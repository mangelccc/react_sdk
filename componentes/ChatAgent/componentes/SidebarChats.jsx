/**
 * Componente del panel lateral que muestra la lista de chats
 * Permite navegar entre conversaciones y crear nuevas
 * Autor: Miguel Ángel
 */

import React from 'react';
import { formatearFecha, obtenerEstadisticasChat } from '../../../bibliotecas/chatUtils.js';
import { usarContextoChat } from '../../../contextos/ProveedorChat.jsx';
import ContenedorSidebar from '../../../contenedores/contenedorSidebar.jsx';

const SidebarChats = () => {

  const {
    manejarEliminacionChat,
    manejarSeleccionChat,
    chats,
    chatActual,
    cargando,
    sidebarAbierto,
    cerrarSidebar,
    manejarNuevoChat,
  } = usarContextoChat();

  return (
    <ContenedorSidebar>
      {/* Overlay para móvil - permite cerrar al tocar fuera */}
      {sidebarAbierto && (
        <div
          className="sidebarChats__overlay"
          onClick={() => cerrarSidebar()}
        />
      )}

      {/* Panel lateral principal */}
      <aside
        className={`sidebarChats ${sidebarAbierto ? 'sidebarChats--abierto' : ''}`}
      >
        <div className="sidebarChats__contenido">

          {/* Header del panel */}
          <header className="sidebarChats__header">
            <div className="sidebarChats__titulo">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 12H16M8 16H13M12 2C13.1046 2 14 2.89543 14 4V8H20C21.1046 8 22 8.89543 22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10C2 8.89543 2.89543 8 4 8H10V4C10 2.89543 10.8954 2 12 2Z"
                  fill="currentColor"
                />
              </svg>
              <h2>Conversaciones</h2>
            </div>

            <button
              onClick={() => cerrarSidebar()}
              className="sidebarChats__botonCerrar"
              aria-label="Cerrar panel de conversaciones"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </header>

          {/* Botón para nueva conversación */}
          <div className="sidebarChats__accion">
            <button
              onClick={() => manejarNuevoChat()}
              className="sidebarChats__botonNuevo"
              disabled={cargando}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Nueva conversación
            </button>
          </div>

          {/* Lista de chats */}
          <div className="sidebarChats__lista">
            {cargando ? (
              // Indicador de carga
              <div className="sidebarChats__cargando">
                <div className="sidebarChats__spinner"></div>
                <p>Cargando conversaciones...</p>
              </div>
            ) : chats.length === 0 ? (
              // Estado vacío
              <div className="sidebarChats__vacio">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 12H16M8 16H13M12 2C13.1046 2 14 2.89543 14 4V8H20C21.1046 8 22 8.89543 22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10C2 8.89543 2.89543 8 4 8H10V4C10 2.89543 10.8954 2 12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>No hay conversaciones</p>
                <span>Crea una nueva para empezar</span>
              </div>
            ) : (
              // Lista de chats
              chats.map((chat) => {
                const estadisticas = obtenerEstadisticasChat(chat);
                const estaActivo = chatActual?.id === chat.id;

                return (
                  <div
                    key={chat.id}
                    className={`sidebarChats__item ${estaActivo ? 'sidebarChats__item--activo' : ''}`}
                    onClick={() => manejarSeleccionChat(chat)}
                  >
                    <div className="sidebarChats__itemContenido">
                      <h3 className="sidebarChats__itemTitulo">
                        {chat.titulo}
                      </h3>

                      <div className="sidebarChats__itemMeta">
                        <span className="sidebarChats__itemMensajes">
                          {estadisticas.totalMensajes} mensaje{estadisticas.totalMensajes !== 1 ? 's' : ''}
                        </span>
                        <span className="sidebarChats__itemFecha">
                          {formatearFecha(chat.fechaActualizacion)}
                        </span>
                      </div>
                    </div>

                    {/* Botón eliminar - aparece al hover */}
                    <button
                      onClick={(evento) => manejarEliminacionChat(evento, chat.id, chat.titulo)}
                      className="sidebarChats__itemEliminar"
                      aria-label={`Eliminar conversación: ${chat.titulo}`}
                      disabled={cargando}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 6H5H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </aside>
    </ContenedorSidebar>
  );
};

export default SidebarChats;