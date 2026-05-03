import AppPageContainer from '@/shared/ui/AppPageContainer'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <OrdinaryHeader
        title="Escolas e Empresas"
        subtitle="Cadastro, status e desempenho das escolas"
      />
    </AppPageContainer>
  )
}
