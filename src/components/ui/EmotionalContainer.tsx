import { Box, Typography, Stack, Icon } from '@mui/material'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { ReactNode } from 'react';

interface EmotionButtonProps {
  icon: ReactNode;
  label: string;
  color: 'success' | 'warning' | 'error';
  onClick: () => void;
  testId: string;
  width?: string;
  height?: string;
}
function EmotionButton({ icon, label, color, onClick, testId, width, height }: EmotionButtonProps) {
  return (
    <Box 
      component="button"
      onClick={onClick}
      data-testid={testId}
      sx={{ 
        width: width || '163.33px',
        height: height || '92px',
        flexDirection: 'column',
        cursor: 'pointer', 
        borderRadius: '12px',
        borderColor: `${color}.main`, 
        backgroundColor: 'transparent',
        color: `${color}.main`,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: `${color}.light`, 
          opacity: 0.76,
          }
      }}
    >
      {icon}
      <Typography fontWeight="bold" >{label }</Typography>
    </Box>
  );
}

export default function EmotionalContainer() {
  return (
    <Box
      data-testid="card-checkin-emocional"
      sx={{
        backgroundColor: 'light.main',
        border: '1px solid #E2E8F0', 
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '556px',
        maxHeight: '258px',
      }}
    >
      <Typography variant="h6" sx={{mb: 3 , fontWeight: 'bold' }}>
        Check-in emocional
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <EmotionButton 
          testId="emotion-button-good"
          label="Bem"
          color="success"
          icon={<SentimentSatisfiedAltIcon sx={{ fontSize: 28 }} />}
          onClick={() => alert("Humor: Bem")}
        />

        <EmotionButton 
          testId="emotion-button-regular"
          label="Regular"
          color="warning"
          icon={<SentimentNeutralIcon sx={{ fontSize: 28 }} />}
          onClick={() => alert("Humor: Regular")}
        />

        <EmotionButton 
          testId="emotion-button-bad"
          label="Mal"
          color="error"
          icon={<SentimentVeryDissatisfiedIcon sx={{ fontSize: 28 }} />}
          onClick={() => alert("Humor: Mal")}
        />
      </Stack>
        
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Humor da Semana
      </Typography>
      {/* Relatório dos dias da semana aqui  */}
    </Box>
  )
}