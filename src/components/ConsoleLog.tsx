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
    <List sx={{ py: 0, maxWidth: '100%' }}>
      <ListItem sx={{bgcolor: 'secondary.dark', borderRadius: '10px' }}>
        <Box 
          ref={terminalRef} 
          sx={{ 
              overflow: "auto", 
              maxHeight: { xs: '250px', md: '120px', lg: '200px' }, 
              fontFamily: 'monospace', 
              '&::-webkit-scrollbar': {
                width: '4px',
                height: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#e5e5e5',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#ccc',
                borderRadius: '4px',
              } }}>
          {logs.map((log, index) => (
            <p key={index} style={{ width: '100%' }}>{log}</p>
          ))}
        </Box>
      </ListItem>
    </List>
  )
}

export default ConsoleLog;