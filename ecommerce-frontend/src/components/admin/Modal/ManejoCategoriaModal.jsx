import React, { useState, useEffect } from 'react';
import Modal from '../../../components/admin/Modal/Modal.jsx';
import * as toast from '../../../utils/toast.js';

const ManejoCategoriaModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    editingCategory 
}) => {
    const isEditing = !!editingCategory;
    
    const [formData, setFormData] = useState({
        nombre: editingCategory?.nombre || '',
        descripcion: editingCategory?.descripcion || '', 
        activa: editingCategory?.activa ?? true, 
        portada: null, 
        existingImageUrl: editingCategory?.fullImagenUrl || '',
    });

    const [previewImage, setPreviewImage] = useState(formData.existingImageUrl);

    useEffect(() => {
        if (formData.portada) {
            setPreviewImage(URL.createObjectURL(formData.portada));
        } else if (!isEditing) {
            setPreviewImage('');
        }
    }, [formData.portada, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] || null });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim()) {
            toast.error('El nombre de la categoría es obligatorio.');
            return;
        }
        onSave(e, formData, editingCategory);
    };
    
    return (
        <Modal
            isOpen={isOpen} 
            onClose={onClose}
            title={isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}
            width='max-w-lg'
        >
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                {/* Nombre */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-[#5a2a2a]">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-[#a0522d] p-2 focus:outline-none focus:ring-2 focus:ring-[#5a2a2a]/50"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-[#5a2a2a]">
                        Descripción
                    </label>
                    <input
                        type="text"
                        name="descripcion"
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-[#a0522d] p-2 focus:outline-none focus:ring-2 focus:ring-[#5a2a2a]/50"
                    />
                </div>

                {/* Activa */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="activa"
                        id="activa"
                        checked={formData.activa}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#a0522d] border-[#5a2a2a] rounded focus:ring-[#a0522d]"
                    />
                    <label htmlFor="activa" className="ml-2 block text-sm font-medium text-[#5a2a2a]">
                        Categoría Activa
                    </label>
                </div>

                {/* Portada */}
                <div>
                    <label htmlFor="portada" className="block text-sm font-medium text-[#5a2a2a]">
                        Portada (Imagen principal)
                    </label>
                    <input
                        type="file"
                        name="portada"
                        id="portada"
                        accept="image/*"
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-[#a0522d] p-2 focus:outline-none focus:ring-2 focus:ring-[#5a2a2a]/50 cursor-pointer"
                    />
                    {previewImage && (
                        <img 
                            src={previewImage} 
                            alt="Vista Previa Portada" 
                            className="mt-2 max-h-40 w-full object-contain rounded-md border p-2"
                        />
                    )}
                </div>

                {/* Botones */}
                <div className="flex justify-start gap-2 pt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#5a2a2a] text-[#fdf6f0] rounded-md hover:bg-[#a0522d]"
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ManejoCategoriaModal;
