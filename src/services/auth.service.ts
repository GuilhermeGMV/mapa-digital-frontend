import { COOKIE_KEYS } from '@/constants/storage'
import { HttpRequestError, httpClient } from '@/services/http/client'
import type { AuthCredentials, LoginApiResponse } from '@/types/auth'
import { ParentStatusError } from '@/types/auth'
import type { UserRole } from '@/types/user'
import { getCookie, removeCookie, setCookie } from '@/utils/cookies'

export const authService = {
  async login(credentials: AuthCredentials): Promise<LoginApiResponse> {
    try {
      const response = await httpClient.post<LoginApiResponse>('login', {
        email: credentials.email,
        password: credentials.password,
      })

      const result = response.data
      setCookie(COOKIE_KEYS.authToken, result.token)
      setCookie(COOKIE_KEYS.authRole, result.role)

      return result
    } catch (error) {
      if (error instanceof HttpRequestError && error.status === 403) {
        const body = (await error.response?.json().catch(() => null)) as {
          detail?: string
        } | null
        const detail = body?.detail?.toLowerCase()

        if (detail === 'aguardando') throw new ParentStatusError('AGUARDANDO')
        if (detail === 'negado') throw new ParentStatusError('NEGADO')
      }

      throw error
    }
  },

  getToken(): string | null {
    return getCookie(COOKIE_KEYS.authToken)
  },

  getRole(): UserRole | null {
    return getCookie(COOKIE_KEYS.authRole) as UserRole | null
  },

  logout() {
    removeCookie(COOKIE_KEYS.authToken)
    removeCookie(COOKIE_KEYS.authRole)
  },
}
