import React from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CuponProvider } from "./context/CuponContext.jsx";
import { CartProvider } from "./context/CartContext.jsx"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';

// Componentes tienda
import Cabecera from "./pages/tienda/Home/Cabecera.jsx";
import Banner from "./pages/tienda/Home/Banner.jsx";
import ListaProductos from "./pages/tienda/Home/ListaProductos.jsx";
import Hero from "./pages/tienda/Home/Hero.jsx";
import Footer from "./pages/tienda/Home/Footer.jsx";
import Categorias from "./pages/tienda/Categoria/Categorias.jsx";
import CategoriaDetalle from "./pages/tienda/Categoria/CategoriaDetalle.jsx";
import CuponDescuento from "./pages/tienda/Home/CuponDescuento.jsx";
import Productos from "./pages/tienda/Producto/Productos.jsx";
import ProductoDetalle from "./pages/tienda/Producto/ProductoDetalle.jsx";
import Carrito from "./pages/tienda/Carrito/Carrito.jsx";
import SharuAI from "./components/tienda/SharuIA.jsx";
import Contacto from "./pages/tienda/Contacto/Contacto.jsx"

// Páginas usuario
import Login from "./pages/tienda/Usuario/Login.jsx";
import Registro from "./pages/tienda/Usuario/Registro.jsx";
import MiCuenta from "./pages/tienda/Usuario/MiCuenta.jsx";
import MisCompras from "./pages/tienda/Usuario/MisCompras.jsx";
import OAuthCallback from "./pages/tienda/Usuario/OAuthCallback.jsx";

// Admin
import HomeAdmin from "./pages/admin/HomeAdmin.jsx";
import DashboardAdmin from "./pages/admin/DashboardAdmin.jsx";
import CategoriasAdmin from "./pages/admin/CategoriasAdmin.jsx";
import ProductosAdmin from "./pages/admin/ProductosAdmin.jsx";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin.jsx";
import LayoutAdmin from "./components/admin/LayoutAdmin.jsx";
import NotFoundPage from "./pages/admin/NotFoundPage.jsx";
import PrivateRoute from "./components/admin/PrivateRoute.jsx";
import GaleriaAdmin from "./pages/admin/GaleriaAdmin.jsx";

const snackbarStyles = {
  success: {
    backgroundColor: '#fdf6f0', 
    color: '#4e2a2a',           
    border: '1px solid #a0522d',
  },
  error: {
    backgroundColor: '#a0522d', 
    color: '#fff',
  },
  warning: {
    backgroundColor: '#fce9d4',
    color: '#5a2a2a',
  },
  info: {
    backgroundColor: '#ede0dc',
    color: '#4e2a2a',
  },
};

const SuccessSnackbar = React.forwardRef(({ message }, ref) => (
  <div
    ref={ref}
    style={{
      ...snackbarStyles.success,
      padding: '12px 16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif',
    }}
  >
    {message}
  </div>
));

const ErrorSnackbar = React.forwardRef(({ message }, ref) => (
  <div
    ref={ref}
    style={{
      ...snackbarStyles.error,
      padding: '12px 16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif',
    }}
  >
    {message}
  </div>
));

const WarningSnackbar = React.forwardRef(({ message }, ref) => (
  <div
    ref={ref}
    style={{
      ...snackbarStyles.warning,
      padding: '12px 16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif',
    }}
  >
    {message}
  </div>
));

const InfoSnackbar = React.forwardRef(({ message }, ref) => (
  <div
    ref={ref}
    style={{
      ...snackbarStyles.info,
      padding: '12px 16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif',
    }}
  >
    {message}
  </div>
));

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      Components={{
        success: SuccessSnackbar,
        error: ErrorSnackbar,
        warning: WarningSnackbar,
        info: InfoSnackbar,
      }}
    >
      <AuthProvider>
          <CuponProvider>
            <CartProvider> 
              <BrowserRouter>
                <Routes>
                  {/* ---------------- TIENDA PUBLICO ---------------- */}
                  <Route
                    path="/"
                    element={
                      <>
                        <Cabecera />
                        <Banner />
                        <ListaProductos vista="home" limiteProductos={4}/>
                        <CuponDescuento />
                        <Hero />
                        <Footer />
                      </>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Registro />} />

                  <Route
                    path="/carrito"
                    element={
                      <>
                        <Cabecera />
                        <Carrito />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/categorias"
                    element={
                      <>
                        <Cabecera />
                        <Categorias />
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/categorias/:id"
                    element={
                      <>
                        <Cabecera />
                        <CategoriaDetalle />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/productos"
                    element={
                      <>
                        <Cabecera />
                        <Productos />
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/productos/:id"
                    element={
                      <>
                        <Cabecera />
                        <ProductoDetalle />
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/contacto"
                    element={
                      <>
                        <Cabecera />
                        <Contacto />
                        <Footer />
                      </>
                    }
                  />


                  {/* ---------------- TIENDA PRIVADO ---------------- */}
                  <Route
                    path="/mi-cuenta"
                    element={
                      <PrivateRoute rolRequerido={2}>
                        <MiCuenta />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/mis-compras"
                    element={
                      <PrivateRoute rolRequerido={2}>
                        <MisCompras />
                      </PrivateRoute>
                    }
                  />

                  {/* ---------------- LOGIN GOOGLE CALLBACK ---------------- */}
                  <Route path="/oauth/callback" element={<OAuthCallback />} />

                  {/* ---------------- ADMINISTRACION ---------------- */}
                  <Route path="/admin" element={<HomeAdmin />} />

                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute rolRequerido={1}>
                        <LayoutAdmin />
                      </PrivateRoute>
                    }
                  >
                    <Route path="dashboard" element={<DashboardAdmin />} />
                    <Route path="usuarios" element={<UsuariosAdmin />} />
                    <Route path="categorias" element={<CategoriasAdmin />} />
                    <Route path="productos" element={<ProductosAdmin />} />
                    <Route path="galeria/:idProducto" element={<GaleriaAdmin />} />
                  </Route>

                  <Route path="/admin/*" element={<NotFoundPage />} />
                </Routes>

                {/* EL WIDGET DE CHAT (SOMMELIER AI)*/}
                <Box 
                  sx={{
                    position: 'fixed',
                    bottom: 24,         
                    right: 24,          
                    zIndex: 50,    
                    pointerEvents: 'none',   
                    maxWidth: '80vw',   
                    '@media (min-width:600px)': {
                    maxWidth: 350,    
                    }
                  }}
                >
                  <SharuAI />
                </Box>
              </BrowserRouter>
            </CartProvider>
          </CuponProvider>
        </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
