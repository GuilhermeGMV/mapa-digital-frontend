import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, Button } from '@mui/material'
import { useState } from 'react'
import TaskList from '@/modules/student/shared/components/TaskList'
import UploadActivityModal from '@/modules/student/shared/components/UploadActivityModal'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppInput from '@/shared/ui/AppInput'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { SUBJECTS } from '@/shared/utils/themes'

type SubjectKey =
  | 'matematica'
  | 'portugues'
  | 'ciencias'
  | 'historia'
  | 'biologia'
  | 'ingles'
  | 'geografia'

type UploadedTask = {
  id: string
  title: string
  type: string
  subject: SubjectKey
}

type UploadTaskPayload = Omit<UploadedTask, 'id'>

const uploadTasks: UploadedTask[] = [
  {
    id: '1',
    title: 'Lista de Exercícios - Equações',
    subject: 'matematica',
    type: 'Exercício',
  },
  {
    id: '2',
    title: 'Redação Dissertativa',
    subject: 'portugues',
    type: 'Revisão',
  },
  {
    id: '3',
    title: 'Relatório de Experiência',
    subject: 'ciencias',
    type: 'Trabalho',
  },
  {
    id: '4',
    title: 'Redação',
    subject: 'portugues',
    type: 'Pré-prova',
  },
]

export default function Page() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [tasks, setTasks] = useState<UploadedTask[]>(uploadTasks)

  function handleAddTask(task: UploadTaskPayload) {
    const newTask: UploadedTask = {
      id: crypto.randomUUID(),
      ...task,
    }

    setTasks(currentTasks => [newTask, ...currentTasks])
    setIsUploadModalOpen(false)
  }

  const taskListItems = tasks.map(task => ({
    id: task.id,
    title: task.title,
    type: task.type,
    subject: SUBJECTS[task.subject],
  }))

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        title="Upload de Tarefas"
        subtitle="Visualize e envie suas tarefas"
        variant="aluno"
      />

      <AppCard
        contentClassName="gap-4 p-5"
        title="Lista de tarefas"
        titleClassName="text-xl font-bold md:text-2xl"
      >
        <Box className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_320px]">
          <AppInput
            placeholder="Pesquisar tarefas..."
            backgroundColor="background.default"
            InputProps={{
              startAdornment: (
                <SearchRoundedIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
          />

          <Button
            className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-500"
            variant="outlined"
            startIcon={<FilterListRoundedIcon />}
          >
            Filtros
          </Button>

          <AppButton
            label="Upload de Atividade"
            backgroundColor="primary.main"
            data-testid="upload-activity-button"
            onClick={() => setIsUploadModalOpen(true)}
          />
        </Box>

        <TaskList tasks={taskListItems} />
      </AppCard>

      <UploadActivityModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </AppPageContainer>
  )
}
