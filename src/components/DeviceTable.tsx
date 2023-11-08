import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import { Collapse, ListItemButton } from '@mui/material';
import { parse } from 'toml';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const apiEndpoint = `${process.env.REACT_APP_DEVICE_ADDR}/api`;

interface Button {
  name: string;
  descr: string;
  pins?: string[];
}

type ButtonGroupsType = Record<string, Button[]>;
export function activateButton(bGroup: string, bName: string): Promise<boolean> {
  console.log(`activating ${bGroup} to ${bName}`);
  let fetchCall = `${apiEndpoint}/BUT/${bGroup}/${bName}`
  console.log(fetchCall)
  return fetch(fetchCall, {mode: 'cors'})
    .then(function(response) {
      return response.text();
    })
    .then(function(result) {
      if (result === "OK") {
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
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  
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
  }, []);

  // console.log(buttonGroups, "buttonGroups"); 

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
        console.error("Error toggling button:", error);
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

  const handleGroupToggle = (groupName: string) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  return (
    <List
      sx={{ maxWidth: '100%', bgcolor: '#E9EDEF', borderRadius: "10px" }}
    >
      {groupNames.map(groupName => (
        <ListItem key={groupName} sx={{ flexDirection: "column", justifyContent: "start", width: '100%' }}>
          <ListItemButton onClick={() => handleGroupToggle(groupName)} sx={{ width: "100%" }}>
            <ListItemText primary={`Group ${groupName.toUpperCase()}`} />
            {openGroup === groupName ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openGroup === groupName} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
            <List component="div" disablePadding sx={{ flexDirection: "column" }}>
              {buttonGroups[groupName]?.map(button => (
                <ListItem key={button.name} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <SettingsInputAntennaIcon style={{ color: checked.indexOf(button.name) !== -1 ? '#60BE84' : 'inherit' }} />
                  </ListItemIcon>
                  <ListItemText primary={button.name} secondary={button.descr} />
                  <Switch
                    edge="end"
                    onChange={() => handleToggle(groupName, button.name)}
                    checked={activeButtons[groupName] === button.name}
                    inputProps={{
                      'aria-labelledby': `switch-list-label-${button.name}`,
                    }}
                    color="success"
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </ListItem>
      ))}
    </List>
  )
}

export default DeviceTable