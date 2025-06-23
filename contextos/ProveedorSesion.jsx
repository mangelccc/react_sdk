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

    // ========== NUEVAS FUNCIONES PARA REGISTRO CON EMAIL ==========

    /**
     * Función para registrar usuario con email (envía verificación)
     * @param {string} email - Email del usuario a registrar
     */
    const registrarConEmail = async (email) => {
        try {
            // Obtener variables de entorno (igual que en chatApi.js)
            const API_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;
            const API_BASE_URL = import.meta.env.VITE_API_URL;

            console.log("🔍 API_TOKEN:", API_TOKEN);
            console.log("🔍 API_BASE_URL:", API_BASE_URL);

            // Mostrar loading
            Swal.fire({
                title: 'Enviando verificación...',
                text: 'Por favor espera mientras procesamos tu registro',
                icon: 'info',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Hacer petición a la API (igual que en chatApi.js)
            const response = await fetch(`${API_BASE_URL}/api/usuarios/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}` // ← Usando tu variable de entorno
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                // Éxito - Email enviado
                Swal.fire({
                    title: '📧 Verifica tu email',
                    html: `
                        <p>Hemos enviado un email de verificación a:</p>
                        <strong>${email}</strong>
                        <br><br>
                        <p>Haz clic en el enlace del email para activar tu cuenta.</p>
                        <small style="color: #666;">El enlace expira en 30 minutos</small>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#2d79f3'
                });
            } else {
                // Error del servidor
                throw new Error(data.detail || 'Error en el registro');
            }

        } catch (error) {
            console.error('Error en registro:', error);
            Swal.fire({
                title: '❌ Error en el registro',
                text: error.message || 'No se pudo enviar el email de verificación',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    /**
     * Función para manejar cuando el usuario ha verificado su email exitosamente
     * Esta se puede llamar desde otras partes de la app cuando se detecte la verificación
     * @param {string} email - Email del usuario verificado
     */
    const emailVerificado = (email) => {
        Swal.fire({
            title: '🎉 ¡Cuenta activada!',
            html: `
                <p>Tu cuenta ha sido verificada exitosamente.</p>
                <strong>${email}</strong>
                <br><br>
                <p>Ya puedes iniciar sesión y usar todas las funciones.</p>
            `,
            icon: 'success',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#10b981'
        }).then(() => {
            // Aquí puedes redirigir al login o hacer login automático
            console.log('Usuario verificado, redirigir al login');
        });
    };

    /**
     * Función para mostrar estado de espera de verificación
     * Útil para mostrar cuando el usuario está esperando verificar
     */
    const esperandoVerificacion = (email) => {
        Swal.fire({
            title: '⏳ Esperando verificación',
            html: `
                <p>Revisa tu bandeja de entrada en:</p>
                <strong>${email}</strong>
                <br><br>
                <p>Si no encuentras el email, revisa tu carpeta de spam.</p>
                <br>
                <button onclick="location.reload()" style="
                    background: #2d79f3;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                ">Reenviar email</button>
            `,
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: {
                popup: 'swal-verificacion-popup'
            }
        });
    };

    // ========== RESTO DEL CÓDIGO ORIGINAL ==========

    // Crear un estado inicial con valores por defecto
    const valoresIniciales = {
        email: '',
        password: '',
        rememberMe: false
    };

    const erroresIniciales = [];
    // Estado para los valores del formulario
    const [datosFormulario, setDatosFormulario] = useState(valoresIniciales);
    const [errores, setErrores] = useState(erroresIniciales);

    // Función para actualizar el estado con los datos del evento
    const actualizarDato = (evento) => {
        // Se obtienen los datos necesarios del evento que lanza esta función: el input
        const { name, value, type, checked } = evento.target;
        // Se asigna al estado
        setDatosFormulario({ 
            ...datosFormulario, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    // Función que valida el valor de un input
    const validarDato = (elemento) => {
        // Desestructuración del objeto target
        const { name, value } = elemento;
        // Variable con los errores de cada elemento
        let erroresElemento = [];
        
        // Campo email
        if (name === "email") {
            // Se comprueba si tiene algo escrito
            if (!value.length) {
                erroresElemento = [
                    ...erroresElemento,
                    `El campo ${name} debe tener un valor.`,
                ];
            }
            // Se comprueba si cumple los requisitos de email
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                erroresElemento = [
                    ...erroresElemento,
                    `El email debe tener un formato válido.`,
                ];
            }
        }
        
        // Campo password
        if (name === "password") {
            // Se comprueba si tiene algo escrito
            if (!value.length) {
                erroresElemento = [
                    ...erroresElemento,
                    `El campo ${name} debe tener un valor.`,
                ];
            }
            // Se comprueba si cumple los requisitos
            if (value.length < 6) {
                erroresElemento = [
                    ...erroresElemento,
                    `La contraseña debe tener al menos 6 caracteres.`,
                ];
            }
        }
        
        // Se devuelve el listado de errores (o ninguno)
        return erroresElemento;
    };

    // Función para validar el formulario
    const validarFormulario = (evento) => {
        // Se accede al elemento <form> que contiene el listado de todos sus elementos (elements)
        const formulario = evento.target.parentNode;
        // Array vacío para guardar todos los errores del formulario
        let erroresListado = [];
        // Se recorre el formulario comprobando cada elemento
        for (var i = 0; i < formulario.elements.length - 1; i++) {
            // Solo validar inputs de texto y email
            if (formulario.elements[i].type === 'email' || formulario.elements[i].type === 'password') {
                // Validar dato devuelve un array con los errores de ese elemento
                let erroresElemento = validarDato(formulario.elements[i]);
                // Se comprueba si hay errores o no (aplicando un estilo)
                erroresElemento.length !== 0
                    ? formulario.elements[i].classList.add("error")
                    : formulario.elements[i].classList.remove("error");
                // Se añaden los errores (si existen) de cada elemento a erroresListado
                erroresListado = [...erroresListado, ...erroresElemento];
            }
        }
        // Se cambia el valor el estado por los errores producidos
        setErrores(erroresListado);
        // Se devuelve un booleano para poder realizar una acción tras la comprobación
        // Si no hay errores se devuelve true
        return erroresListado.length === 0;
    };

    const manejarLoginGoogle = () => {
        console.log('Iniciar sesión con Google');
        // Lógica para Google OAuth
        if (cerrarLogin) cerrarLogin(); // Cerrar popup
    };

    const manejarLoginApple = () => {
        console.log('Iniciar sesión con Apple');
        // Lógica para Apple OAuth
        if (cerrarLogin) cerrarLogin(); // Cerrar popup
    };

    const cerrarLogin = () => {
        setMostrarLogin(false);
    };

    const [mostrarLogin, setMostrarLogin] = useState(true); 

    const valoresContexto = {
        usuario,
        registrarUsuario,
        registrarConEmail,        // ← Nueva función
        emailVerificado,          // ← Nueva función
        esperandoVerificacion,    // ← Nueva función
        actualizarDato,
        validarFormulario,
        datosFormulario,
        errores,
        manejarLoginGoogle,
        manejarLoginApple,
        cerrarLogin,
        mostrarLogin,
    };

    return (
        <ContextoSesion.Provider value={valoresContexto}>
            {children}
        </ContextoSesion.Provider>
    );
};

export default ProveedorSesion;
export { ContextoSesion };