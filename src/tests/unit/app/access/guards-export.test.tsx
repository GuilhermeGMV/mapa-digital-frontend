import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('router guards re-export access guards', () => {
  const source = readFileSync(
    new URL('../../../../app/router/guards.tsx', import.meta.url),
    'utf8'
  )

  assert.match(source, /ProtectedRoute/)
  assert.match(source, /RoleRoute/)
})
