import { createBrowserRouter, Navigate } from 'react-router-dom'
import { publicRoutes } from './public.routes'
import { privateRoutes } from './private.routes'
import { PATHS } from './paths'

export const router = createBrowserRouter([
  ...publicRoutes,
  ...privateRoutes,
  {
    path: '*',
    element: <Navigate to={PATHS.HOME} replace />,
  },
])
