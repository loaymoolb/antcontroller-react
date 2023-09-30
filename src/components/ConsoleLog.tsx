import React, { useEffect, useRef } from 'react';
// import { Typography } from '@mui/material';
import { List, ListItem } from '@mui/material';

interface ConsoleLogProps {
  logs: string[];
}

const ConsoleLog = ({ logs }: ConsoleLogProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = terminalRef.current!;
    div.scrollTop = div.scrollHeight;
  }, [logs]);

  return (
    <List>
      <ListItem sx={{bgcolor: '#D2DADF', borderRadius: '10px' }}>
        <div ref={terminalRef} style={{ overflow: "auto", maxHeight: "200px", fontFamily: 'monospace'}}>
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </ListItem>
    </List>
  )
}

export default ConsoleLog;