import { expect, test } from '@jest/globals'
import {
  createContentApprovalRepository,
  type ApprovalApiClient,
} from '@/modules/admin/content/services/content/repository'
import type {
  ApprovalQueueResponseDto,
  ContentApprovalDto,
} from '@/modules/admin/content/services/content/mapper'
import {
  createParentApprovalRepository,
  type ParentApprovalApiClient,
} from '@/modules/admin/parent/services/parent/repository'
import type { ParentApprovalUserDto } from '@/modules/admin/parent/services/parent/mapper'
import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'

function apiResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    message: 'OK',
    success: true,
  }
}

function parentUser(
  overrides: Partial<ParentApprovalUserDto> = {}
): ParentApprovalUserDto {
  return {
    created_at: '2026-04-08T10:15:00+00:00',
    email: 'responsavel+qa@test.com',
    id: 42,
    is_superadmin: false,
    name: 'Mariana Souza',
    role: 'responsavel',
    status: 'aguardando',
    ...overrides,
  }
}

function contentApproval(
  overrides: Partial<ContentApprovalDto> = {}
): ContentApprovalDto {
  return {
    id: 'content-10',
    requested_at: '2026-04-07',
    resource_type: 'exam',
    stage_label: 'Português',
    status: 'in_review',
    subject_label: '7º ano',
    tags: [{ id: 'tag-1', label: '2 questões vinculadas', tone: 'danger' }],
    title: 'Avaliação bimestral',
    ...overrides,
  }
}

test('content approval repository sends queue filters and maps backend DTOs', async () => {
  const getCalls: Array<{
    options?: { query?: HttpRequestOptions['query'] }
    path: string
  }> = []
  const client: ApprovalApiClient = {
    async get<T>(
      path: string,
      options?: { query?: HttpRequestOptions['query'] }
    ) {
      getCalls.push({ path, options })

      return apiResponse<ApprovalQueueResponseDto<ContentApprovalDto>>({
        items: [contentApproval()],
        page: 2,
        page_size: 10,
        total_items: 11,
        total_pages: 2,
      }) as ApiResponse<T>
    },
    async patch() {
      throw new Error('Unexpected patch call')
    },
    async post() {
      throw new Error('Unexpected post call')
    },
  }

  const repository = createContentApprovalRepository({ client })
  const result = await repository.getContentQueue({
    page: 2,
    pageSize: 10,
    query: ' português ',
    status: 'inReview',
  })

  expect(getCalls).toEqual([
    {
      path: 'admin/approvals/content',
      options: {
        query: {
          page: 2,
          page_size: 10,
          query: 'português',
          status: 'in_review',
        },
      },
    },
  ])
  expect(result).toMatchObject({
    currentPage: 2,
    pageSize: 10,
    totalItems: 11,
    totalPages: 2,
  })
  expect(result.items[0]).toMatchObject({
    id: 'content-10',
    status: 'inReview',
    subtitle: 'Prova · Português · 07/04/2026',
    title: 'Avaliação bimestral',
  })
})

test('content approval repository translates UI status updates before patching', async () => {
  const patchCalls: Array<{ body?: unknown; path: string }> = []
  const client: ApprovalApiClient = {
    async get() {
      throw new Error('Unexpected get call')
    },
    async patch<T>(path: string, body?: unknown) {
      patchCalls.push({ path, body })

      return apiResponse(
        contentApproval({ status: 'correction_in_progress' })
      ) as ApiResponse<T>
    },
    async post() {
      throw new Error('Unexpected post call')
    },
  }

  const repository = createContentApprovalRepository({ client })
  const item = await repository.updateContentStatus(
    'content-10',
    'correctionInProgress'
  )

  expect(patchCalls).toEqual([
    {
      path: 'admin/approvals/content/content-10/status',
      body: { status: 'correction_in_progress' },
    },
  ])
  expect(item.status).toBe('correctionInProgress')
})

test('parent approval repository calls admin user endpoints with encoded ids', async () => {
  const getCalls: Array<{
    options?: { query?: HttpRequestOptions['query'] }
    path: string
  }> = []
  const patchCalls: Array<{ body?: unknown; path: string }> = []
  const postCalls: Array<{
    body?: unknown
    options?: Omit<HttpRequestOptions, 'body' | 'method'>
    path: string
  }> = []
  const client: ParentApprovalApiClient = {
    async delete() {
      throw new Error('Unexpected delete call')
    },
    async get<T>(
      path: string,
      options?: { query?: HttpRequestOptions['query'] }
    ) {
      getCalls.push({ path, options })

      return apiResponse([parentUser()]) as ApiResponse<T>
    },
    async patch<T>(path: string, body?: unknown) {
      patchCalls.push({ path, body })

      return apiResponse(parentUser({ status: 'aprovado' })) as ApiResponse<T>
    },
    async post<T>(
      path: string,
      body?: unknown,
      options?: Omit<HttpRequestOptions, 'body' | 'method'>
    ) {
      postCalls.push({ path, body, options })

      return apiResponse(null) as ApiResponse<T>
    },
  }

  const repository = createParentApprovalRepository({ client })
  const queue = await repository.getParentQueue({
    page: 1,
    pageSize: 10,
    query: 'mariana',
    status: 'pendingValidation',
  })
  const updated = await repository.updateParentStatus(
    'responsavel+qa@test.com',
    'approved'
  )
  await repository.createParentRegistration({
    email: 'novo@test.com',
    password: '12345678',
    title: 'Novo Responsável',
  })

  expect(getCalls).toEqual([
    {
      path: 'admin/users',
      options: {
        query: {
          role: 'responsavel',
          user_status: 'aguardando',
        },
      },
    },
  ])
  expect(queue.items[0]).toMatchObject({
    id: 'responsavel+qa@test.com',
    requestedAt: '08/04/2026',
    roleLabel: 'Responsável',
    status: 'pendingValidation',
    title: 'Mariana Souza',
  })
  expect(patchCalls).toEqual([
    {
      path: 'admin/users/responsavel%2Bqa%40test.com/status',
      body: { status: 'aprovado' },
    },
  ])
  expect(updated.status).toBe('approved')
  expect(postCalls).toEqual([
    {
      path: 'register',
      body: {
        email: 'novo@test.com',
        name: 'Novo Responsável',
        password: '12345678',
      },
      options: { skipAuth: true },
    },
  ])
})
