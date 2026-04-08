import type { ApiResponse, HttpRequestOptions } from '../types/api'
import type {
  ApprovalBadgeTone,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ContentApprovalItem,
  ContentApprovalStatus,
  GuardianApprovalItem,
  GuardianApprovalStatus,
} from '../types/admin'
import {
  filterApprovalItems,
  paginateApprovalItems,
} from '../utils/admin'

export class HttpRequestError extends Error {
  constructor(
    public readonly status: number,
    statusText: string
  ) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = 'HttpRequestError'
  }
}

type ApprovalApiClient = {
  get<T>(
    path: string,
    options?: { query?: HttpRequestOptions['query'] }
  ): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
}

type ContentApprovalStatusDto = 'approved' | 'in_review' | 'rejected' | 'sent'
type GuardianApprovalStatusDto = 'approved' | 'pending_validation' | 'rejected'

interface ApprovalTagDto {
  id: string
  label: string
  tone: ApprovalBadgeTone
}

interface ContentApprovalDto {
  id: string
  requested_at: string
  resource_type: 'exam' | 'task'
  stage_label: string
  status: ContentApprovalStatusDto
  subject_label: string
  tags: ApprovalTagDto[]
  title: string
}

interface GuardianApprovalDto {
  child_name: string
  id: string
  name: string
  requested_at: string
  role_label: string
  status: GuardianApprovalStatusDto
  tags: ApprovalTagDto[]
  validation: {
    has_document: boolean
    relationship_confirmed: boolean
    student_linked: boolean
  }
}

interface ApprovalQueueResponseDto<TItem> {
  items: TItem[]
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

interface CreateAdminApprovalRepositoryOptions {
  allowFallback?: boolean
  client: ApprovalApiClient
}

const contentResourceLabelMap = {
  exam: 'Prova',
  task: 'Tarefa',
} as const

const contentStatusMap: Record<
  ContentApprovalStatusDto,
  ContentApprovalStatus
> = {
  approved: 'approved',
  in_review: 'inReview',
  rejected: 'rejected',
  sent: 'sent',
}

const guardianStatusMap: Record<
  GuardianApprovalStatusDto,
  GuardianApprovalStatus
> = {
  approved: 'approved',
  pending_validation: 'pendingValidation',
  rejected: 'rejected',
}

let mockContentApprovalItems: ContentApprovalItem[] = [
  {
    id: 'content-1',
    kind: 'content',
    title: 'Lista de Equações do 7º ano',
    subtitle: 'Tarefa · Matemática · 22/03/2026',
    status: 'inReview',
    badges: [
      {
        id: 'content-1-origin',
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
        id: 'content-2-group',
        label: 'Alunos',
        tone: 'neutral',
      },
      {
        id: 'content-2-school',
        label: 'Escolas',
        tone: 'neutral',
      },
      {
        id: 'content-2-linked',
        label: '2 questões vinculadas',
        tone: 'danger',
      },
    ],
  },
  {
    id: 'content-3',
    kind: 'content',
    title: 'Produção textual argumentativa',
    subtitle: 'Tarefa · Português · 01/04/2026',
    status: 'approved',
    badges: [
      {
        id: 'content-3-school',
        label: 'Turma 7B',
        tone: 'info',
      },
    ],
  },
  {
    id: 'content-4',
    kind: 'content',
    title: 'Simulado de Ciências naturais',
    subtitle: 'Prova · Ciências · 04/04/2026',
    status: 'rejected',
    badges: [
      {
        id: 'content-4-note',
        label: 'Correção obrigatória',
        tone: 'warning',
      },
    ],
  },
]

let mockGuardianApprovalItems: GuardianApprovalItem[] = [
  {
    id: 'guardian-1',
    kind: 'guardian',
    title: 'Mariana Souza',
    subtitle: 'Solicitação em 01/04/2026',
    status: 'pendingValidation',
    badges: [
      {
        id: 'guardian-2-stage',
        label: 'Pronto para liberar',
        tone: 'success',
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
    subtitle: 'Solicitação em 02/04/2026',
    status: 'pendingValidation',
    badges: [
      {
        id: 'guardian-2-stage',
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
  {
    id: 'guardian-3',
    kind: 'guardian',
    title: 'Renata Lima',
    subtitle: 'Solicitação em 03/04/2026',
    status: 'approved',
    badges: [
      {
        id: 'guardian-3-stage',
        label: 'Acesso liberado',
        tone: 'success',
      },
    ],
    childName: 'Gabriel Lima',
    validation: {
      hasDocument: true,
      relationshipConfirmed: true,
      studentLinked: true,
    },
  },
  {
    id: 'guardian-4',
    kind: 'guardian',
    title: 'Paulo Mendes',
    subtitle: 'Solicitação em 05/04/2026',
    status: 'rejected',
    badges: [
      {
        id: 'guardian-4-stage',
        label: 'Cadastro recusado',
        tone: 'danger',
      },
    ],
    childName: 'Ana Mendes',
    validation: {
      hasDocument: true,
      relationshipConfirmed: false,
      studentLinked: true,
    },
  },
]

function formatBrazilianDate(value: string) {
  const [year, month, day] = value.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

function buildQueueQuery(query: ApprovalQueueQuery) {
  return {
    page: query.page,
    page_size: query.pageSize,
    query: query.query || undefined,
    status:
      query.status === 'all'
        ? undefined
        : query.status === 'inReview'
          ? 'in_review'
          : query.status === 'pendingValidation'
            ? 'pending_validation'
            : query.status,
  } satisfies HttpRequestOptions['query']
}

function mapApprovalQueue<TSource, TTarget>(
  response: ApiResponse<ApprovalQueueResponseDto<TSource>>,
  mapItem: (item: TSource) => TTarget
): ApprovalQueueResult<TTarget> {
  return {
    currentPage: response.data.page,
    items: response.data.items.map(mapItem),
    pageSize: response.data.page_size,
    totalItems: response.data.total_items,
    totalPages: response.data.total_pages,
  }
}

function mapContentApprovalItem(item: ContentApprovalDto): ContentApprovalItem {
  return {
    id: item.id,
    kind: 'content',
    title: item.title,
    subtitle: `${contentResourceLabelMap[item.resource_type]} · ${
      item.stage_label
    } · ${formatBrazilianDate(item.requested_at)}`,
    status: contentStatusMap[item.status],
    badges: item.tags.map(tag => ({
      id: tag.id,
      label: tag.label,
      tone: tag.tone,
    })),
  }
}

function mapGuardianApprovalItem(
  item: GuardianApprovalDto
): GuardianApprovalItem {
  return {
    id: item.id,
    kind: 'guardian',
    title: item.name,
    subtitle: `${item.role_label} · Solicitação em ${formatBrazilianDate(
      item.requested_at
    )}`,
    status: guardianStatusMap[item.status],
    badges: item.tags.map(tag => ({
      id: tag.id,
      label: tag.label,
      tone: tag.tone,
    })),
    childName: item.child_name,
    validation: {
      hasDocument: item.validation.has_document,
      relationshipConfirmed: item.validation.relationship_confirmed,
      studentLinked: item.validation.student_linked,
    },
  }
}

export function mapContentApprovalQueueResponse(
  response: ApiResponse<ApprovalQueueResponseDto<ContentApprovalDto>>
) {
  return mapApprovalQueue(response, mapContentApprovalItem)
}

function mapGuardianApprovalQueueResponse(
  response: ApiResponse<ApprovalQueueResponseDto<GuardianApprovalDto>>
) {
  return mapApprovalQueue(response, mapGuardianApprovalItem)
}

function shouldUseFallback(error: unknown, allowFallback: boolean) {
  if (!allowFallback) {
    return false
  }

  if (
    error instanceof HttpRequestError ||
    (typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof error.status === 'number')
  ) {
    return Number(error.status) >= 500
  }

  return error instanceof Error
}

function queryMockContentApprovals(
  query: ApprovalQueueQuery
): ApprovalQueueResult<ContentApprovalItem> {
  const filteredItems = filterApprovalItems(mockContentApprovalItems, query)

  return paginateApprovalItems(filteredItems, query)
}

function queryMockGuardianApprovals(
  query: ApprovalQueueQuery
): ApprovalQueueResult<GuardianApprovalItem> {
  const filteredItems = filterApprovalItems(mockGuardianApprovalItems, query)

  return paginateApprovalItems(filteredItems, query)
}

function updateMockContentStatus(
  id: string,
  status: ContentApprovalStatus
): ContentApprovalItem {
  let nextItem: ContentApprovalItem | undefined

  mockContentApprovalItems = mockContentApprovalItems.map(item => {
    if (item.id !== id) {
      return item
    }

    nextItem = {
      ...item,
      status,
    }

    return nextItem
  })

  if (!nextItem) {
    throw new Error(`Content approval ${id} not found`)
  }

  return nextItem
}

function updateMockGuardianStatus(
  id: string,
  status: GuardianApprovalStatus
): GuardianApprovalItem {
  let nextItem: GuardianApprovalItem | undefined

  mockGuardianApprovalItems = mockGuardianApprovalItems.map(item => {
    if (item.id !== id) {
      return item
    }

    nextItem = {
      ...item,
      badges:
        status === 'approved'
          ? [
              {
                id: `${item.id}-ready`,
                label: 'Acesso liberado',
                tone: 'success',
              },
            ]
          : [
              {
                id: `${item.id}-rejected`,
                label: 'Solicitação recusada',
                tone: 'danger',
              },
            ],
      status,
    }

    return nextItem
  })

  if (!nextItem) {
    throw new Error(`Guardian approval ${id} not found`)
  }

  return nextItem
}

function createMockContentDraft() {
  const itemId = `content-${Date.now()}`
  const nextItem: ContentApprovalItem = {
    id: itemId,
    kind: 'content',
    title: 'Nova avaliação em preparação',
    subtitle: 'Prova · Ciências · 10/04/2026',
    status: 'sent',
    badges: [
      {
        id: `${itemId}-badge-origin`,
        label: 'Cadastro manual',
        tone: 'info',
      },
      {
        id: `${itemId}-badge-audience`,
        label: '7º ano',
        tone: 'neutral',
      },
    ],
  }

  mockContentApprovalItems = [nextItem, ...mockContentApprovalItems]

  return nextItem
}

function createMockGuardianDraft() {
  const itemId = `guardian-${Date.now()}`
  const nextItem: GuardianApprovalItem = {
    id: itemId,
    kind: 'guardian',
    title: 'Novo responsável em triagem',
    subtitle: 'Solicitação em 07/04/2026',
    status: 'pendingValidation',
    badges: [
      {
        id: `${itemId}-badge-review`,
        label: 'Revisão inicial',
        tone: 'warning',
      },
    ],
    childName: 'Aluno a confirmar',
    validation: {
      hasDocument: false,
      relationshipConfirmed: false,
      studentLinked: false,
    },
  }

  mockGuardianApprovalItems = [nextItem, ...mockGuardianApprovalItems]

  return nextItem
}

function removeMockContentItem(id: string) {
  mockContentApprovalItems = mockContentApprovalItems.filter(
    item => item.id !== id
  )
}

function removeMockGuardianItem(id: string) {
  mockGuardianApprovalItems = mockGuardianApprovalItems.filter(
    item => item.id !== id
  )
}

export function createAdminApprovalRepository({
  allowFallback = false,
  client,
}: CreateAdminApprovalRepositoryOptions) {
  return {
    async getContentQueue(query: ApprovalQueueQuery) {
      try {
        const response = await client.get<
          ApprovalQueueResponseDto<ContentApprovalDto>
        >('admin/approvals/content', {
          query: buildQueueQuery(query),
        })

        return mapContentApprovalQueueResponse(response)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return queryMockContentApprovals(query)
      }
    },
    async getGuardianQueue(query: ApprovalQueueQuery) {
      try {
        const response = await client.get<
          ApprovalQueueResponseDto<GuardianApprovalDto>
        >('admin/approvals/guardians', {
          query: buildQueueQuery(query),
        })

        return mapGuardianApprovalQueueResponse(response)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return queryMockGuardianApprovals(query)
      }
    },
    async updateContentStatus(id: string, status: ContentApprovalStatus) {
      const remoteStatus = status === 'inReview' ? 'in_review' : status

      try {
        const response = await client.patch<ContentApprovalDto>(
          `admin/approvals/content/${id}/status`,
          { status: remoteStatus }
        )

        return mapContentApprovalItem(response.data)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return updateMockContentStatus(id, status)
      }
    },
    async updateGuardianStatus(id: string, status: GuardianApprovalStatus) {
      const remoteStatus =
        status === 'pendingValidation' ? 'pending_validation' : status

      try {
        const response = await client.patch<GuardianApprovalDto>(
          `admin/approvals/guardians/${id}/status`,
          { status: remoteStatus }
        )

        return mapGuardianApprovalItem(response.data)
      } catch (error) {
        if (!shouldUseFallback(error, allowFallback)) {
          throw error
        }

        return updateMockGuardianStatus(id, status)
      }
    },
    async createLocalContentDraft() {
      return createMockContentDraft()
    },
    async createLocalGuardianDraft() {
      return createMockGuardianDraft()
    },
    async removeLocalContentItem(id: string) {
      removeMockContentItem(id)
    },
    async removeLocalGuardianItem(id: string) {
      removeMockGuardianItem(id)
    },
  }
}
