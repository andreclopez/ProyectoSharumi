import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import Modal from '../../components/admin/Modal/Modal.jsx';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog.jsx';
import Pagination from '../../components/admin/Paginacion.jsx';
import RenderSkeletonRows from '../../components/admin/RenderSkeletonRows.jsx';
import useAuthStore from '../../store/authStore.js';
import productoService from '../../services/productoService.js';
import categoriaService from '../../services/categoriaService.js';
import { Box, Search, Filter, Plus } from "lucide-react";
import ImageIcon from '@mui/icons-material/Image';
import { IconButton, TableContainer } from '@mui/material';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteForever from '@mui/icons-material/DeleteForever';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import * as toast from '../../../src/utils/toast.js';

const API_URL = '/productos';

const ProductosAdmin = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  // Datos
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState(null);

  // Confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [prodToDelete, setProdToDelete] = useState(null);

  // FormData inicial
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    portada: null, 
    galeria: [], 
    precio: '',
    stock: '',
    oferta: false,
    descuento: 0,
    idCategoria: '',
    idUsuario: 9,
    activo: true,
  });

  // Obtener la lista de categorías
  const fetchCategorias = useCallback(async () => {
    try {
      
      const res = await categoriaService.obtenerCategorias(); 
      setCategorias(res.data.data || []); 
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  }, []);

  // FETCH
  const fetchProductos = useCallback(async () => {
    setCargando(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || undefined,
        sort: sortField,
        direction: sortDirection,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };

      const res = await api.get(API_URL, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      setProductos(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalItems(res.data.pagination?.totalItems || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error cargando productos');
      setProductos([]);
      toast.error('Error cargando productos');
    } finally {
      setCargando(false);
    }
  }, [currentPage, debouncedSearchTerm, sortField, sortDirection, statusFilter, token, itemsPerPage]);

  useEffect(() => { 
    fetchProductos();
    fetchCategorias();
  }, [fetchProductos, fetchCategorias]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // FILTROS LOCALES
  const productosFiltrados = productos.filter(u => {
    const coincideBusqueda = `${u.nombre} ${u.precio} ${u.descuento}`.toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
    const coincideEstado = statusFilter === 'all' || String(u.activo) === statusFilter;
    return coincideBusqueda && coincideEstado;
  }); 

  // HANDLERS
  const handleInputChange = (e) => {
    const { name, type, checked, value, files, multiple } = e.target;
    if (type === 'file') {
      if (multiple) {
        setFormData(prev => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditingProd(prod);
      setFormData({
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        portada: null,
        galeria: [], 
        precio: prod.precio,
        stock: prod.stock,
        oferta: prod.oferta,
        descuento: prod.descuento,
        idCategoria: prod.idCategoria,
        idUsuario: parseInt(prod.idUsuario) || 9,
        activo: prod.activo,
      });
    } else {
      setEditingProd(null);
      setFormData({
        nombre: '',
        descripcion: '',
        portada: null,
        galeria: [],
        precio: '',
        stock: '',
        oferta: false,
        descuento: 0,
        idCategoria: '',
        idUsuario: 9,
        activo: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingProd && !formData.portada) {
      toast.error('Debe seleccionar una portada para crear un producto.');
      return;
    }

    const tieneGaleria = formData.galeria.length > 0;
    
    const updateDataJson = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio), 
        stock: parseInt(formData.stock),     
        oferta: formData.oferta,
        descuento: parseInt(formData.descuento),
        idCategoria: formData.idCategoria,
        idUsuario: parseInt(formData.idUsuario) || 9,
        activo: formData.activo,
    };

    try {
      let productoGuardado;

      if (editingProd) {
        
        if (formData.portada) {
            const portadaData = new FormData();
            portadaData.append('portada', formData.portada);
            await productoService.actualizarPortada(editingProd.id, portadaData); 
            toast.success('Portada actualizada');
        } 
        
        const res = await productoService.actualizarProducto(editingProd.id, updateDataJson); 
        productoGuardado = res.data.data;
        toast.success('Producto actualizado (texto y/o portada)');
        
      } else {
        
        const createData = new FormData();
        for (const key in updateDataJson) { createData.append(key, updateDataJson[key]); }
        createData.append('portada', formData.portada); 
        
        const res = await productoService.crearProducto(createData);
        productoGuardado = res.data.data;
        toast.success('Producto creado exitosamente');
      }
      
      if (tieneGaleria) {
          const idProducto = editingProd ? editingProd.id : productoGuardado.id;
          const galeriaData = new FormData();
          
          formData.galeria.forEach(file => galeriaData.append('archivos', file)); 

          await productoService.subirGaleria(idProducto, galeriaData); 
          toast.success('Galería subida/actualizada');
      }
   
    handleCloseModal();
    fetchProductos();

  } catch (err) {
    console.error(err);
    toast.error('Error al guardar o crear producto');
  }
};

  const handleUpdatePortada = async (prodId, file) => {
    try {
      const data = new FormData();
      data.append('portada', file);
      await productoService.actualizarPortada(prodId, data, token); 
      toast.success('Portada actualizada');
      fetchProductos();
    } catch (err) {
      console.error(err);
      toast.error('Error actualizando la portada');
    }
  };

  // Ir a galeria
  const handleGoToGaleria = (idProducto) => {
    navigate(`/admin/galeria/${idProducto}`); 
  };

  // Eliminar producto
  const handleDelete = (producto) => {
    setProdToDelete(producto);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await productoService.eliminarProducto(prodToDelete.id);
      toast.success(`Producto "${prodToDelete.nombre}" eliminado correctamente`);
      fetchProductos();
    } catch (error) {
      toast.error("Error al eliminar producto");
      console.error(error);
    } finally {
      setShowDeleteConfirm(false);
      setProdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProdToDelete(null);
  };

  const handleToggleActivo = async (prod) => {
    try {
      const updated = { activo: !prod.activo };
      await productoService.actualizarProducto(prod.id, updated);
      fetchProductos();
      toast.success(`Producto cambiado a ${updated.activo ? 'activo' : 'inactivo'}`);
    } catch (err) {
      console.error(err);
      toast.error('Error cambiando el estado de producto');
    }
  };

  const handleSort = (column) => {
    if (sortField === column) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    else setSortField(column);
    setCurrentPage(1);
  };

  return (
    <div className="w-full p-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#5a2a2a] flex items-center">
            <Box className="mr-2" />
            Gestión de Productos
          </h2>
          <p className="text-[#5a2a2a] mt-1">Administra los productos del sistema</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar producto..."
              className="pl-10 pr-4 py-2 border border-[#5a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0522d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#5a2a2a]" />
          </div>
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-[#5a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0522d]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-[#5a2a2a]" />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#a0522d] to-[#5a2a2a] text-[#fdf6f0] rounded-lg hover:from-[#5a2a2a] hover:to-orange-800 transition-all duration-200 shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="w-full max-w-lg rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#fdf6f0' }}>
            <div className="bg-[#5a2a2a] p-4">
              <h2 className="text-[#fdf6f0] text-lg font-semibold">
                {editingProd ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
            </div>
            <div className="p-6 text-[#5a2a2a]">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre del producto" required className="p-2 border border-[#5a2a2a] rounded" />
                <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" className="p-2 border border-[#5a2a2a] rounded" />
                <input type="file" name="portada" onChange={handleInputChange} accept="image/*" className="p-2 border border-[#5a2a2a] rounded" />
                {editingProd && editingProd.galeriaUrls && editingProd.galeriaUrls.length > 0 && (
                  <div className="mt-2 p-2 border border-gray-300 rounded">
                    <p className="text-sm font-semibold mb-2">Imágenes de la Galería ({editingProd.galeriaUrls.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {editingProd.galeriaUrls.map((url, index) => (
                        <img 
                          key={index}
                          src={`${import.meta.env.VITE_API_URL.replace('/api','')}${url}`}
                          alt={`Galería ${index + 1}`}
                          className="w-16 h-16 object-cover rounded shadow-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
                <input type="file" name="galeria" multiple onChange={handleInputChange} accept="image/*" className="p-2 border border-[#5a2a2a] rounded" />
                <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} placeholder="Precio" required className="p-2 border border-[#5a2a2a] rounded" />
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock" required className="p-2 border border-[#5a2a2a] rounded" />
                <input type="number" name="descuento" value={formData.descuento} onChange={handleInputChange} placeholder="Descuento" className="p-2 border border-[#5a2a2a] rounded" />
                <select
                    name="idCategoria"
                    value={formData.idCategoria}
                    onChange={handleInputChange}
                    required
                    className="p-2 border border-[#5a2a2a] rounded"
                >
                  <option value="" disabled>Selecciona una Categoría *</option>
                    {cargando && <option disabled>Cargando categorías...</option>}
                    {/* Mapear las categorías cargadas */}
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="oferta" checked={formData.oferta} onChange={handleInputChange} />
                  <span>Oferta</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleInputChange} />
                  <span>Activo</span>
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="bg-[#5a2a2a] text-[#fdf6f0] hover:bg-[#a0522d] px-4 py-2 rounded">Guardar</button>
                  <button type="button" onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Tabla */}
      {!cargando && !error && (
        <>

        <div style={{ position: 'relative', zIndex: 1, marginTop: '1.5rem', marginBottom: '1rem' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        <TableContainer sx={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#5a2a2a] text-[#fdf6f0]">
                <th className="py-2 px-4">Portada</th>
                <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('nombre')}>Nombre</th>
                <th className="py-2 px-4">Descripción</th>
                <th className="py-2 px-4 text-right">Precio</th>
                <th className="py-2 px-4 text-right">Stock</th>
                <th className="py-2 px-4 text-right">Descuento</th>
                <th className="py-2 px-4">Oferta</th>
                <th className="py-2 px-4">Categoría</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados
                .map(u => (
                  <tr
                    key={u.id}
                    className="border-b border-[#5a2a2a]/20 hover:bg-[#fdf6f0]/70 transition-colors duration-200"
                  >
                    <td className="py-2 px-4">
                      <div className="relative group w-16 h-16 rounded overflow-hidden z-0">
                        {u.imagenUrl && (
                          <>
                            <img
                              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${u.imagenUrl}`}
                              alt={u.nombre}
                              className="w-16 h-16 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                              title="Cambiar portada"
                            />
                            <label
                              title="Cambiar portada"
                              className="absolute inset-0 bg-[#5a2a2a] bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white text-xs font-semibold"
                            >
                              Cambiar
                              <input
                                type="file"
                                hidden
                                onChange={(e) => handleUpdatePortada(u.id, e.target.files[0])}
                              />
                            </label> 
                          </> 
                        )} 
                      </div> 
                    </td>
                    <td className="py-2 px-4">{u.nombre}</td>
                    <td className="py-2 px-4">{u.descripcion}</td>
                    <td className="py-2 px-4 !text-right">{u.precio}</td>
                    <td className="py-2 px-4 !text-right">{u.stock}</td>
                    <td className="py-2 px-4 !text-right">{u.descuento}</td>
                    <td className="py-2 px-4">{u.oferta ? 'Sí' : 'No'}</td>
                    <td className="py-2 px-4">{u.categoria ? u.categoria.nombre : 'Sin Categoría'}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.activo? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-2 px-4 flex space-x-2 items-center relative z-20">
                      <IconButton 
                        onClick={() => handleGoToGaleria(u.id)} 
                        style={{ color: '#a0522d' }} 
                        title="Ver Galería"
                      >
                        <ImageIcon /> 
                      </IconButton>
                      <IconButton onClick={() => handleOpenModal(u)} style={{ color: '#5a2a2a' }}>
                        <EditSquareIcon />
                      </IconButton>
                      <IconButton onClick={() => handleToggleActivo(u)} style={{ color: '#5a2a2a' }}>
                        {u.activo ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton>
                      <IconButton onClick={() => handleDelete(u)} style={{ color: '#a0522d' }}>
                        <DeleteForever />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        </>
      )}

      {showDeleteConfirm && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Eliminar Producto" 
          confirmClass="bg-[#5a2a2a] hover:bg-[#a0522d] text-[#fdf6f0]" 
          width="w-[32rem]" 
        >
          <p className="text-gray-700 text-base text-center">
            ⚠️ El producto **"{prodToDelete?.nombre}"** se eliminará permanentemente. ¿Deseas continuar?
          </p>
        </ConfirmationDialog>
      )}

      {cargando && <RenderSkeletonRows />}
    </div>
  );
};

export default ProductosAdmin;
