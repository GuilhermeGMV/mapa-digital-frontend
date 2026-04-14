import { Box, Typography } from '@mui/material'
import React from 'react'

export interface BarChartData {
  label: string
  value: number
}

interface BarChartProps {
  data: BarChartData[]
  height?: number | string
  maxValue?: number
  className?: string
}

export default function BarChart({
  data,
  height = 200,
  maxValue,
  className = '',
}: BarChartProps) {
  const dataMax = Math.max(...data.map(d => d.value), 0)
  const resolvedMaxValue = maxValue ?? dataMax
  const effectiveMax =
    maxValue !== undefined
      ? Math.max(maxValue, 0)
      : Math.max(resolvedMaxValue, 1)

  return (
    <Box className={className} sx={{ height }}>
      <Box
        sx={{
          alignItems: 'flex-end',
          display: 'flex',
          gap: 1,
          height: '100%',
        }}
      >
        {data.map(item => {
          const barHeightPercent =
            effectiveMax <= 0 ? 0 : (item.value / effectiveMax) * 100

          return (
            <Box
              key={item.label}
              sx={{
                alignItems: 'center',
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Typography variant="caption">{item.label}</Typography>
              <Box
                sx={{
                  width: '100%',
                  height: `${barHeightPercent}%`,
                  minHeight: item.value === 0 ? 2 : 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 1,
                }}
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
