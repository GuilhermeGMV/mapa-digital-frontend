import type { PaletteMode } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { alpha, lighten } from '@mui/material/styles'
import { AppColors } from '../styles/AppColors'
import type {
  ApprovalBadge,
  ApprovalBadgeTone,
  ApprovalCardStatus,
  ContentApprovalStatus,
  GuardianApprovalItem,
  GuardianApprovalStatus,
} from '../types/admin'
import type { TagContext } from '../types/common'

export type TagSize = 'sm' | 'md' | 'lg'
export type SubjectChipSize = TagSize

export type TagChipTone = {
  backgroundColor: string
  borderColor: string
  color: string
}

export function getTagChipTone(
  color: string | undefined,
  { mode = 'light' }: { mode?: PaletteMode } = {}
): TagChipTone {
  const resolvedColor = color ?? 'rgba(32, 109, 197, 1)'
  const isDark = mode === 'dark'

  return {
    backgroundColor: alpha(resolvedColor, isDark ? 0.16 : 0.1),
    borderColor: alpha(resolvedColor, isDark ? 0.46 : 0.3),
    color: resolvedColor,
  }
}

const SUBJECT_CATALOG = {
  default: {
    color: 'rgba(32, 109, 197, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'default',
    label: 'Geral',
  },
  biology: {
    color: 'rgba(20, 184, 166, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'biology',
    label: 'Biologia',
  },
  english: {
    color: 'rgba(254, 51, 163, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'english',
    label: 'Inglês',
  },
  geography: {
    color: 'rgba(0, 212, 106, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'geography',
    label: 'Geografia',
  },
  history: {
    color: 'rgba(255, 186, 0, 1)',
    contrast: 'rgba(16, 42, 67, 1)',
    id: 'history',
    label: 'História',
  },
  mathematics: {
    color: 'rgba(173, 68, 248, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'mathematics',
    label: 'Matemática',
  },
  portuguese: {
    color: 'rgba(5, 113, 247, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'portuguese',
    label: 'Português',
  },
  science: {
    color: 'rgba(0, 210, 237, 1)',
    contrast: 'rgba(255, 255, 255, 1)',
    id: 'science',
    label: 'Ciências',
  },
} as const

const GUARDIAN_STATUS_SHOWCASE_CATALOG = {
  default: {
    color: 'rgba(32, 109, 197, 1)',
    id: 'default',
    label: 'Geral',
  },
  success: {
    color: 'rgba(20, 184, 166, 1)',
    id: 'success',
    label: 'Cadastro liberado',
  },
  warning: {
    color: 'rgba(254, 51, 163, 1)',
    id: 'warning',
    label: 'Aguardando validação',
  },
  error: {
    color: 'rgba(0, 212, 106, 1)',
    id: 'error',
    label: 'Cadastro recusado',
  },
} as const

export type SubjectId = keyof typeof SUBJECT_CATALOG
export const ALL_SUBJECT_TAG_CONTEXTS: TagContext[] = (
  Object.keys(SUBJECT_CATALOG) as SubjectId[]
).map(id => ({
  id: SUBJECT_CATALOG[id].id,
  label: SUBJECT_CATALOG[id].label,
  color: SUBJECT_CATALOG[id].color,
}))
export const SUBJECT_TAG_SIZES: SubjectChipSize[] = ['sm', 'md', 'lg']

type SubjectStyleSlot = {
  backgroundColor?: string
  borderColor?: string
  color?: string
}

export type SubjectTheme = {
  badge: SubjectStyleSlot
  border: SubjectStyleSlot
  color: string
  icon: SubjectStyleSlot
  id: SubjectId
  label: string
  mutedText: SubjectStyleSlot
  option: SubjectStyleSlot
  optionSelected: SubjectStyleSlot
  progressFill: string
  progressTrack: string
  softSurface: SubjectStyleSlot
  solidSurface: SubjectStyleSlot
  text: SubjectStyleSlot
}

export type SubjectBadgeProps = {
  color: string
  label: string
}

export type SubjectChipTone = TagChipTone

export const SUBJECTS: Record<string, TagContext> = {
  ciencias: SUBJECT_CATALOG.science,
  geografia: SUBJECT_CATALOG.geography,
  historia: SUBJECT_CATALOG.history,
  ingles: SUBJECT_CATALOG.english,
  matematica: SUBJECT_CATALOG.mathematics,
  portugues: SUBJECT_CATALOG.portuguese,
}

type GetSubjectThemeOptions = {
  mode?: PaletteMode
}

export function getSubjectContext(
  subject: Partial<TagContext> | undefined,
  fallback: TagContext
): TagContext {
  return {
    color: subject?.color ?? fallback.color,
    id: subject?.id ?? fallback.id,
    label: subject?.label ?? fallback.label,
  }
}

function getResolvedSubjectId(subject?: Partial<TagContext>): SubjectId {
  const subjectId = subject?.id

  if (subjectId && subjectId in SUBJECT_CATALOG) {
    return subjectId as SubjectId
  }

  return 'default'
}

export function getSubjectTheme(
  subject?: Partial<TagContext>,
  { mode = 'light' }: GetSubjectThemeOptions = {}
): SubjectTheme {
  const id = getResolvedSubjectId(subject)
  const fallbackColor = SUBJECT_CATALOG[id].color
  const baseColor = subject?.color ?? fallbackColor
  const label = subject?.label ?? SUBJECT_CATALOG[id].label
  const isDark = mode === 'dark'
  const foregroundText = isDark
    ? AppColors.dark.textPrimary
    : AppColors.light.textPrimary
  const secondaryText = isDark
    ? AppColors.dark.textSecondary
    : AppColors.light.textSecondary
  const neutralBorder = isDark
    ? alpha(AppColors.dark.textSecondary, 0.2)
    : alpha(AppColors.neutral.border, 0.95)

  return {
    badge: {
      backgroundColor: isDark ? alpha(baseColor, 0.18) : alpha(baseColor, 0.1),
      borderColor: alpha(baseColor, isDark ? 0.34 : 0.28),
      color: baseColor,
    },
    border: {
      borderColor: neutralBorder,
      color: neutralBorder,
    },
    color: baseColor,
    icon: {
      backgroundColor: alpha(baseColor, isDark ? 0.2 : 0.12),
      color: baseColor,
    },
    id,
    label,
    mutedText: {
      color: secondaryText,
    },
    option: {
      backgroundColor: isDark
        ? alpha(AppColors.dark.backgroundPaper, 0.9)
        : AppColors.light.backgroundPaper,
      borderColor: neutralBorder,
      color: foregroundText,
    },
    optionSelected: {
      backgroundColor: alpha(baseColor, isDark ? 0.2 : 0.08),
      borderColor: alpha(baseColor, isDark ? 0.42 : 0.24),
      color: baseColor,
    },
    progressFill: baseColor,
    progressTrack: isDark
      ? alpha(AppColors.dark.textSecondary, 0.22)
      : 'rgba(233, 237, 243, 1)',
    softSurface: {
      backgroundColor: isDark ? alpha(baseColor, 0.16) : alpha(baseColor, 0.06),
      borderColor: alpha(baseColor, isDark ? 0.34 : 0.24),
    },
    solidSurface: {
      backgroundColor: isDark ? baseColor : lighten(baseColor, 0.28),
      color: SUBJECT_CATALOG[id].contrast,
    },
    text: {
      color: foregroundText,
    },
  }
}

export function getSubjectBadgeProps(
  subject?: Partial<TagContext>,
  options?: GetSubjectThemeOptions
): SubjectBadgeProps {
  const theme = getSubjectTheme(subject, options)

  return {
    color: theme.color,
    label: subject?.label ?? theme.label,
  }
}

export function getSubjectChipTone(
  subjectOrColor: Partial<TagContext> | string | undefined,
  { mode = 'light' }: GetSubjectThemeOptions = {}
): SubjectChipTone {
  const fallbackTheme = getSubjectTheme(
    typeof subjectOrColor === 'string'
      ? { color: subjectOrColor }
      : subjectOrColor,
    { mode }
  )

  const resolvedColor =
    typeof subjectOrColor === 'string'
      ? subjectOrColor
      : (subjectOrColor?.color ?? fallbackTheme.color)

  return getTagChipTone(resolvedColor, { mode })
}

export function getApprovalToneColorFromPalette(
  tone: ApprovalBadgeTone,
  palette: Theme['palette']
): string {
  switch (tone) {
    case 'danger':
      return palette.error.main
    case 'warning':
      return palette.warning.main
    case 'success':
      return palette.success.main
    case 'info':
      return palette.info.main
    default:
      return palette.text.secondary
  }
}

export function approvalBadgeToTagContext(
  badge: ApprovalBadge,
  palette: Theme['palette']
): TagContext {
  return {
    id: badge.id,
    label: badge.label,
    color: getApprovalToneColorFromPalette(badge.tone, palette),
  }
}

export function approvalBadgesToTagContexts(
  badges: ApprovalBadge[],
  palette: Theme['palette']
): TagContext[] {
  return badges.map(badge => approvalBadgeToTagContext(badge, palette))
}

export function approvalCardStatusToTagContext(
  status: ApprovalCardStatus,
  palette: Theme['palette'],
  options?: { id?: string }
): TagContext {
  return {
    id: options?.id ?? 'approval-card-status',
    label: status.label,
    color: getApprovalToneColorFromPalette(status.tone, palette),
  }
}

export const CONTENT_APPROVAL_CARD_STATUS: Record<
  ContentApprovalStatus,
  ApprovalCardStatus
> = {
  approved: {
    label: 'Aprovado',
    tone: 'success',
  },
  inReview: {
    label: 'Em revisão',
    tone: 'warning',
  },
  rejected: {
    label: 'Recusado',
    tone: 'danger',
  },
  sent: {
    label: 'Enviado',
    tone: 'success',
  },
}

export const GUARDIAN_APPROVAL_CARD_STATUS: Record<
  GuardianApprovalStatus,
  ApprovalCardStatus
> = {
  approved: {
    label: 'Cadastro liberado',
    tone: 'success',
  },
  pendingValidation: {
    label: 'Aguardando validação',
    tone: 'warning',
  },
  rejected: {
    label: 'Cadastro recusado',
    tone: 'danger',
  },
}

export type GuardianStatusShowcaseId = keyof typeof GUARDIAN_STATUS_SHOWCASE_CATALOG

export const ALL_GUARDIAN_STATUS_TAG_CONTEXTS: TagContext[] = (
  Object.keys(GUARDIAN_STATUS_SHOWCASE_CATALOG) as GuardianStatusShowcaseId[]
).map(key => ({
  id: GUARDIAN_STATUS_SHOWCASE_CATALOG[key].id,
  label: GUARDIAN_STATUS_SHOWCASE_CATALOG[key].label,
  color: GUARDIAN_STATUS_SHOWCASE_CATALOG[key].color,
}))

export function buildGuardianValidationBadges(
  item: GuardianApprovalItem
): ApprovalBadge[] {
  return [
    item.validation.hasDocument
      ? { id: `${item.id}-hasDocument`, label: 'Documento ok', tone: 'success' }
      : {
          id: `${item.id}-hasDocument`,
          label: 'Sem documento',
          tone: 'warning',
        },
    item.validation.relationshipConfirmed
      ? {
          id: `${item.id}-relationshipConfirmed`,
          label: 'Parentesco confirmado',
          tone: 'success',
        }
      : {
          id: `${item.id}-relationshipConfirmed`,
          label: 'Parentesco pendente',
          tone: 'warning',
        },
    item.validation.studentLinked
      ? {
          id: `${item.id}-studentLinked`,
          label: 'Aluno vinculado',
          tone: 'success',
        }
      : { id: `${item.id}-studentLinked`, label: 'Sem vínculo', tone: 'warning' },
  ]
}
