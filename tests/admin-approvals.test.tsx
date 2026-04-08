import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import type { ApiResponse } from '../src/types/api'
import type {
  ContentApprovalItem,
  GuardianApprovalItem,
} from '../src/types/admin'
import {
  HttpRequestError,
  createAdminApprovalRepository,
  mapContentApprovalQueueResponse,
} from '../src/services/admin-approval.service'
import {
  filterApprovalItems,
  getGuardianApprovalEligibility,
  paginateApprovalItems,
} from '../src/pages/admin/components/approvalQueue.utils'

const contentItems: ContentApprovalItem[] = [
  {
    id: 'content-1',
    kind: 'content',
    title: 'Lista de Equações do 7º ano',
    subtitle: 'Tarefa · Matemática · 22/03/2026',
    status: 'inReview',
    badges: [
      {
        id: 'badge-1',
        label: 'Upload de aluno',
        tone: 'neutral',
      },
    ],
  },
  {
    id: 'content-2',
    kind: 'content',
    title: 'Prova mensal de interpretação',
    subtitle: 'Prova · Português · 28/03/2026',
    status: 'sent',
    badges: [
      {
        id: 'badge-2',
        label: '2 questões vinculadas',
        tone: 'danger',
      },
    ],
  },
]

const guardianItems: GuardianApprovalItem[] = [
  {
    id: 'guardian-1',
    kind: 'guardian',
    title: 'Mariana Souza',
    subtitle: 'Mãe · Solicitação em 01/04/2026',
    status: 'pendingValidation',
    badges: [
      {
        id: 'guardian-badge-1',
        label: 'Documento pendente',
        tone: 'warning',
      },
    ],
    childName: 'Luiza Souza',
    validation: {
      hasDocument: false,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  },
  {
    id: 'guardian-2',
    kind: 'guardian',
    title: 'Carlos Santos',
    subtitle: 'Pai · Solicitação em 02/04/2026',
    status: 'pendingValidation',
    badges: [
      {
        id: 'guardian-badge-2',
        label: 'Pronto para liberar',
        tone: 'success',
      },
    ],
    childName: 'Rafael Santos',
    validation: {
      hasDocument: true,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  },
]

const contentQueueResponse: ApiResponse<{
  items: Array<{
    id: string
    requested_at: string
    resource_type: 'task' | 'exam'
    stage_label: string
    status: 'in_review' | 'sent' | 'approved' | 'rejected'
    subject_label: string
    tags: Array<{
      id: string
      label: string
      tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
    }>
    title: string
  }>
  page: number
  page_size: number
  total_items: number
  total_pages: number
}> = {
  data: {
    items: [
      {
        id: 'content-10',
        requested_at: '2026-04-07',
        resource_type: 'exam',
        stage_label: 'Português',
        status: 'in_review',
        subject_label: '7º ano',
        tags: [
          {
            id: 'tag-1',
            label: '2 questões vinculadas',
            tone: 'danger',
          },
        ],
        title: 'Avaliação bimestral',
      },
    ],
    page: 2,
    page_size: 10,
    total_items: 11,
    total_pages: 2,
  },
  message: 'OK',
  success: true,
}

test('filterApprovalItems searches by text and respects the selected status', () => {
  const bySearch = filterApprovalItems(contentItems, {
    query: 'interpretação',
    status: 'all',
  })
  const byStatus = filterApprovalItems(contentItems, {
    query: '',
    status: 'inReview',
  })
  const byBadge = filterApprovalItems(contentItems, {
    query: 'questões vinculadas',
    status: 'all',
  })

  assert.equal(bySearch.length, 1)
  assert.equal(bySearch[0]?.id, 'content-2')
  assert.equal(byStatus.length, 1)
  assert.equal(byStatus[0]?.id, 'content-1')
  assert.equal(byBadge.length, 1)
  assert.equal(byBadge[0]?.id, 'content-2')
})

test('paginateApprovalItems clamps the current page and exposes totals', () => {
  const page = paginateApprovalItems(contentItems, {
    page: 4,
    pageSize: 1,
  })

  assert.equal(page.currentPage, 2)
  assert.equal(page.totalPages, 2)
  assert.equal(page.totalItems, 2)
  assert.equal(page.items.length, 1)
  assert.equal(page.items[0]?.id, 'content-2')
})

test('getGuardianApprovalEligibility only allows approval when all validations pass', () => {
  const blocked = getGuardianApprovalEligibility(guardianItems[0])
  const ready = getGuardianApprovalEligibility(guardianItems[1])

  assert.equal(blocked.canApprove, false)
  assert.deepEqual(blocked.missingRequirements, ['documento'])
  assert.equal(ready.canApprove, true)
  assert.deepEqual(ready.missingRequirements, [])
})

test('admin approvals area is wired into routes and sidebar navigation', () => {
  const routesSource = readFileSync(
    new URL('../src/constants/routes.ts', import.meta.url),
    'utf8'
  )
  const adminRouteSource = readFileSync(
    new URL('../src/pages/admin/route.tsx', import.meta.url),
    'utf8'
  )
  const dashboardLayoutSource = readFileSync(
    new URL('../src/layouts/DashboardLayout.tsx', import.meta.url),
    'utf8'
  )

  assert.match(routesSource, /approvals: '\/admin\/approvals'/)
  assert.match(adminRouteSource, /AdminApprovalsPage/)
  assert.match(dashboardLayoutSource, /Aprovações/)
})

test('mapContentApprovalQueueResponse normalizes python-style DTOs into UI items', () => {
  const response = mapContentApprovalQueueResponse(contentQueueResponse)

  assert.equal(response.currentPage, 2)
  assert.equal(response.totalItems, 11)
  assert.equal(response.items[0]?.status, 'inReview')
  assert.equal(response.items[0]?.subtitle, 'Prova · Português · 07/04/2026')
  assert.equal(response.items[0]?.badges[0]?.label, '2 questões vinculadas')
})

test('admin approval repository falls back to mock data when the remote API is unavailable', async () => {
  const repository = createAdminApprovalRepository({
    allowFallback: true,
    client: {
      get() {
        return Promise.reject(new TypeError('fetch failed'))
      },
      patch() {
        return Promise.reject(new TypeError('fetch failed'))
      },
    },
  })

  const response = await repository.getContentQueue({
    page: 1,
    pageSize: 2,
    query: 'interpretação',
    status: 'all',
  })

  assert.equal(response.items.length, 1)
  assert.equal(response.items[0]?.id, 'content-2')
  assert.equal(response.totalItems, 1)
})

test('admin approval repository does not hide client contract errors behind mock fallback', async () => {
  const repository = createAdminApprovalRepository({
    allowFallback: true,
    client: {
      get() {
        return Promise.reject(new HttpRequestError(400, 'Bad Request'))
      },
      patch() {
        return Promise.reject(new HttpRequestError(400, 'Bad Request'))
      },
    },
  })

  await assert.rejects(
    () =>
      repository.getGuardianQueue({
        page: 1,
        pageSize: 2,
        query: '',
        status: 'all',
      }),
    (error: unknown) =>
      error instanceof HttpRequestError && error.status === 400
  )
})

test('theme selector and approvals filter reuse AppDropdown with the ghost trigger', () => {
  const themeModeSource = readFileSync(
    new URL('../src/components/ui/ThemeMode.tsx', import.meta.url),
    'utf8'
  )
  const appDropdownSource = readFileSync(
    new URL('../src/components/ui/AppDropdown.tsx', import.meta.url),
    'utf8'
  )
  const searchBarAndFilterSource = readFileSync(
    new URL(
      '../src/components/common/SearchBarAndFilter.tsx',
      import.meta.url
    ),
    'utf8'
  )

  assert.match(themeModeSource, /AppDropdown/)
  assert.match(themeModeSource, /Sistema/)
  assert.match(appDropdownSource, /triggerVariant/)
  assert.match(appDropdownSource, /ghost/)
  assert.match(searchBarAndFilterSource, /triggerVariant="ghost"/)
})

test('approval queue panel reuses shared toolbar and pagination components', () => {
  const approvalComponentSource = readFileSync(
    new URL(
      '../src/pages/admin/components/ApprovalComponent.tsx',
      import.meta.url
    ),
    'utf8'
  )
  const searchBarAndFilterSource = readFileSync(
    new URL('../src/components/common/SearchBarAndFilter.tsx', import.meta.url),
    'utf8'
  )
  const paginationSource = readFileSync(
    new URL('../src/components/common/Pagination.tsx', import.meta.url),
    'utf8'
  )

  assert.match(approvalComponentSource, /SearchBarAndFilter/)
  assert.match(approvalComponentSource, /Pagination/)
  assert.match(approvalComponentSource, /overflowY: 'auto'/)
  assert.match(approvalComponentSource, /flex: 1/)
  assert.match(approvalComponentSource, /minHeight: 0/)
  assert.match(searchBarAndFilterSource, /InputAdornment position="end"/)
  assert.match(searchBarAndFilterSource, /displayLabel="Filtros"/)
  assert.match(searchBarAndFilterSource, /height: 44/)
  assert.match(searchBarAndFilterSource, /minHeight: 44/)
  assert.match(paginationSource, /currentPage/)
})

test('admin approvals page uses a responsive grid and a bounded page size for queues', () => {
  const adminApprovalsPageSource = readFileSync(
    new URL('../src/pages/admin/AdminApprovalsPage.tsx', import.meta.url),
    'utf8'
  )

  assert.match(adminApprovalsPageSource, /pageSize: 2/)
  assert.match(
    adminApprovalsPageSource,
    /repeat\(auto-fit, minmax\(min\(100%, 32rem\), 1fr\)\)/
  )
})

test('approval list cards preserve the compact visual proportions from the reference', () => {
  const approvalCardSource = readFileSync(
    new URL(
      '../src/pages/admin/components/ApprovalCard.tsx',
      import.meta.url
    ),
    'utf8'
  )
  const searchBarAndFilterSource = readFileSync(
    new URL(
      '../src/components/common/SearchBarAndFilter.tsx',
      import.meta.url
    ),
    'utf8'
  )

  assert.match(approvalCardSource, /fontSize: \{ md: 22, xs: 18 \}/)
  assert.match(approvalCardSource, /AppTags/)
  assert.match(approvalCardSource, /size="sm"/)
  assert.match(searchBarAndFilterSource, /height: 44/)
})

test('admin surfaces rely on theme-aware styling instead of fixed slate utility colors', () => {
  const adminDashboardSource = readFileSync(
    new URL('../src/pages/admin/AdminDashboardPage.tsx', import.meta.url),
    'utf8'
  )
  const approvalCardSource = readFileSync(
    new URL(
      '../src/pages/admin/components/ApprovalCard.tsx',
      import.meta.url
    ),
    'utf8'
  )
  const approvalComponentSource = readFileSync(
    new URL(
      '../src/pages/admin/components/ApprovalComponent.tsx',
      import.meta.url
    ),
    'utf8'
  )

  assert.match(adminDashboardSource, /useTheme/)
  assert.match(approvalCardSource, /useTheme/)
  assert.match(approvalComponentSource, /useTheme/)
  assert.doesNotMatch(approvalCardSource, /text-slate-900/)
  assert.doesNotMatch(approvalComponentSource, /text-slate-900/)
})

test('admin approvals page renders cards directly and provides visible actions', () => {
  const adminApprovalsPageSource = readFileSync(
    new URL('../src/pages/admin/AdminApprovalsPage.tsx', import.meta.url),
    'utf8'
  )
  const approvalCardSource = readFileSync(
    new URL('../src/pages/admin/components/ApprovalCard.tsx', import.meta.url),
    'utf8'
  )
  const adminTypesSource = readFileSync(
    new URL('../src/types/admin.ts', import.meta.url),
    'utf8'
  )

  assert.match(adminTypesSource, /export interface ApprovalCardAction/)
  assert.match(adminTypesSource, /export interface ApprovalCardStatus/)
  assert.match(adminTypesSource, /export interface ApprovalCardHelperText/)
  assert.match(adminApprovalsPageSource, /<ApprovalCard/)
  assert.doesNotMatch(adminApprovalsPageSource, /actions=\{\[\]\}/)
  assert.match(adminApprovalsPageSource, /item=\{item\}/)
  assert.match(adminApprovalsPageSource, /onEdit=\{\(\) =>/)
  assert.match(approvalCardSource, /item\.kind === 'content'/)
  assert.match(approvalCardSource, /getGuardianApprovalEligibility/)
  assert.doesNotMatch(approvalCardSource, /ApprovalPill/)
})
