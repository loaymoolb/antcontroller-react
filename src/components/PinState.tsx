import React, { useEffect, useRef } from 'react';
// import { Typography } from '@mui/material';
import { List, ListItem } from '@mui/material';

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
        <p>{tag}</p>
        <p>{content.ioType}</p>
        {Object.entries(content.pins).map(([key, value]) => (
          <p>{value.state ? "x" : "o"}</p>
        ))}
        </ListItem>
      ))}
    </List>
  )
}

export default PinState;