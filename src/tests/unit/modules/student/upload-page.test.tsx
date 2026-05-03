import { jest, test, expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthContext } from '@/app/auth/context'
import type { AuthContextValue } from '@/app/auth/core/types'
import StudentUploadPage from '@/modules/student/upload/page/Page'
import { renderWithProviders } from '@/tests/helpers/render'

const authValue: AuthContextValue = {
  isAuthenticated: true,
  login: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  logout: jest.fn(),
  status: 'authenticated',
  token: 'token-123',
  user: {
    email: 'aluno@mapa.local',
    name: 'Aluno Local',
    role: 'aluno',
  },
}

function renderPage() {
  renderWithProviders(
    <AuthContext.Provider value={authValue}>
      <StudentUploadPage />
    </AuthContext.Provider>
  )
}

test('StudentUploadPage exposes the subject filter by accessible name and filters tasks', async () => {
  const user = userEvent.setup()

  renderPage()

  const subjectFilter = screen.getByRole('combobox', {
    name: /filtrar tarefas por disciplina/i,
  })

  await user.click(subjectFilter)
  await user.click(screen.getByRole('option', { name: 'Matemática' }))

  expect(screen.getByText('Lista de Exercícios - Equações')).toBeInTheDocument()
  expect(screen.queryByText('Redação Dissertativa')).not.toBeInTheDocument()
})

test('StudentUploadPage filters tasks by search text and selected subject together', async () => {
  const user = userEvent.setup()

  renderPage()

  await user.type(
    screen.getByPlaceholderText('Pesquisar tarefas...'),
    'redação'
  )

  expect(screen.getByText('Redação Dissertativa')).toBeInTheDocument()
  expect(screen.getByText('Redação em Inglês')).toBeInTheDocument()
  expect(
    screen.queryByText('Lista de Exercícios - Equações')
  ).not.toBeInTheDocument()

  await user.click(
    screen.getByRole('combobox', {
      name: /filtrar tarefas por disciplina/i,
    })
  )
  await user.click(screen.getByRole('option', { name: 'Português' }))

  expect(screen.getByText('Redação Dissertativa')).toBeInTheDocument()
  expect(screen.queryByText('Redação em Inglês')).not.toBeInTheDocument()
})
