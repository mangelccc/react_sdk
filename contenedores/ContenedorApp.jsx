import React from 'react'
import './App.css';

const ContenedorApp = ({children}) => {
  return (
    <div className="app">
      {children}
    </div>
  )
}

export default ContenedorApp
