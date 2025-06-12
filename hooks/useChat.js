/**
 * Hook personalizado para el manejo del estado de chats
 * Centraliza toda la lógica de estado relacionada con los chats y mensajes
 * Autor: Miguel Ángel
 */

import { useState, useCallback } from 'react';
import { 
  crearNuevoChat, 
  agregarMensajeAChat, 
  actualizarTituloChat,
  validarChat 
} from '../bibliotecas/chatUtils.js';

/**
 * Hook personalizado para manejar el estado de los chats
 * @returns {Object} - Objeto con estado y funciones para manejar chats
 */
const useChat = () => {
  // Estado principal de la aplicación
  const [chats, setChats] = useState([]);
  const [chatActual, setChatActual] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Limpia cualquier error existente
   */
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Crea un nuevo chat y lo establece como actual
   * @returns {Object} - El nuevo chat creado
   */
  const crearChat = useCallback(() => {
    try {
      limpiarError();
      const nuevoChat = crearNuevoChat();
      setChatActual(nuevoChat);
      
      // 🔥 Agregar inmediatamente a la lista de chats
      setChats(chatsAnteriores => [nuevoChat, ...chatsAnteriores]);
      
      console.log("✅ Nuevo chat creado y agregado a la lista:", nuevoChat.id);
      return nuevoChat;
    } catch (error) {
      console.error("❌ Error al crear nuevo chat:", error);
      setError("No se pudo crear un nuevo chat");
      throw error;
    }
  }, [limpiarError]);

  /**
   * Guarda un chat en el estado local
   * En el futuro se conectará a la base de datos
   * @param {Object} chat - Chat a guardar
   * @returns {Promise<Object>} - Chat guardado
   */
  const guardarChat = useCallback(async (chat) => {
    try {
      setCargando(true);
      limpiarError();
      
      // Validar chat antes de guardar
      if (!validarChat(chat)) {
        throw new Error("Chat inválido para guardar");
      }
      
      // TODO: Aquí se conectará con la base de datos
      // Por ahora solo actualizamos el estado local
      setChats(chatsAnteriores => {
        const indiceExistente = chatsAnteriores.findIndex(c => c.id === chat.id);
        
        if (indiceExistente >= 0) {
          // Actualizar chat existente
          const chatsActualizados = [...chatsAnteriores];
          chatsActualizados[indiceExistente] = chat;
          return chatsActualizados;
        } else {
          // Agregar nuevo chat al principio
          return [chat, ...chatsAnteriores];
        }
      });
      
      console.log("✅ Chat guardado correctamente:", chat.id);
      return chat;
    } catch (error) {
      console.error("❌ Error al guardar chat:", error);
      setError("No se pudo guardar la conversación");
      throw error;
    } finally {
      setCargando(false);
    }
  }, [limpiarError]);

  /**
   * Elimina un chat del estado
   * @param {string} chatId - ID del chat a eliminar
   * @returns {Promise<boolean>} - True si se eliminó correctamente
   */
  const eliminarChat = useCallback(async (chatId) => {
    try {
      setCargando(true);
      limpiarError();
      
      // TODO: Aquí se conectará con la base de datos
      setChats(chatsAnteriores => chatsAnteriores.filter(c => c.id !== chatId));
      
      // Si el chat eliminado era el actual, limpiar selección
      if (chatActual?.id === chatId) {
        setChatActual(null);
      }
      
      console.log("✅ Chat eliminado:", chatId);
      return true;
    } catch (error) {
      console.error("❌ Error al eliminar chat:", error);
      setError("No se pudo eliminar la conversación");
      throw error;
    } finally {
      setCargando(false);
    }
  }, [chatActual, limpiarError]);

  /**
   * Agrega un mensaje al chat actual
   * @param {Object} mensaje - Mensaje a agregar
   * @returns {Object} - Chat actualizado
   */
  const agregarMensaje = useCallback(async (mensaje) => {
    try {
      limpiarError();
      
      if (!chatActual) {
        throw new Error("No hay chat activo para agregar mensaje");
      }

      console.log("📝 Agregando mensaje:", {
        tipo: mensaje.esUsuario ? 'USUARIO' : 'AGENTE',
        contenido: mensaje.contenido.substring(0, 50) + '...',
        chatId: chatActual.id,
        mensajesAnteriores: chatActual.mensajes.length
      });

      const chatActualizado = agregarMensajeAChat(chatActual, mensaje);
      
      // Actualizar título si es el primer mensaje del usuario
      if (chatActual.mensajes.length === 0 && mensaje.esUsuario) {
        const chatConTitulo = actualizarTituloChat(chatActualizado, mensaje.contenido);
        setChatActual(chatConTitulo);
        console.log("🏷️ Título del chat actualizado:", chatConTitulo.titulo);
        return chatConTitulo;
      }
      
      setChatActual(chatActualizado);
      console.log("✅ Mensaje agregado. Total mensajes:", chatActualizado.mensajes.length);
      return chatActualizado;
    } catch (error) {
      console.error("❌ Error al agregar mensaje:", error);
      setError("No se pudo agregar el mensaje");
      throw error;
    }
  }, [chatActual, limpiarError]);

  /**
   * Selecciona un chat como actual
   * @param {Object} chat - Chat a seleccionar
   */
  const seleccionarChat = useCallback((chat) => {
    try {
      limpiarError();
      
      if (!validarChat(chat)) {
        throw new Error("Chat inválido seleccionado");
      }
      
      setChatActual(chat);
      console.log("✅ Chat seleccionado:", chat.id);
    } catch (error) {
      console.error("❌ Error al seleccionar chat:", error);
      setError("No se pudo seleccionar la conversación");
    }
  }, [limpiarError]);

  /**
   * Obtiene estadísticas de los chats
   * @returns {Object} - Estadísticas generales
   */
  const obtenerEstadisticas = useCallback(() => {
    const totalChats = chats.length;
    const totalMensajes = chats.reduce((total, chat) => total + chat.mensajes.length, 0);
    
    return {
      totalChats,
      totalMensajes,
      chatActivo: chatActual?.id || null
    };
  }, [chats, chatActual]);

  // Retornar estado y funciones
  return {
    // Estado
    chats,
    chatActual,
    cargando,
    error,
    
    // Funciones principales
    crearChat,
    guardarChat,
    eliminarChat,
    agregarMensaje,
    seleccionarChat,
    
    // Funciones auxiliares
    limpiarError,
    obtenerEstadisticas,
    
    // Setters directos (usar con cuidado)
    setChatActual
  };
};

export default useChat;