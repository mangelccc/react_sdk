import React from 'react';
import ContenedorIndicadorEscritura from '../../../contenedores/ContenedorIndicadorEscritura.jsx';
/**
 * Componente indicador de que el agente está escribiendo una respuesta
 * Muestra una animación de puntos para indicar actividad
 * Autor: Miguel Ángel
 */

/**
 * Componente IndicadorEscritura - Muestra animación de escritura
 * @returns {JSX.Element} - Indicador de escritura animado
 */
const IndicadorEscritura = () => {
  return (
    <ContenedorIndicadorEscritura>
      <div className="indicadorEscritura__globo">
        <div className="indicadorEscritura__puntos">
          {/* Puntos animados */}
          <div className="indicadorEscritura__punto"></div>
          <div className="indicadorEscritura__punto"></div>
          <div className="indicadorEscritura__punto"></div>
        </div>
        
        {/* Texto descriptivo para accesibilidad */}
        <span className="sr-only">El agente está escribiendo...</span>
      </div>
    </ContenedorIndicadorEscritura>
  );
};

export default IndicadorEscritura;