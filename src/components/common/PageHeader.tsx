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