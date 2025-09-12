import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/categorias')
      .then(res => setCategorias(res.data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {categorias.map(categoria => (
        <div
          key={categoria.id}
          className="cursor-pointer border rounded-lg shadow p-4 hover:bg-gray-100"
          onClick={() => navigate(`/categoria/${categoria.id}`)}
        >
          <img src={categoria.imagenUrl} alt={categoria.nombre} className="w-full h-40 object-cover rounded" />
          <h2 className="mt-2 text-xl font-semibold text-center">{categoria.nombre}</h2>
        </div>
      ))}
    </div>
  );
};

export default Categorias;
