/**
 * Aplicación principal de chat con agente IA
 * Integra todos los componentes y maneja el estado global de la aplicación
 * Autor: Miguel Ángel
 */

import React, { useState } from 'react';
import { usarContextoChat } from '../../../contextos/ProveedorChat.jsx';
import CabeceraChat from '../componentes/CabeceraChat.jsx';
import ListaMensajes from '../componentes/ListaMensajes.jsx';
import EntradaMensaje from '../componentes/EntradaMensaje.jsx';
import SidebarChats from '../componentes/SidebarChats.jsx';
import ErrorDisplay from '../componentes/ErrorDisplay.jsx';
import "./ChatPrincipal.css";

/**
 * Componente principal de la aplicación de chat
 * Coordina la interacción entre usuario y agente IA
 */
const ChatPrincipal = () => {
  // Estado local del componente
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // Contexto del chat
  const {
    chats,
    chatActual,
    cargando,
    error,
    estaEscribiendo,
    crearChat,
    limpiarError,
    obtenerEstadisticas
  } = usarContextoChat();

  /**
   * Maneja la creación de un nuevo chat
   */
  const manejarNuevoChat = () => {
    try {
      crearChat();
      setSidebarAbierto(false);
      limpiarError();
    } catch (error) {
      console.error("❌ Error al crear nuevo chat:", error);
    }
  };

  /**
   * Maneja la apertura/cierre del sidebar
   */
  const manejarToggleSidebar = () => {
    setSidebarAbierto(!sidebarAbierto);
  };

  // Obtener estadísticas para la cabecera
  const estadisticas = obtenerEstadisticas();

  return (
    <div className="chatPrincipal">
      
      {/* Cabecera del chat */}
      <CabeceraChat
        titulo={chatActual?.titulo || "Agent Chat"}
        alAbrirSidebar={manejarToggleSidebar}
        totalChats={estadisticas.totalChats}
        conectado={!error}
      />

      {/* Contenido principal */}
      <main className="chatPrincipal__contenido">
        
        {/* Mostrar errores si existen */}
        {error && (
          <ErrorDisplay 
            mensaje={error}
            alCerrar={limpiarError}
          />
        )}

        {/* Área de mensajes */}
        <div className="chatPrincipal__mensajes">
          <ListaMensajes
            mensajes={chatActual?.mensajes || []}
            estaEscribiendo={estaEscribiendo}
          />
        </div>

        {/* Área de entrada de mensajes */}
        <div className="chatPrincipal__entrada">
          <EntradaMensaje
            deshabilitado={estaEscribiendo || cargando}
            placeholder={
              chatActual 
                ? "Escribe tu mensaje..." 
                : "Escribe un mensaje para comenzar..."
            }
          />
        </div>
      </main>

      {/* Panel lateral de chats */}
      <SidebarChats
        estaAbierto={sidebarAbierto}
        alCerrar={() => setSidebarAbierto(false)}
        chats={chats}
        chatActual={chatActual}
        alCrearNuevoChat={manejarNuevoChat}
        cargando={cargando}
      />

      {/* Pie de página con información del desarrollador */}
      <footer className="chatPrincipal__pie">
        <p>
          Desarrollado por <strong>Miguel Ángel Grimal Lopez</strong> - 
          Chat Agent v1.0
        </p>
      </footer>
    </div>
  );
};

export default ChatPrincipal;