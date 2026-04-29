import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('useParentDashboard exists and exports the hook', () => {
  const source = readSource(
    'modules/parent/dashboard/hooks/useParentDashboard.ts'
  )

  assert.match(source, /useParentDashboard/)
  assert.match(source, /isLoading/)
  assert.match(source, /CHILD_MOCK_DATA/)
  assert.match(source, /getChildren/)
  assert.match(source, /getStudentSummary/)
})
