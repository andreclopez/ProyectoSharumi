import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; 
import { useCart } from '../../../hooks/useCart';
import { Box, Typography, IconButton, Button, Card, CardMedia, CardContent, Divider } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import axios from 'axios';

const Carrito = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, accessToken} = useAuth();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const handleCheckout = async () => {
  if (!user) {
    navigate('/login', { state: { from: '/carrito' } }); 
    return;
  }

  const pedido = {
    total: total,
    productos: cartItems.map(item => ({
      idProducto: item.id,
      cantidad: item.cantidad,
      precioUnitario: item.precio
    }))
  };

  try {
    await axios.post('http://localhost:3001/api/pedidos', pedido, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    alert('¡Tu compra ha sido realizada con éxito! 💕');
    clearCart();
    navigate('/mis-compras'); 

  } catch (error) {
    console.error("Error al finalizar la compra:", error.response?.data || error.message);
    alert('Hubo un error al procesar tu compra. Por favor, intenta de nuevo.');
  }
};

const handleContinueShopping = () => {
    navigate('/productos');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#5a2a2a' }}> 
        Tu carrito 🛍️
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed #d9b08c', borderRadius: '12px', mt: 3 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            El carrito está vacío. ¡Visita nuestro catálogo de productos! 🍷
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/productos')}
            sx={{ 
              mt: 1, 
              backgroundColor: '#a0522d', 
              borderRadius: '8px', 
              px: 4, 
              '&:hover': { backgroundColor: '#5a2a2a' }
            }}
          >
            Ver Catálogo
          </Button>
        </Box>
      ) : (
        <>
          {cartItems.map((p) => (
            <Card 
              key={p.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2, 
                p: 2, 
                borderRadius: '12px', 
                boxShadow: 3, 
                transition: 'transform 0.2s', 
                '&:hover': { transform: 'scale(1.005)' } 
              }}
            >
              {/* El resto del mapeo de productos se mantiene igual... */}
              <CardMedia component="img" image={p.imagen} alt={p.nombre} sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover', mr: 2 }} />
              <CardContent sx={{ flex: 1, p: 1, '&:last-child': { pb: 1 } }}> 
                <Typography variant="subtitle1" fontWeight="bold" color="#5a2a2a">{p.nombre}</Typography>
                <Typography color="#a0522d" variant="body2">${p.precio.toLocaleString('es-AR')}</Typography>
              </CardContent>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton onClick={() => updateQuantity(p.id, -1)} sx={{ color: '#a0522d' }}><Remove /></IconButton>
                <Typography sx={{ color: '#5a2a2a', fontWeight: 600 }}>{p.cantidad}</Typography>
                <IconButton onClick={() => updateQuantity(p.id, 1)} sx={{ color: '#a0522d' }}><Add /></IconButton>
              </Box>

              <Typography sx={{ width: 100, textAlign: 'right', fontWeight: 600, color: '#5a2a2a' }}>
                ${(p.precio * p.cantidad).toLocaleString('es-AR')}
              </Typography>

              <IconButton color="error" onClick={() => removeFromCart(p.id)} sx={{ ml: 1 }}>
                <Delete />
              </IconButton>
            </Card>
          ))}

          <Divider sx={{ my: 3, borderColor: '#d9b08c' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="#5a2a2a">Total:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#a0522d' }}>
              ${total.toLocaleString('es-AR')}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2, 
            flexWrap: 'wrap',
            mt: 3
            }}>

            <Button 
              variant="contained" 
              onClick={handleContinueShopping}
              sx={{ 
                mt: 0, 
                backgroundColor: '#a0522d', 
                borderRadius: '12px', 
                px: 2, 
                py: 1.5, 
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#7a3a1a' }
              }}   
            >
              Seguir comprando
            </Button>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                onClick={clearCart} 
                disabled={cartItems.length === 0} 
                sx={{ 
                  mt: 3, 
                  borderColor: '#a0522d', 
                  color: '#a0522d',
                  borderRadius: '12px', 
                  px: 2, 
                  py: 1.5, 
                  fontWeight: 'bold',
                  '&:hover': { 
                    backgroundColor: '#fdf6f0', 
                    borderColor: '#5a2a2a', 
                    color: '#5a2a2a' 
                  }
                }} 
              >
                Vaciar carrito
              </Button>

              <Button 
                variant="contained" 
                sx={{ 
                  mt: 3, 
                  backgroundColor: '#5a2a2a', 
                  borderRadius: '12px', 
                  px: 2, 
                  py: 1.5, 
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#3e1e1e' }
                }} 
                onClick={handleCheckout}
              >
                Finalizar compra
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Carrito;