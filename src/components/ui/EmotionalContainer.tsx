import { Box, Typography, Stack, Icon } from '@mui/material'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AppButton from './AppButton';

export default function EmotionalContainer() {
  return (
    <Box
      data-testid="card-checkin-emocional"
      sx={{
        backgroundColor: 'white',
        border: '1px solid #E2E8F0', 
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '500px', 
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Check-in emocional
      </Typography>

      {/*
      <AppButton>
          <div>
              <SentimentSatisfiedAltIcon sx={{ color: 'green', width:163.33, height: 92 }} />
          </div>
          <div>
              <SentimentSatisfiedAltIcon sx={{ color: 'orange', width:163.33, height: 92 }} />
          </div>
          <div>
          <SentimentSatisfiedAltIcon sx={{ color: 'red', width:163.33, height: 92 }} />
          </div>
      </AppButton>
      */}
       <Stack>
       <AppButton>
        <SentimentSatisfiedAltIcon color="success" fontSize="large" />
       </AppButton>
         <AppButton>
        <SentimentNeutralIcon color="warning" fontSize="large"/>
         </AppButton>
         <AppButton>
        <SentimentVeryDissatisfiedIcon color="error" fontSize="large"/>
         </AppButton>
        </Stack>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}  >
            Humor da Semana
        </Typography>

        {/*<Icon>
        {/* <Icon>
            SentimentSatisfiedAltIcon(24, 'green'),
            SentimentNeutralIcon (24, 'orange'),
            SentimentVeryDissatisfiedIcon (24, 'red')
        </Icon> */}

    </Box>
  )
}