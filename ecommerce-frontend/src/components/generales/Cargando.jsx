
/**
 * Componente para mostrar un indicador de carga
 */
const Cargando = ({ mensaje = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-lg text-gray-400">{mensaje}</p>
    </div>
  );
};



export default Cargando;
