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
      <Container maxWidth="xl" sx={{py: "2rem"}}>
        <Toolbar disableGutters>
          <Box sx={{display: "flex", flexDirection: "column", flexGrow: 1}}>
            <Typography
              variant="h4"
              noWrap
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#fff',
              }}
            >
              REAS API Tester
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 500,
                color: '#fff',
              }}
            >
              HTTP GET request generator for local devices
            </Typography>
          </Box>
          <IconButton sx={{ p: 0 }}>
            <GitHubIcon href="https://github.com/cr1tbit/REAS" sx={{  color: "#000", fontSize: {xs: "2.5rem", md: "3rem"} }} />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar