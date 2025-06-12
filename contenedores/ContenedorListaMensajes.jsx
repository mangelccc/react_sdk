import React from 'react'
import "./ListaMensajes.css";

const ContenedorListaMensajes = ({children}) => {
  return (
    <div className="chatPrincipal__mensajes">
      {children}
    </div>
  )
}

export default ContenedorListaMensajes
