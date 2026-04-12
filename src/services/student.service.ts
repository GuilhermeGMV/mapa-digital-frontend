import { COOKIE_KEYS } from '@/constants/storage'
import { httpClient } from '@/services/http/client'
import type { StudentTask, SummaryMetric } from '@/types/common'
import { getCookie } from '@/utils/cookies'

export const studentService = {
  getName(): string | null {
    return getCookie(COOKIE_KEYS.authName)
  },

  getEmail(): string | null {
    return getCookie(COOKIE_KEYS.authEmail)
  },

  getOrganization(): string | null {
    return getCookie(COOKIE_KEYS.authOrganization)
  },

  async getSummary() {
    const response = await httpClient.get<SummaryMetric[]>('student/summary')
    return response.data
  },

  async getTasks() {
    const response = await httpClient.get<StudentTask[]>('student/tasks')
    return response.data
  },
}
