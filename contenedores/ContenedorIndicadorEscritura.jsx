import React from 'react'
import './IndicadorEscritura.css';

const ContenedorIndicadorEscritura = ({children}) => {
  return (
    <div className="indicadorEscritura">
      {children}
    </div>
  )
}

export default ContenedorIndicadorEscritura
