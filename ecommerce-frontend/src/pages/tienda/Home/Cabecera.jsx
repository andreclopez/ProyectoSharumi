import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import WineBarIcon from '@mui/icons-material/WineBar';
import { useAuth } from "../../../context/AuthContext";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { useCart } from '../../../hooks/useCart';

const pages = [
  { nombre: 'Home', ruta: '/' },
  { nombre: 'Productos', ruta: '/productos' },
  { nombre: 'Categorias', ruta: '/categorias' },
  { nombre: 'Contacto', ruta: '/contacto' }
];

function Cabecera() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const userSettings = user
    ? [
        { nombre: "Mi cuenta", ruta: "/mi-cuenta" },
        { nombre: "Mis compras", ruta: "/mis-compras" },
        { nombre: "Salir", action: handleLogout },
      ]
    : [{ nombre: "Ingresá", ruta: "/login" }];

    const isAdmin = user && user.idRol === 1;

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#5a2a2a' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo escritorio */}
          <WineBarIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#a0522d' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem', 
              color: '#a0522d', 
              textDecoration: 'none',
            }}
          >
            SHARUMI
          </Typography>

          {/* Menú mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} sx={{ color: '#a0522d' }}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.nombre} 
                  onClick={handleCloseNavMenu} 
                  component={Link} 
                  to={page.ruta}
                  sx={{ 
                    '&:hover': { backgroundColor: '#fdf6f0' } 
                  }}
                >
                  <Typography textAlign="center" color="#a0522d">{page.nombre}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>


          {/* Logo mobile */}
          <WineBarIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#a0522d' }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#a0522d',
              textDecoration: 'none',
            }}
          >
            SHARUMI
          </Typography>

          {/* Menú escritorio */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 'auto' }}>
            {pages.map((page) => (
              <Button
                key={page.nombre}
                component={Link}
                to={page.ruta}
                sx={{ 
                  my: 2, 
                  color: '#a0522d', 
                  display: 'block',
                  fontWeight: 600, 
                  '&:hover': {
                    backgroundColor: 'rgba(90, 42, 42, 0.1)', 
                  }
                }}
              >
                {page.nombre}
              </Button>
            ))}
          </Box>

          {/* Icono del carrito */}
          <Box sx={{ ml: 2 }}>
            <IconButton component={Link} to="/carrito" sx={{ color: '#a0522d' }}>
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

          {/* Botón visible solo si es admin */}
            {isAdmin && (
              <Button
                component={Link}
                to="/admin/dashboard"
                variant="outlined"
                sx={{
                  color: '#a0522d',
                  borderColor: '#a0522d',
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(160, 82, 45, 0.1)',
                    borderColor: '#a0522d',
                  },
                }}
              >
                Ir al Dashboard
              </Button>
            )}
          </Box>

          {/* Avatar y menú de usuario */}
          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <Tooltip title="Abrir opciones">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.nombre || "Usuario"} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {userSettings.map((setting) => (
                <MenuItem
                  key={setting.nombre}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting.action) setting.action();
                  }}
                  component={setting.ruta ? Link : "div"}
                  to={setting.ruta}
                  sx={{ color: '#a0522d' }}
                >
                  <Typography textAlign="center">{setting.nombre}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Cabecera;
