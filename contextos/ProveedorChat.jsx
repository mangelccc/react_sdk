/**
 * Contexto para el manejo global del estado del chat
 * Proporciona acceso a los chats y funciones relacionadas en toda la aplicación
 * Autor: Miguel Ángel
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import useChat from '../hooks/useChat.js';
import { enviarMensajeAlAgente } from '../bibliotecas/chatApi.js';
import { crearMensaje, agregarMensajeAChat, formatearFecha, obtenerEstadisticasChat } from '../bibliotecas/chatUtils.js';
import Swal from 'sweetalert2';
// Crear el contexto
const ContextoChat = createContext();

/**
 * Proveedor del contexto de chat
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} - Proveedor del contexto
 */
const ProveedorChat = ({ children }) => {
  // Hook personalizado para manejar chats
  const {
    chats,
    chatActual,
    cargando,
    error,
    crearChat,
    guardarChat,
    eliminarChat,
    agregarMensaje,
    seleccionarChat,
    limpiarError,
    obtenerEstadisticas
  } = useChat();

  // Estados adicionales del contexto
  const [estaEscribiendo, setEstaEscribiendo] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    autoGuardar: true,
    notificaciones: true,
    temaOscuro: false
  });

  /**
   * Envía un mensaje del usuario y obtiene respuesta del agente
   * @param {string} contenidoMensaje - Contenido del mensaje a enviar
   * @returns {Promise<void>}
   */
  const enviarMensaje = async (contenidoMensaje) => {
    try {
      limpiarError();

      // Verificar que hay un chat activo o crear uno nuevo
      let chatTrabajo = chatActual;
      if (!chatTrabajo) {
        chatTrabajo = crearChat();
      }

      // Crear y agregar mensaje del usuario
      const mensajeUsuario = crearMensaje(contenidoMensaje, true);
      const chatConMensajeUsuario = await agregarMensaje(mensajeUsuario);

      // 🔥 GUARDAR INMEDIATAMENTE el mensaje del usuario
      if (configuracion.autoGuardar && chatConMensajeUsuario) {
        await guardarChat(chatConMensajeUsuario);
        console.log("💾 Mensaje del usuario guardado:", contenidoMensaje);
      }

      // Indicar que el agente está escribiendo
      setEstaEscribiendo(true);

      try {
        // Obtener respuesta del agente
        const respuestaAgente = await enviarMensajeAlAgente(contenidoMensaje);

        // Crear mensaje del agente
        const mensajeAgente = crearMensaje(respuestaAgente, false);

        // 🔥 USAR EL CHAT CON MENSAJE USUARIO como base para agregar el del agente
        console.log("🔄 Agregando respuesta del agente al chat que tiene:", chatConMensajeUsuario.mensajes.length, "mensajes");

        // Agregar respuesta del agente AL CHAT QUE YA TIENE EL MENSAJE DEL USUARIO
        const chatConMensajeAgente = agregarMensajeAChat(chatConMensajeUsuario, mensajeAgente);

        // Usar seleccionarChat para actualizar el estado
        seleccionarChat(chatConMensajeAgente);

        console.log("✅ Chat final con", chatConMensajeAgente.mensajes.length, "mensajes:",
          chatConMensajeAgente.mensajes.map(m => `${m.esUsuario ? 'USER' : 'AGENT'}: ${m.contenido.substring(0, 20)}...`)
        );

        // Guardar chat con ambos mensajes
        if (configuracion.autoGuardar && chatConMensajeAgente) {
          await guardarChat(chatConMensajeAgente);
          console.log("💾 Chat completo guardado con", chatConMensajeAgente.mensajes.length, "mensajes");
        }

      } catch (errorApi) {
        // Si falla la API, agregar mensaje de error
        const mensajeError = crearMensaje(
          'Lo siento, no puedo responder en este momento. Por favor, inténtalo más tarde.',
          false
        );

        const chatConError = agregarMensajeAChat(chatConMensajeUsuario, mensajeError);

        // Usar seleccionarChat para actualizar el estado
        seleccionarChat(chatConError);

        // Guardar chat con mensaje de error
        if (configuracion.autoGuardar && chatConError) {
          await guardarChat(chatConError);
          console.log("💾 Chat con error guardado");
        }

        console.error("❌ Error al obtener respuesta del agente:", errorApi);
      }

    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
    } finally {
      setEstaEscribiendo(false);
    }
  };

  /**
   * Actualiza la configuración del chat
   * @param {Object} nuevaConfiguracion - Nueva configuración
   */
  const actualizarConfiguracion = (nuevaConfiguracion) => {
    setConfiguracion(prevConfig => ({
      ...prevConfig,
      ...nuevaConfiguracion
    }));
  };

  /**
   * Limpia todos los chats (con confirmación)
   * @returns {Promise<boolean>} - True si se limpiaron
   */
  const limpiarTodosLosChats = async () => {
    try {
      // En una implementación real, esto requeriría confirmación del usuario
      const confirmacion = window.confirm(
        "¿Estás seguro de que quieres eliminar todas las conversaciones? Esta acción no se puede deshacer."
      );

      if (confirmacion) {
        // Eliminar todos los chats uno por uno usando la función del hook
        for (const chat of chats) {
          await eliminarChat(chat.id);
        }
        console.log("✅ Todos los chats han sido eliminados");
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Error al limpiar chats:", error);
      return false;
    }
  };

  const [mensajeInput, setMensajeInput] = useState('');

  /**
   * Maneja el envío del mensaje
   */
  const manejarEnvio = () => {
    const mensaje = (mensajeInput || '').trim();
    if (!mensaje) return;

    enviarMensaje(mensaje);
    setMensajeInput('');
  };

  /**
   * Maneja el evento de tecla presionada
   * @param {KeyboardEvent} evento - Evento de teclado
   */
  const manejarTeclaPresionada = (evento) => {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault();
      manejarEnvio();
    }
  };

  /**
   * Maneja el cambio en el textarea
   * @param {Event} evento - Evento de cambio
   */
  const manejarCambio = (evento) => {
    setMensajeInput(evento.target.value || '');
  };

  /**
     * Configuración de colores para SweetAlert2 (personalizar según app.css)
     */
  const configuracionSwal = {
    background: '#ffffff',
    color: '#333333',
    confirmButtonColor: '#007bff',
    cancelButtonColor: '#6c757d',
    iconColor: '#dc3545'
  };

  /**
   * Maneja la eliminación de un chat con confirmación usando SweetAlert2
   * @param {Event} evento - Evento del click
   * @param {string} chatId - ID del chat a eliminar
   * @param {string} tituloChat - Título del chat para confirmación
   */
  const manejarEliminacionChat = async (evento, chatId, tituloChat) => {
    evento.stopPropagation();

    try {
      const resultado = await Swal.fire({
        title: '¿Eliminar conversación?',
        html: `
              <div style="text-align: left; margin: 20px 0;">
                <p style="margin-bottom: 10px; color: #666;">
                  Estás a punto de eliminar la conversación:
                </p>
                <p style="font-weight: 600; color: #333; margin-bottom: 15px;">
                  "${tituloChat}"
                </p>
                <p style="color: #dc3545; font-size: 14px;">
                  ⚠️ Esta acción no se puede deshacer
                </p>
              </div>
            `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        focusCancel: true,
        background: configuracionSwal.background,
        color: configuracionSwal.color,
        confirmButtonColor: configuracionSwal.iconColor,
        cancelButtonColor: configuracionSwal.cancelButtonColor,
        customClass: {
          popup: 'swal-popup-custom',
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
          title: 'swal-title-custom',
          htmlContainer: 'swal-content-custom'
        },
        buttonsStyling: true,
        allowOutsideClick: false,
        allowEscapeKey: true,
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
      });

      if (resultado.isConfirmed) {
        // Mostrar loading mientras se elimina
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          background: configuracionSwal.background,
          color: configuracionSwal.color,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await manejarEliminarChat(chatId);

        // Mostrar confirmación de éxito
        await Swal.fire({
          title: '¡Eliminada!',
          text: 'La conversación ha sido eliminada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: configuracionSwal.background,
          color: configuracionSwal.color,
          iconColor: '#28a745',
          showClass: {
            popup: 'animate__animated animate__fadeInUp animate__faster'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster'
          }
        });
      }
    } catch (error) {
      console.error('Error al eliminar chat:', error);

      // Mostrar error con SweetAlert2
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la conversación. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        background: configuracionSwal.background,
        color: configuracionSwal.color,
        confirmButtonColor: configuracionSwal.confirmButtonColor,
        iconColor: configuracionSwal.iconColor,
        customClass: {
          popup: 'swal-popup-custom',
          confirmButton: 'swal-confirm-button'
        }
      });
    }
  };

  const manejarEliminarChat = async (chatId) => {
    try {
      await eliminarChat(chatId);
    } catch (error) {
      console.error("❌ Error al eliminar chat:", error);
    }
  };

  /**
   * Maneja la selección de un chat existente
   * @param {Object} chat - Chat a seleccionar
   */
  const manejarSeleccionChat = (chat) => {
    try {
      seleccionarChat(chat);
      limpiarError();
    } catch (error) {
      console.error("❌ Error al seleccionar chat:", error);
    }
  };
  /**
   * Maneja el envío de un nuevo mensaje
   * @param {string} mensaje - Mensaje a enviar
  const manejarEnvioMensaje = async (mensaje) => {
    try {
      limpiarError();
      await enviarMensaje(mensaje);
    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
    }
  };
  */

  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // ✅ 2. Agregar estas funciones (donde tienes las otras funciones)
  const manejarNuevoChat = () => {
    try {
      crearChat();
      setSidebarAbierto(false);
      limpiarError();
    } catch (error) {
      console.error("❌ Error al crear nuevo chat:", error);
    }
  };

  const manejarAperturaSidebar = useCallback(() => {
    setSidebarAbierto(prev => !prev); 
  }, []);

  const cerrarSidebar = useCallback(() => {
    setSidebarAbierto(false);
  }, []);

  // Objeto con todos los valores y funciones a exportar
  const valoresContexto = {
    // Estado
    chats,
    chatActual,
    cargando,
    error,
    estaEscribiendo,
    configuracion,

    // Funciones principales
    enviarMensaje,
    crearChat,
    seleccionarChat,
    eliminarChat,

    // Funciones auxiliares
    limpiarError,
    obtenerEstadisticas,
    actualizarConfiguracion,
    limpiarTodosLosChats,

    // Funciones avanzadas
    guardarChat,

    // Funciones de entrada de mensaje
    mensajeInput,
    setMensajeInput,
    manejarEnvio,
    manejarTeclaPresionada,
    manejarCambio,

    // Funciones de manejo de chat
    manejarEliminacionChat,
    manejarSeleccionChat,

    // Funciones de sidebar
    sidebarAbierto,
    cerrarSidebar,
    manejarNuevoChat,
    manejarAperturaSidebar,
  };

  return (
    <ContextoChat.Provider value={valoresContexto}>
      {children}
    </ContextoChat.Provider>
  );
};

/**
 * Hook para usar el contexto de chat
 * @returns {Object} - Valores del contexto
 * @throws {Error} - Si se usa fuera del proveedor
 */
const usarContextoChat = () => {
  const contexto = useContext(ContextoChat);

  if (!contexto) {
    throw new Error('usarContextoChat debe usarse dentro de ProveedorChat');
  }

  return contexto;
};

export default ProveedorChat;
export { usarContextoChat, ContextoChat };