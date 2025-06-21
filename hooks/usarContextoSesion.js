/**
 * Hook para usar el contexto de sesión
 * @returns {Object} - Valores del contexto
 * @throws {Error} - Si se usa fuera del proveedor
 */

import { useContext } from 'react';
import { ContextoSesion } from '../contextos/ProveedorSesion.jsx';

const usarContextoSesion = () => {
  const contexto = useContext(ContextoSesion);

  if (!contexto) {
    throw new Error('usarContextoSesion debe usarse dentro de ProveedorSesion');
  }

  return contexto;
};

export default usarContextoSesion;