import { Link } from 'react-router-dom'; 
import { Box, Container, Typography, Button } from '@mui/material';

const Hero = () => {
  return (
    <Box
      sx={{
        height: { xs: 400, md: 500 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        textAlign: 'center',
        backgroundImage: 'url(https://media.istockphoto.com/id/1346316025/photo/fresh-dark-red-grape-background.jpg?s=612x612&w=0&k=20&c=OBtf36ZYdogQXLgFn0OSKqzEfBoMFe1ZQvz7mC73RUA=)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fdf6f0',
        overflow: 'hidden',
      }}
    >
      {/* Capa de oscurecimiento */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 1,
        }}
      />

      {/* Contenido centrado */}
      <Container
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#fdf6f0',
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
            width: '100%',
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            color="#5a2a2a"
            fontWeight={700}
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              lineHeight: 1.2,
            }}
          >
            Bienvenidos a Sharumi, Tres Latitudes
          </Typography>

          <Typography
            variant="h6"
            paragraph
            color="#5a2a2a"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              mb: 3,
            }}
          >
            Te unimos a tus raíces, cruzando océanos con vino... Descubre nuestra magia.
          </Typography>

          <Button
            component={Link}
            to="/productos"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#5a2a2a',
              borderRadius: 2,
              px: 4,
              py: 1.2,
              fontWeight: 600,
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
