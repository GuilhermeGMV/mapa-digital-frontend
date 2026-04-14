import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('parent dashboard exposes only the child registration entry point', () => {
  const source = readFileSync(
    new URL(
      '../../../../modules/parent/dashboard/page/Page.tsx',
      import.meta.url
    ),
    'utf8'
  )

  assert.match(source, /PageHeader/)
  assert.match(source, /AppActionModal/)
  assert.match(source, /Cadastrar filho/)
  assert.match(source, /Nome do filho/)
  assert.match(source, /parentChildModalOpen/)
  assert.doesNotMatch(source, /role="responsavel"/)
  assert.doesNotMatch(source, /parentService\.getSummary/)
  assert.doesNotMatch(source, /parentService\.getChildren/)
  assert.doesNotMatch(source, /DISCIPLINE_PERFORMANCE/)
  assert.doesNotMatch(source, /WEEKLY_MOOD/)
})
