import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('login feature exposes Page, service and wraps authService', () => {
  const pageSource = readFileSync(
    new URL('../../../../modules/auth/login/page/Page.tsx', import.meta.url),
    'utf8'
  )
  const serviceSource = readFileSync(
    new URL(
      '../../../../modules/auth/login/services/service.ts',
      import.meta.url
    ),
    'utf8'
  )

  assert.match(pageSource, /export default function Page/)
  assert.match(serviceSource, /loginService/)
  assert.match(serviceSource, /authService/)
})
