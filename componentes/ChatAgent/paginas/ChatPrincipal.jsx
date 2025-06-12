/**
 * Aplicación principal de chat con agente IA
 * Integra todos los componentes y maneja el estado global de la aplicación
 * Autor: Miguel Ángel
 */

import React, { useState } from 'react';
import { usarContextoChat } from '../../../contextos/ProveedorChat.jsx';
import Cabecera from './CabeceraChat.jsx';
import ListaMensajes from '../componentes/ListaMensajes.jsx';
import EntradaMensaje from '../componentes/EntradaMensaje.jsx';
import SidebarChats from '../componentes/SidebarChats.jsx';
import ErrorDisplay from '../componentes/ErrorDisplay.jsx';
import Footer from './Footer.jsx';
import ContenedorChatPrincipal from '../../../contenedores/ContenedorChatPrincipal.jsx'
import ContenidoChat from '../../../contenedores/ContenidoChat.jsx';


/**
 * Componente principal de la aplicación de chat
 * Coordina la interacción entre usuario y agente IA
 */
const ChatPrincipal = () => {

  const {
    error
  } = usarContextoChat();

  return (
    <ContenedorChatPrincipal>
      <Cabecera />
      <ContenidoChat>
        {error && (
          <ErrorDisplay />
        )}
        <ListaMensajes />
        <EntradaMensaje />
      </ContenidoChat>

      <SidebarChats />

      <Footer />
    </ContenedorChatPrincipal>
  );
};

export default ChatPrincipal;