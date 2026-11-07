// Admin sidebar — built on shadcn/ui Sidebar, adapted from Shadcn Space
// dashboard-shell-01 (app-sidebar + nav-main) for React Router.
import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ExternalLink } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUnreadCount } from "../hooks/useUnreadCount";
import { nav } from "../lib/nav";
import logo1 from "@/assets/img/logo1.png";

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();
  const badges = { unread: useUnreadCount() };

  // Close the mobile sheet after navigating
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  const isActive = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <Sidebar collapsible="icon" id="admin-sidebar">
      <SidebarHeader className="px-3 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="TheTechSpace">
              <Link to="/admin">
                <img src={logo1} alt="" className="size-8 shrink-0 rounded-md object-contain" />
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-bold">TheTechSpace</span>
                  <span className="text-xs text-muted-foreground">Admin console</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-1">
        {nav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const active = isActive(item);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="h-9 rounded-lg data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground"
                    >
                      <Link to={item.href} aria-current={active ? "page" : undefined}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {badges[item.badge] > 0 && (
                      <SidebarMenuBadge className={active ? "text-primary-foreground" : "text-primary"}>
                        {badges[item.badge]}
                        <span className="sr-only"> unread</span>
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <Card className="gap-0 border-0 bg-secondary py-5 shadow-none">
          <CardContent className="flex flex-col items-center gap-3 px-4 text-center">
            <p className="text-sm font-semibold text-secondary-foreground">Your site is live</p>
            <p className="text-xs text-muted-foreground">See your changes the way visitors do.</p>
            <Button asChild size="sm" className="rounded-lg">
              <Link to="/" target="_blank" rel="noopener noreferrer">
                View site <ExternalLink />
                <span className="sr-only">(opens in a new tab)</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
