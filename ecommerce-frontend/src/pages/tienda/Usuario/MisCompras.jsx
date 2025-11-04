import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import {
  Box, Typography, Accordion, AccordionSummary,
  AccordionDetails, CircularProgress, Alert, Paper, Chip, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const MisCompras = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!accessToken) {
        setCargando(false);
        setError("Debes iniciar sesión para ver tus compras.");
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/api/pedidos/mis-pedidos', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setPedidos(response.data.data);
      } catch (err) {
        setError('No se pudieron cargar tus compras. Intenta de nuevo más tarde.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    fetchPedidos();
  }, [accessToken]);

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress sx={{ color: '#a0522d' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 4, borderRadius: 2 }}>{error}</Alert>;
  }

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fdf6f0 0%, #fff 100%)',
      }}
    >
      {/* Header decorativo */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <LocalMallIcon sx={{ fontSize: 60, color: '#a0522d', mb: 1 }} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#5a2a2a',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Mis Compras 🛍️
        </Typography>
        <Typography sx={{ color: '#7a3a1a', fontSize: '1rem', mt: 1 }}>
          Gracias por confiar en Sharumi 💕
        </Typography>
      </Box>

      {/* Si no hay pedidos */}
      {pedidos.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: 'center',
            backgroundColor: '#fff7f3',
            borderRadius: 3,
            boxShadow: '0 4px 10px rgba(160, 82, 45, 0.15)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#5a2a2a', mb: 1 }}>
            Aún no has realizado ninguna compra.
          </Typography>
          <Typography sx={{ color: '#a0522d' }}>
            Cuando realices tu primera compra, aparecerá aquí con todo el detalle 💫
          </Typography>
        </Paper>
      ) : (
        pedidos.map((pedido) => (
          <Accordion
            key={pedido.id}
            sx={{
              mb: 2.5,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(160,82,45,0.1)',
              backgroundColor: '#fff',
              transition: 'all 0.2s ease-in-out',
              '&:hover': { boxShadow: '0 6px 16px rgba(160,82,45,0.15)' },
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#5a2a2a' }} />}
              sx={{
                backgroundColor: '#fdf6f0',
                borderBottom: '1px solid #d9b08c',
                py: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography sx={{ fontWeight: 'bold', color: '#5a2a2a' }}>
                  Pedido #{pedido.id}
                </Typography>

                <Chip
                  label={pedido.estado || "Procesando"}
                  sx={{
                    backgroundColor: pedido.estado === "Entregado" ? "#e0f2f1" : "#f8e1d2",
                    color: pedido.estado === "Entregado" ? "#2e7d32" : "#5a2a2a",
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                />

                <Typography sx={{ color: '#7a3a1a' }}>
                  {new Date(pedido.createdAt).toLocaleDateString()}
                </Typography>

                <Typography sx={{ fontWeight: 'bold', color: '#a0522d' }}>
                  Total: ${pedido.total}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 3, backgroundColor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#5a2a2a' }}>
                Detalles del Pedido
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {pedido.pedidoxproductos.map((item) => (
                <Box
                  key={item.producto.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0e0d6',
                    py: 1,
                  }}
                >
                  <Typography sx={{ color: '#5a2a2a' }}>
                    {item.producto.nombre} (x{item.cantidad})
                  </Typography>
                  <Typography sx={{ fontWeight: 500, color: '#7a3a1a' }}>
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default MisCompras;
