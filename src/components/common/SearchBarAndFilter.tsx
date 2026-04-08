import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import AppInput from '../ui/AppInput'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import AppDropdown from '../ui/AppDropdown'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import type { SelectChangeEvent } from '@mui/material'
import type { DropdownOption } from '@/components/ui/AppDropdown'
import type { ChangeEvent } from 'react'

const outlineFieldBorderSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
  },
}

interface SearchBarAndFilterProps {
  onQueryChange: (query: string) => void
  searchPlaceholder: string
  query: string
  resultLabel: string
  filterOptions: DropdownOption[]
  onStatusChange: (event: SelectChangeEvent<string>) => void
  selectedStatus: string
}

export function SearchBarAndFilter({ onQueryChange, searchPlaceholder, query, resultLabel, filterOptions, onStatusChange, selectedStatus }: SearchBarAndFilterProps) {
  return (
    <Box className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-3">
      <AppInput
        className="min-w-0 flex-1"
        icon={
          <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        }
        onChange={event => onQueryChange(event.target.value)}
        placeholder={searchPlaceholder}
        type="search"
        value={query}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { md: 15, xs: 14 },
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {resultLabel}
              </Typography>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            borderRadius: '14px',
            height: 44,
            minHeight: 44,
          },
          ...outlineFieldBorderSx,
          '& .MuiInputAdornment-positionStart': {
            marginRight: 1,
          },
        }}
      />

      <Box
        sx={{
          flexShrink: 0,
          width: { lg: 'auto', xs: '100%' },
        }}
      >
        <AppDropdown
          displayLabel="Filtros"
          leadingIcon={
            <FilterAltOutlinedIcon
              sx={{ color: 'text.secondary', fontSize: 20 }}
            />
          }
          neutralOutline
          onChange={event =>
            onStatusChange(event as ChangeEvent<HTMLInputElement>)
          }
          options={filterOptions}
          triggerVariant="ghost"
          value={selectedStatus}
          width="auto"
          borderRadius="12px"
          sx={{
            backgroundColor: 'background.paper',
            minHeight: 44,
            '& .MuiOutlinedInput-root': {
              height: 44,
              minHeight: 44,
            },
            ...outlineFieldBorderSx,
            '& .MuiSelect-select': {
              alignItems: 'center',
              gap: 1,
              paddingBlock: '10px',
              paddingInline: '14px',
            },
            '& .MuiSelect-icon': {
              color: 'text.secondary',
              fontSize: 20,
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                marginTop: '10px',
              },
            },
          }}
        />
      </Box>
    </Box>
  )
}
