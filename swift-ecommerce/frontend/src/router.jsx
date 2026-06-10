import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

// Auth pages
import LoginPage from '@/pages/Auth/LoginPage'
import RegisterPage from '@/pages/Auth/RegisterPage'

// App pages (lazy loaded para mejor performance)
import { lazy, Suspense } from 'react'
import Spinner from '@/components/ui/Spinner/Spinner'

const AppShell = lazy(() => import('@/components/layout/AppShell'))
const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'))
const ServicesPage = lazy(() => import('@/pages/Services/ServicesPage'))
const ServiceDetailPage = lazy(() => import('@/pages/Services/ServiceDetailPage'))
const OrdersPage = lazy(() => import('@/pages/Orders/OrdersPage'))
const OrderDetailPage = lazy(() => import('@/pages/Orders/OrderDetailPage'))
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'))

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/Admin/AdminDashboardPage'))
const AdminOrdersPage    = lazy(() => import('@/pages/Admin/AdminOrdersPage'))
const AdminUsersPage     = lazy(() => import('@/pages/Admin/AdminUsersPage'))
const AdminServicesPage  = lazy(() => import('@/pages/Admin/AdminServicesPage'))

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
    <Spinner size="lg" />
  </div>
)

const withSuspense = (element) => <Suspense fallback={<Loading />}>{element}</Suspense>

const router = createBrowserRouter([
  // Redirige raíz al dashboard
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // Rutas públicas (auth)
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // Rutas protegidas con AppShell
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: withSuspense(<AppShell />),
        children: [
          { path: '/dashboard', element: withSuspense(<DashboardPage />) },
          { path: '/services', element: withSuspense(<ServicesPage />) },
          { path: '/services/:id', element: withSuspense(<ServiceDetailPage />) },
          { path: '/orders', element: withSuspense(<OrdersPage />) },
          { path: '/orders/:id', element: withSuspense(<OrderDetailPage />) },
          { path: '/profile', element: withSuspense(<ProfilePage />) },
        ],
      },
    ],
  },

  // Rutas admin (requieren rol ADMIN)
  {
    element: <ProtectedRoute adminOnly />,
    children: [
      {
        element: withSuspense(<AppShell />),
        children: [
          { path: '/admin',          element: withSuspense(<AdminDashboardPage />) },
          { path: '/admin/orders',   element: withSuspense(<AdminOrdersPage />) },
          { path: '/admin/users',    element: withSuspense(<AdminUsersPage />) },
          { path: '/admin/services', element: withSuspense(<AdminServicesPage />) },
        ],
      },
    ],
  },

  // 404
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])

export default router
