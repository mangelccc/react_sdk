import React from 'react'
import "./EntradaMensaje.css";

const ContenedorEntradaMensaje = ({children}) => {
  return (
    <div className="chatPrincipal__entrada">
      {children}
    </div>
  )
}

export default ContenedorEntradaMensaje
