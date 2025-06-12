import React from 'react'
import './Mensaje.css';

const ContenedorMensaje = ({ bool, children }) => {
  return (
    <div className={`mensaje ${bool ? 'mensaje--usuario' : 'mensaje--agente'}`}>
      {children}
    </div>
  )
}

export default ContenedorMensaje
