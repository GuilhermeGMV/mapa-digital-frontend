import type { UserRole } from '@/shared/types/user'

export const APP_ROUTES = {
  root: '/',
  auth: {
    login: '/login',
    forgotPassword: '/forgot-password',
  },
  student: {
    dashboard: '/student/dashboard',
    adaptiveTrail: '/student/adaptive-trail',
    contents: '/student/components',
    uploads: '/student/uploads',
    routine: '/student/routine',
    chat: '/student/chat',
    components: '/student/components',
    profile: '/student/profile',
    /** @deprecated use profile — mantido para links legados */
    onboardingFlow: '/student/profile',
    subjects: '/student/components',
    performance: '/student/performance',
  },
  parent: {
    dashboard: '/parent/dashboard',
    students: '/parent/students',
    studentDetails: '/parent/students/:studentId',
    emotional: '/parent/emotional',
    financial: '/parent/financial',
  },
  admin: {
    approvals: '/admin/approvals',
    correction: '/admin/approvals/corrections/:contentId',
    dashboard: '/admin/dashboard',
  },
  school: {
    dashboard: '/school/dashboard',
    students: '/school/students',
    classes: '/school/classes',
  },
  company: {
    dashboard: '/company/dashboard',
    partnerships: '/company/partnerships',
    reports: '/company/reports',
  },
  common: {
    unauthorized: '/unauthorized',
  },
} as const

export function buildAdminCorrectionRoute(contentId: string) {
  return `/admin/approvals/corrections/${contentId}`
}

export function buildParentStudentDetailsRoute(studentId: string) {
  return `/parent/students/${studentId}`
}

export const DEFAULT_ROUTE_BY_ROLE: Record<UserRole, string> = {
  aluno: APP_ROUTES.student.dashboard,
  responsavel: APP_ROUTES.parent.dashboard,
  admin: APP_ROUTES.admin.dashboard,
  empresa: APP_ROUTES.company.dashboard,
  escola: APP_ROUTES.school.dashboard,
}
