import React from 'react';

/**
 * Componente reutilizable para mostrar un diálogo de confirmación con contenido personalizado.
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Determina si el diálogo está visible.
 * @param {Function} props.onClose - Función para cerrar el diálogo.
 * @param {string} props.title - Título del diálogo.
 * @param {React.ReactNode} props.children - Contenido del diálogo.
 * @param {string} props.width - Ancho del diálogo (ej. 'w-96' para 24rem).
 * @param {boolean} props.showBackdrop - Si true, muestra un fondo oscurecido.
 * @param {string} props.backdropColor - Color del fondo (por defecto rgba(0,0,0,0.5)).
 * @param {Function} props.onConfirm - Función para acción de confirmación (opcional).
 * @param {string} props.confirmText - Texto del botón de confirmación (por defecto 'Confirmar').
 * @param {string} props.cancelText - Texto del botón de cancelar (por defecto 'Cancelar').
 * @param {string} props.confirmClass - Clase CSS para el botón de confirmación.
 * @param {boolean} props.showCloseButton - Si true, muestra un botón de cierre en la esquina.
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-[30rem]',
  showBackdrop = true,
  backdropColor = 'rgba(0, 0, 0, 0.5)',
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmClass = 'bg-[#5a2a2a] hover:bg-[#a0522d] text-[#fdf6f0]',
  showCloseButton = false
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: showBackdrop ? backdropColor : 'transparent' }}
    >
      <div
        className={`bg-[#fdf6f0] p-6 rounded-2xl shadow-2xl ${width} relative transition-transform transform scale-100`}
      >
        {/* Botón de cierre opcional */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-[#5a2a2a] hover:text-[#a0522d] transition-colors"
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

        {/* Título */}
        {title && (
          <h2 className="text-2xl font-semibold mb-4 text-[#5a2a2a] text-center tracking-wide">
            {title}
          </h2>
        )}

        {/* Contenido */}
        <div className="mb-6 text-gray-800 text-center leading-relaxed">
          {children}
        </div>

        {/* Botones */}
        <div className="flex justify-center space-x-3 mt-2">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-lg shadow-md transition-transform transform hover:scale-105 ${confirmClass}`}
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-[#5a2a2a] rounded-lg hover:bg-gray-300 transition-transform transform hover:scale-105 shadow-sm"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;