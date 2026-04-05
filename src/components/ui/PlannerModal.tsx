import dayjs from 'dayjs'
import { Box, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AppSubjectsTags from './AppSubjectsTags'
import type { SubjectContext } from '@/types/common'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { alpha } from '@mui/material/styles'

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
  const config = {
    done: {
      icon: <CheckIcon sx={{ fontSize: 25 }} />,
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.15)',
    },
    adjust: {
      icon: <FitnessCenterIcon sx={{ fontSize: 25 }} />,
      color: '#eab308',
      bg: 'rgba(234,179,8,0.15)',
    },
    pending: {
      icon: <FitnessCenterIcon sx={{ fontSize: 25 }} />,
      color: '#9ca3af',
      bg: 'rgba(156,163,175,0.15)',
    },
  }

  const current = config[status] || config.pending

  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: current.bg,
        color: current.color,
      }}
    >
      {current.icon}
    </Box>
  )
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
            <Box key={task.id} sx={{ mb: 2, border: '1px solid', borderColor: alpha(task.subject.color || '#ccc', 0.35), borderRadius: '12px', p: 2, 
                                   backgroundColor: 'transparent'}}>
            
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        
                        {getTaskIcon(task.status)}
                        
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