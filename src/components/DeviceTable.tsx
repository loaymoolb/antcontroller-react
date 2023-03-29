import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import { Typography } from '@mui/material';

const DeviceTable = () => {

  // TEMP DATA
  const devices = [
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

  // FETCH DATA FROM CSV

    // const [devices, setDevices] = useState([]);

    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await axios.get('/data/devices.csv');
    //       const data = parse(response.data, {
    //         columns: true,
    //         skip_empty_lines: true,
    //       });
    //       setDevices(data);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };

    //   fetchData();
    // }, []);

  const [checked, setChecked] = useState(() => {
    const savedCheckedDevices = localStorage.getItem('checkedDevices');
    return savedCheckedDevices ? JSON.parse(savedCheckedDevices) : [];
  });

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    localStorage.setItem('checkedDevices', JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    const savedCheckedDevices = localStorage.getItem('checkedDevices');
    if (savedCheckedDevices) {
      setChecked(JSON.parse(savedCheckedDevices));
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
            REAS Devices
          </Typography>
        </ListSubheader>
      }
    >
      {devices.map((device) => (
        <ListItem key={device.name}>
          <ListItemIcon>
            <SettingsInputAntennaIcon style={{ color: checked.indexOf(device.name) !== -1 ? '#60BE84' : 'inherit' }} />
          </ListItemIcon>
          <ListItemText primary={device.name} secondary={device.description} />
          <Switch
            edge="end"
            onChange={handleToggle(device.name)}
            checked={checked.indexOf(device.name) !== -1}
            inputProps={{
              'aria-labelledby': `switch-list-label-${device.name}`,
              
            }}
            color="success"
          />
        </ListItem>
      ))}
    </List>
  )
}

export default DeviceTable