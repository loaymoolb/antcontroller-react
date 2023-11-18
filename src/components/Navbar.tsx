import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { Stack } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ModalComponent from './Modal';
import { useState } from 'react';

const apiEndpoint = `${process.env.REACT_APP_DEVICE_ADDR}/api`;

export interface NavbarProps {
  backendState: string;
}

const Navbar: React.FC<NavbarProps> = ({backendState} : NavbarProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  
  const handleSubmit = () => {

    fetch(`${apiEndpoint}/RST`, { mode: 'cors' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log(data))
      .catch(error => console.error('Error fetching data:', error));

    handleCloseModal();
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Stack direction='row' sx={{ position: {xs: 'static', md: 'absolute'}, left: '26%' }}>
        <p style={{ color: 'black', alignSelf: 'left' }}>{backendState}</p>
      </Stack>

      <Stack direction='row' flex='1' justifyContent='center'>
        <img src="https://vcc.earth/img/pony.webp" alt="friendship is magic" width="40" height="40" />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            alignSelf: 'center',
            mr: 2
          }}
        >
          AntController
        </Typography>
        <IconButton sx={{ p: 0 }} href="https://github.com/cr1tbit/antcontroller" target='_blank' rel="noopener noreferrer">
          <GitHubIcon sx={{  color: 'success.main', fontSize: '2rem' }} />
        </IconButton>
      </Stack>

      <Stack direction="row" sx={{ position: {xs: 'static', md: 'absolute'}, right: '26%' }}>
        <IconButton href="/edit"  target="_blank" title='edit config' sx={{ p: 0, '&:hover': { background: 'none' } }}>
          <EditNoteIcon sx={{ fontSize: '2rem' }} />
        </IconButton>
        
        <IconButton onClick={handleOpenModal} title='restart device' sx={{ p: 0, ml: 1, '&:hover': { background: 'none' } }}>
          <RestartAltIcon sx={{ fontSize: '1.7rem' }} />
        </IconButton>
        <IconButton href="https://vcc.earth/antcontroller"  target="_blank" title='update firmware' sx={{ p: 0, '&:hover': { background: 'none' } }}>
          <UpgradeIcon sx={{ fontSize: '2rem' }} />
        </IconButton>
      </Stack>

      <ModalComponent 
        open={isModalOpen} 
        heading="Restart Device"
        subheading="Are you sure you want to restart the device?"
        close={handleCloseModal} 
        submit={handleSubmit}
      />
    </Box> 
  )
}

export default Navbar