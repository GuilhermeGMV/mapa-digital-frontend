import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import BarChart from '../../../../modules/student/shared/components/BarChart'

test('BarChart keeps zero values measurable when maxValue is zero', () => {
  const html = renderToStaticMarkup(
    <BarChart data={[{ label: 'Seg', value: 0 }]} maxValue={0} />
  )

  assert.match(html, /height:0%/)
  assert.doesNotMatch(html, /NaN/)
})
