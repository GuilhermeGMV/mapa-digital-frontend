import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('navigation index composes menus for all roles', () => {
  const source = readFileSync(
    new URL('../../../app/navigation/index.tsx', import.meta.url),
    'utf8'
  )

  assert.match(source, /NAVIGATION_BY_ROLE/)
  assert.match(source, /studentNavigation/)
  assert.match(source, /parentNavigation/)
  assert.match(source, /adminNavigation/)
  assert.match(source, /schoolNavigation/)
  assert.match(source, /companyNavigation/)
})
