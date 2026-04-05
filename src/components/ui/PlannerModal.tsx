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
}

