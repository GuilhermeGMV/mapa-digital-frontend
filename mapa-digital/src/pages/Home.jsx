import { Box, Typography, Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PaletteIcon from '@mui/icons-material/Palette'

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

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard')}
        >
          Ir para Dashboard
        </Button>
      </Stack>
    </Box>
  )
}

export default Home
