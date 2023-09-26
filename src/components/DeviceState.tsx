import React, { useEffect, useRef } from 'react';
// import { Typography } from '@mui/material';
import { List, ListItem } from '@mui/material';

/*
{"MOS": {"status": "OK","bits": 2,"ioNum": 16},
 "REL": {"status": "OK","bits": 0,"ioNum": 15},
 "OPT": {"status": "OK","bits": 0,"ioNum": 8},
 "TTL": {"status": "OK","bits": 0,"ioNum": 8},
 "INP": {"status": "OK","bits": 0,"ioNum": 12},
 "BUT": {"status": "OK",
    "groups": {"a": "OFF","b": "OFF","c": "OFF","d": "ROT RIGHT"}
},"msg": "OK", "retCode": 200 }
*/
interface DeviceStateProps {
  stateJson: JSON;
}

const DeviceState = ({ stateJson }: DeviceStateProps) => {
  const pinTabRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const div = terminalRef.current!;
  //   div.scrollTop = div.scrollHeight;
  // }, [pinStatus]);

  return (    
    <List>
      {Object.keys(stateJson).map((key) => (
        <ListItem sx={{bgcolor: '#D2DADF', borderRadius: '10px' }}>
          <p>{key}</p>
          </ListItem>
      ))}     
    </List>
  )
}

export default DeviceState;