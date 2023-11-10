import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';

const Navbar = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
      <IconButton sx={{ p: 0 }}>
        <GitHubIcon href="https://github.com/cr1tbit/antcontroller" sx={{  color: "#1ED98A", fontSize: '2.5rem' }} />
      </IconButton>
    </Box>
  )
}

export default Navbar