import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { startTransition, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth/hook'
import { parentService, parentSettingsService } from '../services/service'
import AccountSettings from '../components/AccountSettings'
import { useParentSettings } from '../hooks/useParentSettings'
import {
  ChildItem,
  ChildQueueQuery,
  ChildQueueResult,
  Status,
} from '../types/types'
import ListChildren, { type StatusOption } from '../components/ListChildren'
import { ResultsSummary } from '@/modules/parent/settings/types/types'

const DEFAULT_PAGE_INDEX = 1

const DEFAULT_QUERY: ChildQueueQuery = {
  page: DEFAULT_PAGE_INDEX,
  pageSize: 10,
  query: '',
  status: 'all',
}

const FilterOptions: StatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aguardando validação', value: 'pendingValidation' },
  { label: 'Cadastro liberado', value: 'approved' },
  { label: 'Cadastro recusado', value: 'rejected' },
]

function emptyQueueResult<TItem>(pageSize: number): ChildQueueResult<TItem> {
  return {
    currentPage: DEFAULT_PAGE_INDEX,
    items: [],
    pageSize,
    totalItems: 0,
    totalPages: 1,
  }
}

function buildResultsSummary(count: number): ResultsSummary {
  return {
    count,
    pluralLabel: 'resultados',
    singularLabel: 'resultado',
  }
}

export default function Page() {
  const { logout } = useAuth()
  const { children, selectedChildId, selectChild } = useParentSettings()
  const [accountSettings, setAccountSettings] = useState(() =>
    parentService.getAccountSettings()
  )
  const [parentQuery, setParentQuery] = useState<ChildQueueQuery>(DEFAULT_QUERY)
  const [parentQueue, setParentQueue] = useState<ChildQueueResult<ChildItem>>(
    emptyQueueResult(DEFAULT_QUERY.pageSize)
  )

  const parentResultsSummary = useMemo(
    () => buildResultsSummary(parentQueue.totalItems),
    [parentQueue.totalItems]
  )

  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title={parentSettingsService.getTitle()}
        subtitle="Configure sua conta"
        variant="responsavel"
      />
      <AccountSettings
        initialValues={accountSettings}
        onDeleteAccount={async () => {
          await parentService.deleteAccount()
          logout()
        }}
        onDisableAccount={async () => {
          await parentService.disableAccount()
          logout()
        }}
        onSave={async settings => {
          const updatedSettings =
            await parentService.updateAccountSettings(settings)
          setAccountSettings(updatedSettings)
        }}
      />
      <ListChildren
        children={children}
        selectedChildId={selectedChildId}
        onSelect={selectChild}
        title="Filhos"
        description="AAadaa a"
        currentPage={parentQueue.currentPage}
        emptyStateDescription={
          'Não há responsáveis aguardando aprovação no momento.'
        }
        emptyStateTitle="Nenhum responsável encontrado"
        filterOptions={FilterOptions}
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
        resultsSummary={parentResultsSummary}
        searchPlaceholder="Pesquisar responsáveis..."
        selectedStatus={parentQuery.status}
        totalPages={parentQueue.totalPages}
      />
    </AppPageContainer>
  )
}
