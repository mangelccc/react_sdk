import React from 'react'
import './ChatPrincipal.css';

const ContenidoChat = ({children}) => {
  return (
    <main className="chatPrincipal__contenido">
      {children}
    </main>
  )
}

export default ContenidoChat
