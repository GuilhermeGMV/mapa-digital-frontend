import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import RuleFolderOutlinedIcon from '@mui/icons-material/RuleFolderOutlined'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import PageHeader from '@/shared/ui/PageHeader'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { buildAdminCorrectionRoute } from '@/app/router/paths'
import { useUserRole } from '@/app/access/hook'
import {
  contentApprovalService,
  parentApprovalService,
} from '@/modules/admin/approvals/services/runtime'
import type {
  ApprovalCardAction,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ApprovalResultsSummary,
  ContentApprovalDraftInput,
  ContentApprovalItem,
  ContentApprovalStatus,
  ParentApprovalDraftInput,
  ParentApprovalItem,
  ParentApprovalStatus,
} from '@/modules/admin/shared/types/types'
import { ALL_SUBJECT_TAG_CONTEXTS } from '@/shared/utils/themes'
import ApprovalActionModal, {
  type ApprovalActionFormValues,
  type ApprovalActionModalMode,
} from '../components/ApprovalActionModal'
import ApprovalCard from '../components/ApprovalCard'
import ApprovalComponent, {
  type ApprovalStatusOption,
} from '../components/ApprovalComponent'
import { getParentApprovalEligibility } from '../components/approvalQueue.utils'
import {
  CONTENT_APPROVAL_CARD_STATUS,
  PARENT_APPROVAL_CARD_STATUS,
} from '@/shared/utils/themes'

const DEFAULT_PAGE_INDEX = 1
const DEFAULT_REQUESTED_AT = '09/04/2026'

const DEFAULT_QUERY: ApprovalQueueQuery = {
  page: DEFAULT_PAGE_INDEX,
  pageSize: 10,
  query: '',
  status: 'all',
}

const contentFilterOptions: ApprovalStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Em revisão', value: 'inReview' },
  { label: 'Correção em progresso', value: 'correctionInProgress' },
  { label: 'Enviado', value: 'sent' },
  { label: 'Aprovado', value: 'approved' },
  { label: 'Recusado', value: 'rejected' },
]

const parentFilterOptions: ApprovalStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aguardando validação', value: 'pendingValidation' },
  { label: 'Cadastro liberado', value: 'approved' },
  { label: 'Cadastro recusado', value: 'rejected' },
]

const resourceTypeOptions = [
  { label: 'Tarefa', value: 'task' },
  { label: 'Prova', value: 'exam' },
] as const

const subjectOptions = ALL_SUBJECT_TAG_CONTEXTS.filter(
  subject => subject.id !== 'default'
).map(subject => ({
  label: subject.label,
  value: subject.id ?? subject.label,
}))

const DEFAULT_SUBJECT_ID =
  subjectOptions.find(subject => subject.value === 'mathematics')?.value ??
  subjectOptions[0]?.value ??
  'default'

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

function buildResultsSummary(count: number): ApprovalResultsSummary {
  return {
    count,
    pluralLabel: 'resultados',
    singularLabel: 'resultado',
  }
}

function removeParentRequestFromQueue(
  queue: ApprovalQueueResult<ParentApprovalItem>,
  id: string
): ApprovalQueueResult<ParentApprovalItem> {
  const items = queue.items.filter(item => item.id !== id)

  if (items.length === queue.items.length) {
    return queue
  }

  const totalItems = Math.max(queue.totalItems - 1, 0)
  const totalPages = Math.max(Math.ceil(totalItems / queue.pageSize), 1)

  return {
    ...queue,
    currentPage: Math.min(queue.currentPage, totalPages),
    items,
    totalItems,
    totalPages,
  }
}

function getDefaultFormValues(): ApprovalActionFormValues {
  return {
    childName: '',
    email: '',
    password: '',
    requestedAt: DEFAULT_REQUESTED_AT,
    resourceType: 'task',
    subjectId: String(DEFAULT_SUBJECT_ID),
    title: '',
  }
}

export default function Page() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { role, isAdmin } = useUserRole()
  const [contentQuery, setContentQuery] =
    useState<ApprovalQueueQuery>(DEFAULT_QUERY)
  const [parentQuery, setParentQuery] =
    useState<ApprovalQueueQuery>(DEFAULT_QUERY)
  const [contentQueue, setContentQueue] = useState<
    ApprovalQueueResult<ContentApprovalItem>
  >(emptyQueueResult(DEFAULT_QUERY.pageSize))
  const [parentQueue, setParentQueue] = useState<
    ApprovalQueueResult<ParentApprovalItem>
  >(emptyQueueResult(DEFAULT_QUERY.pageSize))
  const [contentError, setContentError] = useState<string | null>(null)
  const [parentError, setParentError] = useState<string | null>(null)
  const [hasLoadedContent, setHasLoadedContent] = useState(false)
  const [hasLoadedParents, setHasLoadedParents] = useState(false)
  const [contentRefreshKey, setContentRefreshKey] = useState(0)
  const [parentRefreshKey, setParentRefreshKey] = useState(0)
  const [dismissedParentRequestIds, setDismissedParentRequestIds] = useState<
    string[]
  >([])
  const [modalState, setModalState] = useState<ApprovalActionModalMode | null>(
    null
  )
  const [modalValues, setModalValues] = useState<ApprovalActionFormValues>(
    getDefaultFormValues()
  )
  const [isModalSubmitting, setIsModalSubmitting] = useState(false)
  const [selectionMode, setSelectionMode] = useState<{
    action: 'edit' | 'delete'
    type: 'content' | 'parent'
  } | null>(null)
  const deferredContentSearch = useDeferredValue(contentQuery.query)
  const deferredParentSearch = useDeferredValue(parentQuery.query)
  const resolvedContentQuery = useMemo(
    () => buildResolvedQuery(contentQuery, deferredContentSearch),
    [contentQuery, deferredContentSearch]
  )
  const resolvedParentQuery = useMemo(
    () => buildResolvedQuery(parentQuery, deferredParentSearch),
    [parentQuery, deferredParentSearch]
  )

  const contentResultsSummary = useMemo(
    () => buildResultsSummary(contentQueue.totalItems),
    [contentQueue.totalItems]
  )
  const parentResultsSummary = useMemo(
    () => buildResultsSummary(parentQueue.totalItems),
    [parentQueue.totalItems]
  )

  const getSubjectById = useCallback((subjectId: string) => {
    return (
      ALL_SUBJECT_TAG_CONTEXTS.find(
        subject => (subject.id ?? subject.label) === subjectId
      ) ?? ALL_SUBJECT_TAG_CONTEXTS[0]
    )
  }, [])

  const resetModal = useCallback(() => {
    setModalState(null)
    setModalValues(getDefaultFormValues())
    setSelectionMode(null)
  }, [])

  const toggleSelectionMode = useCallback(
    (action: 'edit' | 'delete', type: 'content' | 'parent') => {
      setSelectionMode(current =>
        current?.action === action && current?.type === type
          ? null
          : { action, type }
      )
    },
    []
  )

  const handleContentItemSelect = useCallback(
    (item: ContentApprovalItem) => {
      if (!selectionMode || selectionMode.type !== 'content') return
      setSelectionMode(null)
      setModalState({ action: selectionMode.action, item, type: 'content' })
      setModalValues({
        childName: '',
        email: '',
        password: '',
        requestedAt: item.requestedAt ?? DEFAULT_REQUESTED_AT,
        resourceType: item.resourceType ?? 'task',
        subjectId: String(item.subject?.id ?? DEFAULT_SUBJECT_ID),
        title: item.title ?? '',
      })
    },
    [selectionMode]
  )

  const handleParentItemSelect = useCallback(
    (item: ParentApprovalItem) => {
      if (!selectionMode || selectionMode.type !== 'parent') return
      setSelectionMode(null)
      setModalState({ action: selectionMode.action, item, type: 'parent' })
      setModalValues({
        childName: item.childName ?? '',
        email: '',
        password: '',
        requestedAt: item.requestedAt ?? DEFAULT_REQUESTED_AT,
        resourceType: 'task',
        subjectId: String(DEFAULT_SUBJECT_ID),
        title: item.title ?? '',
      })
    },
    [selectionMode]
  )

  const openModal = useCallback((nextMode: ApprovalActionModalMode) => {
    setModalState(nextMode)
    setModalValues({
      childName:
        nextMode.item?.kind === 'parent' ? nextMode.item.childName : '',
      email: '',
      password: '',
      requestedAt: nextMode.item?.requestedAt ?? DEFAULT_REQUESTED_AT,
      resourceType:
        nextMode.item?.kind === 'content'
          ? (nextMode.item.resourceType ?? 'task')
          : 'task',
      subjectId:
        nextMode.item?.kind === 'content'
          ? String(nextMode.item.subject?.id ?? DEFAULT_SUBJECT_ID)
          : String(DEFAULT_SUBJECT_ID),
      title: nextMode.item?.title ?? '',
    })
  }, [])

  const handleContentStatusUpdate = useCallback(
    async (id: string, status: ContentApprovalStatus) => {
      await contentApprovalService.updateContentStatus(id, status)
      setContentRefreshKey(current => current + 1)
    },
    []
  )

  const handleParentStatusUpdate = useCallback(
    async (id: string, status: ParentApprovalStatus) => {
      await parentApprovalService.updateParentStatus(id, status)
      setParentRefreshKey(current => current + 1)
    },
    []
  )

  const dismissParentRequest = useCallback((id: string) => {
    setDismissedParentRequestIds(current =>
      current.includes(id) ? current : [...current, id]
    )
    setParentQueue(current => removeParentRequestFromQueue(current, id))
  }, [])

  const buildContentActions = useCallback(
    (item: ContentApprovalItem): ApprovalCardAction[] => {
      const success = theme.palette.success.main
      const error = theme.palette.error.main
      const warning = theme.palette.warning.main
      const correctionRoute = buildAdminCorrectionRoute(item.id)

      return [
        {
          accentColor: warning,
          icon:
            item.status === 'approved' ? (
              <EditOutlinedIcon />
            ) : (
              <RuleFolderOutlinedIcon />
            ),
          id: `${item.id}-review`,
          label: 'Revisar conteúdo',
          onClick: () => {
            if (item.status === 'approved') {
              openModal({ action: 'edit', item, type: 'content' })
              return
            }

            navigate(correctionRoute)
          },
          priority: 'secondary',
          tooltip:
            item.status === 'approved'
              ? 'Editar conteúdo'
              : 'Corrigir atividade',
        },
        {
          accentColor: error,
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-delete`,
          label: 'Excluir conteúdo',
          onClick: () => {
            openModal({ action: 'delete', item, type: 'content' })
          },
          priority: 'secondary',
          tooltip: 'Excluir conteúdo',
        },
        {
          accentColor: success,
          disabled: item.status === 'approved',
          icon: <CheckRoundedIcon />,
          id: `${item.id}-approve`,
          label: 'Validar conteúdo',
          onClick: () => {
            void handleContentStatusUpdate(item.id, 'approved')
          },
        },
        {
          accentColor: error,
          disabled: item.status === 'rejected',
          icon: <CancelOutlinedIcon />,
          id: `${item.id}-reject`,
          label: 'Rejeitar conteúdo',
          onClick: () => {
            void handleContentStatusUpdate(item.id, 'rejected')
          },
        },
      ]
    },
    [handleContentStatusUpdate, navigate, openModal, theme.palette]
  )

  const buildParentActions = useCallback(
    (item: ParentApprovalItem): ApprovalCardAction[] => {
      const success = theme.palette.success.main
      const error = theme.palette.error.main
      const eligibility = getParentApprovalEligibility(item)
      const clearRequestAction: ApprovalCardAction[] =
        item.status === 'pendingValidation' ? [] : []
      return [
        {
          accentColor: success,
          disabled: item.status === 'approved' || !eligibility.canApprove,
          icon: <CheckRoundedIcon />,
          id: `${item.id}-approve`,
          label: 'Validar cadastro',
          onClick: () => {
            void handleParentStatusUpdate(item.id, 'approved')
          },
          tooltip: eligibility.canApprove
            ? 'Validar cadastro'
            : `Pendências: ${eligibility.missingRequirements.join(', ')}`,
        },
        {
          accentColor: error,
          disabled: item.status === 'rejected',
          icon: <CancelOutlinedIcon />,
          id: `${item.id}-reject`,
          label: 'Rejeitar cadastro',
          onClick: () => {
            void handleParentStatusUpdate(item.id, 'rejected')
          },
        },
        ...clearRequestAction,
      ]
    },
    [dismissParentRequest, handleParentStatusUpdate, theme.palette]
  )

  const handleModalChange = useCallback(
    (
      field: keyof ApprovalActionFormValues,
      value: string | ContentApprovalDraftInput['resourceType']
    ) => {
      setModalValues(current => ({
        ...current,
        [field]: value,
      }))
    },
    []
  )

  const handleModalConfirm = useCallback(async () => {
    if (!modalState || isModalSubmitting) {
      return
    }

    setIsModalSubmitting(true)

    try {
      if (modalState.type === 'content') {
        if (modalState.action === 'delete' && modalState.item) {
          await contentApprovalService.removeLocalContentItem(
            modalState.item.id
          )
          setContentRefreshKey(current => current + 1)
          resetModal()
          return
        }

        const payload: ContentApprovalDraftInput = {
          requestedAt: modalValues.requestedAt,
          resourceType: modalValues.resourceType,
          subject: getSubjectById(modalValues.subjectId),
          title: modalValues.title || 'Novo conteúdo',
        }

        if (modalState.action === 'create') {
          await contentApprovalService.createLocalContentDraft(payload)
        } else if (modalState.item) {
          await contentApprovalService.updateLocalContentItem(
            modalState.item.id,
            payload
          )
        }

        setContentRefreshKey(current => current + 1)
        resetModal()
        return
      }

      if (modalState.action === 'create') {
        const payload: ParentApprovalDraftInput = {
          email: modalValues.email.trim(),
          password: modalValues.password,
          title: modalValues.title.trim(),
        }

        await parentApprovalService.createParentRegistration(payload)
        setParentRefreshKey(current => current + 1)
      }

      resetModal()
    } finally {
      setIsModalSubmitting(false)
    }
  }, [getSubjectById, isModalSubmitting, modalState, modalValues, resetModal])

  const isModalConfirmDisabled = useMemo(() => {
    if (!modalState || modalState.action === 'delete') {
      return false
    }

    if (modalState.type === 'parent' && modalState.action === 'create') {
      return true
    }

    return false
  }, [modalState])

  useEffect(() => {
    let isActive = true

    async function loadContentQueue() {
      try {
        const nextContentQueue =
          await contentApprovalService.getContentQueue(resolvedContentQuery)

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
          'Nenhum conteúdo cadastrado. Cadastre um novo conteúdo para revisão.'
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

    async function loadParentQueue() {
      try {
        const nextParentQueue =
          await parentApprovalService.getParentQueue(resolvedParentQuery)
        const visibleParentQueue = dismissedParentRequestIds.reduce(
          removeParentRequestFromQueue,
          nextParentQueue
        )

        if (!isActive) {
          return
        }

        setParentError(null)
        setParentQueue(visibleParentQueue)
      } catch {
        if (!isActive) {
          return
        }

        setParentError(
          'Nenhum responsável cadastrado. Cadastre um novo responsável para revisão.'
        )
        setParentQueue(emptyQueueResult(DEFAULT_QUERY.pageSize))
      }

      setHasLoadedParents(true)
    }

    void loadParentQueue()

    return () => {
      isActive = false
    }
  }, [dismissedParentRequestIds, resolvedParentQuery, parentRefreshKey])

  if (!isAdmin || role !== 'admin' || !hasLoadedContent || !hasLoadedParents) {
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
          currentPage={contentQueue.currentPage}
          description="Cadastre uma nova tarefa ou prova para revisão."
          emptyStateDescription={
            contentError ??
            'Tente outro filtro ou cadastre um novo conteúdo para iniciar a revisão.'
          }
          emptyStateTitle="Nenhum conteúdo encontrado"
          filterOptions={contentFilterOptions}
          items={contentQueue.items}
          onCreate={() => {
            openModal({ action: 'create', type: 'content' })
          }}
          onEdit={() => toggleSelectionMode('edit', 'content')}
          onDelete={() => toggleSelectionMode('delete', 'content')}
          onItemSelect={handleContentItemSelect}
          selectionMode={
            selectionMode?.type === 'content' ? selectionMode.action : null
          }
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
              actions={buildContentActions(item)}
              item={item}
              status={CONTENT_APPROVAL_CARD_STATUS[item.status]}
              type="content"
            />
          )}
          resultsSummary={contentResultsSummary}
          role={role}
          searchPlaceholder="Pesquisar tarefas e provas..."
          selectedStatus={contentQuery.status}
          title="Cadastro e Aprovação de atividades"
          totalPages={contentQueue.totalPages}
        />

        <ApprovalComponent
          currentPage={parentQueue.currentPage}
          description="Valide e libere os cadastros de responsáveis."
          emptyStateDescription={
            parentError ??
            'Não há responsáveis aguardando aprovação no momento.'
          }
          emptyStateTitle="Nenhum responsável encontrado"
          filterOptions={parentFilterOptions}
          items={parentQueue.items}
          onCreate={() => {
            openModal({ action: 'create', type: 'parent' })
          }}
          onEdit={() => toggleSelectionMode('edit', 'parent')}
          onDelete={() => toggleSelectionMode('delete', 'parent')}
          onItemSelect={handleParentItemSelect}
          selectionMode={
            selectionMode?.type === 'parent' ? selectionMode.action : null
          }
          onPageChange={page => {
            startTransition(() => {
              setParentQuery(currentQuery => ({
                ...currentQuery,
                page,
              }))
            })
          }}
          onQueryChange={query => {
            startTransition(() => {
              setParentQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                query,
              }))
            })
          }}
          onStatusChange={status => {
            startTransition(() => {
              setParentQuery(currentQuery => ({
                ...currentQuery,
                page: DEFAULT_PAGE_INDEX,
                status,
              }))
            })
          }}
          query={parentQuery.query}
          renderItem={item => (
            <ApprovalCard
              actions={buildParentActions(item)}
              item={item}
              status={PARENT_APPROVAL_CARD_STATUS[item.status]}
              type="parent"
            />
          )}
          resultsSummary={parentResultsSummary}
          role={role}
          searchPlaceholder="Pesquisar responsáveis..."
          selectedStatus={parentQuery.status}
          title="Validação e liberação de responsáveis"
          totalPages={parentQueue.totalPages}
        />
      </Box>

      <ApprovalActionModal
        mode={modalState}
        disableConfirm={isModalConfirmDisabled}
        isSubmitting={isModalSubmitting}
        onChange={handleModalChange}
        onClose={resetModal}
        onConfirm={handleModalConfirm}
        open={modalState !== null}
        resourceTypeOptions={[...resourceTypeOptions]}
        role={role}
        subjectOptions={subjectOptions}
        values={modalValues}
      />
    </AppPageContainer>
  )
}
