import React from 'react'
import "./CabeceraChat.css";

const Cabecera = ({children}) => {
  return (
    <header className="cabeceraChat">
      {children}
    </header>
  )
}

export default Cabecera
