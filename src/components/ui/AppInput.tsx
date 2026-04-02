import React from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

type InputSize = 'small' | 'medium' | 'large'

type AppInputProps = TextFieldProps & {
  inputSize?: InputSize
  icon?: React.ReactNode
}