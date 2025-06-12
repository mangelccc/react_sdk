/**
 * Utilidades para el manejo de chats y mensajes
 * Contiene funciones auxiliares para crear, formatear y manipular datos de chat
 * Autor: Miguel Ángel
 */
import { generarUuidAleatorio } from "./funciones.js";

/**
 * Crea un nuevo objeto de chat vacío
 * @returns {Object} - Nuevo chat con estructura base
 */
const crearNuevoChat = () => {
  const ahora = new Date().toISOString();
  return {
    id: generarUuidAleatorio(),
    titulo: 'Nueva conversación',
    mensajes: [],
    fechaCreacion: ahora,
    fechaActualizacion: ahora
  };
};

/**
 * Crea un nuevo mensaje con la estructura requerida
 * @param {string} contenido - Contenido del mensaje
 * @param {boolean} esUsuario - Si el mensaje es del usuario o del agente
 * @returns {Object} - Objeto mensaje formateado
 */
const crearMensaje = (contenido, esUsuario = true) => {
  console.log("🔍 Contenido del mensaje:", contenido);
  return {
    id: generarUuidAleatorio(),
    contenido: contenido.trim(),
    timestamp: new Date().toISOString(),
    esUsuario
  };
};

/**
 * Actualiza el título del chat basado en el primer mensaje
 * @param {Object} chat - Chat a actualizar
 * @param {string} primerMensaje - Primer mensaje para generar título
 * @returns {Object} - Chat con título actualizado
 */
const actualizarTituloChat = (chat, primerMensaje) => {
  const tituloGenerado = primerMensaje.length > 30 
    ? primerMensaje.substring(0, 30) + '...' 
    : primerMensaje;
    
  return {
    ...chat,
    titulo: chat.mensajes.length === 0 ? tituloGenerado : chat.titulo,
    fechaActualizacion: new Date().toISOString()
  };
};

/**
 * Agrega un mensaje a un chat existente
 * @param {Object} chat - Chat al que agregar el mensaje
 * @param {Object} mensaje - Mensaje a agregar
 * @returns {Object} - Chat actualizado con el nuevo mensaje
 */
const agregarMensajeAChat = (chat, mensaje) => {
  return {
    ...chat,
    mensajes: [...chat.mensajes, mensaje],
    fechaActualizacion: new Date().toISOString()
  };
};

/**
 * Formatea la fecha para mostrar en la interfaz
 * @param {string} timestamp - Timestamp en formato ISO
 * @returns {string} - Fecha formateada
 */
const formatearFecha = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleDateString();
  } catch (error) {
    console.warn("⚠️ Error al formatear fecha:", error);
    return "Fecha inválida";
  }
};

/**
 * Formatea la hora para mostrar en los mensajes
 * @param {string} timestamp - Timestamp en formato ISO
 * @returns {string} - Hora formateada
 */
const formatearHora = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleTimeString();
  } catch (error) {
    console.warn("⚠️ Error al formatear hora:", error);
    return "Hora inválida";
  }
};

/**
 * Valida que un chat tenga la estructura correcta
 * @param {Object} chat - Chat a validar
 * @returns {boolean} - True si es válido
 */
const validarChat = (chat) => {
  return chat && 
         typeof chat === 'object' && 
         chat.id && 
         chat.titulo && 
         Array.isArray(chat.mensajes);
};

/**
 * Obtiene estadísticas de un chat
 * @param {Object} chat - Chat a analizar
 * @returns {Object} - Estadísticas del chat
 */
const obtenerEstadisticasChat = (chat) => {
  if (!validarChat(chat)) {
    return { totalMensajes: 0, mensajesUsuario: 0, mensajesAgente: 0 };
  }
  
  const totalMensajes = chat.mensajes.length;
  const mensajesUsuario = chat.mensajes.filter(m => m.esUsuario).length;
  const mensajesAgente = totalMensajes - mensajesUsuario;
  
  return {
    totalMensajes,
    mensajesUsuario,
    mensajesAgente
  };
};

export {
  crearNuevoChat,
  crearMensaje,
  actualizarTituloChat,
  agregarMensajeAChat,
  formatearFecha,
  formatearHora,
  validarChat,
  obtenerEstadisticasChat
};