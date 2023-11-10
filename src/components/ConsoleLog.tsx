import { useEffect, useRef } from 'react';
import { Box, List, ListItem } from '@mui/material';

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
    <List sx={{ py: 0 }}>
      <ListItem sx={{bgcolor: '#D2DADF', borderRadius: '10px' }}>
        <Box ref={terminalRef} sx={{ overflow: "auto", maxHeight: { xs: '250px', md: '120px', lg: '200px' }, fontFamily: 'monospace'}}>
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </Box>
      </ListItem>
    </List>
  )
}

export default ConsoleLog;