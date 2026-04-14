import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('auth route registers login and forgot-password', () => {
  const source = readFileSync(
    new URL('../../../modules/auth/route.tsx', import.meta.url),
    'utf8'
  )

  assert.match(source, /forgotPassword/)
  assert.match(source, /login\/page\/Page/)
  assert.match(source, /forgot-password\/page\/Page/)
})
