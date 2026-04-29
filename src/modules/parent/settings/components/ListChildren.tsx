import { Box, IconButton, Typography } from '@mui/material'
import AppCard from '@/shared/ui/AppCard'
import type { ParentChild } from '@/modules/parent/settings/types/types'
import ListChildrenCard from './ListChildrenCard'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useTheme } from '@mui/material/styles'
import { getRoleAccentColor, getHoverStyle } from '@/app/theme/core/roles'
import { useParentRole } from '../../shared/hooks/useParentRole'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import Pagination from '@/shared/ui/Pagination'
import EmptyState from '@/shared/ui/EmptyState'
import type { DropdownOption } from '@/shared/ui/AppDropdown'
import type {
  ResultsSummary,
  Status,
} from '@/modules/parent/settings/types/types'

export interface StatusOption extends DropdownOption {
  value: Status
}

interface ListChildrenProps {
  children: ParentChild[]
  selectedChildId: string | null
  onSelect: (id: string) => void
  title?: string
  description?: string
  currentPage: number
  emptyStateDescription: string
  emptyStateTitle: string
  onCreate?: () => void | Promise<void>
  onDelete?: () => void | Promise<void>
  onEdit?: () => void | Promise<void>
  onPageChange: (page: number) => void
  onQueryChange: (query: string) => void
  query: string
  searchPlaceholder: string
  totalPages: number
  filterOptions: StatusOption[]
  resultsSummary: ResultsSummary
  selectedStatus: Status
  onStatusChange: (status: Status) => void
}

export default function ListChildren({
  children,
  selectedChildId,
  onSelect,
  title,
  description,
  currentPage,
  emptyStateDescription,
  emptyStateTitle,
  onPageChange,
  onQueryChange,
  query,
  searchPlaceholder,
  totalPages,
  filterOptions,
  resultsSummary,
  selectedStatus,
  onStatusChange,
}: ListChildrenProps) {
  const theme = useTheme()
  const role = useParentRole()
  const accentColor = getRoleAccentColor(theme, role)
  const accentHover = getHoverStyle(theme, accentColor)

  if (children.length === 0) return null

  return (
    <AppCard
      className="flex h-full min-h-0 flex-col"
      contentSx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 2,
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <Box className="flex min-w-0 flex-col gap-2">
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            gap: 1.5,
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <Box className="space-y-1">
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { md: 20, xs: 18 },
                fontWeight: 700,
                minWidth: 0,
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
          <Box
            sx={{
              alignItems: 'flex-start',
              display: 'flex',
              gap: 1.5,
              justifyContent: 'space-between',
              minWidth: 0,
            }}
          >
            <IconButton
              aria-label="Adicionar"
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
                  backgroundColor: accentHover.backgroundColor,
                  borderColor: accentHover.borderColor,
                },
              }}
            >
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <SearchBarAndFilter
          filterOptions={filterOptions}
          onQueryChange={onQueryChange}
          onStatusChange={status => onStatusChange(status as Status)}
          query={query}
          resultsSummary={resultsSummary}
          searchPlaceholder={searchPlaceholder}
          selectedStatus={selectedStatus}
        />
      </Box>
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          minHeight: 0,
          paddingTop: 2,
        }}
      >
        {children.length > 0 ? (
          <Box
            className="grid gap-4"
            sx={{
              flex: 1,
              maxHeight: { md: 360, xs: 'none' },
              minHeight: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
              pr: { md: 1, xs: 0.75 },
              pl: { md: 0.5, xs: 0.75 },
              pt: { md: 0.5, xs: 0.75 },
            }}
          >
            {children.map(child => (
              <ListChildrenCard
                child={child}
                key={child.id}
                onSelect={onSelect}
                selected={child.id === selectedChildId}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flex: '1 1 auto',
              justifyContent: 'center',
              minHeight: 0,
              overflow: 'hidden',
              px: { md: 2, xs: 1 },
              py: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: 720,
                width: '100%',
              }}
            >
              <EmptyState
                description={emptyStateDescription}
                title={emptyStateTitle}
              />
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          flexShrink: 0,
          marginTop: 'auto',
          width: '100%',
        }}
      >
        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          role={role}
          totalPages={totalPages}
        />
      </Box>
    </AppCard>
  )
}
