import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';

const Navbar = () => {
  return (
    <AppBar position="static" color="secondary" elevation={0}> 
      <Container maxWidth="xl" sx={{py: "0.1rem"}}>
        <Toolbar disableGutters>
          <Box sx={{display: "flex", flexDirection: "column", flexGrow: 10}}>
            {/* <Typography variant="h4" noWrap component="h1" sx={{ fontWeight: 700, color: '#fff', }}>
              AntController
            </Typography> */}
            <Typography variant="h6" component="h2" sx={{ fontWeight: 500, color: '#fff', }}>
              AntController
            </Typography>
          </Box>
          <Box sx={{display: "flex", flexDirection: "column", flexGrow: 1}}>
            <a href="/edit/" target="_blank">[edit config]</a>
          </Box>
          {/* <Box sx={{display: "flex", flexDirection: "row-reverse", flexGrow: 1}}>
            <IconButton sx={{ p: 0 }}>
              <GitHubIcon href="https://github.com/loaymoolb/antcontroller-react/" sx={{  color: "#6600DD", fontSize: {xs: "2.5rem", md: "3rem"} }} />
            </IconButton>
            <IconButton sx={{ p: 0 }}>
              <GitHubIcon href="https://github.com/cr1tbit/antcontroller" sx={{  color: "#11AA11", fontSize: {xs: "2.5rem", md: "3rem"} }} />
            </IconButton>
            <IconButton sx={{ p: 0 }}>
              <GitHubIcon href="https://github.com/cr1tbit/antController-fw" sx={{  color: "#0022CC", fontSize: {xs: "2.5rem", md: "3rem"} }} />
            </IconButton>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar