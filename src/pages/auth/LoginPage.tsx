import { Alert, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { DEFAULT_ROUTE_BY_ROLE } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import type { AuthCredentials, ParentStatus } from '@/types/auth'
import { ParentStatusError } from '@/types/auth'
import ParentStatusModal from '../parent/components/ParentStatusModal'
import AuthModeSelect, { type AuthMode } from './components/AuthModeSelect'
import LoginForm from './components/LoginForm'

function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, login, role } = useAuth()
  const { mode, setMode } = useOutletContext<{
    mode: AuthMode
    setMode: (mode: AuthMode) => void
  }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [parentStatus, setParentStatus] = useState<Exclude<
    ParentStatus,
    'APROVADO'
  > | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(DEFAULT_ROUTE_BY_ROLE[role], { replace: true })
    }
  }, [isAuthenticated, navigate, role])

  async function handleSubmit(values: AuthCredentials) {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await login(values)
      const role = authService.getRole()
      if (role) {
        navigate(DEFAULT_ROUTE_BY_ROLE[role], { replace: true })
      }
    } catch (error) {
      if (error instanceof ParentStatusError) {
        setParentStatus(error.parentStatus)
        setIsStatusModalOpen(true)
      } else {
        setErrorMessage('E-mail ou senha inválidos.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      className="flex flex-col bg-white p-7 md:p-8"
      sx={{
        width: '100%',
        height: { xs: 600, md: 600 },
        border: '1px solid rgba(16, 42, 67, 0.1)',
        borderRadius: '16px',
      }}
    >
      <AuthModeSelect
        value={mode}
        onChange={nextMode => {
          setMode(nextMode)
          setErrorMessage(null)
        }}
      />

      <Box
        sx={{
          mt: 1,
          height: 8,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {errorMessage && (
          <Alert
            className="items-center py-0"
            severity="error"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              height: { xs: 40, md: 48 },
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              '& .MuiAlert-icon': { color: '#dc2626' },
            }}
          >
            {errorMessage}
          </Alert>
        )}
      </Box>

      <Box className="min-h-0 flex-1">
        <LoginForm
          isSubmitting={isSubmitting}
          key={mode}
          mode={mode}
          onSubmit={handleSubmit}
        />
      </Box>

      <ParentStatusModal
        open={isStatusModalOpen}
        status={parentStatus ?? ''}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </Box>
  )
}

export default LoginPage
