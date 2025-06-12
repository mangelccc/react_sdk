/**
 * Componente principal de la aplicación Agent Chat
 * Configura el contexto global y renderiza la aplicación
 * Autor: Miguel Ángel
 */

import React from 'react';
import ProveedorChat from './contextos/ProveedorChat.jsx';
import ChatPrincipal from './componentes/ChatAgent/paginas/ChatPrincipal.jsx';
import ContenedorApp from './contenedores/AppContenedor.jsx';

/**
 * Componente App - Raíz de la aplicación
 * @returns {JSX.Element} - Aplicación completa
 */
const App = () => {
  return (
    <ContenedorApp>
      <ProveedorChat>
        <ChatPrincipal />
      </ProveedorChat>
    </ContenedorApp>
  );
};

export default App;