import React from 'react'
import './ChatPrincipal.css';

const ContenedorChatPrincipal = ({children}) => {
  return (
    <div className="chatPrincipal">
      {children}
    </div>
  )
}

export default ContenedorChatPrincipal
