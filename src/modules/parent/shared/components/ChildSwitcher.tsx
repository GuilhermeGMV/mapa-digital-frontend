import { Box, IconButton, Typography } from '@mui/material'
import type { ParentDashboardChild } from '@/modules/parent/dashboard/types/types'
import { useTheme } from '@mui/material/styles'
import { getRolePalette, getSelectedStyle } from '@/app/theme/core/roles'
import { useParentRole } from '@/modules/parent/shared/hooks/useParentRole'

interface ChildSwitcherProps {
  children: ParentDashboardChild[]
  selectedChildId: string | null
  onSelect: (id: string) => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ChildSwitcher({
  children,
  selectedChildId,
  onSelect,
}: ChildSwitcherProps) {
  const theme = useTheme()
  const role = useParentRole()
  const rolePalette = getRolePalette(theme, role)
  const selectColor = getSelectedStyle(theme, rolePalette.contrast)
  if (children.length === 0) return null

  return (
    <Box
      role="group"
      aria-label="Selecionar filho"
      sx={{
        height: 32,
        display: 'flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: rolePalette.contrast,
        borderRadius: 'var(--app-radius-pill)',
        gap: 1,
      }}
    >
      {children.map(child => {
        const isSelected = child.id === selectedChildId
        const initials = getInitials(child.name)
        const firstName = child.name.split(' ')[0]

        return (
          <IconButton
            key={child.id}
            aria-checked={isSelected}
            aria-label={`${child.name} — ${child.grade}`}
            onClick={() => onSelect(child.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: isSelected ? 1 : 0.5,
              py: 0.5,
              borderRadius: 'var(--app-radius-pill)',
              cursor: 'pointer',
              transition:
                'background-color 0.15s ease, border-color 0.15s ease',
              backgroundColor: isSelected ? selectColor : 'transparent',
              '&:hover': {
                backgroundColor: isSelected ? selectColor : selectColor,
              },
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '1px solid',
                backgroundColor: rolePalette.secondary,
                color: rolePalette.contrast,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
                flexShrink: 0,
                letterSpacing: '0.02em',
              }}
            >
              {initials}
            </Box>
            {isSelected ? (
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: rolePalette.contrast,
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  pr: 0.25,
                }}
              >
                {firstName}
              </Typography>
            ) : null}
          </IconButton>
        )
      })}
    </Box>
  )
}

export default ChildSwitcher
