// Floating pill navbar. "About" is a shadcn/ui NavigationMenu dropdown (Our
// story + Team) so the bar carries five links instead of six; on mobile the
// same group renders as a labelled section.
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Compass, UsersRound } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useFoundedYear } from "@/lib/content";
import logo1 from "../assets/img/logo1.png";

// ── Icons ────────────────────────────────────────────────────────────────────
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

// ── Nav items ─────────────────────────────────────────────────────────────────
// Labels must match their destination. Contact lives in the "Book a call" CTA.
const aboutLinks = [
  { name: "Our story", path: "/about", icon: Compass, description: "Who we are, what we believe and where we're headed." },
  { name: "Team", path: "/team", icon: UsersRound, description: "The designers and developers you'll work with." },
];

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", children: aboutLinks },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blogs" },
];

const ease = [0.22, 1, 0.36, 1];

// Text link with the sliding underline used across the bar.
function Underlined({ active, children }) {
  return (
    <>
      <span className={active ? "text-white" : ""}>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 left-0 block h-[2px] w-full origin-left rounded-full bg-white transition-transform duration-300 ease-out",
          active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100",
        )}
      />
    </>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const aboutActive = aboutLinks.some((l) => location.pathname.startsWith(l.path));
  const founded = useFoundedYear();

  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!showMenu) return;
    const onKey = (e) => e.key === "Escape" && setShowMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showMenu]);

  const pillBg = isScrolled ? "bg-slate-900/85 border-white/10 shadow-slate-900/50" : "bg-slate-900/30 border-white/20";
  // Named group: shadcn's NavigationMenuList is itself an unnamed "group", so a
  // plain group-hover would light up every underline at once.
  const linkClass = "group/link relative py-1 text-sm font-medium text-white/90 transition-colors duration-200 hover:text-white";
  const ctaClasses = "bg-white hover:bg-white/90 text-slate-900 shadow-sm";
  const mobileLink = "w-full rounded-xl px-4 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/10";

  return (
    <header className="w-full fixed top-0 z-50 py-4 px-4 sm:px-6">
      {/* ── Floating pill ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className={`mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border py-2 pl-4 pr-2 shadow-lg backdrop-blur-md transition-colors duration-500 ${pillBg}`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 rounded-full" aria-label="The Tech Space — home">
          <img src={logo1} alt="" className="h-8 w-8 object-contain" />
          <span className="hidden text-sm font-bold tracking-tight text-white sm:block">
            The<span className="text-violet-300">Tech</span>Space
          </span>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu viewport={false} aria-label="Main" className="hidden lg:flex">
          <NavigationMenuList className="gap-6">
            {navItems.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuTrigger
                    className={cn(
                      linkClass,
                      "h-auto gap-1 rounded-none bg-transparent px-0 hover:bg-transparent focus:bg-transparent focus-visible:ring-white/40 data-[state=open]:bg-transparent data-[state=open]:text-white data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent",
                    )}
                    aria-current={aboutActive ? "true" : undefined}
                  >
                    <Underlined active={aboutActive}>{item.name}</Underlined>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="dark !mt-4 !rounded-2xl !border-white/10 !bg-[#0c0918]/95 p-0 text-white !shadow-2xl backdrop-blur-xl">
                    <ul className="grid w-[400px] gap-1 p-2">
                      {item.children.map((child) => {
                        const active = location.pathname.startsWith(child.path);
                        return (
                          <li key={child.path}>
                            <NavigationMenuLink asChild active={active}>
                              <Link
                                to={child.path}
                                aria-current={active ? "page" : undefined}
                                className="flex-row items-start gap-3 rounded-xl p-3 hover:bg-white/[0.06] focus:bg-white/[0.06] data-[active=true]:bg-white/[0.06]"
                              >
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-violet-500/15 text-violet-200">
                                  <child.icon className="size-4" aria-hidden="true" />
                                </span>
                                <span className="flex flex-col gap-0.5">
                                  <span className="text-sm font-semibold text-white">{child.name}</span>
                                  <span className="text-sm leading-snug text-white/55">{child.description}</span>
                                </span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-white/50">
                      <span>Since {founded} · Made in Ghana</span>
                      <NavigationMenuLink asChild>
                        <Link to="/contact" className="flex-row items-center gap-1 p-0 font-medium text-violet-200 hover:bg-transparent hover:text-white focus:bg-transparent">
                          Work with us <ArrowRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.path}>
                  <NavLink to={item.path} end={item.path === "/"} className={linkClass}>
                    {({ isActive }) => <Underlined active={isActive}>{item.name}</Underlined>}
                  </NavLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTA + Admin link */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            to="/admin"
            className="grid h-10 w-10 place-items-center rounded-full text-white/80 transition-colors duration-200 hover:bg-white/15 hover:text-white"
            aria-label="Admin dashboard"
            title="Admin dashboard"
          >
            <GridIcon />
          </Link>
          <Link to="/contact" className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${ctaClasses}`}>
            Book a call
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="grid h-11 w-11 place-items-center rounded-full text-white transition-colors duration-200 hover:bg-white/10 lg:hidden"
          aria-label={showMenu ? "Close menu" : "Open menu"}
          aria-expanded={showMenu}
          aria-controls="mobile-menu"
        >
          <span className={`transition-transform duration-300 ${showMenu ? "rotate-90" : "rotate-0"}`}>
            {showMenu ? <CloseIcon /> : <MenuIcon />}
          </span>
        </button>
      </motion.div>

      {/* ── Mobile menu ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showMenu && (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease }}
            className="mx-auto mt-2 flex max-w-5xl flex-col rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md lg:hidden"
          >
            {navItems.map((item) =>
              item.children ? (
                <div key={item.name} role="group" aria-labelledby="mobile-about-label" className="my-1 rounded-xl bg-white/[0.04] py-1">
                  <p id="mobile-about-label" className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    {item.name}
                  </p>
                  {item.children.map((child) => (
                    <NavLink key={child.path} to={child.path} className={cn(mobileLink, "flex items-center gap-3 py-2.5")}>
                      {({ isActive }) => (
                        <>
                          <child.icon className="size-4 text-violet-300" aria-hidden="true" />
                          <span className={isActive ? "font-semibold text-white" : ""} aria-current={isActive ? "page" : undefined}>
                            {child.name}
                          </span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink key={item.path} to={item.path} end={item.path === "/"} className={mobileLink}>
                  {({ isActive }) => (
                    <span className={isActive ? "font-semibold text-white" : ""} aria-current={isActive ? "page" : undefined}>
                      {item.name}
                    </span>
                  )}
                </NavLink>
              ),
            )}
            <Link to="/admin" className={cn(mobileLink, "flex items-center gap-2")}>
              <GridIcon />
              Admin
            </Link>
            <Link to="/contact" className={`mt-2 w-full rounded-full py-3 text-center text-base font-semibold transition-colors duration-200 ${ctaClasses}`}>
              Book a call
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
