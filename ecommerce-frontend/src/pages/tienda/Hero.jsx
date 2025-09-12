import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

const Hero = () => {
  return (
    <Box
      sx={{
        height: 400,
        backgroundImage: 'url(https://media.istockphoto.com/id/1346316025/photo/fresh-dark-red-grape-background.jpg?s=612x612&w=0&k=20&c=OBtf36ZYdogQXLgFn0OSKqzEfBoMFe1ZQvz7mC73RUA=)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a0522d',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="sm">
         <Box
          sx={{
            backgroundColor: '#fdf6f0', 
            padding: 3,
            borderRadius: 2,
          }}
          >
            <Typography variant="h3" gutterBottom>
              Bienvenidos a Sharumi Easy Shop
            </Typography>
            <Typography variant="h6" paragraph>
              Tres latitudes que te unen a tus raíces, cruzando océanos con vino... Descubre nuestra magia.
            </Typography>
            <Button
            variant="contained"
            sx={{
              backgroundColor: '#5a2a2a',
              '&:hover': {
              backgroundColor: '#3e1e1e',
              },
            }}
          >
          Comprar ahora
           </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;

