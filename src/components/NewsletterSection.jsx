import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { api } from "@/lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function NewsletterSignup({ onSubmit }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Enter your email address to subscribe.");
            return;
        }
        if (!EMAIL_PATTERN.test(email)) {
            setError("That email doesn't look right. Check for typos, e.g. name@company.com.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(email);
            setIsSubmitted(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                disableForReducedMotion: true,
            });
        } catch (err) {
            setError(err.fields?.email?.[0] ?? "We couldn't subscribe you just now. Please try again in a moment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
                {!isSubmitted ? (
                    <motion.form
                        key="form"
                        noValidate
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2"
                    >
                        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                        {/* newsletter-01 pill input */}
                        <InputGroup className={`mx-auto h-auto w-full max-w-xl overflow-hidden rounded-full bg-background! ${error ? "border-destructive" : ""}`}>
                            <InputGroupInput
                                type="email"
                                id="newsletter-email"
                                name="email"
                                autoComplete="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-invalid={error ? "true" : undefined}
                                aria-describedby={error ? "newsletter-error" : undefined}
                                className="h-12 ps-6 text-base"
                            />
                            <InputGroupAddon align="inline-end" className="py-1.5 pe-1.5">
                                <InputGroupButton
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-10 gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                                >
                                    {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
                                    {isSubmitting ? "Subscribing…" : "Subscribe"}
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                        {error && (
                            <p id="newsletter-error" className="text-center text-sm text-red-600">
                                {error}
                            </p>
                        )}
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-primary/20 bg-background p-5 text-left"
                    >
                        <CheckCircle2 className="size-6 shrink-0 text-primary" aria-hidden="true" />
                        <div>
                            <p className="font-semibold text-foreground">You're on the list.</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                We'll send our next update to {email}.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Wrapper that provides the onSubmit handler and section layout
export default function NewsletterSection() {
    const handleSubmit = async (email) => {
        await api("/api/newsletter/subscribe", { method: "POST", body: { email } });
    };

    return (
        <section id="newsletter" aria-labelledby="newsletter-heading" className="bg-canvas px-4 pb-24 sm:px-6">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-secondary px-6 py-20 text-center sm:py-24">
                <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full border-[28px] border-primary/10" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full border-[28px] border-primary/10" />
                <div className="relative flex flex-col gap-10">
                    <div className="flex flex-col gap-5">
                        <h2 id="newsletter-heading" className="text-3xl font-semibold text-foreground sm:text-5xl">
                            Subscribe to our newsletter
                        </h2>
                        <p className="mx-auto max-w-xl text-base text-muted-foreground">
                            Practical tips on websites, design and growing online, plus news from the studio. No spam.
                        </p>
                    </div>
                    <NewsletterSignup onSubmit={handleSubmit} />
                </div>
            </div>
        </section>
    );
}
