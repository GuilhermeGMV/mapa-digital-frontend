import { Dialog, DialogContent, Typography, Button, Box } from '@mui/material'

import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import CloseIcon from '@mui/icons-material/Close'

export default function StatusModal({ open, status, onClose }) {
  const isAguardando = status === 'AGUARDANDO'

  return (
    <Dialog open={open} onClose={onClose}>
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
            <CloseIcon sx={{ fontSize: 60, color: '#D32248' }} />
          )}

          <Typography variant="h6" fontWeight="bold">
            {isAguardando ? 'Cadastro em Análise' : 'Acesso Negado'}
          </Typography>

          <Typography variant="body2">
            {isAguardando
              ? 'Recebemos seus dados com sucesso. Seu perfil foi enviado para um administrador e está aguardando aprovação. Sua entrada na plataforma será habilitada logo após essa etapa.'
              : 'O cadastro associado a este e-mail não foi aprovado pela administração. Para mais informações ou para solicitar uma nova análise, entre em contato com a nossa equipe.'}
          </Typography>

          <Button variant="outlined" onClick={onClose}>
            Ok
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
