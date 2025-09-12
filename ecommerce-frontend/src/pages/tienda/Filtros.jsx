import React from 'react';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Filtros = () => {
  const [categoria, setCategoria] = React.useState('');
  const [orden, setOrden] = React.useState('');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fdf6f0',
      }}
    >
      {/* Chips */}
      {['In Box', 'Más vendido', 'Sale', 'Envio Gratis'].map((label) => (
        <Chip
          key={label}
          label={label}
          variant="outlined"
          clickable
          sx={{ fontSize: '0.875rem', color: '#5a2a2a' }}
        />
      ))}

      {/* Select Categoría */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Categoria</InputLabel>
        <Select value={categoria} onChange={(e) => setCategoria(e.target.value)} label="Category">
          <MenuItem value="">Todas las categorias</MenuItem>
          <MenuItem value="Vino Tinto">Sales</MenuItem>
          <MenuItem value="Vino Tinto">Red Wine</MenuItem>
          <MenuItem value="Vino Blanco">White Wine</MenuItem>
          <MenuItem value="Vino Rosé">Rosé Wine</MenuItem>
        </Select>
      </FormControl>

      {/* Select Ordenar */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Buscar por</InputLabel>
        <Select value={orden} onChange={(e) => setOrden(e.target.value)} label="Sort By">
          <MenuItem value="variedad">Variedad</MenuItem>
          <MenuItem value="precioAsc">Precio: Menor a mayor</MenuItem>
          <MenuItem value="precioDesc">Precio: Mayor a menor </MenuItem>
        </Select>
      </FormControl>

      {/* Buscador */}
      <TextField
        placeholder="Search products..."
        size="small"
        sx={{ minWidth: 200 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default Filtros;
