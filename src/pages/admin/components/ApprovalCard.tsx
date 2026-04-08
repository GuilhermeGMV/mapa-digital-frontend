import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { Palette } from '@mui/material/styles'
import AppCard from '@/components/ui/AppCard'
import AppTags from '@/components/ui/AppTags'
import type {
  ApprovalBadge,
  ApprovalCardAction,
  ApprovalCardStatus,
  ContentApprovalItem,
  GuardianApprovalItem,
} from '@/types/admin'
import {
  approvalBadgesToTagContexts,
  approvalCardStatusToTagContext,
} from '@/utils/themes'
import { getGuardianApprovalEligibility } from './approvalQueue.utils'

/** `alpha()` não aceita `var(--mui-palette-*)`; resolve para cores do tema. */
function colorForAlpha(
  accentColor: string | undefined,
  palette: Palette
): string {
  if (!accentColor) {
    return palette.primary.main
  }
  if (accentColor.startsWith('var(')) {
    if (accentColor.includes('success')) {
      return palette.success.main
    }
    if (accentColor.includes('error')) {
      return palette.error.main
    }
    if (accentColor.includes('primary')) {
      return palette.primary.main
    }
    return palette.primary.main
  }
  return accentColor
}

function buildActions(
  item: ContentApprovalItem | GuardianApprovalItem,
  palette: Palette,
  handlers: {
    onApprove: () => void
    onDelete: () => void
    onEdit: () => void
    onReject: () => void
  }
): ApprovalCardAction[] {
  const success = palette.success.main
  const error = palette.error.main
  const neutral = palette.text.primary

  const editDelete = (): ApprovalCardAction[] => [
    {
      accentColor: neutral,
      icon: <EditOutlinedIcon />,
      id: `${item.id}-edit`,
      label: 'Editar',
      onClick: handlers.onEdit,
    },
    {
      accentColor: error,
      icon: <DeleteOutlineIcon />,
      id: `${item.id}-delete`,
      label: 'Excluir',
      onClick: handlers.onDelete,
    },
  ]

  if (item.kind === 'content') {
    if (item.status === 'approved') {
      return editDelete()
    }
    return [
      {
        accentColor: success,
        icon: <CheckRoundedIcon />,
        id: `${item.id}-approve`,
        label: 'Aprovar conteúdo',
        onClick: handlers.onApprove,
      },
      {
        accentColor: error,
        disabled: item.status === 'rejected',
        icon: <CancelOutlinedIcon />,
        id: `${item.id}-reject`,
        label: 'Recusar conteúdo',
        onClick: handlers.onReject,
      },
    ]
  }

  if (item.status === 'approved') {
    return editDelete()
  }

  const eligibility = getGuardianApprovalEligibility(item)

  return [
    {
      accentColor: success,
      disabled: !eligibility.canApprove,
      icon: <CheckRoundedIcon />,
      id: `${item.id}-approve`,
      label: 'Liberar cadastro',
      onClick: handlers.onApprove,
      tooltip: eligibility.canApprove
        ? 'Liberar acesso do responsável'
        : `Pendências: ${eligibility.missingRequirements.join(', ')}`,
    },
    {
      accentColor: error,
      disabled: item.status === 'rejected',
      icon: <CancelOutlinedIcon />,
      id: `${item.id}-reject`,
      label: 'Recusar cadastro',
      onClick: handlers.onReject,
    },
  ]
}

export interface ApprovalCardProps {
  badges: ApprovalBadge[]
  item: ContentApprovalItem | GuardianApprovalItem
  onApprove: () => void
  onDelete: () => void
  onEdit: () => void
  onReject: () => void
  status: ApprovalCardStatus
  subtitle: string
  title: string
}

function ApprovalCard({
  badges,
  item,
  onApprove,
  onDelete,
  onEdit,
  onReject,
  status,
  subtitle,
  title,
}: ApprovalCardProps) {
  const theme = useTheme()
  const statusChip = approvalCardStatusToTagContext(status, theme.palette)
  const badgeTags = approvalBadgesToTagContexts(badges, theme.palette)
  const actions = buildActions(item, theme.palette, {
    onApprove,
    onDelete,
    onEdit,
    onReject,
  })

  return (
    <AppCard>
      <Box className="flex flex-nowrap items-start justify-between gap-3">
        <Box className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { md: 22, xs: 18 },
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
          <AppTags size="sm" tags={[statusChip]} />
        </Box>
        <Box className="flex shrink-0 items-center justify-end gap-2 self-center">
          {actions.map(action => (
            <Tooltip key={action.id} title={action.tooltip ?? action.label}>
              <span>
                <IconButton
                  aria-label={action.label}
                  disabled={action.disabled}
                  onClick={action.onClick}
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: 'background.border',
                    borderRadius: 'var(--app-radius-control)',
                    color: action.accentColor ?? 'text.primary',
                    height: 32,
                    width: 32,
                    '& .MuiSvgIcon-root': {
                      fontSize: 16,
                    },
                    '&:hover': {
                      backgroundColor: alpha(
                        colorForAlpha(action.accentColor, theme.palette),
                        0.1
                      ),
                      borderColor: alpha(
                        colorForAlpha(action.accentColor, theme.palette),
                        0.2
                      ),
                    },
                  }}
                >
                  {action.icon}
                </IconButton>
              </span>
            </Tooltip>
          ))}
        </Box>
      </Box>
      <Box
        className="flex flex-col gap-1"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          paddingTop: 0,
        }}
      >
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { md: 14, xs: 13 },
          }}
        >
          {subtitle}
        </Typography>
        {badgeTags.length > 0 && <AppTags size="sm" tags={badgeTags} />}
      </Box>
    </AppCard>
  )
}

export default ApprovalCard
