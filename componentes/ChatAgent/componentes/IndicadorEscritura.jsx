/**
 * Componente indicador de que el agente está escribiendo una respuesta
 * Muestra una animación de puntos para indicar actividad
 * Autor: Miguel Ángel
 */

import React from 'react';
import ContenedorIndicadorEscritura from '../../../contenedores/ContenedorIndicadorEscritura.jsx';

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