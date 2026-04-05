import dayjs from 'dayjs'
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import AppSubjectsTags from './AppSubjectsTags'

type Status = 'done' | 'pending' | 'adjust'

type Task = {
    id: string
    date: string
    title: string
    status: Status
    subject: {
        id: string
        label: string
        color: string
    }
}

interface PlannerModalProps {
    open: boolean
    onClose: () => void
    tasks: Task[]
}

const weekOrder = [
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
    'domingo',
]

function getTaskIcon(status: Task['status']) {
    if (status === 'done') {
        return <CheckCircleIcon fontSize="small"/>
    }
    return <PendingIcon fontSize="small"/>
}

function PlannerModal({ open, onClose, tasks }: PlannerModalProps) {
    const startOfWeek = dayjs().startOf('week').add(1, 'day')

    const endOfWeek = dayjs().endOf('week').add(1, 'day')

    const tasksThisWeek = tasks.filter(task => {
        const taskDate = dayjs(task.date)

        return (
            taskDate.isAfter(startOfWeek.subtract(1, 'day')) &&
            taskDate.isBefore(endOfWeek.add(1, 'day'))
        )
    })

    const groupedTasks: Record<string, Task[]> = {}

    for (const task of tasksThisWeek) {
        const dayKey = dayjs(task.date).format('dddd')

        if(!groupedTasks[dayKey]) {
            groupedTasks[dayKey] = []
        }
        groupedTasks[dayKey].push(task)
    }
}
