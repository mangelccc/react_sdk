/**
 * Componente para mostrar un mensaje individual en el chat
 * Maneja la visualización diferenciada entre mensajes de usuario y agente
 * Autor: Miguel Ángel
 */

import React from 'react';
import { formatearHora } from '../../../bibliotecas/chatUtils.js';
import "./Mensaje.css";

/**
 * Componente Mensaje - Renderiza un mensaje individual
 * @param {Object} props - Props del componente
 * @param {Object} props.mensaje - Objeto mensaje con contenido y metadata
 * @returns {JSX.Element} - Elemento del mensaje renderizado
 */
const Mensaje = ({ mensaje }) => {
  // Validación de props
  if (!mensaje || !mensaje.contenido) {
    console.warn("⚠️ Mensaje inválido recibido en componente Mensaje");
    return null;
  }

  const { contenido, timestamp, esUsuario } = mensaje;

  return (
    <div className={`mensaje ${esUsuario ? 'mensaje--usuario' : 'mensaje--agente'}`}>
      <div className="mensaje__globo">
        {/* Contenido del mensaje */}
        <p className="mensaje__contenido">
          {contenido}
        </p>
        
        {/* Timestamp del mensaje */}
        <span className="mensaje__hora">
          {formatearHora(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default Mensaje;