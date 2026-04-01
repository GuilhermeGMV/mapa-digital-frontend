import React from 'react'
import {
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  SelectChangeEvent,
  Checkbox,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'

export interface DropdownOption {
  label: string
  value: string | number
}

export interface AppDropdownProps {
  options: DropdownOption[]
  value: string | number | Array<string | number>
  onChange: (
    event: SelectChangeEvent<string | number | (string | number)[]>,
    child?: React.ReactNode
  ) => void
  multiple?: boolean
  placeholder?: string
  customText?: string
  className?: string
  dropdownPlacement?: 'bottom' | 'top'
  width?: string | number
}

function AppDropdown({
  options = [],
  value,
  onChange,
  multiple = false,
  placeholder = 'Selecione uma opção',
  customText,
  className = '',
  dropdownPlacement = 'bottom',
  width = 240,
}: AppDropdownProps) {
  // Função para definir a renderização do texto no botão fechado
  const renderValue = (selected: unknown) => {
    // Se o usuário passou um texto forçado, ele tem prioridade
    if (customText) return customText

    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return <span className="text-gray-500">{placeholder}</span>
    }

    if (multiple && Array.isArray(selected)) {
      const selectedLabels = options
        .filter(opt => selected.includes(opt.value))
        .map(opt => opt.label)
      return selectedLabels.join(', ')
    }

    if (
      !multiple &&
      (typeof selected === 'string' || typeof selected === 'number')
    ) {
      const found = options.find(opt => opt.value === selected)
      return found ? found.label : selected
    }

    return ''
  }
  return (
    <FormControl
      className={className}
      style={{ minWidth: width, maxWidth: width, width }}
    >
      <Select
        multiple={multiple}
        value={value}
        onChange={onChange}
        displayEmpty
        renderValue={renderValue}
        IconComponent={ExpandMoreIcon}
        MenuProps={{
          anchorOrigin:
            dropdownPlacement === 'top'
              ? { vertical: 'top', horizontal: 'left' }
              : { vertical: 'bottom', horizontal: 'left' },
          transformOrigin:
            dropdownPlacement === 'top'
              ? { vertical: 'bottom', horizontal: 'left' }
              : { vertical: 'top', horizontal: 'left' },
          PaperProps: {
            className: 'shadow-lg mt-1 border border-slate-100',
            sx: {
              background: 'var(--dropdown-modal-background)',
              borderRadius: 'var(--dropdown-radius)',
              minWidth: width,
              '& .MuiList-root': {
                padding: '8px',
                borderRadius: 'var(--dropdown-radius)',
              },
            },
          },
        }}
      >
        {options.map(option => {
          // Verifica se a opção atual está selecionada
          const isSelected = multiple
            ? Array.isArray(value) && value.includes(option.value)
            : value === option.value

          return (
            <MenuItem
              key={option.value}
              value={option.value}
              // Tailwind classes para o hover e estado selecionado
              className={`transition-colors duration-200 ${
                multiple
                  ? 'text-slate-700 hover:bg-slate-100'
                  : isSelected
                    ? 'text-white hover:bg-cyan-600!'
                    : 'text-slate-700 hover:bg-slate-100'
              }`}
              sx={{
                margin: 'var(--dropdown-option-gap)',
                borderRadius: 'var(--dropdown-radius)',
                paddingY: '8px',
                paddingX: '12px',
                background:
                  !multiple && isSelected
                    ? 'var(--dropdown-selected-background)'
                    : undefined,
                color: !multiple && isSelected ? '#fff' : undefined,
                '&.Mui-selected': !multiple
                  ? {
                      backgroundColor:
                        'var(--dropdown-selected-background) !important',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#0f87ad !important',
                      },
                    }
                  : {
                      backgroundColor: 'transparent !important',
                      color: '#22223B',
                    },
                minWidth: width,
                maxWidth: width,
              }}
            >
              <ListItemIcon className="min-w-8 flex items-center justify-center">
                {multiple ? (
                  <Checkbox
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      color: '#22223B',
                      '&.Mui-checked': {
                        color: 'var(--dropdown-selected-background)',
                      },
                      '& .MuiSvgIcon-root': {
                        borderRadius: '6px',
                      },
                    }}
                  />
                ) : (
                  isSelected && (
                    <CheckIcon fontSize="small" className="text-white" />
                  )
                )}
              </ListItemIcon>
              <ListItemText
                primary={option.label}
                className={`${!isSelected && multiple ? 'ml-8' : ''}`}
              />
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

export default AppDropdown
