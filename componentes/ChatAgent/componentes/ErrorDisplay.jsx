import React from 'react';
import "./ErrorDisplay.css";
/**
 * Componente para mostrar errores de forma elegante
 * Muestra mensajes de error con opción de cerrar
 * Autor: Miguel Ángel
 */

/**
 * Componente ErrorDisplay - Muestra errores de forma elegante
 * @param {Object} props - Props del componente
 * @param {string} props.mensaje - Mensaje de error a mostrar
 * @param {Function} props.alCerrar - Función para cerrar el error
 * @param {string} props.tipo - Tipo de error (error, advertencia, info)
 * @returns {JSX.Element} - Componente de error renderizado
 */
const ErrorDisplay = ({ 
  mensaje, 
  alCerrar, 
  tipo = 'error' 
}) => {
  
  if (!mensaje) return null;

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
    <div className={`errorDisplay errorDisplay--${tipo}`}>
      <div className="errorDisplay__contenido">
        <div className="errorDisplay__icono">
          {obtenerIcono()}
        </div>
        
        <div className="errorDisplay__mensaje">
          <p>{mensaje}</p>
        </div>
        
        <button
          onClick={alCerrar}
          className="errorDisplay__botonCerrar"
          aria-label="Cerrar error"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;