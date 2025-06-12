import React from 'react'
import './App.css';

const AppContenedor = ({children}) => {
  return (
    <div className="app">
      {children}
    </div>
  )
}

export default AppContenedor
