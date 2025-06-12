import React from 'react';
import { usarContextoChat } from '../../../contextos/ProveedorChat.jsx';
import "./EntradaMensaje.css";
/**
 * Componente para el área de entrada de mensajes
 * Maneja el input de texto y el botón de envío
 * Autor: Miguel Ángel
 */

/**
 * Componente EntradaMensaje - Área de input para escribir mensajes
 * @param {Object} props - Props del componente
 * @param {Function} props.alEnviarMensaje - Función a ejecutar al enviar mensaje
 * @param {boolean} props.deshabilitado - Si el input está deshabilitado
 * @param {string} props.placeholder - Texto placeholder del input
 * @returns {JSX.Element} - Área de entrada renderizada
 */
const EntradaMensaje = ({ 
  deshabilitado = false, 
  placeholder = "Escribe tu mensaje..." 
}) => {

  const {
      mensajeInput,
      manejarEnvio,
      manejarTeclaPresionada,
      manejarCambio
    } = usarContextoChat();

  return (
    <div className="entradaMensaje">
      <div className="entradaMensaje__contenedor">
        <div className="entradaMensaje__inputContainer">
          <textarea
            value={mensajeInput}
            onChange={(evento) => manejarCambio(evento)}
            onKeyPress={(evento) => manejarTeclaPresionada(evento)}
            placeholder={placeholder}
            className="entradaMensaje__textarea"
            rows={1}
            disabled={deshabilitado}
            maxLength={1000}
          />
        </div>
        
        <button
          onClick={(evento) => manejarEnvio(evento)}
          disabled={!mensajeInput.trim() || deshabilitado}
          className="entradaMensaje__boton"
          aria-label="Enviar mensaje"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M2 21L23 12L2 3V10L17 12L2 14V21Z" 
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      
      {/* Contador de caracteres */}
      <div className="entradaMensaje__contador">
        {mensajeInput.length}/1000
      </div>
    </div>
  );
};

export default EntradaMensaje;