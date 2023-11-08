import React, { useEffect, useRef } from 'react';
// import { Typography } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
      <List>
        {Object.entries(pins).map(([tag, content]) => (
          <ListItem sx={{ bgcolor: '#D2DADF', borderRadius: '10px' }}>
          <Box sx={{display: "flex", flexDirection: "column", flexGrow: 1}}>
          <Typography variant="caption" sx={{ fontWeight: 500, color: '#222', }}>
            {tag} {content.ioType}
          </Typography>
            {Object.entries(content.pins).map(([key, value]) => (
              // <Typography py="-10px" variant="caption" sx={{ fontWeight: 500, color: '#222', }}>
              //   {value.state ? "x" : "o"}
              // </Typography>
              <div style={{margin: "1px", width: "100%", height: "10px", backgroundColor: value.state ? "#60BE84" : "#E9EDEF", borderRadius: "10px"}}></div>
            ))}
          </Box>
          </ListItem>

        ))}
      </List>    
  )
}

export default PinState;