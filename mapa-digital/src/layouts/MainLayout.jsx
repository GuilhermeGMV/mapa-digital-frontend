import { Outlet } from 'react-router-dom'
import { Container, Box } from '@mui/material'

export default function MainLayout() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Outlet />
      </Box>
    </Container>
  )
}
