/**
 * Componente principal de la aplicación Agent Chat
 * Configura el contexto global y renderiza la aplicación
 * Autor: Miguel Ángel
 */

import React from 'react';
import ProveedorChat from './contextos/ProveedorChat.jsx';
import ProveedorSesion from './contextos/ProveedorSesion.jsx';
import ChatPrincipal from './componentes/estructura/ChatPrincipal.jsx';
import ContenedorApp from './contenedores/ContenedorApp.jsx';
import InicioSesion from './componentes/paginas/InicioSesion.jsx';

/**
 * Componente App - Raíz de la aplicación
 * @returns {JSX.Element} - Aplicación completa
 */
const App = () => {
  return (
    <ProveedorSesion>
      <ContenedorApp>
        <ProveedorChat>
          <ChatPrincipal />
        </ProveedorChat>
      </ContenedorApp>
    </ProveedorSesion>
  );
};

export default App;