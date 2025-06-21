/**
 * Componente para mostrar la lista de mensajes del chat
 * Maneja el scroll automático y la renderización de mensajes
 * Autor: Miguel Ángel
 */

import React, { useEffect, useRef } from 'react';
import { usarContextoChat } from '../../contextos/ProveedorChat.jsx';
import Mensaje from './Mensaje.jsx';
import IndicadorEscritura from './IndicadorEscritura.jsx';
import ContenedorListaMensajes from '../../contenedores/ContenedorListaMensajes.jsx';


// Componente ListaMensajes - Renderiza la lista completa de mensajes

const ListaMensajes = () => {
  const finMensajesRef = useRef(null);
  const { 
    estaEscribiendo, 
    chatActual 
  } = usarContextoChat();

  let mensajes = chatActual?.mensajes || [];

  const desplazarAlFinal = () => {
    finMensajesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    desplazarAlFinal();
  }, [mensajes, estaEscribiendo]);

  return (
    <ContenedorListaMensajes>
      <div className="listaMensajes">
        <div className="listaMensajes__contenedor">

          {/* Renderizar mensajes */}
          {mensajes.length > 0 ? (
            mensajes.map((mensaje) => (
              <Mensaje
                key={mensaje.id}
                mensaje={mensaje}
              />
            ))
          ) : (
            <div className="listaMensajes__vacio">
              <div className="listaMensajes__iconoVacio">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 12H16M8 16H13M12 2C13.1046 2 14 2.89543 14 4V8H20C21.1046 8 22 8.89543 22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10C2 8.89543 2.89543 8 4 8H10V4C10 2.89543 10.8954 2 12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="listaMensajes__tituloVacio">
                ¡Comienza una conversación!
              </h3>
              <p className="listaMensajes__textoVacio">
                Escribe un mensaje para empezar a chatear con el agente
              </p>
            </div>
          )}

          {/* Indicador de escritura */}
          {estaEscribiendo && <IndicadorEscritura />}

          {/* Referencia para scroll automático */}
          <div ref={finMensajesRef} />
        </div>
      </div>
    </ContenedorListaMensajes>
  );
};

export default ListaMensajes;