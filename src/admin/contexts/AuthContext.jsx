// Admin session state.
//
// With VITE_API_URL set, sign-in goes through the TTS API, which keeps the
// session in an httpOnly cookie (JavaScript never sees a token). Without it,
// a demo account works in `npm run dev` only; production builds refuse to
// sign anyone in, so a deploy without a backend never exposes the console.
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { API_URL, ApiError, api } from "@/lib/api";

const DEMO_KEY = "admin_user";

const AuthContext = createContext(null);

const ROLE_LABELS = { OWNER: "Owner", EDITOR: "Editor" };
const toUser = (admin) => ({ ...admin, roleLabel: ROLE_LABELS[admin.role] ?? admin.role });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore the session the first time an admin page asks for it, so public
    // visitors never trigger a session request.
    const checked = useRef(false);
    const ensureSession = useCallback(() => {
        if (checked.current) return;
        checked.current = true;
        if (API_URL) {
            api("/api/auth/me")
                .then((body) => setUser(toUser(body.admin)))
                .catch(() => setUser(null))
                .finally(() => setLoading(false));
            return;
        }
        if (import.meta.env.DEV) {
            try {
                const stored = localStorage.getItem(DEMO_KEY);
                if (stored) setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem(DEMO_KEY);
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email, password, remember = true) => {
        if (API_URL) {
            try {
                const body = await api("/api/auth/login", { method: "POST", body: { email, password, remember } });
                checked.current = true;
                setUser(toUser(body.admin));
                setLoading(false);
                return { success: true };
            } catch (err) {
                return {
                    success: false,
                    error: err instanceof ApiError && err.status
                        ? err.message
                        : "Can't reach the server. Check your connection and try again.",
                };
            }
        }

        if (!import.meta.env.DEV) {
            return { success: false, error: "Admin sign-in isn't available until the TTS backend is connected." };
        }
        if (email === "admin@thetechspace.com" && password === "admin123") {
            const demo = toUser({ name: "Demo Admin", email, role: "OWNER" });
            checked.current = true;
            setUser(demo);
            setLoading(false);
            localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
            return { success: true };
        }
        return { success: false, error: "Incorrect email or password" };
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        if (API_URL) {
            await api("/api/auth/logout", { method: "POST" }).catch(() => {});
        } else {
            localStorage.removeItem(DEMO_KEY);
        }
    }, []);

    // For screens that change the signed-in admin (e.g. setting a password).
    const updateUser = useCallback((admin) => setUser(toUser(admin)), []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, ensureSession, updateUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
