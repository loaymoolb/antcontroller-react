import { Box, Stack, Typography } from '@mui/material';

export interface PinStateIface {
  [tag: string]: {
    ioType: string;
    pins: {
      [num: number]: {
        state: boolean;
      };
    }
  };
}

type PinStateProps = {pins : PinStateIface};

const PinState = ({pins} : PinStateProps) => {
  return (    
    <>
      <Stack direction="row" spacing={{xs: 2, sm: 1, md: 4}} sx={{ bgcolor: '#D2DADF', borderRadius: '10px', p: 2, justifyContent: 'center', textAlign: 'center' }}>
        {Object.entries(pins).map(([tag, content], index) => (
          <Box key={index}>
            <Typography variant="body1">{tag}</Typography>
            <Typography variant="body2">{content.ioType}</Typography>
            <Stack spacing='0.3rem' sx={{ marginTop: '0.3rem', alignItems: 'center' }}>
              {Object.entries(content.pins).map(([key, value]) => (
                <Box
                  key={key}
                  sx={{
                    width: '35px',
                    height: 12,
                    backgroundColor: value.state ? '#1ED98A' : '#909090',
                    borderRadius: '6px',
                  }}
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </>
  )
}

export default PinState;