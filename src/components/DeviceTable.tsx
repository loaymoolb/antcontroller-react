import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Box, Button, Divider, Typography } from '@mui/material';
import { parse } from 'toml';

const apiEndpoint = `${process.env.REACT_APP_DEVICE_ADDR}/api`;

interface IButton {
  name: string;
  descr?: string;
  pins?: string[];
}

type ButtonGroupsType = Record<string, IButton[]>;
export function activateButton(bGroup: string, bName: string): Promise<boolean> {
  console.log(`activating ${bGroup} to ${bName}`);
  let fetchCall = `${apiEndpoint}/BUT/${bGroup}/${bName}`
  console.log(fetchCall)
  return fetch(fetchCall, {mode: 'cors'})
    .then(function(response) {
      return response.text();
    })
    .then(function(result) {
      if (result === 'OK') {
        console.log(`but ${bName} activated`);
        return true;
      } else {
        console.log(`but ${bName} ERR: ${result}`);
        return false;
      }
    });
}

const DeviceTable = () => {
  const [buttonGroups, setButtonGroups] = useState<ButtonGroupsType>({}); 
   
  const groupNames = ['a', 'b', 'c', 'd'];  
  
  const [activeButtons, setActiveButtons] = useState<Record<string, string | null>>({
    a: null,
    b: null,
    c: null,
    d: null
  });

  let configEndpoint: string;
  if (process.env.REACT_APP_DEVICE_ADDR === undefined) {
    configEndpoint = '/buttons.conf';
  } else {
    configEndpoint = `${apiEndpoint}/config`;
  }

  useEffect(() => {
    fetch(configEndpoint,{mode: 'cors'})
      .then(response => response.text())
      .then(data => {
        const parsedData: { buttons: ButtonGroupsType } = parse(data);
        setButtonGroups(parsedData.buttons);
      });
  }, [configEndpoint]);

  console.log(buttonGroups, 'buttonGroups'); 

  const [checked] = useState<string[]>(() => {
    const savedCheckedButtons = localStorage.getItem('checkedButtons');
    return savedCheckedButtons ? JSON.parse(savedCheckedButtons) : [];
  });

  const handleToggle = async (category: string, buttonName: string) => {
    const isActive = activeButtons[category] === buttonName;
    const newState = {
        ...activeButtons,
        [category]: isActive ? null : buttonName
    };
    setActiveButtons(newState);
    
    try {
        const butParam = isActive ? 'OFF' : buttonName;
        activateButton(category, butParam);
    } catch (error) {
        console.error('Error toggling button:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('checkedButtons', JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem('activeButtons', JSON.stringify(activeButtons));
  }, [activeButtons]);

  useEffect(() => {
    const savedActiveButtons = localStorage.getItem('activeButtons');
    if (savedActiveButtons) {
        setActiveButtons(JSON.parse(savedActiveButtons));
    }
  }, []);


  return (
    <List
      sx={{ maxWidth: '100%', bgcolor: '#E9EDEF', borderRadius: '10px', py: 0 }}
    >
      {groupNames.map((groupName, index) => (
        <>
        {index > 0 && (
          <Box sx={{ px: 3, my: { xs: 0, lg: 1 } }}>
            <Divider />
          </Box>
        )}
        <ListItem key={groupName} sx={{ flexDirection: 'column', justifyContent: 'start', width: '100%', py: '0' }}>
          <List disablePadding sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', my: 1 }}>
            {buttonGroups[groupName]?.map(button => (
              <ListItem key={button.name} sx={{ flex: { xs: '100%', sm: '33%', md: '25%' }, maxWidth: { xs: '50%', sm: '33%', md: '25%' }, p: { xs: 0.5, md: 1 } }}>
                <Button 
                  variant="outlined"
                  onClick={() => handleToggle(groupName, button.name)}
                  sx={{
                    p: { xs: 0.7, md: 1 },
                    border: 1.5,
                    borderColor: activeButtons[groupName] === button.name ? '#1ED98A' : 'inherit',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'start',
                    width: '100%',
                    textTransform: 'none',
                    backgroundColor: activeButtons[groupName] === button.name ? '#1ED98A' : 'inherit',
                    '&:hover': {
                      border: 1.5,
                      borderColor: activeButtons[groupName] === button.name ? '#1ED98A' : 'inherit',
                      backgroundColor: activeButtons[groupName] === button.name ? '#1ED98A' : 'inherit',
                    },
                  }}
                >
                  <Box>
                    <Typography variant='body2' sx={{ textAlign: 'left', wordBreak: 'break-word', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>{button.name}</Typography>
                  </Box>
                </Button>
              </ListItem>
            ))}
          </List>
        </ListItem>
          </>
      ))}
    </List>
  )
}

export default DeviceTable