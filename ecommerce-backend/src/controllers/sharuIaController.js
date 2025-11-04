import { generateContent, generateContentWithHistory } from "../config/gemini.js";
import { Producto } from "../models/index.js";

export const controladorConsultaIA = async (req, res) => {
  try {
    const { pregunta, historial } = req.body;

    if (!pregunta) return res.status(400).json({ error: "Falta la pregunta" });

    // Formatear historial
    const historialFormatoGemini = historial.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user', 
        parts: msg.parts
    }));

    // === CONTEXTOS ===
    const INFO_BASE = {
      VARIOS: `
Sharumi es un e-commerce que tiene como objetivo la comercialización de vino argentino con identidad cultural profunda. 
Basado en la producción local en Argentina y con distribución en todo el país, Sharumi busca conectar mundos a través de un producto que es símbolo de encuentro, historia y pertenencia. 
Además de ser una propuesta comercial, Sharumi representa una narrativa personal: una herencia viva que cruza fronteras, una raíz que florece en múltiples latitudes.  
Responde basándote en este contexto general si la pregunta es sobre la plataforma o su filosofía.
      `,

      ENVIOS: `
Sharumi ofrece opciones de entregas locales.
Después de confirmar una compra, el comprador y el vendedor coordinan la entrega directamente.
Los métodos disponibles incluyen:
- Retiro en punto acordado (disponible para capital y Gran Buenos Aires).
- Entregas a domicilio mediante Correo Argentino o Andreani.
Responde con base en este contexto si la pregunta trata sobre envíos o logística.
      `,

      PRODUCTOS: `
Los productos que ofrece Sharumi son enteramente de origen nacional. 
Cada uno muestra su región origen, características, precio, stock y posibles descuentos activos.
Algunos tienen etiquetas especiales como "Producto Destacado" o "Edición Limitada".
A continuación se incluye la lista actual de productos disponibles.
Responde únicamente con base en esta lista y evita inventar productos.
Si no hay coincidencias, indica que no está disponible actualmente.
      `,

      USUARIOS: `
En Sharumi actualmente existen 2 tipos de usuarios:

- **Cliente:** Puede navegar, comprar, aplicar cupones y enviar mensajes a los vendedores.
- **Administrador:** Supervisa usuarios, categorías, mensajes, cupones y órdenes de compra.

El registro es simple y seguro. Por defecto, todos los usuarios inician como clientes.

Próximamente, se preve la creación de un tercer tipo de usuario:

- **Vendedor:** Podrá solicitar dicho rol desde su perfil y, una vez aprobado, publicar, gestionar y comercializar los productos.

Responde con base en este contexto si se consulta sobre roles, permisos o registro.
      `
    };

    // === PASO 1: Clasificación ===
    const textoFiltro = `
Clasifica la siguiente pregunta en una de estas categorías: VARIOS, ENVIOS, PRODUCTOS o USUARIOS.
Solo responde con una palabra exacta.
Pregunta: "${pregunta}"
    `;

    const responseFiltro = await generateContent(textoFiltro, {
        maxOutputTokens: 10, 
        temperature: 0.0,
    });

    let palabraClave = responseFiltro.text.trim().toUpperCase();

    if (!["VARIOS", "ENVIOS", "PRODUCTOS", "USUARIOS"].includes(palabraClave)) {
      console.warn(`Clasificación inesperada: ${palabraClave}. Usando VARIOS por defecto.`);
      palabraClave = "VARIOS";
    }

    console.log("Categoría detectada:", palabraClave);

    // === PASO 2: Construcción del Prompt ===
    let contextoEspecial = "";

    if (palabraClave === "PRODUCTOS") {
      try {
        const productosDB = await Producto.findAll({
          attributes: ["nombre", "precio", "stock"],
        });

        if (productosDB.length === 0) {
            contextoEspecial = "Actualmente no tenemos productos disponibles en el catálogo.";
        } else {
            const textoProductos = productosDB
             .map((p) => `${p.nombre} - $${p.precio.toFixed(2)} - stock: ${p.stock}`)
             .join(". ");
            contextoEspecial = `Lista de productos disponibles: ${textoProductos}.`;
        }

      } catch (errorDB) {
         console.error("Error al consultar productos:", errorDB.message);
         contextoEspecial = "No fue posible obtener la lista de productos en este momento.";
      }
    }

    const promptBase = `
${INFO_BASE[palabraClave]} 
${contextoEspecial}

Responde la siguiente pregunta del usuario: "${pregunta}".

👉 Instrucciones de estilo:
- Usa un tono cercano y amable.
- Escribe en **primera persona**, como si hablara un asistente humano.
- La respuesta debe ser **breve y clara (máximo 120 caracteres)**.
- Si no tienes información suficiente, responde: "Lo siento, no tengo información sobre eso en este momento."
`;

    // === PASO 3: Generación con historial ===
    const contents = [
        ...historialFormatoGemini,
        { role: 'user', parts: [{ text: promptBase }] }
    ];

    const respuestaIA = await generateContentWithHistory(contents, {
        maxOutputTokens: 120,
        temperature: 0.7,
    });

    console.log("Respuesta IA:", respuestaIA.text);
    return res.status(200).json({ respuesta: respuestaIA.text });

  } catch (error) {
    console.error("Error en controladorConsultaIA:", error);
    return res.status(500).json({
      error: "Error interno del servidor al consultar la IA.",
      detalle: error.message
    });
  }
};