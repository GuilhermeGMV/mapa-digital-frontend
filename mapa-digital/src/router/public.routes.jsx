import { Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import MainLayout from '../layouts/MainLayout'
import { PATHS } from './paths'

export const publicRoutes = [
  {
    path: PATHS.ROOT,
    element: <Navigate to={PATHS.HOME} replace />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <Home />,
      },
    ],
  },
]
