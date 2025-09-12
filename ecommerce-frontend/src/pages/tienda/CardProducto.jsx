import React from 'react';
import { Card, CardContent, Typography, Box } from "@mui/material";

const CardProducto = ({ producto, descuentoCupon = 0 }) => {
    const precioOriginal = producto.precioOriginal || producto.precio; 
    const precioConDescuentoCupon = 
    descuentoCupon > 0
      ? precioOriginal - (precioOriginal * descuentoCupon) / 100
      : null;

    const precioConDescuentoPropio =
    producto.oferta && producto.descuento > 0
    ? Math.round(precioOriginal - (precioOriginal * producto.descuento) / 100)
    : null;

  return (
    <Card sx={{ maxWidth: 300, m: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {producto.nombre}
        </Typography>

        <Box sx={{ mt: 1 }}>
          {precioConDescuentoCupon !== null ? (
            <>
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", color: "gray" }}
              >
                ${precioOriginal.toFixed(2)}
              </Typography>
              <Typography variant="h6" color="primary">
                ${precioConDescuentoCupon.toFixed(2)}
              </Typography>
            </>
          ) : precioConDescuentoPropio !== null ? (
            <>
             <Typography
            variant="body2"
            sx={{ textDecoration: "line-through", color: "gray" }}
            >
              ${precioOriginal.toFixed(2)}
            </Typography>
            <Typography>
              ${precioConDescuentoPropio.toFixed(2)}
            </Typography>
            </>
          ) : (
            <Typography variant="h6">${precioOriginal.toFixed(2)}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardProducto