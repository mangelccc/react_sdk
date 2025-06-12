/**
 * Biblioteca para la comunicación con la API del chat agent
 * Contiene todas las funciones relacionadas con el envío y recepción de mensajes
 * Autor: Miguel Ángel
 */

const API_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;
const API_BASE_URL = import.meta.env.VITE_API_URL
/**
 * Envía un mensaje al agente y obtiene la respuesta
 * @param {string} mensaje - El mensaje del usuario a enviar
 * @returns {Promise<string>} - La respuesta del agente
 * @throws {Error} - Si hay problemas en la comunicación
 */
const enviarMensajeAlAgente = async (mensaje) => {
  try {
    console.log("🔍 API_TOKEN:", API_TOKEN);
    console.log("🔍 API_BASE_URL:", API_BASE_URL);
    console.log(mensaje);
    const respuesta = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({ message: mensaje })
    });

    // Verificar si la respuesta es exitosa
    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status} - ${respuesta.statusText}`);
    }

    const datos = await respuesta.json();
    console.log("📥 Respuesta recibida del agente:", datos.respuesta);

    return datos.respuesta;
  } catch (error) {
    console.error("❌ Error al comunicarse con el agente:", error);
    throw new Error(`No se pudo conectar con el agente: ${error.message}`);
  }
};

/**
 * Función auxiliar para simular delay en desarrollo/testing
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise<void>}
 */
const esperarDelay = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Valida que un mensaje tenga contenido válido
 * @param {string} mensaje - Mensaje a validar
 * @returns {boolean} - True si es válido
 */
const validarMensaje = (mensaje) => {
  return mensaje && typeof mensaje === 'string' && mensaje.trim().length > 0;
};

export {
  enviarMensajeAlAgente,
  esperarDelay,
  validarMensaje
};