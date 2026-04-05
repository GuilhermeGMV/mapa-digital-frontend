import dayjs from 'dayjs'
import { Box, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import AppSubjectsTags from './AppSubjectsTags'
import type { SubjectContext } from '@/types/common'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

type Status = 'done' | 'pending' | 'adjust'

export type Task = {
  id: string
  date: string
  title: string
  status: Status
  subject: SubjectContext
}

interface PlannerProps {
  tasks: Task[]
}

const dayMap: Record<string, string> = {
  Monday: 'Segunda',
  Tuesday: 'Terça',
  Wednesday: 'Quarta',
  Thursday: 'Quinta',
  Friday: 'Sexta',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
}

function getTaskIcon(status: Task['status']) {
  if (status === 'done') {
    return <CheckCircleIcon sx={{ fontSize: 50 }}/>
  }
  return <PendingIcon sx={{ fontSize: 50 }}/>
}

function PlannerModal({ tasks }: PlannerProps) {
  const startOfWeek = dayjs().startOf('week').add(1, 'day')
  const endOfWeek = dayjs().endOf('week').add(1, 'day')

  const tasksThisWeek = tasks.filter(task => {
    const taskDate = dayjs(task.date)

    return (
      taskDate.isAfter(startOfWeek.subtract(1, 'day')) &&
      taskDate.isBefore(endOfWeek.add(1, 'day'))
    )
  })

   const sortedTasks = [...tasksThisWeek].sort((a, b) =>
   dayjs(a.date).valueOf() - dayjs(b.date).valueOf())

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px',
        p: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarMonthIcon sx={{ color: '#319BDD', fontSize: 25}} />
        <Typography variant="h5">
            Planner da Semana
        </Typography>
      </Box>

      {sortedTasks.map(task => {
        const dayEN = dayjs(task.date).format('dddd')
        const day = dayMap[dayEN]

        return (
            <Box key={task.id} sx={{ mb: 2, border: '1px solid', borderColor: task.subject.color || 'divider', borderRadius: '12px', p: 2, 
                                   backgroundColor: 'transparent'}}>
            
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box
                        sx={{
                            color:
                                task.status === 'done' ? 'success.main'
                                : task.status === 'adjust' ? 'warning.main'
                                : 'text.disabled',
                        }}
                        >
                            {getTaskIcon(task.status)}
                        </Box>
                        
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', mb: 0.5 }}>
                                {day}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                            <AppSubjectsTags subjects={[task.subject]} size="sm" />

                            <Typography variant="body1">
                                {task.title}
                            </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', minWidth: 80, textAlign: 'right'}}
                    >
                        {task.status === 'done' ? 'concluído'
                        : task.status === 'adjust' ? 'ajustar'
                        : 'pendente'}
                    </Typography>
                </Box> 
            </Box>
        )
      })}
    </Box>
  )
}

export default PlannerModal