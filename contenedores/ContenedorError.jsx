import React from 'react'
import "./ErrorDisplay.css";

const ContenedorError = ({children, t}) => {
  return (
    <div className={`errorDisplay errorDisplay--${t}`}>
      {children}
    </div>
  )
}

export default ContenedorError
