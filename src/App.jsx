import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { MotionConfig } from 'motion/react'
import RootLayout from './layout/RootLayout'
import NotFound from './pages/NotFound'
import { lazyRoute } from './lib/lazyRoute'
import Home from './pages/Home'
import About from './pages/About'
// Home and About load with the first visit; the rest load on demand.
const Services = lazyRoute(() => import('./pages/Services'))
const Team = lazyRoute(() => import('./pages/Team'))
const BlogPage = lazyRoute(() => import('./pages/Blogs'))
const Contact = lazyRoute(() => import('./pages/Contact'))
const ProjectsPage = lazyRoute(() => import('./pages/Projects'))
const ProjectDetail = lazyRoute(() => import('./pages/ProjectDetail'))
const BlogDetail = lazyRoute(() => import('./pages/BlogDetail'))

// Code-split: the admin is staff-only, so it doesn't ship in the public
// bundle. lazyRoute() recovers from stale chunks after a deploy.

// Admin imports
import { AuthProvider } from './admin/contexts/AuthContext'
import ProtectedRoute from './admin/components/ProtectedRoute'
const AdminLayout = lazyRoute(() => import('./admin/layouts/AdminLayout'))
const AdminLogin = lazyRoute(() => import('./admin/pages/Login'))
const AdminDashboard = lazyRoute(() => import('./admin/pages/Dashboard'))
const AdminPosts = lazyRoute(() => import('./admin/pages/Posts'))
const AdminTeam = lazyRoute(() => import('./admin/pages/TeamManagement'))
const AdminServices = lazyRoute(() => import('./admin/pages/ServicesManagement'))
const AdminContacts = lazyRoute(() => import('./admin/pages/Contacts'))
const AdminSettings = lazyRoute(() => import('./admin/pages/Settings'))
const AdminHelp = lazyRoute(() => import('./admin/pages/HelpCenter'))
const AdminMilestones = lazyRoute(() => import('./admin/pages/MilestonesManagement'))
const AdminProjects = lazyRoute(() => import('./admin/pages/ProjectsManagement'))
const AdminTestimonials = lazyRoute(() => import('./admin/pages/Testimonials'))

function App() {

  return (
    // reducedMotion="user": Motion skips transform/layout animation for
    // visitors with prefers-reduced-motion, keeping opacity fades.
    <MotionConfig reducedMotion="user">
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <Routes>
          {/* ── Public site ── */}
          <Route path='/' element={<RootLayout />}>
            <Route index={true} element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/services' element={<Services />} />
            <Route path='/team' element={<Team />} />
            <Route path='/blogs' element={<BlogPage />} />
            <Route path='/blogs/:slug' element={<BlogDetail />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/projects' element={<ProjectsPage />} />
            <Route path='/projects/:id' element={<ProjectDetail />} />
            <Route path='*' element={<NotFound />} />
          </Route>

          {/* ── Admin dashboard ── */}
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin' element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path='posts' element={<AdminPosts />} />
            <Route path='team' element={<AdminTeam />} />
            <Route path='services' element={<AdminServices />} />
            <Route path='milestones' element={<AdminMilestones />} />
            <Route path='projects' element={<AdminProjects />} />
            <Route path='testimonials' element={<AdminTestimonials />} />
            <Route path='contacts' element={<AdminContacts />} />
            <Route path='settings' element={<AdminSettings />} />
            <Route path='help' element={<AdminHelp />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
    </MotionConfig>
  )
}

export default App
