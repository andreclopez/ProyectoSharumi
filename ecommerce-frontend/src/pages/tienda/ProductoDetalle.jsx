import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const ProductoDetalle = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [mensaje, setMensaje] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3001/api/productos/${id}`)
        .then(res => setProducto(res.data))
        .catch(err => console.error('Error al traer mensaje:', err.response?.data || err));

        axios.get(`http://localhost:3001/api/productos/${id}/mensajes`)
        .then(res => setMensaje(res.data))
        .catch(err => console.error('Error al traer mensaje:', err.response?.data || err));
    }, [id]);

    const enviarMensaje = async () => {
        if (!nuevoMensaje.trim()) 
            return;
        await axios.post(`http://localhost:3001/api/productos/${id}/mensajes`, { texto: nuevoMensaje });
        setNuevoMensaje('');
        const res = await axios.get(`http://localhost:3001/api/productos/${id}/mensajes`);
        setMensaje(res.data);
    }

    if (!producto) return <p> Cargando producto... </p>;
    
    return (
    <div>
        <h2>{producto.nombre}</h2>
        <p> Precio: ${producto.precio}</p>

        <h3>Mensajes</h3>
        {mensaje.map((msg) => (
            <p key={msg.id}>{msg.texto}</p>
        ))}

        <textarea value={nuevoMensaje}
        onChange={e => 
            setNuevoMensaje(e.target.value)}/>
        <button onClick={enviarMensaje}>
            Enviar Mensaje
        </button>
    </div>
  )
}

export default ProductoDetalle