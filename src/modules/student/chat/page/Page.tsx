import AppPageContainer from '@/shared/ui/AppPageContainer'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4">
      <OrdinaryHeader
        title="Chat Inteligente"
        subtitle="Tire dúvidas e acompanhe o histórico das conversas criadas durante as atividades."
      />
    </AppPageContainer>
  )
}
