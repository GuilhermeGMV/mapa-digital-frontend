import { Box, Typography, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function Dashboard() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          minWidth: { xs: '100%', sm: 400 },
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Esta é uma nova página
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Adicione seu conteúdo aqui
        </Typography>
      </Paper>

      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
      >
        Voltar para Home
      </Button>
    </Box>
  )
}

export default Dashboard
