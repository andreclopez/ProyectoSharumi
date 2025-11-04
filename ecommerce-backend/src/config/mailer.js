import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Creamos el "transportador" usando .env
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Función para enviar el email de notificación al admin por producto/mensaje
export const enviarEmailNotificacionAdmin = async (mensaje, producto) => {
  const mailOptions = {
    from: `"Sharumi Ecommerce" <${process.env.EMAIL_USER}>`, 
    to: process.env.EMAIL_USER, 
    subject: `Nuevo mensaje en el producto: ${producto.nombre}`, 
    html: `
      <h1>¡Nuevo Mensaje Recibido!</h1>
      <p>Un usuario ha dejado un nuevo mensaje en tu tienda.</p>
      <hr>
      <p><strong>Producto:</strong> ${producto.nombre} (ID: ${producto.id})</p>
      <p><strong>Autor:</strong> ${mensaje.usuario.nombre} (${mensaje.usuario.email})</p>
      <p><strong>Mensaje:</strong></p>
      <blockquote>${mensaje.texto}</blockquote>
      <hr>
      <p>Puedes responder o moderar este comentario desde tu panel de administración.</p>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de notificación al admin enviado exitosamente.');
  } catch (error) {
    console.error('Error al enviar el email de notificación al admin:', error);
  }
};

// Función para notificar al admin por formulario de contacto
export const enviarConsultaContacto = async (nombre, email, mensaje) => {
  const contentHTML = `
    <h1>Nueva consulta desde la web de Sharumi</h1>
    <p><strong>De:</strong> ${nombre}</p>
    <p><strong>Email:</strong> ${email}</p>
    <h2>Mensaje:</h2>
    <p>${mensaje}</p>
  `;

  const mailOptions = {
    from: `"Sharumi Web" <${process.env.EMAIL_USER}>`, 
    to: process.env.EMAIL_USER, 
    subject: `Nueva consulta de ${nombre}`, 
    html: contentHTML, 
    replyTo: email, 
  };

  try {
    // Usamos el transportador que ya definiste
    await transporter.sendMail(mailOptions);
    console.log('✅ Correo de contacto enviado con éxito.');
    return true; // Indicamos que fue exitoso
  } catch (error) {
    console.error('❌ Error al enviar el correo de contacto:', error);
    // Relanzamos el error para que el controlador lo maneje
    throw new Error('Error de servicio al enviar el correo.'); 
  }
};

// Función para notificaciones al cliente
export const enviarEmailConfirmacionCliente = async (mensaje, producto) => {
  const mailOptions = {
    from: `"Sharumi Ecommerce" <${process.env.EMAIL_USER}>`, 
    to: mensaje.usuario.email, 
    subject: `¡Hemos recibido tu mensaje sobre ${producto.nombre}!`, 
    html: `
      <h1>¡Gracias por tu mensaje, ${mensaje.usuario.nombre}!</h1>
      <p>Hemos recibido correctamente tu pregunta sobre el producto <strong>${producto.nombre}</strong>.</p>
      <p>La revisaremos y te responderemos lo antes posible.</p>
      <hr>
      <p><strong>Tu mensaje fue:</strong></p>
      <blockquote>${mensaje.texto}</blockquote>
      <hr>
      <p>Gracias por tu interés en Sharumi Ecommerce.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de confirmación al cliente enviado exitosamente.');
  } catch (error) {
    console.error('Error al enviar el email de confirmación al cliente:', error);
  }
};
 