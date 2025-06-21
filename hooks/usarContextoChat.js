/**
 * Hook para usar el contexto de chat
 * @returns {Object} - Valores del contexto
 * @throws {Error} - Si se usa fuera del proveedor
 */

import { useContext } from 'react';
import { ContextoChat } from '../contextos/ProveedorChat.jsx';

const usarContextoChat = () => {
  const contexto = useContext(ContextoChat);

  if (!contexto) {
    throw new Error('usarContextoChat debe usarse dentro de ProveedorChat');
  }

  return contexto;
};

export default usarContextoChat;