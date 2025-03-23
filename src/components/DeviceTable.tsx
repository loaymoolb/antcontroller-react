import { useEffect, useState, useCallback } from 'react';
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

export interface DeviceStateIface {
  [tag: string]: {
    currentButton: string;
    confirmed: boolean;
  }
}

type ButtonGroupsType = Record<string, IButton[]>;

export function activateButton(bGroup: string, bName: string): Promise<boolean> {
  console.log(`activating ${bGroup} to ${bName}`);
  let fetchCall = `${apiEndpoint}/BUT/${bGroup}/${bName}`
  return fetch(fetchCall, {mode: 'cors'})
    .then(function(response) {
      return response.text();
    })
    .then(function(result) {
      console.log(`but ${bName}: ${result}`);
      return true;
    });
}

type DeviceStateProps = {devices: DeviceStateIface};

const DeviceTable = ({devices} : DeviceStateProps) => {
  const [buttonGroups, setButtonGroups] = useState<ButtonGroupsType>({}); 
  const [isHolding, setIsHolding] = useState(false);
  const [heldButton, setHeldButton] = useState<{group: string, name: string} | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
   
  const groupNames = ['a', 'b', 'c', 'd'];  
  
  const [activeButtons, setActiveButtons] = useState<DeviceStateIface>({
    a: { currentButton: 'OFF', confirmed: false },
    b: { currentButton: 'OFF', confirmed: false },
    c: { currentButton: 'OFF', confirmed: false },
    d: { currentButton: 'OFF', confirmed: false }
  });

  let configEndpoint: string;
  if (process.env.REACT_APP_DEVICE_ADDR === undefined) {
    configEndpoint = '/buttons.conf';
  } else {
    configEndpoint = `${apiEndpoint}/config`;
  }

  useEffect(() => {
    console.log("fetching buttons")
    fetch(configEndpoint,{mode: 'cors'})
      .then(response => response.text())
      .then(data => {
        const parsedData: { buttons: ButtonGroupsType } = parse(data);
        setButtonGroups(parsedData.buttons);
      });
  }, [configEndpoint]);

  useEffect(() => {
    setActiveButtons(devices);
  }, [devices]);

  const debouncedActivate = useCallback(async (category: string, buttonName: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(async () => {
      try {
        await activateButton(category, buttonName);
      } catch (error) {
        console.error('Error activating button:', error);
      }
    }, 100);
    
    setDebounceTimer(timer);
  }, [debounceTimer]);

  const debouncedDeactivate = useCallback(async (category: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(async () => {
      try {
        await activateButton(category, 'OFF');
      } catch (error) {
        console.error('Error deactivating button:', error);
      }
    }, 100);
    
    setDebounceTimer(timer);
  }, [debounceTimer]);

  const handleMouseDown = async (category: string, buttonName: string) => {
    if (category === 'd') {
      setIsHolding(true);
      setHeldButton({ group: category, name: buttonName });
      const newState = {
        ...activeButtons,
        [category]: {
          currentButton: buttonName,
          confirmed: false
        }
      };
      setActiveButtons(newState);
      debouncedActivate(category, buttonName);
    } else {
      handleToggle(category, buttonName);
    }
  };

  const handleMouseUp = async () => {
    if (isHolding && heldButton) {
      setIsHolding(false);
      const newState = {
        ...activeButtons,
        [heldButton.group]: {
          currentButton: 'OFF',
          confirmed: false
        }
      };
      setActiveButtons(newState);
      debouncedDeactivate(heldButton.group);
      setHeldButton(null);
    }
  };

  const handleToggle = async (category: string, buttonName: string) => {
    const isActive = activeButtons[category].currentButton === buttonName;
    const newState = {
      ...activeButtons,
      [category]: {
        currentButton: isActive ? 'OFF' : buttonName,
        confirmed: false
      }
    };
    setActiveButtons(newState);
    
    try {
        const butParam = isActive ? 'OFF' : buttonName;
        activateButton(category, butParam);
    } catch (error) {
        console.error('Error toggling button:', error);
    }
  };

  const getButtonStyles = (groupName: string, buttonName: string) => {
    const isActive = activeButtons[groupName].currentButton === buttonName;
    const isConfirmed = activeButtons[groupName].confirmed;
  
    const activeConfirmed = isActive && isConfirmed;
    return {
      p: { xs: 0.7, md: 1 },
      border: 1.5,
      borderColor: isActive ? 'success.main' : 'inherit',
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'start',
      width: '100%',
      textTransform: 'none',
      backgroundColor: activeConfirmed ? 'success.main' : 'inherit',
      '&:hover': {
        border: 1.5,
        borderColor: isActive ? 'success.main' : 'inherit',
        backgroundColor: activeConfirmed ? 'success.main' : 'inherit',
      },
    };
  };

  return (
    <List
      sx={{ maxWidth: '100%', bgcolor: 'primary.light', borderRadius: '10px', py: 0 }}
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
                  {...(groupName === 'd' ? {
                    onMouseDown: () => handleMouseDown(groupName, button.name),
                    onMouseUp: handleMouseUp,
                    onMouseLeave: handleMouseUp,
                    onTouchStart: () => handleMouseDown(groupName, button.name),
                    onTouchEnd: handleMouseUp,
                  } : {
                    onClick: () => handleToggle(groupName, button.name)
                  })}
                  sx={getButtonStyles(groupName, button.name)}
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