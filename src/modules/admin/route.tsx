import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from '@/app/router/guards'
import { APP_ROUTES } from '@/app/router/paths'
import DashboardLayout from '@/app/layout/DashboardLayout'
import AdminApprovalsPage from '@/modules/admin/approvals/page/Page'
import AdminContentCorrectionPage from '@/modules/admin/content-correction/page/Page'
import AdminDashboardPage from '@/modules/admin/dashboard/page/Page'

export const adminRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['admin']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.admin.dashboard,
                element: <AdminDashboardPage />,
              },
              {
                path: APP_ROUTES.admin.approvals,
                element: <AdminApprovalsPage />,
              },
              {
                path: APP_ROUTES.admin.correction,
                element: <AdminContentCorrectionPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]
