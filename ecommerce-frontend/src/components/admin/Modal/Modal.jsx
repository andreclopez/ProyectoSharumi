import React from 'react';

/**
 * Componente reutilizable para mostrar un modal con contenido personalizado.
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Determina si el modal está visible.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {string} props.title - Título del modal.
 * @param {React.ReactNode} props.children - Contenido del modal.
 * @param {string} props.width - Ancho del modal (ej. 'max-w-lg' para formularios).
 * @param {boolean} props.showBackdrop - Si true, muestra un fondo oscurecido.
 * @param {string} props.backdropColor - Color del fondo (por defecto rgba(0,0,0,0.5)).
 * @param {boolean} props.showCloseButton - Si true, muestra un botón de cierre en la esquina.
 * @param {string} props.customClass - Clases CSS adicionales para personalizar el modal.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'max-w-lg',
  showBackdrop = true,
  backdropColor = 'rgba(0, 0, 0, 0.5)',
  showCloseButton = true,
  customClass = ''
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#5a2a2a] bg-opacity-30 backdrop-blur-sm"
      style={{ backgroundColor: showBackdrop ? backdropColor : 'transparent' }}
    >
      <div className={`rounded-lg shadow-xl w-full ${width} overflow-hidden relative ${customClass}`}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-300 hover:text-[#fdf6f0]"
            aria-label="Cerrar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {title && (
          <div className="p-4 bg-[#5a2a2a] border-b border-[#5a2a2a]">
            <h2 className="text-xl font-semibold text-[#fdf6f0]">{title}</h2>
          </div>
        )}

        <div className="bg-[#fdf6f0] text-[#5a2a2a]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
