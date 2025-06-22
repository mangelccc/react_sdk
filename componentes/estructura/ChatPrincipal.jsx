/**
 * Aplicación principal de chat con agente IA
 * Integra todos los componentes y maneja el estado global de la aplicación
 * Autor: Miguel Ángel
 */

import React, { useState } from 'react';
import usarContextoChat from '../../hooks/usarContextoChat.js';
import usarContextoSesion from '../../hooks/usarContextoSesion.js';
import Cabecera from './CabeceraChat.jsx';
import ListaMensajes from '../paginas/ListaMensajes.jsx';
import EntradaMensaje from '../paginas/EntradaMensaje.jsx';
import SidebarChats from '../paginas/SidebarChats.jsx';
import ErrorDisplay from '../paginas/ErrorDisplay.jsx';
import Footer from './Footer.jsx';
import InicioSesion from '../paginas/InicioSesion.jsx';
import ContenedorChatPrincipal from '../../contenedores/ContenedorChatPrincipal.jsx'
import ContenidoChat from '../../contenedores/ContenidoChat.jsx';

/**
 * Componente principal de la aplicación de chat
 * Coordina la interacción entre usuario y agente IA
 */
const ChatPrincipal = () => {

  const {
    error
  } = usarContextoChat();
  const {
    usuario,
    mostrarLogin
  } = usarContextoSesion();
  
  console.log('Usuario actual:', usuario);


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

      {/* Popup de login */}
      {mostrarLogin && (
        <InicioSesion />
      )}

      <Footer />
    </ContenedorChatPrincipal>
  );
};

export default ChatPrincipal;