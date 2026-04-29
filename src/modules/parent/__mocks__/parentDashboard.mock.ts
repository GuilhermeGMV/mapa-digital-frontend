import { SUBJECTS } from '@/shared/utils/themes'
import type {
  ParentDashboardChild,
  ParentDashboardData,
  StudentDisciplineProgress,
} from '@/modules/parent/dashboard/types/types'
import type { SummaryMetric, WeeklyMoodEntry } from '@/shared/types/common'
import type { Task } from '@/modules/student/shared/components/Planner'

const weekDay = (weekOffset: number, dayOffset: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  d.setDate(d.getDate() + weekOffset * 7 + dayOffset)
  return d.toISOString().slice(0, 10)
}

const monday = (offsetDays: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offsetDays)
  return d
}

export const MOCK_CHILDREN: ParentDashboardChild[] = [
  { id: 'mock-student-1', name: 'Lucas Silva', grade: '7º Ano' },
  { id: 'mock-student-2', name: 'Ana Silva', grade: '5º Ano' },
]

interface ChildMockData {
  child: ParentDashboardChild
  metrics: SummaryMetric[]
  disciplines: StudentDisciplineProgress[]
  tasks: Task[]
  wellBeing: WeeklyMoodEntry[]
}

export const CHILD_MOCK_DATA: Record<string, ChildMockData> = {
  'mock-student-1': {
    child: MOCK_CHILDREN[0],
    metrics: [
      { id: 'streak', title: 'Sequência do Aluno', value: '5 dias' },
      { id: 'activities', title: 'Atividades Feitas', value: 18 },
    ],
    disciplines: [
      { subjectId: 'matematica', subjectLabel: 'Matemática', progress: 78 },
      { subjectId: 'portugues', subjectLabel: 'Português', progress: 82 },
      { subjectId: 'ciencias', subjectLabel: 'Ciências', progress: 68 },
      { subjectId: 'historia', subjectLabel: 'História', progress: 70 },
    ],
    tasks: [
      {
        id: 'mock-task-1',
        date: monday(0),
        title: 'Revisão de equações',
        status: 'done',
        subject: SUBJECTS.matematica,
      },
      {
        id: 'mock-task-2',
        date: monday(1),
        title: 'Leitura e interpretação',
        status: 'done',
        subject: SUBJECTS.portugues,
      },
      {
        id: 'mock-task-3',
        date: monday(3),
        title: 'Exercícios de Brasil Colônia',
        status: 'done',
        subject: SUBJECTS.historia,
      },
    ],
    wellBeing: [
      { date: weekDay(0, 0), mood: 'good' },
      { date: weekDay(0, 1), mood: 'good' },
      { date: weekDay(0, 2), mood: 'regular' },
      { date: weekDay(0, 3), mood: 'bad' },
      { date: weekDay(0, 4), mood: 'good' },
      { date: weekDay(-1, 0), mood: 'good' },
      { date: weekDay(-1, 1), mood: 'good' },
      { date: weekDay(-1, 2), mood: 'good' },
      { date: weekDay(-1, 3), mood: 'regular' },
      { date: weekDay(-1, 4), mood: 'good' },
    ],
  },
  'mock-student-2': {
    child: MOCK_CHILDREN[1],
    metrics: [
      { id: 'streak', title: 'Sequência do Aluno', value: '2 dias' },
      { id: 'activities', title: 'Atividades Feitas', value: 9 },
    ],
    disciplines: [
      { subjectId: 'portugues', subjectLabel: 'Português', progress: 91 },
      { subjectId: 'matematica', subjectLabel: 'Matemática', progress: 55 },
      { subjectId: 'ciencias', subjectLabel: 'Ciências', progress: 74 },
      { subjectId: 'artes', subjectLabel: 'Artes', progress: 88 },
    ],
    tasks: [
      {
        id: 'mock-task-a1',
        date: monday(0),
        title: 'Produção de texto',
        status: 'done',
        subject: SUBJECTS.portugues,
      },
      {
        id: 'mock-task-a2',
        date: monday(2),
        title: 'Tabuada e frações',
        status: 'pending',
        subject: SUBJECTS.matematica,
      },
    ],
    wellBeing: [
      { date: weekDay(0, 0), mood: 'regular' },
      { date: weekDay(0, 1), mood: 'bad' },
      { date: weekDay(0, 2), mood: 'regular' },
      { date: weekDay(0, 3), mood: 'good' },
      { date: weekDay(0, 4), mood: 'good' },
      { date: weekDay(-1, 0), mood: 'bad' },
      { date: weekDay(-1, 1), mood: 'regular' },
      { date: weekDay(-1, 2), mood: 'good' },
      { date: weekDay(-1, 3), mood: 'good' },
      { date: weekDay(-1, 4), mood: 'regular' },
    ],
  },
}

export const PARENT_DASHBOARD_MOCK: ParentDashboardData = {
  ...CHILD_MOCK_DATA['mock-student-1'],
  child: MOCK_CHILDREN[0],
  children: MOCK_CHILDREN,
}
