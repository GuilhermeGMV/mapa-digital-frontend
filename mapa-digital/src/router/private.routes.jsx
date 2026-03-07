import Dashboard from '../pages/Dashboard'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from './guards/ProtectedRoute'
import { PATHS } from './paths'

const isAuthenticated = true

export const privateRoutes = [
  {
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: PATHS.DASHBOARD,
        element: <Dashboard />,
      },
    ],
  },
]
