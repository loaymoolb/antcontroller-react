import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import { Typography } from '@mui/material';


const RecentResponse = () => {
  const [response] = useState("No query performed");

  return (
    <List
      sx={{ maxWidth: '100%', p: "1rem", bgcolor: '#E9EDEF', borderRadius: "20px" }}
      subheader={
        <ListSubheader sx={{bgcolor: 'inherit', borderRadius: 'inherit'}}>
          <Typography
            variant="h6"
            component="h6"
            sx={{
              fontWeight: 700,
              color: 'primary',
            }}
          >
            REAS' recent response:
          </Typography>
        </ListSubheader>
      }
    >
        <ListItem sx={{bgcolor: '#D2DADF', borderRadius: '10px' }}>
          <code>
            {response}
          </code>
        </ListItem>
    </List>
  )
}

export default RecentResponse