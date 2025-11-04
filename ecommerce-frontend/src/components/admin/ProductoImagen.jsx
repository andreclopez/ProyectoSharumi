
const ProductoImagen = ({ images, selectedImage, setSelectedImage, fallbackImage }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="main-image w-full max-w-md bg-white rounded-lg overflow-hidden mb-4">
        <img
          alt="Producto Principal"
          className="w-full h-auto object-cover"
          src={images[selectedImage]?.apiUrl || fallbackImage}
        />
      </div>

      <div className="flex space-x-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`thumbnail w-20 h-20 rounded-md overflow-hidden transition duration-200 ${
              selectedImage === index ? "outline-2 outline-primary outline-offset-2" : ""
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img
              alt={`Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
              src={image.apiUrl}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductoImagen;
