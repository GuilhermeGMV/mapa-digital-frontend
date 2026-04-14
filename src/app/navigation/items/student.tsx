import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import type { SidebarItem } from '@/shared/types/common'
import { APP_ROUTES } from '@/app/router/paths'

export const studentNavigation: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.student.dashboard,
    icon: <AutoStoriesIcon fontSize="medium" />,
  },
  {
    label: 'Trilha Adaptativa',
    path: APP_ROUTES.student.adaptiveTrail,
    icon: <RouteRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Conteúdos',
    path: APP_ROUTES.student.components,
    icon: <PlayCircleFilledWhiteOutlinedIcon fontSize="medium" />,
  },
  {
    label: 'Perfil / Onboarding',
    path: APP_ROUTES.student.profile,
    icon: <PersonRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Desempenho',
    path: APP_ROUTES.student.performance,
    icon: <BarChartRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Upload de Avaliações',
    path: APP_ROUTES.student.uploads,
    icon: <UploadFileOutlinedIcon fontSize="medium" />,
  },
  {
    label: 'Rotina & Bem-estar',
    path: APP_ROUTES.student.routine,
    icon: <FavoriteBorderRoundedIcon fontSize="medium" />,
  },
  {
    label: 'Chat IA',
    path: APP_ROUTES.student.chat,
    icon: <ChatBubbleOutlineRoundedIcon fontSize="medium" />,
  },
]
