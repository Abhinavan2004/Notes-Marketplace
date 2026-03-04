import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import type { UserRole } from '../../redux/auth/authSlice'

export const RequireAuth = (props: { roles?: UserRole[] }) => {
  const user = useAppSelector((s) => s.auth.user)

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (props.roles && !props.roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

