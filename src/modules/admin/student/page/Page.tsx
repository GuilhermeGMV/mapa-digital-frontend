import AppPageContainer from '@/shared/ui/AppPageContainer'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <OrdinaryHeader
        title="Alunos"
        subtitle="Monitoramento de risco e progresso"
      />
    </AppPageContainer>
  )
}
