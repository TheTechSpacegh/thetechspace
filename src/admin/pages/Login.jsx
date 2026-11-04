// Admin sign-in — Shadcn Space login-01 layout (centred card on a dark field
// with concentric rings) using shadcn/ui Card, Field, Input and Checkbox.
// Google/GitHub buttons hand off to the backend's OAuth routes once
// VITE_API_URL is set (see Backend/PLAN.md); until then they explain why not.
import { useState } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import logo1 from "@/assets/img/logo1.png";

const API_URL = import.meta.env.VITE_API_URL;

// Messages for the ?error= codes the API sends back after Google/GitHub sign-in.
const OAUTH_ERRORS = {
    not_allowed: "That account doesn't have access to the admin console. Ask an owner to add your email.",
    oauth_failed: "Sign-in didn't complete. Please try again.",
    oauth_cancelled: "Sign-in was cancelled.",
    oauth_unavailable: "That sign-in option isn't set up yet. Use your email and password.",
};

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
        <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
);

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
);

export default function Login() {
    const [searchParams] = useSearchParams();
    const [oauthNotice, setOauthNotice] = useState(() => OAUTH_ERRORS[searchParams.get("error")] ?? "");

    // Hand off to the backend OAuth route; explain if the backend isn't connected yet.
    const signInWith = (provider) => {
        if (API_URL) {
            window.location.href = `${API_URL}/api/auth/${provider}`;
            return;
        }
        setOauthNotice(`${provider === "google" ? "Google" : "GitHub"} sign-in will be available once the TTS backend is connected. Use your email and password for now.`);
    };
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/admin";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <section className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06040d] px-4 py-10">
            {/* login-01 concentric rings, in TTS violet */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
                <div className="absolute right-0 top-0 size-[1300px] -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-500/10" />
                <div className="absolute right-0 top-0 size-[700px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#06040d]" />
                <div className="absolute left-1/2 top-[-20%] h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(124_58_237/0.35),transparent)] blur-2xl" />
            </div>

            <Link to="/" className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white">
                <ArrowLeft className="size-4" aria-hidden="true" /> Back to site
            </Link>

            <Card className="relative w-full max-w-md gap-6 rounded-2xl px-6 py-8 sm:p-10">
                <CardHeader className="gap-5 p-0 text-center">
                    <img src={logo1} alt="" className="mx-auto size-11 rounded-lg bg-white object-contain p-0.5" />
                    <div className="flex flex-col gap-1">
                        <CardTitle className="text-2xl font-semibold text-card-foreground">Welcome back</CardTitle>
                        <CardDescription>Sign in to the TheTechSpace admin console</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* login-01 social row, as pills */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Button type="button" variant="outline" onClick={() => signInWith("google")} className="h-11 gap-2 rounded-full bg-background text-sm font-medium text-card-foreground">
                            <GoogleIcon /> Continue with Google
                        </Button>
                        <Button type="button" variant="outline" onClick={() => signInWith("github")} className="h-11 gap-2 rounded-full bg-background text-sm font-medium text-card-foreground">
                            <GitHubIcon /> Continue with GitHub
                        </Button>
                    </div>
                    {oauthNotice && (
                        <p role="status" className="mt-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-center text-xs text-violet-200">
                            {oauthNotice}
                        </p>
                    )}
                    <FieldSeparator className="my-6 text-sm text-muted-foreground *:data-[slot=field-separator-content]:bg-card">
                        or sign in with email
                    </FieldSeparator>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup className="gap-5">
                            {error && (
                                <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-red-300">
                                    {error}
                                </div>
                            )}
                            <Field className="gap-1.5">
                                <FieldLabel htmlFor="login-email" className="text-sm font-normal text-muted-foreground">Email</FieldLabel>
                                <Input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    autoComplete="username"
                                    placeholder="you@thetechspace.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-10 rounded-lg bg-background"
                                />
                            </Field>
                            <Field className="gap-1.5">
                                <FieldLabel htmlFor="login-password" className="text-sm font-normal text-muted-foreground">Password</FieldLabel>
                                <Input
                                    id="login-password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-10 rounded-lg bg-background"
                                />
                            </Field>
                            <Field orientation="horizontal" className="items-center gap-2.5">
                                <Checkbox id="remember" defaultChecked />
                                <FieldLabel htmlFor="remember" className="text-sm font-normal text-muted-foreground">Keep me signed in</FieldLabel>
                            </Field>
                            <Button type="submit" disabled={loading} className="h-10 w-full rounded-lg">
                                {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
                                {loading ? "Signing in…" : "Sign in"}
                            </Button>
                        </FieldGroup>
                    </form>

                    {/* Mock auth helper: never rendered in production builds. */}
                    {import.meta.env.DEV && (
                        <p className="mt-6 rounded-lg border border-dashed px-4 py-3 text-center font-mono text-xs text-muted-foreground">
                            dev only · admin@thetechspace.com / admin123
                        </p>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
