import { 
  Card, CardContent, Typography, Box, CardMedia, 
  Button, IconButton, Rating, CardActions, Chip
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../../hooks/useCart";

// Define la URL base de API
const API_BASE_URL = 'http://localhost:3001'; 

const ProductoCard = ({ producto, descuentoCupon = 0, apiUrlBase }) => {
  const navigate = useNavigate();
  const [favorito, setFavorito] = useState(false);
  const { addToCart } = useCart();

  // --- Construcción de URL de imagen ---
  const isAbsoluteUrl = producto.imagenUrl?.startsWith('http') || producto.imagenUrl?.startsWith('https');
  
  let imageUrl;
  
  if (isAbsoluteUrl) {
    imageUrl = producto.imagenUrl;
  } else if (producto.imagenUrl) {
    // Usar apiUrlBase si está disponible, sino API_BASE_URL
    const baseUrl = apiUrlBase || API_BASE_URL;
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const path = producto.imagenUrl.startsWith('/') ? producto.imagenUrl : `/${producto.imagenUrl}`;
    imageUrl = `${base}${path}`;
  } else {
    // Imagen por defecto
    imageUrl = '/ruta/a/imagen/default.png';
  }

  // --- Cálculo de precios ---
  const precioOriginal = Number(producto.precio) || 0;
  const descuentoPropio = Number(producto.descuento) || 0;

  // Calcular precio con descuento propio 
  const precioConDescuentoPropio = 
    descuentoPropio > 0
      ? precioOriginal - (precioOriginal * descuentoPropio) / 100
      : null;

  // Calcular precio con cupón
  const precioConDescuentoCupon =
    descuentoCupon > 0
      ? precioOriginal - (precioOriginal * descuentoCupon) / 100
      : null;

  // Determinar precio final y tipo de descuento
  let precioFinal = precioOriginal;
  let tipoDescuento = null;
  let porcentajeDescuento = 0;

  // Prioridad: cupón > descuento propio
  if (precioConDescuentoCupon !== null) {
    precioFinal = precioConDescuentoCupon;
    tipoDescuento = "cupon";
    porcentajeDescuento = descuentoCupon;
  } else if (precioConDescuentoPropio !== null) {
    precioFinal = precioConDescuentoPropio;
    tipoDescuento = "oferta";
    porcentajeDescuento = descuentoPropio;
  }

  return (
    <Card
      sx={{
        width: 300,
        height: 500,
        m: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": { boxShadow: 6, transform: "scale(1.02)", cursor: "pointer" }
      }}
    >

      <Box 
        onClick={() => navigate(`/productos/${producto.id}`)}
        sx={{ 
          flexGrow: 1, 
          position: 'relative', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Contenedor de imagen con altura fija */}
        <Box sx={{ 
          width: '100%', 
          height: 200,  
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0  
        }}>
          {/* Badge de descuento */}
          {tipoDescuento && (
            <Chip
              label={`-${porcentajeDescuento}%`}
              color={tipoDescuento === "cupon" ? "success" : "error"}
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 2,
                fontWeight: 700
              }}
            />
          )}

          {/* Imagen */}
          {imageUrl && (
            <CardMedia
              component="img"
              image={imageUrl}
              alt={producto.nombre}
              sx={{ 
                objectFit: "contain", 
                maxWidth: '90%',  
                maxHeight: '90%', 
                p: 0
              }}
            />
          )}
        </Box>

        {/* Contenido */}
        <CardContent sx={{ flexGrow: 1, pt: 1, pb: 0, px: 2, width: '100%' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom noWrap color="#5a2a2a">
            {producto.nombre}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.5rem',
              mb: 1
            }}
          >
            {producto.descripcion}
          </Typography>

          <Rating value={producto.rating || 4} precision={0.5} readOnly size="medium" sx={{ color: '#a0522d' }} />

          {/* --- Bloque de precios --- */}
          <Box sx={{ mt: 2 }}>
            {tipoDescuento ? (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ 
                    textDecoration: "line-through", 
                    color: "gray",
                    mb: 0.5
                  }}
                >
                  ${precioOriginal.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={tipoDescuento === "cupon" ? "green" : "#a0522d"}
                  >
                    ${precioFinal.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ 
                      color: tipoDescuento === "cupon" ? "green" : "#a0522d",
                      fontWeight: 600
                    }}
                  >
                    ({tipoDescuento === "cupon" ? "Con cupón" : "Oferta"})
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="h5" fontWeight={700} color="#5a2a2a">
                ${precioOriginal.toFixed(2)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Box>

      {/* Acciones */}
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, mt: 'auto' }}>
        <IconButton 
          onClick={(e) => { 
            e.stopPropagation(); 
            setFavorito(!favorito);
          }} 
          color={favorito ? "error" : "default"}
        >
          <FavoriteIcon />
        </IconButton>
        <Button
          variant="contained"
          size="medium"
          sx={{
            backgroundColor: "#5a2a2a",
            borderRadius: 2,
            fontWeight: 600,
            "&:hover": { backgroundColor: "#a0522d" }
          }}
          onClick={(e) => {
            e.stopPropagation();
            addToCart({
              id: producto.id,
              nombre: producto.nombre,
              precio: precioFinal,
              imagen: imageUrl
            });
          }}
          startIcon={<ShoppingCartIcon />}
        >
          Añadir
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductoCard;