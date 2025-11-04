import React from 'react';

const RenderSkeletonRows = ({ itemsPerPage = 10, columns = 6 }) => {
  // Estilos para la animación de la barra de progreso
  const progressAnimationStyle = `
    .animate-progress {
      animation: progress 2s infinite;
    }
    @keyframes progress {
      0% {
        width: 0%;
      }
      100% {
        width: 100%;
      }
    }
  `;

  const renderSkeletonRows = () => {
    return Array.from({ length: itemsPerPage }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        {index === 0 ? (
          // Primera fila con barra de progreso animada
          <>
            <td colSpan={columns} className="px-6 py-4">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full animate-progress" style={{width: '0%'}}></div>
              </div>
            </td>
          </>
        ) : (
          // Filas normales del skeleton
          <>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </td>
            ))}
          </>
        )}
      </tr>
    ));
  };

  return (
    <>
      <style>{progressAnimationStyle}</style>
      {renderSkeletonRows()}
    </>
  );
};

export default RenderSkeletonRows;