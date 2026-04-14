import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const adminNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.admin.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Aprovações',
    path: APP_ROUTES.admin.approvals,
    icon: <FactCheckRoundedIcon fontSize="medium" />,
  },
]
