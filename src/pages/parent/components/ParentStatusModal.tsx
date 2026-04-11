import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'

type ParentStatus = 'AGUARDANDO' | 'NEGADO' | 'APROVADO' | string

interface ParentStatusModalProps {
  open: boolean
  status: ParentStatus
  onClose: () => void
}

export default function ParentStatusModal({
  open,
  status,
  onClose,
}: ParentStatusModalProps) {
  const isAguardando = status === 'AGUARDANDO'

  const title = isAguardando ? 'Cadastro em Análise' : 'Acesso Negado'
  const description = isAguardando
    ? 'Recebemos seus dados com sucesso. Seu perfil foi enviado para um administrador e está aguardando aprovação. Sua entrada na plataforma será habilitada logo após essa etapa.'
    : 'O cadastro associado a este e-mail não foi aprovado pela administração. Para mais informações ou para solicitar uma nova análise, entre em contato com a nossa equipe.'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={2}
          p={2}
        >
          {isAguardando ? (
            <HourglassTopIcon
              sx={{
                fontSize: 60,
                color: 'primary.main',
              }}
            />
          ) : (
            <CloseIcon
              sx={{
                fontSize: 60,
                color: '#D32248',
              }}
            />
          )}

          <Typography variant="body2">{description}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
