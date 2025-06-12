/**
 * Componente para mostrar errores de forma elegante
 * Muestra mensajes de error con opción de cerrar
 * Autor: Miguel Ángel
 */

import React from 'react';
import { usarContextoChat } from '../../../contextos/ProveedorChat.jsx';
import ContenedorError from '../../../contenedores/ContenedorError.jsx';

const ErrorDisplay = () => {

  // Contexto del chat
  const {
    error,
    limpiarError
  } = usarContextoChat();
  
  if (!error) return null;

  let tipo = 'error'; //Demomento, solo errores.

  const obtenerIcono = () => {
    switch (tipo) {
      case 'advertencia':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <ContenedorError t={tipo}>
      <div className="errorDisplay__contenido">
        <div className="errorDisplay__icono">
          {obtenerIcono()}
        </div>
        
        <div className="errorDisplay__mensaje">
          <p>{error}</p>
        </div>
        
        <button
          onClick={limpiarError}
          className="errorDisplay__botonCerrar"
          aria-label="Cerrar error"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </ContenedorError>
  );
};

export default ErrorDisplay;