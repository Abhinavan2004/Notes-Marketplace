import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Home } from './pages/Home'
import { Marketplace } from './pages/Marketplace'
import { Orders } from './pages/Orders'
import { Wishlist } from './pages/Wishlist'
import { Profile } from './pages/Profile'
import { UploadNote } from './pages/UploadNote'
import { SellerDashboard } from './pages/SellerDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { VerifyOtp } from './pages/auth/VerifyOtp'
import { NotFound } from './pages/NotFound'
import { About } from './pages/static/About'
import { Contact } from './pages/static/Contact'
import { Privacy } from './pages/static/Privacy'
import { Terms } from './pages/static/Terms'
import { RequireAuth } from './components/routing/RequireAuth'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'marketplace', element: <Marketplace /> },
      { path: 'orders', element: <Orders /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'profile', element: <Profile /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: 'auth/login', element: <Login /> },
      { path: 'auth/signup', element: <Signup /> },
      { path: 'auth/verify-otp', element: <VerifyOtp /> },
      {
        element: <RequireAuth roles={['seller', 'both']} />,
        children: [
          { path: 'seller/upload', element: <UploadNote /> },
          { path: 'seller/dashboard', element: <SellerDashboard /> },
        ],
      },
      {
        element: <RequireAuth roles={['admin']} />,
        children: [{ path: 'admin', element: <AdminDashboard /> }],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

