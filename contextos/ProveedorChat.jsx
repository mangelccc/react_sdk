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

  const asegurarChatActivo = async () => {
    if (chatActual) {
      return chatActual;
    }

    console.log("📝 Creando nuevo chat automáticamente...");
    const nuevoChat = await crearChat();

    // Seleccionar inmediatamente el chat creado
    seleccionarChat(nuevoChat);

    console.log("✅ Chat creado y seleccionado:", nuevoChat.id);
    return nuevoChat;
  };

  const enviarMensaje = async (contenidoMensaje) => {
    try {
      limpiarError();

      // 🔥 ASEGURAR CHAT ACTIVO
      let chatTrabajo = chatActual;
      if (!chatTrabajo) {
        console.log("📝 Creando nuevo chat automáticamente...");
        chatTrabajo = crearChat(); // Sin await, ya que no es async
        console.log("✅ Chat creado:", chatTrabajo.id);
      }

      // 🔥 PASAR EL CHAT ESPECÍFICO a agregarMensaje
      const mensajeUsuario = crearMensaje(contenidoMensaje, true);
      const chatConMensajeUsuario = await agregarMensaje(mensajeUsuario, chatTrabajo);

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
        const mensajeAgente = crearMensaje(respuestaAgente, false);

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
        // Mostrar loading mientras se elimina
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: true,
          confirmButtonText: 'Cargando...',
          confirmButtonColor: configuracionSwal.confirmButtonColor,
          background: configuracionSwal.background,
          color: configuracionSwal.color,
          customClass: {
            popup: 'swal-popup-custom',
            confirmButton: 'swal-confirm-button'
          },
          preConfirm: () => {
            return false; // Prevenir que se cierre al hacer clic
          },
          willOpen: () => {
            // Mostrar loading en el botón
            Swal.showLoading();
          }
        });;

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
  const manejarNuevoChat = async () => {
  try {
    // Mostrar loading mientras se crea
    Swal.fire({
      title: 'Creando nueva conversación...',
      html: `
        <div style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
          <div style="
            border: 3px solid #f3f3f3;
            border-top: 3px solid #007bff;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            animation: spin 1s linear infinite;
            margin-right: 15px;
          "></div>
          <span>Preparando tu nuevo chat...</span>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: configuracionSwal.background,
      color: configuracionSwal.color,
      customClass: {
        popup: 'swal-popup-custom',
        htmlContainer: 'swal-content-custom'
      }
    });

    // Crear el chat
    const nuevoChat = crearChat();
    
    // Pequeño delay para que se vea el loading (opcional)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSidebarAbierto(false);
    limpiarError();

    // Mostrar confirmación de éxito
    await Swal.fire({
      title: '¡Nueva conversación creada!',
      html: `
        <div style="text-align: center; margin: 15px 0;">
          <p style="margin-bottom: 15px; color: #666; font-size: 16px;">
            Tu nueva conversación está lista
          </p>
          <p style="color: #28a745; font-weight: 600; font-size: 14px;">
            💬 Puedes empezar a escribir tu mensaje
          </p>
        </div>
      `,
      icon: 'success',
      timer: 2500,
      showConfirmButton: false,
      background: configuracionSwal.background,
      color: configuracionSwal.color,
      iconColor: '#28a745',
      customClass: {
        popup: 'swal-popup-custom',
        htmlContainer: 'swal-content-custom'
      },
      showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
      }
    });

    console.log("✅ Nuevo chat creado exitosamente:", nuevoChat.id);

  } catch (error) {
    console.error("❌ Error al crear nuevo chat:", error);

    // Mostrar error con SweetAlert2
    await Swal.fire({
      title: 'Error al crear conversación',
      html: `
        <div style="text-align: center; margin: 15px 0;">
          <p style="margin-bottom: 10px; color: #dc3545;">
            No se pudo crear una nueva conversación
          </p>
          <p style="color: #666; font-size: 14px;">
            Por favor, inténtalo de nuevo
          </p>
        </div>
      `,
      icon: 'error',
      confirmButtonText: 'Reintentar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      background: configuracionSwal.background,
      color: configuracionSwal.color,
      confirmButtonColor: configuracionSwal.confirmButtonColor,
      cancelButtonColor: configuracionSwal.cancelButtonColor,
      iconColor: configuracionSwal.iconColor,
      customClass: {
        popup: 'swal-popup-custom',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button',
        htmlContainer: 'swal-content-custom'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Reintentar crear el chat
        manejarNuevoChat();
      }
    });
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

export default ProveedorChat;
export { ContextoChat };