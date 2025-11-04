import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box } from '@mui/material'; 
import API from '../../../services/api.js';
import { useToastAlerts } from '../../../utils/toastAlerts.js';
import { useNavigate } from 'react-router-dom';

const colors = {
  background: '#fdf8f5', 
  cardBackground: '#ffffff',
  primaryText: '#4e2a2a',  
  secondaryText: '#7d5a5a',
  accent: '#a0522d',       
  accentHover: '#5a2a2a',
};

const Contacto = () => {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [isLoading, setIsLoading] = useState(false); 
  const { showSuccess, showError } = useToastAlerts();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await API.post('/contacto', form);

      setForm({ nombre: '', email: '', mensaje: '' });

      const successMessage = (
        <Box>
          <Typography fontWeight="bold">¡Mensaje Enviado! 🎉</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {data.message || "Gracias por contactarnos. Responderemos pronto."}
          </Typography>
          <Button 
            variant="text" 
            size="small"
            sx={{ 
                mt: 1, 
                color: colors.primaryText, 
                borderColor: colors.primaryText 
            }}
            onClick={() => navigate('/')} 
          >
            Volver a la Home
          </Button>
        </Box>
      );

      showSuccess(successMessage);

    } catch (error) {
      console.error("Error de red:", error); 
      showError("No se pudo enviar el mensaje. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      sx={{ 
        py: 5, 
        bgcolor: colors.background,
        minHeight: '80vh' 
      }}
    >
      {/* Tarjeta con colores más cálidos y sombra suave */}
      <Card sx={{ 
        width: 400, 
        p: 2, 
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)', 
        borderRadius: '20px',
        bgcolor: colors.cardBackground,
        border: `1px solid ${colors.accent}20` 
      }}>
        <CardContent>
          <Typography 
            variant="h5" 
            gutterBottom 
            textAlign="center" 
            fontWeight="bold"
            color={colors.primaryText} 
          >
            Contáctanos 💌
          </Typography>
          <Typography 
            variant="body2" 
            color={colors.secondaryText} 
            textAlign="center" 
            mb={3} 
          >
            ¿Tenés alguna duda o sugerencia? Escribinos y te responderemos pronto.
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Personalizamos los campos de texto */}
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: colors.accent, 
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.accent, 
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isLoading}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: colors.accent,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.accent,
                },
              }}
            />
            <TextField
              fullWidth
              label="Mensaje"
              name="mensaje"
              multiline
              rows={4}
              value={form.mensaje}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: colors.accent,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.accent,
                },
              }}
            />

            {/* Botón con gradiente y efecto hover */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{ 
                mt: 2, 
                borderRadius: '12px',
                py: 1.5, 
                fontWeight: 'bold',
                color: 'white',
                background: isLoading ? colors.secondaryText : `linear-gradient(45deg, ${colors.accent} 30%, #b85c38 90%)`,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0px 4px 15px ${colors.accent}50`,
                },
              }}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Contacto;