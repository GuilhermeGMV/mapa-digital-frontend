import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('ListChildren renders selectable child cards with parent theme context', () => {
  const source = readSource(
    'modules/parent/settings/components/ListChildren.tsx'
  )

  assert.match(source, /ListChildrenCard/)
  assert.match(source, /selectedChildId/)
  assert.match(source, /onSelect/)
  assert.match(source, /role="list"/)
  assert.match(source, /Filhos vinculados/)
  assert.match(source, /children\.map\(child =>/)
})

test('ListChildrenCard uses planner-like rows with initials and selected state', () => {
  const source = readSource(
    'modules/parent/settings/components/ListChildrenCard.tsx'
  )

  assert.match(source, /role="listitem"/)
  assert.match(source, /component="button"/)
  assert.match(source, /aria-pressed/)
  assert.match(source, /getInitials/)
  assert.match(source, /child\.grade/)
  assert.match(source, /Selecionado/)
  assert.match(source, /getRoleSelectedStyle/)
})
