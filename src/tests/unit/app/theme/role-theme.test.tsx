import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createAppTheme } from '../../../../app/theme/core/theme'
import {
  getRoleActionTone,
  getRoleGradient,
  getRolePalette,
} from '../../../../app/theme/core/roles'

test('role colors are exposed by the app theme and reusable helpers', () => {
  const theme = createAppTheme('light')
  const parentPalette = getRolePalette(theme, 'responsavel')
  const parentActionTone = getRoleActionTone(theme, 'responsavel')

  assert.equal(parentPalette.primary, theme.palette.role.responsavel.primary)
  assert.equal(parentActionTone.confirmColor, parentPalette.primary)
  assert.equal(parentActionTone.confirmTextColor, parentPalette.contrast)
  assert.equal(parentPalette.contrast, 'rgba(255, 255, 255, 1)')
  assert.match(
    getRoleGradient(theme, 'responsavel', '150deg'),
    /^linear-gradient\(150deg,/
  )
})

test('role themed components do not resolve AppColors role tokens directly', () => {
  const files = [
    '../../../../app/layout/DashboardLayout.tsx',
    '../../../../modules/admin/approvals/components/ApprovalActionModal.tsx',
    '../../../../modules/admin/approvals/components/ApprovalComponent.tsx',
    '../../../../modules/admin/content-correction/page/Page.tsx',
    '../../../../shared/ui/AppSidebar.tsx',
    '../../../../shared/ui/PageHeader.tsx',
    '../../../../shared/ui/Pagination.tsx',
  ]

  for (const file of files) {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8')

    assert.doesNotMatch(source, /AppColors\.role/)
    assert.doesNotMatch(source, /roleGradient/)
  }

  const headerSource = readFileSync(
    new URL('../../../../shared/ui/PageHeader.tsx', import.meta.url),
    'utf8'
  )

  assert.doesNotMatch(headerSource, /bg-\[#/)
  assert.doesNotMatch(headerSource, /from-\[#/)
  assert.match(headerSource, /getRoleGradient/)
})

test('global css exposes semantic tokens for app surfaces and role colors', () => {
  const globalCssSource = readFileSync(
    new URL('../../../../app/theme/styles/global.css', import.meta.url),
    'utf8'
  )
  const themeSource = readFileSync(
    new URL('../../../../app/theme/core/theme.ts', import.meta.url),
    'utf8'
  )

  assert.match(globalCssSource, /--app-surface-elevated:/)
  assert.match(globalCssSource, /--app-card-border:/)
  assert.match(globalCssSource, /--app-action-hover-opacity:/)
  assert.match(globalCssSource, /--app-input-background:/)
  assert.match(globalCssSource, /--app-role-parent-primary:/)
  assert.match(globalCssSource, /--color-role-parent-primary:/)
  assert.match(themeSource, /var\(--app-body-gradient\)/)
  assert.match(themeSource, /var\(--app-card-border\)/)
  assert.match(themeSource, /var\(--app-input-background\)/)
})
