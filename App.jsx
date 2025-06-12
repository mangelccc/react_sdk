/**
 * Componente principal de la aplicación Agent Chat
 * Configura el contexto global y renderiza la aplicación
 * Autor: Miguel Ángel
 */

import React from 'react';
import ProveedorChat from './contextos/ProveedorChat.jsx';
import ChatPrincipal from './componentes/ChatAgent/paginas/ChatPrincipal.jsx';
import './App.css';

/**
 * Componente App - Raíz de la aplicación
 * @returns {JSX.Element} - Aplicación completa
 */
const App = () => {
  return (
    <div className="app">
      <ProveedorChat>
        <ChatPrincipal />
      </ProveedorChat>
    </div>
  );
};

export default App;