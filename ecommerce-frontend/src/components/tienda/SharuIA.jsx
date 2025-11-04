import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  IconButton, 
  Fade 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const SharuAI = () => {

   // === ESTADOS PRINCIPALES ===
  const [abierto, setAbierto] = useState(false);
  const [pregunta, setPregunta] = useState("");
  const [cargando, setCargando] = useState(false);

  const [historial, setHistorial] = useState([
    {
      role: "bot",
      parts: [{ text: "Hola, soy Sharu 🍷 tu sommelier virtual. ¿En qué puedo ayudarte hoy?" }],
    },
  ]);

  // === FUNCIÓN PARA ENVIAR PREGUNTA ===
  const enviarPregunta = async () => {
    if (!pregunta.trim()) return;

    const nuevoMensajeUsuario = { role: "user", parts: [{ text: pregunta }] };
    setHistorial((prev) => [...prev, nuevoMensajeUsuario]);
    setCargando(true);

    try {
      const historialParaAPI = historial;

      const { data } = await axios.post("http://localhost:3001/api/ai/chat", {
        pregunta,
        historial: historialParaAPI,
      });

      const nuevoMensajeIA = {
        role: "bot",
        parts: [{ text: data.respuesta || "No tengo una respuesta en este momento." }],
      };
      setHistorial((prev) => [...prev, nuevoMensajeIA]);
    } catch (error) {
      console.error("Error al consultar la IA:", error);
      setHistorial((prev) => [
        ...prev,
        {
          role: "bot",
          parts: [{ text: "Lo siento, hubo un problema de conexión con el servidor." }],
        },
      ]);
    } finally {
      setCargando(false);
      setPregunta("");
    }
  };

  return (
    <Box>
      {/* 2. CONTENIDO DEL CHAT (Se oculta y aparece con Fade) */}
      <Fade in={abierto}>
        <Paper 
          elevation={8} 
          sx={{ 
            pointerEvents: 'auto',
            mb: 2, 
            p: 2, 
            borderRadius: 3, 
            width: 300, 
            bgcolor: '#fdf6f0',
            position: 'relative',
          }}
        >
          {/* Cabecera del Chat */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color="#5a2a2a" 
                  display="flex" 
                  alignItems="center"
              >
                  <ChatBubbleIcon sx={{ mr: 1, color: '#a0522d', fontSize: 20 }} />
                  Sharu AI
              </Typography>
              <IconButton size="small" onClick={() => setAbierto(false)}>
                  <CloseIcon />
              </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
              Pregúntale a nuestro Sommelier virtual!
          </Typography>

          {/* Área de Respuestas */}
          <Box sx={{ minHeight: 150, maxHeight: 300, overflowY: 'auto', p: 1, mb: 1, border: '1px solid #d9b08c', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {historial.map((msg, index) => (
              <Box 
                key={index} 
                sx={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: msg.role === 'user' ? '#a0522d' : '#e8d5c4',
                  color: msg.role === 'user' ? '#fff' : '#5a2a2a',
                  borderRadius: 2,
                  py: 0.5,
                  px: 1.5,
                  maxWidth: '85%',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {msg.parts[0].text}
                </Typography>
              </Box>
            ))}
            {/* El indicador de "cargando" ahora se muestra al final */}
            {cargando && (
                <Box alignSelf="flex-start" mt={1}>
                    <CircularProgress size={20} sx={{ color: '#a0522d' }} />
                </Box>
            )}
          </Box>


          {/* Input y Botón */}
          <Box display="flex" gap={1} alignItems="center">
            
            <TextField
              fullWidth
              placeholder="Escribe aquí..."
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') enviarPregunta(); }}
              size="small"
              disabled={cargando}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3, 
                }
              }}
            />
            
            <Button
              variant="contained"
              onClick={enviarPregunta}
              disabled={cargando || !pregunta.trim()}
              sx={{ 
                minWidth: 40,
                width: 40,
                height: 40,
                borderRadius: '50%', 
                p: 0,
                bgcolor: '#a0522d', 
                '&:hover': { bgcolor: '#5a2a2a' },
              }}
            >
              <SendIcon fontSize="small" />
            </Button>
          </Box>
        </Paper>
      </Fade>

      {/* 3. BOTÓN FLOTANTE ✨ */}
      <Button
        variant="contained"
        onClick={() => setAbierto(!abierto)}
        aria-label={abierto ? "Cerrar Sharu AI" : "Abrir Sharu AI"}
        sx={{
          pointerEvents: 'auto',
          position: 'fixed',
          bottom: 24,
          right: 24,
          minWidth: 80,
          width: 80,
          height: 80,
          borderRadius: '50%',
          p: 0,
          boxShadow: '0px 6px 20px rgba(0,0,0,0.3)',
          background: abierto
            ? 'linear-gradient(135deg, #5a2a2a 0%, #3c1c1c 100%)'
            : 'linear-gradient(135deg, #b85c38 0%, #a0522d 100%)',
          animation: !abierto ? 'pulse 2s infinite' : 'none',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            background: abierto
              ? 'linear-gradient(135deg, #a0522d 0%, #5a2a2a 100%)'
              : 'linear-gradient(135deg, #5a2a2a 0%, #b85c38 100%)',
          },
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.12)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      >
        {abierto ? (
          <CloseIcon sx={{ fontSize: 40, color: '#fff' }} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="44"
            height="44"
            fill="none"
          >
            <path
              d="M48 12c0 9-8 20-16 20S16 21 16 12h32zM24 38h16v3c0 3.3-2.7 6-6 6h-4c-3.3 0-6-2.7-6-6v-3z"
              fill="#f8e3c4"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M32 47v6"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M28 53h8"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </Button>
    </Box>
  );
};

export default SharuAI;