import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Box } from '@mui/material'
import LoadingScreen from '@/components/common/LoadingScreen'
import PageHeader from '@/components/common/PageHeader'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { adminApprovalService } from '@/services/admin-approval.runtime'
import type {
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ContentApprovalItem,
  ContentApprovalStatus,
  GuardianApprovalItem,
  GuardianApprovalStatus,
} from '@/types/admin'
import ApprovalComponent, {
  type ApprovalStatusOption,
} from './components/ApprovalComponent'
import ApprovalCard from './components/ApprovalCard'
import {
  CONTENT_APPROVAL_CARD_STATUS,
  GUARDIAN_APPROVAL_CARD_STATUS,
} from '@/utils/themes'
const DEFAULT_PAGE_INDEX = 1

const DEFAULT_QUERY: ApprovalQueueQuery = {
  page: DEFAULT_PAGE_INDEX,
  pageSize: 10,
  query: '',
  status: 'all',
}

const contentFilterOptions: ApprovalStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Em revisão', value: 'inReview' },
  { label: 'Enviado', value: 'sent' },
  { label: 'Aprovado', value: 'approved' },
  { label: 'Recusado', value: 'rejected' },
]

const guardianFilterOptions: ApprovalStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aguardando validação', value: 'pendingValidation' },
  { label: 'Cadastro liberado', value: 'approved' },
  { label: 'Cadastro recusado', value: 'rejected' },
]

function emptyQueueResult<TItem>(pageSize: number): ApprovalQueueResult<TItem> {
  return {
    currentPage: DEFAULT_PAGE_INDEX,
    items: [],
    pageSize,
    totalItems: 0,
    totalPages: 1,
  }
}

function buildResolvedQuery(query: ApprovalQueueQuery, deferredQuery: string) {
  return {
    ...query,
    query: deferredQuery,
  }
}

function AdminApprovalsPage() {
  const [contentQuery, setContentQuery] =
    useState<ApprovalQueueQuery>(DEFAULT_QUERY)
  const [guardianQuery, setGuardianQuery] =
    useState<ApprovalQueueQuery>(DEFAULT_QUERY)
  const [contentQueue, setContentQueue] = useState<
    ApprovalQueueResult<ContentApprovalItem>
  >(emptyQueueResult(DEFAULT_QUERY.pageSize))
  const [guardianQueue, setGuardianQueue] = useState<
    ApprovalQueueResult<GuardianApprovalItem>
  >(emptyQueueResult(DEFAULT_QUERY.pageSize))
  const [contentError, setContentError] = useState<string | null>(null)
  const [guardianError, setGuardianError] = useState<string | null>(null)
  const [hasLoadedContent, setHasLoadedContent] = useState(false)
  const [hasLoadedGuardians, setHasLoadedGuardians] = useState(false)
  const [contentRefreshKey, setContentRefreshKey] = useState(0)
  const [guardianRefreshKey, setGuardianRefreshKey] = useState(0)

  const deferredContentSearch = useDeferredValue(contentQuery.query)
  const deferredGuardianSearch = useDeferredValue(guardianQuery.query)
  const resolvedContentQuery = useMemo(
    () => buildResolvedQuery(contentQuery, deferredContentSearch),
    [contentQuery, deferredContentSearch]
  )
  const resolvedGuardianQuery = useMemo(
    () => buildResolvedQuery(guardianQuery, deferredGuardianSearch),
    [guardianQuery, deferredGuardianSearch]
  )

  const handleContentStatusUpdate = useCallback(
    async (id: string, status: ContentApprovalStatus) => {
      await adminApprovalService.updateContentStatus(id, status)
      setContentRefreshKey(current => current + 1)
    },
    []
  )

  const handleGuardianStatusUpdate = useCallback(
    async (id: string, status: GuardianApprovalStatus) => {
      await adminApprovalService.updateGuardianStatus(id, status)
      setGuardianRefreshKey(current => current + 1)
    },
    []
  )

  const handleContentEdit = useCallback((_id: string) => {
    // TODO: navegar para o editor de conteúdo quando existir rota/tela dedicada.
  }, [])

  const handleContentDelete = useCallback(async (id: string) => {
    await adminApprovalService.removeLocalContentItem(id)
    setContentRefreshKey(current => current + 1)
  }, [])

  const handleGuardianEdit = useCallback((_id: string) => {
    // TODO: navegar para edição do responsável quando existir rota/tela dedicada.
  }, [])

  const handleGuardianDelete = useCallback(async (id: string) => {
    await adminApprovalService.removeLocalGuardianItem(id)
    setGuardianRefreshKey(current => current + 1)
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadContentQueue() {
      try {
        const nextContentQueue =
          await adminApprovalService.getContentQueue(resolvedContentQuery)

        if (!isActive) {
          return
        }

        setContentError(null)
        setContentQueue(nextContentQueue)
      } catch {
        if (!isActive) {
          return
        }

        setContentError(
          'Não foi possível carregar a fila de conteúdos. Verifique o contrato da API ou tente novamente.'
        )
        setContentQueue(emptyQueueResult(DEFAULT_QUERY.pageSize))
      }

      setHasLoadedContent(true)
    }

    void loadContentQueue()

    return () => {
      isActive = false
    }
  }, [resolvedContentQuery, contentRefreshKey])

  useEffect(() => {
    let isActive = true

    async function loadGuardianQueue() {
      try {
        const nextGuardianQueue = await adminApprovalService.getGuardianQueue(
          resolvedGuardianQuery
        )

        if (!isActive) {
          return
        }

        setGuardianError(null)
        setGuardianQueue(nextGuardianQueue)
      } catch {
        if (!isActive) {
          return
        }

        setGuardianError(
          'Não foi possível carregar a fila de responsáveis. Verifique o contrato da API ou tente novamente.'
        )
        setGuardianQueue(emptyQueueResult(DEFAULT_QUERY.pageSize))
      }

      setHasLoadedGuardians(true)
    }

    void loadGuardianQueue()

    return () => {
      isActive = false
    }
  }, [resolvedGuardianQuery, guardianRefreshKey])

  if (!hasLoadedContent || !hasLoadedGuardians) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        variant="admin"
        title="Centro de Aprovações"
        subtitle="Revise conteúdos enviados e valide responsáveis antes de liberar o acesso na plataforma."
      />
      <Box
        sx={{
          alignItems: 'stretch',
          display: 'grid',
          gap: 2,
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 32rem), 1fr))',
        }}
      >
        <ApprovalComponent
          createActionLabel="Cadastrar tarefa ou prova"
          description="Cadastre uma nova tarefa ou prova para revisão."
          currentPage={contentQueue.currentPage}
          emptyStateDescription={
            contentError ??
            'Tente outro filtro ou cadastre um novo conteúdo para iniciar a revisão.'
          }
          emptyStateTitle="Nenhum conteúdo encontrado"
          filterOptions={contentFilterOptions}
          items={contentQueue.items}
          onCreate={async () => {
            await adminApprovalService.createLocalContentDraft()
            startTransition(() => {
              setContentQuery({ ...DEFAULT_QUERY })
            })
          }}
          onPageChange={page => {
            startTransition(() => {
              setContentQuery(currentQuery => ({
                ...currentQuery,
                page,
              }))
            })
          }}
          onQueryChange={query => {
            startTransition(() => {
              setContentQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                query,
              }))
            })
          }}
          onStatusChange={status => {
            startTransition(() => {
              setContentQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                status,
              }))
            })
          }}
          query={contentQuery.query}
          renderItem={item => (
            <ApprovalCard
              badges={item.badges}
              item={item}
              onApprove={() => {
                void handleContentStatusUpdate(item.id, 'approved')
              }}
              onDelete={() => {
                void handleContentDelete(item.id)
              }}
              onEdit={() => {
                handleContentEdit(item.id)
              }}
              onReject={() => {
                void handleContentStatusUpdate(item.id, 'rejected')
              }}
              status={CONTENT_APPROVAL_CARD_STATUS[item.status]}
              subtitle={item.subtitle ?? ''}
              title={item.title}
            />
          )}
          resultCount={contentQueue.totalItems}
          searchPlaceholder="Pesquisar tarefas e provas..."
          selectedStatus={contentQuery.status}
          title="Cadastro e Aprovação de tarefas e provas"
          totalPages={contentQueue.totalPages}
        />

        <ApprovalComponent
          createActionLabel="Cadastrar responsável"
          currentPage={guardianQueue.currentPage}
          description="Valide e libere os cadastros de responsáveis."
          emptyStateDescription={
            guardianError ??
            'Nenhuma solicitação bate com os filtros atuais. Cadastre um novo responsável ou ajuste a busca.'
          }
          emptyStateTitle="Nenhum responsável encontrado"
          filterOptions={guardianFilterOptions}
          items={guardianQueue.items}
          onCreate={async () => {
            await adminApprovalService.createLocalGuardianDraft()
            startTransition(() => {
              setGuardianQuery({ ...DEFAULT_QUERY })
            })
          }}
          onPageChange={page => {
            startTransition(() => {
              setGuardianQuery(currentQuery => ({
                ...currentQuery,
                page,
              }))
            })
          }}
          onQueryChange={query => {
            startTransition(() => {
              setGuardianQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                query,
              }))
            })
          }}
          onStatusChange={status => {
            startTransition(() => {
              setGuardianQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                status,
              }))
            })
          }}
          query={guardianQuery.query}
          renderItem={item => (
            <ApprovalCard
              badges={item.badges}
              item={item}
              onApprove={() => {
                void handleGuardianStatusUpdate(item.id, 'approved')
              }}
              onDelete={() => {
                void handleGuardianDelete(item.id)
              }}
              onEdit={() => {
                handleGuardianEdit(item.id)
              }}
              onReject={() => {
                void handleGuardianStatusUpdate(item.id, 'rejected')
              }}
              status={GUARDIAN_APPROVAL_CARD_STATUS[item.status]}
              subtitle={item.subtitle ?? ''}
              title={item.title}
            />
          )}
          resultCount={guardianQueue.totalItems}
          searchPlaceholder="Pesquisar responsáveis..."
          selectedStatus={guardianQuery.status}
          title="Validação e liberação de responsáveis"
          totalPages={guardianQueue.totalPages}
        />
      </Box>
    </AppPageContainer>
  )
}

export default AdminApprovalsPage
