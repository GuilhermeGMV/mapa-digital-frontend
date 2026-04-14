import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const companyNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.company.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Parcerias',
    path: APP_ROUTES.company.partnerships,
    icon: <HandshakeRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Relatórios',
    path: APP_ROUTES.company.reports,
    icon: <AssessmentRoundedIcon fontSize="medium" />,
  },
]
