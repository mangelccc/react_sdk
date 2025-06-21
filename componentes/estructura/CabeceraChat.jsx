/**
 * Componente para la cabecera del chat
 * Muestra información del chat actual y controles de navegación
 * Autor: Miguel Ángel
 */

import React from 'react';
import usarContextoChat from '../../hooks/usarContextoChat.js';
import Cabecera from '../../contenedores/Cabecera.jsx';

const CabeceraChat = () => {
  const {
    obtenerEstadisticas,
    chatActual,
    manejarAperturaSidebar,
    error
  } = usarContextoChat();

  let conectado = !error; // Determina si está conectado según el error

    const estadisticas = obtenerEstadisticas() || 0;
    const totalChats = estadisticas.totalChats || 0;
    const titulo = chatActual?.titulo || "Agent Chat";
  return (
    <Cabecera>
      <div className="cabeceraChat__contenedor">
        
        {/* Logo y título */}
        <div className="cabeceraChat__logo">
          <div className="cabeceraChat__icono">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M8 12H16M8 16H13M12 2C13.1046 2 14 2.89543 14 4V8H20C21.1046 8 22 8.89543 22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10C2 8.89543 2.89543 8 4 8H10V4C10 2.89543 10.8954 2 12 2Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          
          <div className="cabeceraChat__info">
            <h1 className="cabeceraChat__titulo">{titulo}</h1>
            <div className="cabeceraChat__estado">
              <span 
                className={`cabeceraChat__indicador ${conectado ? 'cabeceraChat__indicador--conectado' : 'cabeceraChat__indicador--desconectado'}`}
              />
              <span className="cabeceraChat__textoEstado">
                {conectado ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Controles */}
        <div className="cabeceraChat__controles">
          <button
            onClick={() => manejarAperturaSidebar()}
            className="cabeceraChat__botonMenu"
            aria-label="Abrir panel de conversaciones"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M3 12H21M3 6H21M3 18H21" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            
            {/* Badge con número de chats */}
            {totalChats > 0 && (
              <span className="cabeceraChat__badge">
                {totalChats > 99 ? '99+' : totalChats}
              </span>
            )}
          </button>
        </div>
      </div>
    </Cabecera>
  );
};

export default CabeceraChat;