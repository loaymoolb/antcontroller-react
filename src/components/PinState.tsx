import React, { useEffect, useRef } from 'react';
// import { Typography } from '@mui/material';
import { List, ListItem } from '@mui/material';

export interface PinStateIface {
  [tag: string]: {
    ioType: string;
    [num: number]: {
      state: boolean;
    };
  };
}

const PinState = (pins : {pins : PinStateIface}) => {
  const pinTabRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const div = terminalRef.current!;
  //   div.scrollTop = div.scrollHeight;
  // }, [pinStatus]);
  
  console.log(`pinstate reveived: ${pins}`);

  return (    
    <List>
      
      {/* {Object.entries(pins).map(([key, value]) => (
        <ListItem sx={{ bgcolor: '#D2DADF', borderRadius: '10px' }}>
          <h6>{key}</h6>
          <br></br>
          <p>{value.toString()}</p>
        </ListItem>
      ))} */}
    </List>
  )
}

export default PinState;