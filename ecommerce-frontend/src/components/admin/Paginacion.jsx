import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Constante para el marcador de elipsis
const DOTS = '...';

/**
 * Hook personalizado para calcular el rango de paginación con lógica de elipsis.
 * @param {number} currentPage - La página activa actual.
 * @param {number} totalPages - El número total de páginas.
 * @param {number} siblingCount - Cuántos números de página mostrar a cada lado de la actual.
 * @returns {Array<number|string>} - Un array como [1, '...', 4, 5, 6, '...', 10]
 */
const usePagination = ({ currentPage, totalPages, siblingCount = 1 }) => {
  const paginationRange = React.useMemo(() => {
    // 1. Números a mostrar = hermanos + primera pág + última pág + pág actual + 2xDOTS
    const totalPageNumbers = siblingCount + 5;

    // Caso 1: Si el total de páginas es menor que los números que queremos mostrar,
    // mostramos todos los números de página sin elipsis.
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calcular los índices de los hermanos izquierdo y derecho
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Decidir si mostramos elipsis a la izquierda o derecha
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Caso 2: No hay elipsis izquierda, pero sí derecha.
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }

    // Caso 3: No hay elipsis derecha, pero sí izquierda.
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Caso 4: Hay elipsis en ambos lados.
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [currentPage, totalPages, siblingCount]);

  return paginationRange || [];
};


// El componente de Paginación en sí
const Pagination = ({ onPageChange, totalPages, currentPage, totalItems = 0, itemsPerPage = 0 }) => {
  
  const paginationRange = usePagination({ currentPage, totalPages });

  // Si solo hay una página, no renderizamos nada
  if (currentPage === 0 || totalPages < 2) {
    return null;
  }

  const onNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex justify-between items-center mt-6">
      {/* Información de Registros */}
       <div className="text-sm text-[#5a2a2a]">
        Mostrando{" "}
        <span className="font-medium">{itemsPerPage}</span> de{" "}
        <span className="font-medium">{totalItems}</span> registros
      </div>

      {/* Controles de Paginación */}
      <div className="flex space-x-1 sm:space-x-2">
        {/* Botón Anterior */}
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-1 rounded-md border transition-colors duration-200 ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#fdf6f0] text-[#5a2a2a] border-[#a0522d] hover:bg-[#7a3b2a] hover:text-[#fdf6f0]"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Números de Página */}
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return <span key={`${DOTS}-${index}`} className="px-3 py-1 text-gray-500">...</span>;
          }

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-1 rounded-md border transition-colors duration-200 ${
                currentPage === pageNumber
                  ? "bg-[#a0522d] text-[#fdf6f0] shadow-md border-[#5a2a2a]"
                  : "bg-[#fdf6f0] text-[#5a2a2a] border-[#a0522d] hover:bg-[#7a3b2a] hover:text-[#fdf6f0]"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Botón Siguiente */}
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-1 rounded-md border transition-colors duration-200 ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#fdf6f0] text-[#5a2a2a] border-[#a0522d] hover:bg-[#7a3b2a] hover:text-[#fdf6f0]"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;