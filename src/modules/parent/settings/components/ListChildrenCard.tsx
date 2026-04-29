import { Box, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  getHoverStyle,
  getRolePalette,
  getRoleSelectedStyle,
} from '@/app/theme/core/roles'
import { useParentRole } from '@/modules/parent/shared/hooks/useParentRole'
import type { ParentChild } from '@/modules/parent/settings/types/types'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'

interface ListChildrenCardProps {
  child: ParentChild
  selected: boolean
  onSelect: (id: string) => void
}

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return initials || '?'
}

function ListChildrenCard({
  child,
  selected,
  onSelect,
}: ListChildrenCardProps) {
  const theme = useTheme()
  const role = useParentRole()
  const rolePalette = getRolePalette(theme, role)
  const selectedStyle = getRoleSelectedStyle(theme, role)
  const hoverStyle = getHoverStyle(theme, rolePalette.primary)
  const initials = getInitials(child.name)
  const selectedLabel = selected ? 'Selecionado' : 'Selecionar'

  return (
    <Box role="listitem" sx={{ minWidth: 0 }}>
      <Box
        aria-label={`${selectedLabel} ${child.name}, ${child.grade}`}
        aria-pressed={selected}
        component="button"
        onClick={() => onSelect(child.id)}
        sx={{
          backgroundColor: selected
            ? selectedStyle.backgroundColor
            : 'background.paper',
          border: '1px solid',
          borderColor: selected
            ? selectedStyle.borderColor
            : alpha(rolePalette.primary, 0.24),
          borderRadius: '12px',
          color: 'text.primary',
          cursor: 'pointer',
          display: 'flex',
          gap: 1.5,
          justifyContent: 'space-between',
          minWidth: 0,
          p: 1.5,
          textAlign: 'left',
          transition:
            'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
          width: '100%',
          '&:hover': {
            backgroundColor: selected
              ? selectedStyle.backgroundColor
              : hoverStyle.backgroundColor,
            borderColor: selected
              ? selectedStyle.borderColor
              : hoverStyle.borderColor,
          },
          '&:focus-visible': {
            boxShadow: `0 0 0 3px ${alpha(rolePalette.primary, 0.18)}`,
            outline: `1px solid ${alpha(rolePalette.primary, 0.72)}`,
            outlineOffset: '1px',
          },
        }}
        type="button"
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flex: '1 1 200px',
            gap: 1.5,
            minWidth: 0,
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              alignItems: 'center',
              backgroundColor: selected
                ? rolePalette.primary
                : alpha(rolePalette.primary, 0.14),
              borderRadius: '50%',
              color: selected ? rolePalette.contrast : rolePalette.primary,
              display: 'flex',
              flexShrink: 0,
              fontSize: 14,
              fontWeight: 800,
              height: 40,
              justifyContent: 'center',
              letterSpacing: '0.02em',
              minHeight: 40,
              minWidth: 40,
              width: 40,
            }}
          >
            {initials}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: '1rem',
                fontWeight: 700,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={child.name}
            >
              {child.name}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: 14,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {child.grade}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
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
                backgroundColor: hoverStyle.backgroundColor,
                borderColor: hoverStyle.borderColor,
              },
            }}
          >
            <MoreHorizRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default ListChildrenCard
