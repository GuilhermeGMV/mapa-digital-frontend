import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Home() {
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
      <Typography variant="h2" component="h1" gutterBottom>
        Mapa Digital
      </Typography>

      <Typography variant="h5" color="text.secondary" gutterBottom>
        Página Inicial
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/dashboard')}
      >
        Ir para Dashboard
      </Button>
    </Box>
  )
}

export default Home
