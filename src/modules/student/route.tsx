import type { ActionFunctionArgs, RouteObject } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from '@/app/router/guards'
import { APP_ROUTES } from '@/app/router/paths'
import DashboardLayout from '@/app/layout/DashboardLayout'
import StudentComponentsPage from '@/modules/student/subjects/page/Page'
import StudentDashboardPage from '@/modules/student/dashboard/page/Page'
import StudentOnboardingFlowPage from '@/modules/student/profile/page/Page'
import StudentPerformancePage from '@/modules/student/performance/page/Page'
import type {
  StudentOnboardingFlowActionInput,
  StudentOnboardingFlowLoaderData,
} from '@/modules/student/shared/types/types'
import { STUDENT_ONBOARDING_FLOW_QUESTIONS } from '@/modules/student/shared/components/onboardingQuestionFlow'

const DEFAULT_ASSESSMENT_ID = 'local-assessment'

export async function studentOnboardingFlowLoader(): Promise<StudentOnboardingFlowLoaderData> {
  return {
    assessmentId: DEFAULT_ASSESSMENT_ID,
    initialAnswersByQuestionId: {},
    questions: STUDENT_ONBOARDING_FLOW_QUESTIONS,
  }
}

export async function studentOnboardingFlowAction({
  request,
}: ActionFunctionArgs): Promise<StudentOnboardingFlowActionInput | null> {
  try {
    return (await request.json()) as StudentOnboardingFlowActionInput
  } catch {
    return null
  }
}

export const studentRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['aluno']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: APP_ROUTES.student.dashboard,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.adaptiveTrail,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.components,
                element: <StudentComponentsPage />,
              },
              {
                path: APP_ROUTES.student.uploads,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.routine,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.chat,
                element: <StudentDashboardPage />,
              },
              {
                path: APP_ROUTES.student.performance,
                element: <StudentPerformancePage />,
              },
              {
                path: APP_ROUTES.student.profile,
                element: <StudentOnboardingFlowPage />,
                loader: studentOnboardingFlowLoader,
                action: studentOnboardingFlowAction,
              },
            ],
          },
        ],
      },
    ],
  },
]
