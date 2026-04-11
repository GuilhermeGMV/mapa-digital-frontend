import { Box, Typography } from '@mui/material'
import type { DropdownOption } from '@/components/ui/AppDropdown'
import AppActionModal, {
  type AppActionModalMode,
} from '@/components/common/AppActionModal'
import AppDropdown from '@/components/ui/AppDropdown'
import AppInput from '@/components/ui/AppInput'
import { AppColors } from '@/styles/AppColors'
import type {
  ApprovalItem,
  ApprovalModalAction,
  ApprovalType,
  ContentApprovalResourceType,
} from '@/types/admin'
import type { UserRole } from '@/types/user'
import type { AuthCredentials } from '@/types/auth'

type ApprovalActionFormErrors = Partial<
  Record<keyof AuthCredentials | 'confirmPassword' | 'fullName', string>
>

export type ApprovalActionModalMode =
  | {
      action: Exclude<ApprovalModalAction, 'correct'>
      item?: ApprovalItem
      type: ApprovalType
    }
  | {
      action: 'correct'
      item: ApprovalItem
      type: 'content'
    }

type ApprovalActionModalUsage =
  | 'confirm'
  | 'content-correction'
  | 'content-form'
  | 'guardian-form'

export interface ApprovalActionFormValues {
  email: unknown
  password: unknown
  confirmPassword: unknown
  childName: string
  correctionFeedback: string
  correctionOutcome: 'completed' | 'completedWithNotes' | 'redo'
  requestedAt: string
  resourceType: ContentApprovalResourceType
  subjectId: string
  title: string
}

interface ApprovalActionModalProps {
  correctionOutcomeOptions: DropdownOption[]
  mode: ApprovalActionModalMode | null
  onChange: (
    field: keyof ApprovalActionFormValues,
    value: string | ContentApprovalResourceType
  ) => void
  onClose: () => void
  onConfirm: () => void
  open: boolean
  resourceTypeOptions: DropdownOption[]
  subjectOptions: DropdownOption[]
  values: ApprovalActionFormValues
  role: UserRole
  isSubmitting?: boolean
  onSubmit: (values: AuthCredentials) => Promise<void>
}

const fieldLabelSx = {
  color: 'text.secondary',
  fontSize: { md: 13, xs: 12 },
  fontWeight: 700,
  letterSpacing: '0.02em',
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    height: { md: 46, xs: 44 },
  },
  '& .MuiInputBase-input': {
    fontSize: { md: 14, xs: 13 },
  },
  '& .MuiInputBase-startAdornment': {
    size: 10,
    py: 1.25,
    color: 'text.secondary',
  },
}

const multilineInputSx = {
  '& .MuiOutlinedInput-root': {
    alignItems: 'flex-start',
    borderRadius: '14px',
    minHeight: 132,
    py: 0.75,
  },
  '& .MuiInputBase-input': {
    fontSize: { md: 14, xs: 13 },
  },
}

const selectSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    minHeight: { md: 46, xs: 44 },
  },
  '& .MuiSelect-select': {
    fontSize: { md: 14, xs: 13 },
    py: 1.25,
  },
}

function resolveUsageMode(mode: ApprovalActionModalMode): ApprovalActionModalUsage {
  const isContentMode = mode.type === 'content'

  if (mode.action === 'delete') {
    return 'confirm'
  }

  if (mode.action === 'correct') {
    return 'content-correction'
  }

  return mode.type === 'guardian'
    ? 'guardian-form'
    : isContentMode
      ? 'content-form'
      : 'guardian-form'
}

function resolveDialogMode(usage: ApprovalActionModalUsage): AppActionModalMode {
  if (usage === 'confirm') {
    return 'confirm'
  }

  return usage === 'content-correction' ? 'review' : 'form'
}

function resolveModalCopy(mode: ApprovalActionModalMode) {
  if (mode.action === 'correct') {
    return {
      confirmLabel: 'Salvar correção',
      description:
        'Registre o resultado da correção da atividade enviada pelo aluno.',
      title: 'Corrigir atividade',
    }
  }

  if (mode.action === 'delete') {
    return {
      confirmLabel: 'Confirmar exclusão',
      description: 'Essa ação remove o item da fila local de aprovação.',
      title:
        mode.type === 'guardian' ? 'Excluir responsável' : 'Excluir conteúdo',
    }
  }

  if (mode.type === 'guardian') {
    return {
      confirmLabel:
        mode.action === 'create' ? 'Salvar cadastro' : 'Salvar alterações',
      description:
        'Preencha os dados usados para o fluxo de liberação do responsável.',
      title:
        mode.action === 'create'
          ? 'Cadastrar responsável'
          : 'Editar responsável',
    }
  }

  return {
    confirmLabel:
      mode.action === 'create' ? 'Salvar cadastro' : 'Salvar alterações',
    description:
      'Preencha os dados da tarefa ou prova usada no fluxo de aprovação.',
    title:
      mode.action === 'create' ? 'Cadastrar conteúdo' : 'Editar conteúdo',
  }
}

function ApprovalActionModal({
  correctionOutcomeOptions,
  mode,
  onChange,
  onClose,
  onConfirm,
  open,
  resourceTypeOptions,
  subjectOptions,
  values,
  role,
}: ApprovalActionModalProps) {
  if (!mode) {
    return null
  }

  const accent = AppColors.role[role]
  const usage = resolveUsageMode(mode)
  const dialogMode = resolveDialogMode(usage)
  const copy = resolveModalCopy(mode)
  const currentItem = mode.item
  const correctionItem = mode.action === 'correct' ? mode.item : null

  return (
    <AppActionModal
      accentSoftColor={accent.soft}
      confirmColor={accent.primary}
      confirmLabel={copy.confirmLabel}
      confirmTextColor={accent.contrast}
      description={copy.description}
      maxWidth={usage === 'content-correction' ? 'md' : 'sm'}
      mode={dialogMode}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      role={role}
      title={copy.title}
    >
      {usage === 'confirm' ? (
        <Typography color="text.secondary">
          {currentItem
            ? `Deseja remover "${currentItem.title}" desta fila?`
            : 'Deseja remover este item desta fila?'}
        </Typography>
      ) : null}

      {usage === 'content-correction' && correctionItem ? (
        <Box className="grid gap-3">
          <Box
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: accent.soft,
              borderRadius: '18px',
              display: 'grid',
              gap: 1,
              p: { md: 2, xs: 1.75 },
            }}
          >
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { md: 15, xs: 14 },
                fontWeight: 700,
              }}
            >
              {correctionItem.title}
            </Typography>
            <Typography
              sx={{ color: 'text.secondary', fontSize: { md: 13, xs: 12 } }}
            >
              {correctionItem.subtitle}
            </Typography>
          </Box>

          <Box className="grid gap-1">
            <Typography sx={fieldLabelSx}>Resultado da revisão</Typography>
            <AppDropdown
              fullWidth
              onChange={event =>
                onChange('correctionOutcome', String(event.target.value))
              }
              options={correctionOutcomeOptions}
              placeholder="Selecione o resultado"
              sx={selectSx}
              value={values.correctionOutcome}
            />
          </Box>

          <AppInput
            label="Feedback da correção"
            labelSx={fieldLabelSx}
            multiline
            minRows={4}
            onChange={event =>
              onChange('correctionFeedback', event.target.value)
            }
            placeholder="Descreva a correção aplicada, os acertos e o que ainda precisa evoluir."
            sx={multilineInputSx}
            value={values.correctionFeedback}
          />
        </Box>
      ) : null}

      {usage === 'guardian-form' && mode.action === 'create' ? (
        <Box className="grid gap-3">
          <AppInput
            label="Nome do responsável"
            labelSx={fieldLabelSx}
            onChange={event => onChange('title', event.target.value)}
            placeholder="Ex.: Mariana Souza"
            sx={inputSx}
            value={values.title}
          />
          <AppInput
            label="E-mail"
            onChange={event => onChange('email', event.target.value)}
            placeholder="Ex.: mariana@gmail.com"
            type="email"
            sx={inputSx}
            value={values.email}
          />
          <AppInput
            label="Senha"
            onChange={event => onChange('password', event.target.value)}
            placeholder="Mín. 8 caracteres"
            type="password"
            sx={inputSx}
            value={values.password}
          />
          <AppInput
            label="Confirmar senha"
            onChange={event => onChange('confirmPassword', event.target.value)}
            placeholder="Repita a senha"
            type="password"
            value={values.confirmPassword}
            sx={inputSx}
          />
        </Box>
      ) :
      usage === 'guardian-form' && mode.action === 'edit' ? (
        <Box className="grid gap-3">
          <AppInput
            label="Nome do responsável"
            labelSx={fieldLabelSx}
            onChange={event => onChange('title', event.target.value)}
            placeholder="Ex.: Mariana Souza"
            sx={inputSx}
            value={values.title}
          />
          <AppInput
            label="E-mail"
            onChange={event => onChange('email', event.target.value)}
            placeholder="Ex.: mariana@gmail.com"
            type="email"
            sx={inputSx}
            value={values.email}
          />
        </Box>
      ) : null}

      {usage === 'content-form' ? (
        <Box className="grid gap-3">
          <AppInput
            label="Título"
            labelSx={fieldLabelSx}
            onChange={event => onChange('title', event.target.value)}
            placeholder="Ex.: Lista de Equações do 7º ano"
            sx={inputSx}
            value={values.title}
          />
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                md: 'minmax(0, 1fr) minmax(0, 1fr)',
                xs: '1fr',
              },
            }}
          >
            <Box className="grid gap-1">
              <Typography sx={fieldLabelSx}>Tipo</Typography>
              <AppDropdown
                fullWidth
                onChange={event =>
                  onChange(
                    'resourceType',
                    String(event.target.value) as ContentApprovalResourceType
                  )
                }
                options={resourceTypeOptions}
                placeholder="Selecione o tipo"
                sx={selectSx}
                value={values.resourceType}
              />
            </Box>
            <Box className="grid gap-1">
              <Typography sx={fieldLabelSx}>Disciplina</Typography>
              <AppDropdown
                fullWidth
                onChange={event => onChange('subjectId', String(event.target.value))}
                options={subjectOptions}
                placeholder="Selecione a disciplina"
                sx={selectSx}
                value={values.subjectId}
              />
            </Box>
          </Box>
          <AppInput
            label="Data da solicitação"
            labelSx={fieldLabelSx}
            onChange={event => onChange('requestedAt', event.target.value)}
            placeholder="DD/MM/AAAA"
            sx={inputSx}
            value={values.requestedAt}
          />
        </Box>
      ) : null}
    </AppActionModal>
  )
}

export default ApprovalActionModal
