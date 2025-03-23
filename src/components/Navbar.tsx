import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { Stack, Button, Paper, Link, useTheme, useMediaQuery } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import ModalComponent from './Modal';
import { useState } from 'react';

const apiEndpoint = `${process.env.REACT_APP_DEVICE_ADDR}/api`;

export interface NavbarProps {
  backendState: string;
}

const Navbar: React.FC<NavbarProps> = ({backendState} : NavbarProps) => {
  const [isRestartModalOpen, setRestartModalOpen] = useState(false);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenRestartModal = () => setRestartModalOpen(true);
  const handleCloseRestartModal = () => setRestartModalOpen(false);
  const handleOpenAboutModal = () => setAboutModalOpen(true);
  const handleCloseAboutModal = () => setAboutModalOpen(false);
  
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

    handleCloseRestartModal();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'center',
      p: 2,
      gap: 2,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Stack direction='row' sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1, 
            display: 'flex', 
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
            minWidth: '120px',
            justifyContent: 'center'
          }}
        >
          {backendState}
        </Paper>
      </Stack>

      <Stack direction='row' flex='1' justifyContent='center' sx={{ width: { xs: '100%', md: 'auto' } }}>
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
      </Stack>

      <Stack 
        direction="row" 
        sx={{ 
          width: { xs: '100%', md: 'auto' },
          justifyContent: { xs: 'center', md: 'flex-end' },
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Button 
          onClick={handleOpenAboutModal}
          variant="outlined" 
          startIcon={<InfoIcon />}
          size={isMobile ? "small" : "medium"}
        >
          About
        </Button>

        <Button 
          href="/edit" 
          target="_blank" 
          variant="outlined" 
          startIcon={<EditNoteIcon />}
          size={isMobile ? "small" : "medium"}
        >
          Edit Config
        </Button>
        
        <Button 
          onClick={handleOpenRestartModal} 
          variant="outlined" 
          startIcon={<RestartAltIcon />}
          size={isMobile ? "small" : "medium"}
        >
          Restart
        </Button>
        
        <Button 
          href="https://vcc.earth/antcontroller" 
          target="_blank" 
          variant="outlined" 
          startIcon={<UpgradeIcon />}
          size={isMobile ? "small" : "medium"}
        >
          Update
        </Button>
      </Stack>

      <ModalComponent 
        open={isRestartModalOpen} 
        heading="Restart Device"
        subheading="Are you sure you want to restart the device?"
        close={handleCloseRestartModal} 
        submit={handleSubmit}
      />

      <ModalComponent 
        open={isAboutModalOpen} 
        heading="About AntController"
        subheading=""
        close={handleCloseAboutModal} 
        submit={handleCloseAboutModal}
        content={
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" paragraph>
              AntController is a web-based interface for managing and monitoring your ant farm environment.
              It provides real-time control over temperature, humidity, and other environmental factors
              to create the perfect conditions for your ant colony.
            </Typography>
            <Typography variant="body1" paragraph>
              For more information, visit our GitHub repository:
            </Typography>
            <Link 
              href="https://github.com/cr1tbit/antcontroller" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
            >
              <GitHubIcon sx={{ color: 'success.main' }} />
              <Typography>github.com/cr1tbit/antcontroller</Typography>
            </Link>
          </Box>
        }
      />
    </Box> 
  )
}

export default Navbar