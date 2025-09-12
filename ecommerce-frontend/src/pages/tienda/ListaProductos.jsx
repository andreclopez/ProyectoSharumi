import React from "react";
import { Box, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, Rating, Chip, IconButton, Skeleton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useCupon } from "../../hooks/useCupon.js"

const ListaProductos = () => {

  const { cuponActivo } = useCupon();
  const descuentoCupon = cuponActivo?.porcentajeDescuento || 0;
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/productos')
    .then(res => setProductos(res.data.data))
    .catch(err => 
      console.error('Error:', err))
  }, []);
  
  return (
    <Box p={2}>
      <Grid container spacing={3} justifyContent="center">
        {productos && productos.length > 0 ? (
          productos.map((producto) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
              <CardProducto 
              key={producto.id}
              producto={producto} 
              descuentoCupon={descuentoCupon} 
              />
            </Grid>
          ))
        ) : (
          Array.from(new Array(4)).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <CardProducto />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

const CardProducto = ({ producto, descuentoCupon = 0 }) => {
  if (!producto) {
    return (
      <Card>
        <Skeleton variant="rectangular" height={140} />
        <CardContent>
          <Skeleton width="60%" />
          <Skeleton width="40%" />
          <Skeleton width="80%" />
        </CardContent>
        <CardActions>
          <Skeleton width="30%" height={36} />
          <Skeleton width="20%" height={36} />
        </CardActions>
      </Card>
    );
  }

   const precioOriginal = producto.precioOriginal || producto.precio;

   //Para usar cupones activos e ignorar descuento de producto
   const precioConDescuentoCupon =
   descuentoCupon > 0
   ? precioOriginal - (precioOriginal * descuentoCupon) / 100
   : null;

   //Si no hay cupones, se usa el descuento del producto
   const precioConDescuentoPropio =
   producto.oferta && producto.descuento > 0
   ? Math.round(precioOriginal - (precioOriginal * producto.descuento) / 100)
   : null;
      
  return (
    <Card
    sx={{
      backgroundColor: '#fdf6f0',
      color: '#5a2a2a',
      width: 300,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      ...(producto.oferta && {
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 8px 20px rgba(75, 0, 0, 0.2)',
          backgroundColor: '#fff5f1',
        },
      }),
    }}
    >

      <CardMedia
        component="img"
        image={producto.imagenUrl}
        alt={producto.nombre}
        sx={{ height: 300, objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">{producto.nombre}</Typography>
          <Chip
            label={producto.categoria?.nombre || 'Sin categoría'}
            size="small"
            sx={{
              backgroundColor: '#5a2a2a',
              '&:hover': {
                backgroundColor: '#4a1f1f',
              },
              color: 'white'
            }}
          />
        </Box>

        {producto.oferta && (
          <Chip
            label="¡Oferta!"
            color="secondary"
            size="small"
            sx={{ fontWeight: 'bold', mb: 1 }}
          />
        )}

        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60 }}>
          {producto.descripcion}
        </Typography>

        <Rating value={producto.rating} precision={0.5} readOnly size="small" sx={{ my: 1 }} />

        {precioConDescuentoCupon !== null ? (
          <>
            <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ textDecoration: 'line-through' }}
            >
              ${precioOriginal.toLocaleString()}
            </Typography>
            <Typography variant="h6" color="red">
              ${precioConDescuentoCupon.toLocaleString()}
            </Typography>
          </>
        ) :  precioConDescuentoPropio !== null ? (
          <>
          <Typography variant="h6" color="#5a2a2a">
            ${precioOriginal.toLocaleString()}
          </Typography>
          <Typography variant="h6" color="red">
              ${precioConDescuentoPropio.toLocaleString()}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" color="#5a2a2a">
            ${precioOriginal.toLocaleString()}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button
          size="small"
          variant="contained"
          sx={{
            backgroundColor: '#5a2a2a',
            '&:hover': {
              backgroundColor: '#4a1f1f',
            },
            color: 'white'
          }}>
          Comprar
        </Button>
        <IconButton aria-label="Agregar a favoritos">
          <FavoriteIcon color="error" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ListaProductos;
