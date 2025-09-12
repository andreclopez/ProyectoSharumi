import { Box, Container, Grid, Typography, Link, TextField, Button, IconButton, Divider } from "@mui/material";
import { Facebook, Twitter, Instagram, YouTube, Pinterest, Send } from "@mui/icons-material";
import WineBarIcon from '@mui/icons-material/WineBar';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#5a2a2a", pt: 6, pb: 3 }}>
      <Container>
        <Grid container spacing={2} alignItems={"flex-start"}>
          <WineBarIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#a0522d' }} />
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom color="#a0522d">
              SHARUMI easy shop 
            </Typography>
            <Typography variant="h7" color="#a0522d">
              Tres latitudes unidas por el sabor.
            </Typography>
            <Box mt={2}>
              {[Facebook, Twitter, Instagram, YouTube, Pinterest].map((Icon, idx) => (
                <IconButton key={idx} sx={{ color: '#a0522d' }}>
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Secciones */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#a0522d">Comprar</Typography>
            {["Nuevos ingresos", "Más vendidos", "Ofertas", "Todas las categorías",].map((item, idx) => (
              <Link href="#" key={idx} underline="hover" display="block" color="#a0522d">
                {item}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#a0522d">Ayuda</Typography>
            {["Preguntas frecuentes", "Envios", "Devoluciones", "Políticas de reembolso", "Contactanos"].map((item, idx) => (
              <Link href="#" key={idx} underline="hover" display="block" color="#a0522d">
                {item}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#a0522d"> Acerca de nosotros</Typography>
            {["Quienes Somos", "Sostenibilidad", "Trabaja con nosotros", "Nuestro equipo"].map((item, idx) => (
              <Link href="#" key={idx} underline="hover" display="block" color="#a0522d">
                {item}
              </Link>
            ))}
          </Grid>

          {/* Posición del Newsletter */}
          <Grid item xs={12} sm={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#a0522d"> Suscribete </Typography>
            <Typography variant="body2" color="#a0522d" mb={1}>
              Subscribete a nuestro newsletter y mantente informado.
            </Typography>
            <Box display="flex" gap={1}>
              <TextField size="small" placeholder="Email Address" fullWidth />
              <Button variant="contained" sx={{ backgroundColor: '#7a3a1a', '&:hover': { backgroundColor: '#a0522d' } }}>
                <Send />
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Typography variant="body2" color="#a0522d">
            © 2025 Sharumi Easy Shop. Todos los derechos reservados.
          </Typography>
          <Box display="flex" gap={2}>
            {["Políticas de Privacidad", "Terminos y Condiciones", "Accesibilidad", "Defensa del consumidor"].map((item, idx) => (
              <Link href="#" key={idx} underline="hover" color="#a0522d" variant="body2">
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
