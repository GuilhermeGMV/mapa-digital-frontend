import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import BarChart from '../../shared/components/BarChart'
import { performanceService } from '../services/service'

const mockSeries = [
  { label: 'Seg', value: 2 },
  { label: 'Ter', value: 4 },
  { label: 'Qua', value: 3 },
  { label: 'Qui', value: 6 },
  { label: 'Sex', value: 5 },
]

export default function Page() {
  const summary = performanceService.getSummaryLabel()

  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        eyebrow={summary}
        title="Desempenho"
        subtitle="Visão rápida da sua evolução recente."
        variant="aluno"
      />
      <Box sx={{ p: 2, borderRadius: 2, border: 1, borderColor: 'divider' }}>
        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          Atividade semanal (exemplo)
        </Typography>
        <BarChart data={mockSeries} height={220} />
      </Box>
    </AppPageContainer>
  )
}
