import { Box, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import EmptyState from '@/components/common/EmptyState'
import Pagination from '@/components/common/Pagination'
import type { DropdownOption } from '@/components/ui/AppDropdown'
import AppCard from '@/components/ui/AppCard'
import { useUserRole } from '@/hooks/useUserRole'
import { AppColors } from '@/styles/AppColors'
import type { ApprovalStatus } from '@/types/admin'
import type { UserRole } from '@/types/user'
import { SearchBarAndFilter } from '@/components/common/SearchBarAndFilter'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

export interface ApprovalStatusOption extends DropdownOption {
  value: ApprovalStatus
}

interface ApprovalComponentProps<TItem extends { id: string }> {
  createActionLabel: string
  currentPage: number
  description: string
  emptyStateDescription: string
  emptyStateTitle: string
  filterOptions: ApprovalStatusOption[]
  items: TItem[]
  onCreate: () => void | Promise<void>
  onPageChange: (page: number) => void
  onQueryChange: (query: string) => void
  onStatusChange: (status: ApprovalStatus) => void
  query: string
  renderItem: (item: TItem) => ReactNode
  resultCount: number
  searchPlaceholder: string
  selectedStatus: ApprovalStatus
  title: string
  totalPages: number
}

function ApprovalComponent<TItem extends { id: string }>({
  createActionLabel,
  currentPage,
  description,
  emptyStateDescription,
  emptyStateTitle,
  filterOptions,
  items,
  onCreate,
  onPageChange,
  onQueryChange,
  onStatusChange,
  query,
  renderItem,
  resultCount,
  searchPlaceholder,
  selectedStatus,
  title,
  totalPages,
}: ApprovalComponentProps<TItem>) {
  const theme = useTheme()
  const { role } = useUserRole()
  const accentColor = AppColors.role.admin.primary

  return (
    <AppCard
      className="h-full"
      contentClassName="gap-6 p-5 md:p-6"
      contentSx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: {
          lg: 'calc(100vh - 16rem)',
          xs: 'auto',
        },
        maxHeight: {
          lg: '960px',
          xs: 'none',
        },
        minHeight: {
          lg: 'min(720px, calc(100vh - 16rem))',
          xs: 'auto',
        },
        minWidth: 0,
      }}
    >
      <Box className="flex items-start justify-between gap-3">
        <Box className="space-y-1">
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { md: 20, xs: 18 },
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { md: 15, xs: 14 },
              maxWidth: 720,
            }}
          >
            {description}
          </Typography>
        </Box>

        <IconButton
          aria-label={createActionLabel}
          onClick={onCreate}
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'background.border',
            borderRadius: 'var(--app-radius-control)',
            color: 'text.primary',
            flexShrink: 0,
            height: 32,
            width: 32,
            '&:hover': {
              backgroundColor: alpha(
                accentColor,
                theme.palette.mode === 'dark' ? 0.08 : 0.12
              ),
              borderColor: alpha(
                accentColor,
                theme.palette.mode === 'dark' ? 0.24 : 0.16
              ),
            },
          }}
        >
          <AddRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <SearchBarAndFilter
        filterOptions={filterOptions}
        onQueryChange={onQueryChange}
        onStatusChange={event =>
          onStatusChange(event.target.value as ApprovalStatus)
        }
        query={query}
        resultLabel={`${resultCount} ${resultCount === 1 ? 'resultado' : 'resultados'}`}
        searchPlaceholder={searchPlaceholder}
        selectedStatus={selectedStatus}
      />

      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          minHeight: 0,
          paddingTop: 2,
        }}
      >
        {items.length > 0 ? (
          <Box
            className="grid gap-4"
            sx={{
              flex: 1,
              minHeight: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
              pr: 0.5,
            }}
          >
            {items.map(item => (
              <Box key={item.id} sx={{ flexShrink: 0 }}>
                {renderItem(item)}
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              minHeight: { lg: 200, xs: 160 },
            }}
          >
            <EmptyState
              description={emptyStateDescription}
              title={emptyStateTitle}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ flexShrink: 0, mt: 'auto' }}>
        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          role={(role ?? 'admin') as UserRole}
          totalPages={totalPages}
        />
      </Box>
    </AppCard>
  )
}

export default ApprovalComponent
