import { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import {
  PickersDay,
  type PickersDayProps,
} from '@mui/x-date-pickers/PickersDay'
import DayDetailModal from './DayDetailModal'
import 'dayjs/locale/pt-br'
import type { Task } from './Planner'

interface AppCalendarProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
}

function CustomDay(props: PickersDayProps) {
  const isFuture = props.day.isAfter(dayjs(), 'day')

  return (
    <PickersDay
      {...props}
      sx={{
        margin: { xs: '0.5px', sm: '1px', md: '2px' },
        borderRadius: '8px',
        border: theme =>
          `2.5px solid ${
            theme.palette.mode === 'dark'
              ? theme.palette.primary.dark
              : theme.palette.primary.main
          }`,
        backgroundColor: theme =>
          isFuture
            ? 'background.paper'
            : theme.palette.mode === 'dark'
              ? theme.palette.primary.dark
              : theme.palette.primary.light,
        color: theme => theme.palette.text.primary,
        '&:hover': {
          backgroundColor: isFuture ? 'background.hover' : 'background.hover',
        },
        '&.Mui-selected': {
          backgroundColor: 'primary.main',
          borderColor: 'primary.main',
          color: 'background.paper',
        },
        '&.Mui-selected:hover': {
          backgroundColor: 'primary.main',
        },
        '&.MuiPickersDay-today': {
          border: theme =>
            `2.5px solid ${
              theme.palette.mode === 'dark'
                ? theme.palette.primary.dark
                : theme.palette.primary.main
            }`,
        },
        '&:focus': theme => ({
          outline: 'none',
          backgroundColor: isFuture
            ? 'background.paper'
            : theme.palette.mode === 'dark'
              ? 'primary.dark'
              : 'primary.light',
        }),
      }}
    />
  )
}

export default function AppCalendar({
  tasks,
  onTasksChange,
}: AppCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [view, setView] = useState<'year' | 'month' | 'day'>('day')

  function handleDaySelect(date: Dayjs | null) {
    if (!date) return
    setSelectedDate(date)
    if (view === 'day') {
      setModalOpen(true)
    } else {
      setSelectedDate(null)
    }
  }

  function handleModalClose() {
    setSelectedDate(null)
    setModalOpen(false)
  }

  function handleConfirm(updatedDayTasks: Task[]) {
    if (!selectedDate) return
    const otherTasks = tasks.filter(
      t => !dayjs(t.date).isSame(selectedDate, 'day')
    )
    onTasksChange([...otherTasks, ...updatedDayTasks])
  }

  const dayTasks = selectedDate
    ? tasks.filter(t => dayjs(t.date).isSame(selectedDate, 'day'))
    : []

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DateCalendar
          dayOfWeekFormatter={day => day.format('dddd').charAt(0).toUpperCase()}
          reduceAnimations={false}
          value={selectedDate}
          onChange={handleDaySelect}
          onViewChange={setView}
          slots={{ day: CustomDay }}
          sx={{
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            px: { xs: 0, sm: 0.5, md: 0 },
            height: 'auto',
            minHeight: { xs: '21rem', sm: '27rem', md: '34rem' },
            '& .MuiPickersLayout-root': {
              width: '100%',
            },
            '& .MuiDayCalendar-slideTransition': {
              minHeight: { xs: '18rem', sm: '24rem', md: '30rem' },
            },
            '& .MuiDayCalendar-monthContainer': {
              overflow: 'visible',
              width: '100%',
            },
            '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '100%',
              mx: 0,
              px: { xs: 0, sm: 0 },
            },
            '& .MuiPickersDay-root': {
              width: { xs: '14%', sm: 92, md: 92 },
              height: { xs: 32, sm: 50, md: 62 },
              fontSize: { xs: '0.85rem', sm: '1rem', md: '1.2rem' },
              margin: { xs: 0, sm: '2px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 0,
              maxWidth: { xs: '14%', sm: 92, md: 92 },
            },
            '& .MuiDayCalendar-weekDayLabel': {
              width: { xs: '14%', sm: 44, md: 80 },
              height: { xs: 24, sm: 36, md: 56 },
              fontSize: { xs: '0.72rem', sm: '0.8rem', md: '0.85rem' },
              mx: 0,
            },
            '& .MuiYearCalendar-root': {
              height: 'auto',
              minHeight: { xs: '19rem', sm: '22rem', md: '26rem' },
            },
            '& .MuiPickersYear-yearButton': {
              width: { xs: 64, sm: 72, md: 84 },
              height: { xs: 44, sm: 52, md: 60 },
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
            },
            '& .MuiPickersCalendarHeader-label': {
              textTransform: 'capitalize',
              fontSize: { xs: '1rem', sm: '1.05rem', md: '1.15rem' },
            },
            '& .MuiPickersCalendarHeader-root': {
              px: 1,
            },
          }}
        />
      </LocalizationProvider>
      <DayDetailModal
        open={modalOpen}
        date={selectedDate}
        tasks={dayTasks}
        onClose={handleModalClose}
        onConfirm={handleConfirm}
      />
    </>
  )
}
