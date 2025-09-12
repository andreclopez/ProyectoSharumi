import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cabecera from "./pages/tienda/Cabecera.jsx";
import Banner from "./pages/tienda/Banner.jsx";
import Filtros from "./pages/tienda/Filtros.jsx";
import ListaProductos from "./pages/tienda/ListaProductos.jsx";
import Hero from "./pages/tienda/Hero.jsx";
import Footer from "./pages/tienda/Footer.jsx";
import Categorias from "./pages/tienda/Categorias.jsx";
import CategoriaId from "./pages/tienda/CategoriaId.jsx";
import CuponDescuento from "./pages/tienda/CuponDescuento.jsx";
import { CuponProvider } from "./context/CuponContext.jsx";
import ProductoDetalle from "./pages/tienda/ProductoDetalle.jsx";

// Pages admin
import DashboardAdmin from "./pages/admin/DashboardAdmin.jsx";
import CategoriasAdmin from "./pages/admin/CategoriasAdmin.jsx";
import ProductosAdmin from "./pages/admin/ProductosAdmin.jsx";
import LayoutAdmin from "./components/admin/LayoutAdmin.jsx";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin.jsx";

function App() {
  return (
    <CuponProvider>
      <BrowserRouter>
        <Routes>
          {/* TIENDA */}
          <Route
            path="/"
            element={
              <>
                <Cabecera />
                <Banner />
                <Filtros />
                <ListaProductos />
                <CuponDescuento />
                <Hero />
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
            path="/categoria/:id"
            element={
              <>
                <Cabecera />
                <CategoriaId />
                <Footer />
              </>
            }
          />
          <Route
            path="/producto/:id"
            element={
              <>
                <Cabecera />
                <ProductoDetalle />
                <Footer />
              </>
            }
          />

          {/* ADMINISTRACION */}
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="productos" element={<ProductosAdmin />} />
            <Route path="usuarios" element={<UsuariosAdmin />} /> 
          </Route>
        </Routes>
      </BrowserRouter>
    </CuponProvider>
  );
}

export default App;
