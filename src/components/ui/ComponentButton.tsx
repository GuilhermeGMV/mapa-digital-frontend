import Button from '@mui/material/Button'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

interface ButtonProps {
  tamanho: 'small' | 'medium' | 'large'
  cor: string
  texto: string
  raioBorda: string | number
  posicaoIcone?: 'esquerda' | 'direita'
}

export default function ComponentButton({
  tamanho,
  cor,
  texto,
  raioBorda,
  posicaoIcone,
}: ButtonProps) {
  return (
    <Button
      size={tamanho}
      variant="contained"
      startIcon={posicaoIcone === 'esquerda' ? <ArrowBackIosIcon /> : null}
      endIcon={posicaoIcone === 'direita' ? <ArrowForwardIosIcon /> : null}
      sx={{
        backgroundColor: cor,
        color: 'white',
        transition: '0.2s',
        borderRadius: raioBorda,
        padding:
          tamanho === 'small'
            ? '2px 8px'
            : tamanho === 'medium'
              ? '10px 24px'
              : tamanho === 'large'
                ? '20px 44px'
                : '44px 60px',
        fontSize:
          tamanho === 'small'
            ? '0.9rem'
            : tamanho === 'medium'
              ? '1.2rem'
              : '1.5rem',

        '&:hover': {
          backgroundColor: cor,
          filter: 'brightness(0.85)',
        },
      }}
    >
      {texto}
    </Button>
  )
}
