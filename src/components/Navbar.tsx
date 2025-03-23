import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import EditNoteIcon from '@mui/icons-material/EditNote';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { Stack, Button, Paper, Link, useTheme, useMediaQuery } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import ModalComponent from './Modal';
import { useState, useEffect } from 'react';
import { BackendState } from '../App';

const apiEndpoint = `${process.env.REACT_APP_DEVICE_ADDR}/api`;

export interface NavbarProps {
  backendState: BackendState;
}

const getStateColor = (state: BackendState) => {
  switch (state) {
    case BackendState.CONNECTED:
      return 'success.main';
    case BackendState.DISCONNECTED:
      return 'error.main';
    case BackendState.TIMEOUT:
      return 'warning.main';
    default:
      return 'grey.500';
  }
};

const getStateText = (state: BackendState, timeoutSeconds?: number) => {
  switch (state) {
    case BackendState.CONNECTED:
      return 'Connected';
    case BackendState.DISCONNECTED:
      return 'Disconnected';
    case BackendState.TIMEOUT:
      return `Timeout (${timeoutSeconds}s)`;
    default:
      return 'Unknown';
  }
};

const Navbar: React.FC<NavbarProps> = ({backendState} : NavbarProps) => {
  const [isRestartModalOpen, setRestartModalOpen] = useState(false);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [timeoutSeconds, setTimeoutSeconds] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (backendState === BackendState.TIMEOUT) {
      intervalId = setInterval(() => {
        setTimeoutSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setTimeoutSeconds(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [backendState]);

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
        <Button
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          onClick={handleOpenAboutModal}
          sx={{ 
            minWidth: '120px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textTransform: 'none',
            color: 'text.primary'
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: getStateColor(backendState),
              transition: 'background-color 0.2s'
            }}
          />
          {getStateText(backendState, timeoutSeconds)}
        </Button>
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