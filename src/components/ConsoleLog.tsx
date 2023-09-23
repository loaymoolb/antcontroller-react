import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import { List, ListItem, ListSubheader } from '@mui/material';

const eventsEndpoint = `${process.env.REACT_APP_DEVICE_ADDR}/events`;

const ConsoleLog = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  const [logs, setLogs] = useState<string[]>(["connecting to the device..."]);

  useEffect(() => {
    const div = terminalRef.current!;
    div.scrollTop = div.scrollHeight;
  }, [logs]);

  useEffect(() => {
    const sse = new EventSource(eventsEndpoint);
    function getRealtimeData(data: any) {
        console.log(data);
        setLogs((prevLogs) => [...prevLogs, data]);
      } 
    sse.onmessage = e => getRealtimeData(e.data);
    sse.onerror = () => {
      console.log("socket error. closing.");
      sse.close();
    }
    sse.addEventListener('log', (e) => {
      console.log(e.data);
      setLogs((prevLogs) => [...prevLogs, e.data]);
    });
    return () => {
      sse.close();
    };
  }, []);

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