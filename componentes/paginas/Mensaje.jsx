/**
 * Componente para mostrar un mensaje individual en el chat
 * Maneja la visualización diferenciada entre mensajes de usuario y agente
 * Autor: Miguel Ángel
 */

import React from 'react';
import { formatearHora } from '../../bibliotecas/chatUtils.js';
import ContenedorMensaje from '../../contenedores/ContenedorMensaje.jsx';

const Mensaje = ({ mensaje }) => {
  // Validación de props
  if (!mensaje || !mensaje.contenido) {
    console.warn("⚠️ Mensaje inválido recibido en componente Mensaje");
    return null;
  }

  const { contenido, timestamp, esUsuario } = mensaje;

  return (
    <ContenedorMensaje bool={esUsuario}>
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
    </ContenedorMensaje>
  );
};

export default Mensaje;