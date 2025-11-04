import { enviarConsultaContacto } from '../config/mailer.js'; 

const manejarEnvioContacto = async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    await enviarConsultaContacto(nombre, email, mensaje); 

    res.status(200).json({ message: 'Mensaje enviado con éxito.' });

  } catch (error) {
    console.error('❌ Error en el controlador de contacto:', error.message);
    res.status(500).json({ error: 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.' });
  }
};

export default manejarEnvioContacto;