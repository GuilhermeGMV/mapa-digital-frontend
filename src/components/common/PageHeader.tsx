import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import ProgressBar from '../ui/ProgressBar'

type HeaderVariant = 'student' | 'guardians' | 'school' | 'company' | 'admin' | 'enterpriseSchool'

interface PageHeaderProps {
  title: string
  subtitle: string
  eyebrow?: string
  greeting?: string
  tag?: string
  progress?: number
  actions?: ReactNode
  variant?: HeaderVariant
}
 
const variantStyles: Record<HeaderVariant, string> = {
  student: 'bg-[#359CDF] text-white',
  guardians: 'bg-[#DE4512] text-white',
  school: 'bg-[#249E75] text-white',
  company: 'bg-[#6132BD] text-white',
  admin: 'bg-[#BF2260] text-white',
  enterpriseSchool: 'bg-[#5A642B] text-white'
}

function PageHeader({
  title,
  subtitle,
  eyebrow,
  greeting,
  tag,
  progress,
  actions,
  variant = 'student'
}: PageHeaderProps) {
  return (
    <Stack
      data-testid="header"
      className={`w-full rounded-2xl p-6 flex-col gap-3 md:flex-row md:items-center md:justify-between ${variantStyles[variant]}`}
    >
      <Box className="min-w-0 w-full">
        {greeting && (
          <Typography variant="body2" className="opacity-90">
            {greeting}
          </Typography>
        )}

        {eyebrow && (
          <Typography variant="overline" className="block tracking-[0.12em] opacity-90">
            {eyebrow}
          </Typography>
        )}

        <Stack className="flex-row items-center justify-between">
          <Box className="min-w-0">
            <Typography variant="h3">
              {title}
            </Typography>

            <Typography variant="body1" className="mt-1 opacity-90">
              {subtitle}
            </Typography>
          </Box>

          {tag && (
            <Box className="ml-4 rounded-full bg-white/20 px-3 py-1 text-xs whitespace-nowrap">
              {tag}
            </Box>
          )}
        </Stack>

        {progress !== undefined && (
          <Box className="mt-3">
            <ProgressBar value={progress} />
          </Box>
        )}
      </Box>

      {actions}

    </Stack>
  )
}

export default PageHeader