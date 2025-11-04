
const ProductoFiles = ({ files, onDownload }) => {
  if (!files || files.length === 0) return <p>No hay archivos asociados.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-secondary rounded-lg p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <span className="material-icons text-5xl text-primary mb-4">
            book
          </span>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {file.nombreOriginal}
          </h3>
          <button
            className="mt-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-accent rounded-full hover:bg-primary transition-colors"
            onClick={() => onDownload(file.nombre)}
          >
            <span className="material-icons mr-2 text-base">
              download
            </span>
            Descargar
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductoFiles;
