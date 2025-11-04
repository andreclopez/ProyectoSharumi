import { Box, Grid, Skeleton, Typography, Button} from '@mui/material';
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useCupon } from "../../../hooks/useCupon";
import ProductoCard from "../../../components/tienda/ProductoCard";
import Filtros from './Filtros';

const ListaProductos = ({ vista = "tienda", limiteProductos = Infinity }) => {
  const { cuponActivo } = useCupon();
  const descuentoCupon = cuponActivo?.porcentajeDescuento || 0;

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [totalProductos, setTotalProductos] = useState(0);

  const API_BASE_URL = 'http://localhost:3001';

  // PAGINACIÓN LOCAL
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Para vista tienda
  const homeItemsPerPage = 4; // Para vista home (productos destacados por página)

  // Cargar TODOS los productos
  useEffect(() => {
    setCargando(true);
    
    // ✅ SOLUCIÓN: Pedir todos los productos con un límite alto
    axios.get(`${API_BASE_URL}/api/productos`, {
      params: {
        limit: 1000, // Límite alto para obtener todos
        page: 1
      }
    })
      .then(res => {
        const productosData = res.data.data;
        setProductos(productosData);
        setTotalProductos(productosData.length);

        let productosAMostrar = productosData;
        
        // ✅ SOLUCIÓN: Filtrar productos destacados solo en vista home
        if (vista === "home") {
          productosAMostrar = productosData.filter(p => 
            p.oferta === true || p.descuento > 0
          );
          console.log(`📊 Productos destacados encontrados: ${productosAMostrar.length}`);
        }

        setProductosFiltrados(productosAMostrar);

        // Extraer categorías únicas
        const categoriasUnicas = [
          ...new Set(productosData.map(p => p.categoria?.nombre).filter(Boolean))
        ];
        setCategorias(categoriasUnicas);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setProductos([]);
        setProductosFiltrados([]);
      })
      .finally(() => setCargando(false));

  }, [vista]);

  // Función para aplicar filtros 
  const handleFilterChange = useCallback((filtros) => {
    let resultado = [...productos];

    // Búsqueda por nombre
    if (filtros.busqueda) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase())
      );
    }
    
    // Filtrado por categoría
    if (filtros.categoria) {
      resultado = resultado.filter(p => p.categoria?.nombre === filtros.categoria);
    }
    
    // Chips especiales
    if (filtros.chipActivo === 'Sale') {
      resultado = resultado.filter(p => p.oferta === true);
    }
    if (filtros.chipActivo === 'Envío Gratis') {
      resultado = resultado.filter(p => p.envioGratis === true);
    }
    if (filtros.chipActivo === 'Destacados') {
      resultado = resultado.filter(p => p.destacado === true);
    }
    
    // Ordenar
    if (filtros.orden === 'precioAsc') {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (filtros.orden === 'precioDesc') {
      resultado.sort((a, b) => b.precio - a.precio);
    } else if (filtros.orden === 'variedad') {
      resultado.sort((a, b) => {
        const variedadA = a.variedad || ''; 
        const variedadB = b.variedad || '';
        return variedadA.localeCompare(variedadB);
      });
    }

    setProductosFiltrados(resultado);
    setCurrentPage(1); // ✅ Reset página al filtrar
  }, [productos]);

  // ✅ SOLUCIÓN: Lógica de paginación simplificada
  const getProductsToRender = () => {
    const limit = vista === "home" ? homeItemsPerPage : itemsPerPage;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    
    return productosFiltrados.slice(startIndex, endIndex);
  };

  const productsToRender = getProductsToRender();

  // ✅ SOLUCIÓN: Cálculo correcto de páginas totales
  const limit = vista === "home" ? homeItemsPerPage : itemsPerPage;
  const totalPages = Math.ceil(productosFiltrados.length / limit);

  // Cantidad de productos destacados (para el botón del home)
  const totalProductosDestacados = vista === "home" 
    ? productosFiltrados.length 
    : productos.filter(p => p.oferta === true || p.descuento > 0).length;

  return (
    <Box p={2}>
      {/* Filtros */}
      {vista === "tienda" && (
        <>
          <Typography
            variant="h3"
            gutterBottom
            color="#5a2a2a"
            fontWeight={700}
            align='center'
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              lineHeight: 1.2,
              px: 3, 
              py: 3,
            }}
          >
            Catálogo De Productos
          </Typography>
          <Filtros 
            onFilterChange={handleFilterChange} 
            categorias={categorias} 
          />
        </>
      )}

      {vista === "home" && (
        <Typography
          variant="h3"
          gutterBottom
          color="#5a2a2a"
          fontWeight={700}
          align='center'
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            lineHeight: 1.2,
          }}
        >
          Vinos Destacados
        </Typography>
      )}

      {/* Lista de productos */}
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        {cargando ? (
          Array.from(new Array(vista === "home" ? 4 : 10)).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Skeleton variant="rectangular" height={300} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </Grid>
          ))
        ) : productsToRender.length > 0 ? ( 
          productsToRender.map((producto) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
              <ProductoCard 
                producto={producto} 
                descuentoCupon={descuentoCupon} 
                apiUrlBase={API_BASE_URL} 
              />
            </Grid>
          ))
        ) : (
          <Typography color="#5a2a2a" textAlign="center" sx={{ mt: 4, width: '100%' }}>
            No hay productos para mostrar.
          </Typography> 
        )}
      </Grid>

      {/* ✅ SOLUCIÓN: Paginación mejorada */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 4 }}>
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outlined"
            sx={{ color: '#5a2a2a', borderColor: '#5a2a2a' }}
          >
            Anterior
          </Button>
          
          <Typography variant="body1" sx={{ color: '#5a2a2a', fontWeight: 600 }}>
            Página {currentPage} de {totalPages}
          </Typography>

          <Button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            variant="outlined"
            sx={{ color: '#5a2a2a', borderColor: '#5a2a2a' }}
          >
            Siguiente
          </Button>
        </Box>
      )}

      {/* Botón "Ver Catálogo Completo" solo en home */}
      {vista === "home" && totalProductos > totalProductosDestacados && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component="a" 
            href="/productos" 
            sx={{
              backgroundColor: '#5a2a2a', 
              color: '#fdf6f0',           
              '&:hover': {
                backgroundColor: '#3e1e1e', 
              },
              borderRadius: 2, 
              px: 4, 
              py: 1.2, 
              fontWeight: 600, 
            }}
          >
            Ver Catálogo Completo ({totalProductos} Productos)
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ListaProductos;