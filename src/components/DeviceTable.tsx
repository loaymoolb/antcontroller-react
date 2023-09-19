import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import { Typography } from '@mui/material';
import { parse } from 'toml';

// const endpoint = 'http://localhost:3000'
const api_endpoint = 'http://192.168.88.62/api'


interface Button {
  name: string;
  descr: string;
  pins: string[];
}

interface ButtonGroup {
  buttons: Record<string, Button>;
}

//to turn off all buttons, set bName to "OFF"
export function activateButton(bGroup: string, bName: string): Promise<boolean> {
  return fetch(api_endpoint + "/BUT/" + bGroup + "/" + bName,{
    mode: 'cors'
  })
    .then(function(response) {
      return response.text();
    })
    .then(function(result) {
      if (result === "OK") {
        console.log("but" + bName + "activated");
        return true;
      } else {
        console.log("but" + bName + "ERR: " + result);
        return false;
      }
    });
}

const DeviceTable = () => {

  const [buttonGroups, setButtonGroups] = useState<ButtonGroup[]>([]);

  useEffect(() => {
    fetch('/buttons.conf')
    .then(response => response.text())
    .then(data => {
      const parsedData = parse(data);
      let exampleButtons = parsedData['buttons'] as ButtonGroup[];
      setButtonGroups(exampleButtons);
  });
  }, []);

  console.log(buttonGroups); 
  // use this struct instead of buttons, idk how
  // there should be 4 categories of buttons on the page.
  // only one button from each category can be active at a time. None can be active too.
  // clicking a button should send a request in format `/api/BUT/<group[a-d]>/<ON/OFF>`
  // for example `/api/BUT/a/ON` should turn on the first button from the first category   

  // TEMP DATA
  const buttons = [
    {
      name: 'Antenna 1',
      description: 'REAS - a REST-API External Antenna Switch'
    },
    {
      name: 'Antenna 2',
      description: 'REAS - a REST-API External Antenna Switch'
    },
    {
      name: 'Antenna 3',
      description: 'REAS - a REST-API External Antenna Switch'
    },
    {
      name: 'Antenna 4',
      description: 'REAS - a REST-API External Antenna Switch'
    },
  ]

  const [checked, setChecked] = useState(() => {
    const savedCheckedButtons = localStorage.getItem('checkedButtons');
    return savedCheckedButtons ? JSON.parse(savedCheckedButtons) : [];
  });

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    activateButton('c', "EXT")

    setChecked(newChecked);
  };

  useEffect(() => {
    localStorage.setItem('checkedButtons', JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    const savedCheckedButtons = localStorage.getItem('checkedButtons');
    if (savedCheckedButtons) {
      setChecked(JSON.parse(savedCheckedButtons));
    }
  }, []);

  return (
    <List
      sx={{ maxWidth: '100%', p: "1rem", bgcolor: '#E9EDEF', borderRadius: "20px" }}
      subheader={
        <ListSubheader  sx={{bgcolor: 'inherit', borderRadius: 'inherit'}}>
          <Typography
            variant="h6"
            component="h6"
            sx={{
              fontWeight: 700,
              color: 'primary',
            }}
          >
            REAS Buttons
          </Typography>
        </ListSubheader>
      }
    >
      {buttons.map((b) => (
        <ListItem key={b.name}>
          <ListItemIcon>
            <SettingsInputAntennaIcon style={{ color: checked.indexOf(b.name) !== -1 ? '#60BE84' : 'inherit' }} />
          </ListItemIcon>
          <ListItemText primary={b.name} secondary={b.description} />
          <Switch
            edge="end"
            onChange={handleToggle(b.name)}
            checked={checked.indexOf(b.name) !== -1}
            inputProps={{
              'aria-labelledby': `switch-list-label-${b.name}`,
              
            }}
            color="success"
          />
        </ListItem>
      ))}
    </List>
  )
}

export default DeviceTable