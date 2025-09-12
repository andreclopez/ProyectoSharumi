import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoriaId = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    axios.get(`/api/categoria/${id}`)
      .then(res => setCategoria(res.data))
      .catch(err => console.error('Error:', err));
  }, [id]);

  if (!categoria) return <p className="text-center mt-10">Cargando categoría...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{categoria.nombre}</h1>
      <img src={categoria.imagenUrl} alt={categoria.nombre} className="w-full max-w-md mx-auto rounded shadow" />
    </div>
  );
};

export default CategoriaId;
