import { COOKIE_KEYS } from '@/constants/storage'
import { httpClient } from '@/services/http/client'
import type { ParentChild, SummaryMetric } from '@/types/common'
import { getCookie } from '@/utils/cookies'

export const parentService = {
  getName(): string | null {
    return getCookie(COOKIE_KEYS.authName)
  },

  getEmail(): string | null {
    return getCookie(COOKIE_KEYS.authEmail)
  },

  async getSummary() {
    const response = await httpClient.get<SummaryMetric[]>('parent/summary')
    return response.data
  },

  async getChildren() {
    const response = await httpClient.get<ParentChild[]>('parent/children')
    return response.data
  },
}
