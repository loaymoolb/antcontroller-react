import { useEffect, useRef } from 'react';
import { Box, List, ListItem } from '@mui/material';

var Convert = require('ansi-to-html');
var convert = new Convert();

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
      <ListItem sx={{
        bgcolor: 'rgb(44,45,51)', 
        color:'#ddd', 
        borderRadius: '10px', 
        padding:'4px 4px 4px 12px' }}>
        <Box 
          ref={terminalRef} 
          sx={{ 
            overflow: "auto", 
            height: { xs: '250px', md: '120px', lg: '200px' }, 
            marginTop : '4px',
            marginBottom : '4px',             
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            '&::-webkit-scrollbar': {
              width: '4px',
              height: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#1d1e22',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#ccc',
              borderRadius: '4px',
            } }}>
          {logs.map((log, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: convert.toHtml(log) }}
              style={{ width: '100%', margin: '1px' }} />
          ))}
        </Box>
      </ListItem>
    </List>
  )
}

export default ConsoleLog;