import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import type { SidebarItem } from '@/types/common'
import type { UserRole } from '@/types/user'
import { APP_ROUTES } from './routes'

export const NAVIGATION_BY_ROLE: Record<UserRole, SidebarItem[]> = {
  student: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.student.dashboard,
      icon: <AutoStoriesIcon fontSize="medium" />,
    },
    {
      label: 'Trilha Adaptativa',
      path: APP_ROUTES.student.dashboard,
      icon: <RouteRoundedIcon fontSize="medium" />,
    },
    {
      label: 'Conteúdos',
      path: APP_ROUTES.student.dashboard,
      icon: <PlayCircleFilledWhiteOutlinedIcon fontSize="medium" />,
    },
    {
      label: 'Upload de Avaliações',
      path: APP_ROUTES.student.dashboard,
      icon: <DescriptionRoundedIcon fontSize="medium" />,
      color: 'var(--app-primary)',
    },
    {
      label: 'Rotina & Bem-estar',
      path: APP_ROUTES.student.dashboard,
      icon: <FavoriteBorderRoundedIcon fontSize='medium'/>,
    },
    {
      label: 'Chat IA',
      path: APP_ROUTES.student.dashboard,
      icon: <ChatBubbleOutlineRoundedIcon fontSize="medium" />,
    }
  ],
  parent: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.parent.dashboard,
      icon: <AutoStoriesIcon fontSize="medium" />,
    },
  ],
  admin: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.admin.dashboard,
      icon: <AutoStoriesIcon fontSize="medium" />,
    },
  ],
}