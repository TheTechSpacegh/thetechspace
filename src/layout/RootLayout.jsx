import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RouteErrorBoundary from "../components/RouteErrorBoundary";
import SiteSplash from "../components/SiteSplash";
import { useDocumentTitle } from "../hooks/use-document-title";

const TITLES = { "/": null, "/about": "About", "/services": "Services", "/team": "Team", "/projects": "Projects", "/blogs": "Blog", "/contact": "Contact" };

// Detail pages (a post, a project) set a more specific title themselves.
function RouteTitle() {
  const { pathname } = useLocation();
  useDocumentTitle(pathname in TITLES ? TITLES[pathname] : undefined);
  return null;
}

// BrowserRouter keeps the previous scroll position between routes, so a
// footer link would land on the bottom of the next page. Reset on navigation,
// or jump to the #hash target when one is given.
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

const RootLayout = () => {
  const { pathname } = useLocation();
  return (
    <div className="site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <RouteTitle />
      <SiteSplash />
      <Navbar />
      <main id="main">
        <RouteErrorBoundary resetKey={pathname}>
          <Suspense fallback={<div className="min-h-[80vh]" aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
