import React from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from 'node_modules/@mui/material/esm/IconButton/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

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

  const [showPassword, setShowPassword] = React.useState(false)

  const isPasswordField = props.type === 'password'

  const inputType = isPasswordField
    ? showPassword
      ? 'text'
      : 'password'
    : props.type

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

  return (
    <TextField
      {...props}
      type={inputType}
      size={muiSize}
      fullWidth
      variant="outlined"
      className={['w-full', className].filter(Boolean).join(' ')}
      InputProps={{
        ...InputProps,
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : null,

        endAdornment: isPasswordField ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 5,
          backgroundColor: '#F9FAFB',
        },
        ...(sizeStyles as object),
      }}
    />
  )
}
