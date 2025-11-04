import React from 'react';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Filtros = ({ onFilterChange, categorias = [] }) => {
  const [categoria, setCategoria] = React.useState('');
  const [orden, setOrden] = React.useState('');
  const [busqueda, setBusqueda] = React.useState('');
  const [chipActivo, setChipActivo] = React.useState('');

  React.useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        categoria,
        orden,
        busqueda,
        chipActivo
      });
    }
  }, [categoria, orden, busqueda, chipActivo, onFilterChange]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        p: 3,
        boxShadow: 2, 
        borderRadius: '12px', 
        backgroundColor: '#fdf6f0',
      }}
    >
      {/* Chips */}
      {['Destacados', 'Sale', 'Envío Gratis'].map((label) => (
        <Chip
          key={label}
          label={label}
          clickable
          onClick={() => setChipActivo(chipActivo === label ? '' : label)} 
          sx={{ 
            fontSize: '0.875rem', 
            backgroundColor: chipActivo === label ? '#7a3a1a' : '#a0522d', 
            color: '#fdf6f0', 
            fontWeight: 600,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#7a3a1a',
            },
            transition: 'all 0.2s ease'
          }}
        />
      ))}

      {/* Select Categoría */}
       <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel sx={{ color: '#5a2a2a' }}>Categoría</InputLabel>
        <Select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          label="Categoría"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#a0522d' }, 
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#5a2a2a' }, 
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#5a2a2a', borderWidth: '2px' }, 
            color: '#5a2a2a',
            '& .MuiSvgIcon-root': { color: '#5a2a2a' } 
          }}
        >
          <MenuItem value="">Todas las categorías</MenuItem>
          {categorias.map((cat, index) => (
            <MenuItem key={`${cat}-${index}`} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Select Orden */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel sx={{ color: '#5a2a2a' }}>Ordenar por</InputLabel>
        <Select 
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          label="Ordenar por"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#a0522d' }, 
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#5a2a2a' }, 
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#5a2a2a', borderWidth: '2px' }, 
            color: '#5a2a2a', 
            '& .MuiSvgIcon-root': { color: '#5a2a2a' } 
          }}
        >
          <MenuItem value="">Sin orden</MenuItem>
          <MenuItem value="variedad">Variedad</MenuItem>
          <MenuItem value="precioAsc">Precio: Menor a mayor</MenuItem>
          <MenuItem value="precioDesc">Precio: Mayor a menor</MenuItem>
        </Select>
      </FormControl>

      {/* Buscador */}
      <TextField
        placeholder="Buscar productos..." 
        size="small"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        sx={{ minWidth: 220 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: '#5a2a2a' }} />
            </InputAdornment>
          ),
          sx: {
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#a0522d' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#5a2a2a' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#5a2a2a', borderWidth: '2px' },
            color: '#5a2a2a', 
          }
        }}
      />
    </Box>
  );
};

export default Filtros;
