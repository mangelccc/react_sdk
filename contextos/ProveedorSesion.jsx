/**
 * Contexto para el manejo global del estado del chat
 * Proporciona acceso a los chats y funciones relacionadas en toda la aplicación
 * Autor: Miguel Ángel
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import useChat from '../hooks/useChat.js';
import { enviarMensajeAlAgente } from '../bibliotecas/chatApi.js';
import { crearMensaje, agregarMensajeAChat, formatearFecha, obtenerEstadisticasChat } from '../bibliotecas/chatUtils.js';
import Swal from 'sweetalert2';
// Crear el contexto
const ContextoSesion = createContext();

/**
 * Proveedor del contexto de sesión
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} - Proveedor del contexto
 */
const ProveedorSesion = ({ children }) => {

    const usuarioInicial = {
        id: 1,
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        nombre: 'Usuario',
        email: 'usuario@example.com',
        contrasena: 'contrasena123',
        avatar: '',
        tipo: 'usuario',
        fecha_nacimiento: '',
        link_linkedin: '',
        link_github: '',
        tema: 'default',
        idioma: 'es',
        mejorarAgente: false,
        instrucciones: '',
        apodo: '',
        oficio: '',
        cualidades: [],
        sobreTi: '',
        funciones: [],
        memoria: false,
    };
    const [usuario, setUsuario] = useState(usuarioInicial);

    const registrarUsuario = (usuario) => {
        setUsuario(usuario);
        Swal.fire({
            title: 'Registro de Usuario',
            text: `Usuario ${usuario.nombre} registrado correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }

  const valoresContexto = {
      usuario,
      registrarUsuario
  };

  return (
    <ContextoSesion.Provider value={valoresContexto}>
      {children}
    </ContextoSesion.Provider>
  );
};

export default ProveedorSesion;
export { ContextoSesion };