import { Suspense } from "react";
import { Toaster } from "sonner";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Outlet, useLocation } from "react-router";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "../components/AppSidebar";
import SiteHeader from "../components/SiteHeader";

const pageTitles = {
    "/admin": "Overview",
    "/admin/posts": "Blog Posts",
    "/admin/team": "Team Members",
    "/admin/services": "Services",
    "/admin/projects": "Projects",
    "/admin/testimonials": "Testimonials",
    "/admin/milestones": "Milestones",
    "/admin/contacts": "Messages",
    "/admin/settings": "Settings",
    "/admin/help": "Help Center",
};

// shadcn/ui sidebar shell (Shadcn Space dashboard-shell-01 pattern):
// collapsible icon rail on desktop, sheet drawer on mobile, Ctrl/Cmd+B toggles.
export default function AdminLayout() {
    const { pathname } = useLocation();
    const title =
        pageTitles[pathname] ||
        Object.entries(pageTitles).find(([path]) => pathname.startsWith(path) && path !== "/admin")?.[1] ||
        "Overview";
    useDocumentTitle(`${title} · Admin`);

    return (
        <TooltipProvider delayDuration={0}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="min-w-0 bg-background">
                    <SiteHeader title={title} />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <RouteErrorBoundary resetKey={pathname}>
                            <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
                                <Outlet />
                            </Suspense>
                        </RouteErrorBoundary>
                    </main>
                </SidebarInset>
                <Toaster position="top-center" richColors closeButton />
            </SidebarProvider>
        </TooltipProvider>
    );
}
