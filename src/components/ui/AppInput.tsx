import React from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

type InputSize = 'small' | 'medium' | 'large'

type AppInputProps = TextFieldProps & {
  inputSize?: InputSize
  icon?: React.ReactNode
}

export default function AppInput({
  inputSize = 'medium',
  icon,
  className,
  InputProps,
  ...props
}: AppInputProps) {
  const muiSize = inputSize === 'small' ? 'small' : 'medium'

  const sizeStyles = 
    inputSize === 'large'
      ? {
          '& .MuiInputBase-root': {
            height: 56,
            fontSize: '1rem',
          },
        }
      : {}