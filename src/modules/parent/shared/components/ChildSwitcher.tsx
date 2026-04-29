import { Box, IconButton, Typography } from '@mui/material'
import type { ParentDashboardChild } from '@/modules/parent/dashboard/types/types'

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
  if (children.length === 0) return null

  return (
    <Box
      role="group"
      aria-label="Selecionar filho"
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '999px',
        p: 0.375,
        gap: 0.25,
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
              px: 1,
              py: 0.5,
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              backgroundColor: isSelected
                ? 'rgba(255,255,255,0.5)'
                : 'transparent',
              '&:hover': {
                backgroundColor: isSelected
                  ? 'rgba(255,255,255,0.95)'
                  : 'rgba(255,255,255,0.15)',
              },
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: isSelected
                  ? 'var(--app-role-current-primary, #3b3b3b)'
                  : 'rgba(255,255,255,0.3)',
                color: '#fff',
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
                  color: isSelected
                    ? 'var(--app-role-current-primary, #1a1a1a)'
                    : 'rgba(255,255,255,0.92)',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
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
