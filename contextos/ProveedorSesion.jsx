/**
 * Contexto para el manejo global del estado del chat
 * Proporciona acceso a los chats y funciones relacionadas en toda la aplicación
 * Autor: Miguel Ángel - OPTIMIZADO con nuevo método de login - TODO EN EL CONTEXTO
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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

    // ========== ESTADOS DEL CONTEXTO ==========
    
    // Estado para alternar entre login y registro
    const [modoRegistro, setModoRegistro] = useState(false);
    
    // Estado para controlar la visibilidad del popup
    const [mostrarPopupLogin, setMostrarPopupLogin] = useState(true);
    
    // ✅ NUEVO ESTADO: Para controlar cuando hay SweetAlert activo
    const [swalActivo, setSwalActivo] = useState(false);
    
    // ✅ ESTADOS PARA POLLING SIN useRef
    const [pollingActivo, setPollingActivo] = useState(false);
    const [emailParaVerificar, setEmailParaVerificar] = useState('');
    const [tiempoInicioPolling, setTiempoInicioPolling] = useState(null);

    // Crear un estado inicial con valores por defecto
    const valoresIniciales = {
        email: '',
        password: '',
        rememberMe: false,
        aceptarTerminos: false
    };

    const erroresIniciales = [];
    // Estado para los valores del formulario
    const [datosFormulario, setDatosFormulario] = useState(valoresIniciales);
    const [errores, setErrores] = useState(erroresIniciales);
    const [mostrarLogin, setMostrarLogin] = useState(true);

    // ========== FUNCIONES BÁSICAS ==========

    const registrarUsuario = (usuario) => {
        setUsuario(usuario);
        mostrarSwal({
            title: 'Registro de Usuario',
            text: `Usuario ${usuario.nombre} registrado correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }

    /**
     * ✅ NUEVA FUNCIÓN: Mostrar SweetAlert2 y manejar visibilidad del popup
     * @param {Object} swalOptions - Opciones de SweetAlert2
     * @param {boolean} volverAMostrarPopup - Si debe volver a mostrar el popup al cerrar
     * @returns {Promise} - Promise de SweetAlert2
     */
    const mostrarSwal = (swalOptions, volverAMostrarPopup = true) => {
        // Ocultar popup de login
        setSwalActivo(true);
        setMostrarPopupLogin(false);
        
        return Swal.fire(swalOptions).then((result) => {
            // Al cerrar SweetAlert, manejar visibilidad del popup
            setSwalActivo(false);
            
            if (volverAMostrarPopup) {
                setMostrarPopupLogin(true);
            }
            
            return result;
        });
    };

    /**
     * ✅ NUEVA FUNCIÓN: Mostrar SweetAlert2 persistente (sin volver a mostrar popup)
     * @param {Object} swalOptions - Opciones de SweetAlert2
     * @returns {Promise} - Promise de SweetAlert2
     */
    const mostrarSwalPersistente = (swalOptions) => {
        return mostrarSwal(swalOptions, false);
    };

    // Función para actualizar el estado con los datos del evento
    const actualizarDato = (evento) => {
        // Se obtienen los datos necesarios del evento que lanza esta función: el input
        const { name, value, type, checked } = evento.target;
        // Se asigna al estado
        setDatosFormulario({ 
            ...datosFormulario, 
            [name]: type === 'checkbox' ? checked : value 
        });
        
        // ✅ NUEVA FUNCIONALIDAD: Validación en tiempo real para email
        if (name === 'email' && value.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            // Validar email con un pequeño delay para evitar muchas llamadas
            clearTimeout(window.emailValidationTimeout);
            window.emailValidationTimeout = setTimeout(async () => {
                await validarEmailEnTiempoReal(value);
            }, 1000); // 1 segundo de delay
        }
    };

    /**
     * ✅ NUEVA FUNCIÓN: Validación de email en tiempo real
     * @param {string} email - Email a validar
     */
    const validarEmailEnTiempoReal = async (email) => {
        try {
            const emailExiste = await verificarEmailExiste(email);
            let erroresEmail = [];
            
            if (modoRegistro) {
                // En modo REGISTRO: el email NO debe existir
                if (emailExiste) {
                    erroresEmail = [`Este email ya está registrado. Cambia a modo login.`];
                }
            } else {
                // En modo LOGIN: el email SÍ debe existir
                if (!emailExiste) {
                    erroresEmail = [`Este email no está registrado. Cambia a modo registro.`];
                }
            }
            
            // Actualizar errores solo para email
            setErrores(erroresEmail);
            
            // Aplicar estilo visual al campo
            const emailInput = document.querySelector('input[name="email"]');
            if (emailInput) {
                erroresEmail.length > 0 
                    ? emailInput.classList.add("error")
                    : emailInput.classList.remove("error");
            }
            
        } catch (error) {
            console.error('Error en validación en tiempo real:', error);
        }
    };

    // Función que valida el valor de un input (AHORA CON VALIDACIÓN DE EMAIL ASÍNCRONA)
    const validarDato = async (elemento) => {
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
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                erroresElemento = [
                    ...erroresElemento,
                    `El email debe tener un formato válido.`,
                ];
            }
            // ✅ NUEVA VALIDACIÓN: Verificar existencia según el modo
            else {
                const emailExiste = await verificarEmailExiste(value);
                
                if (modoRegistro) {
                    // En modo REGISTRO: el email NO debe existir
                    if (emailExiste) {
                        erroresElemento = [
                            ...erroresElemento,
                            `Este email ya está registrado. Cambia a modo login.`,
                        ];
                    }
                } else {
                    // En modo LOGIN: el email SÍ debe existir
                    if (!emailExiste) {
                        erroresElemento = [
                            ...erroresElemento,
                            `Este email no está registrado. Cambia a modo registro.`,
                        ];
                    }
                }
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

    // Función para validar el formulario (AHORA ASÍNCRONA)
    const validarFormulario = async (evento) => {
        // Se accede al elemento <form> que contiene el listado de todos sus elementos (elements)
        const formulario = evento.target.parentNode;
        // Array vacío para guardar todos los errores del formulario
        let erroresListado = [];
        
        // Se recorre el formulario comprobando cada elemento
        for (var i = 0; i < formulario.elements.length - 1; i++) {
            // Solo validar inputs de texto y email
            if (formulario.elements[i].type === 'email' || formulario.elements[i].type === 'password') {
                // ✅ AHORA ES ASÍNCRONO: Validar dato devuelve un array con los errores de ese elemento
                let erroresElemento = await validarDato(formulario.elements[i]);
                
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

    // ========== FUNCIONES OPTIMIZADAS PARA LOGIN Y REGISTRO ==========

    /**
     * ✅ NUEVA FUNCIÓN OPTIMIZADA: Verificar si email existe (súper eficiente)
     * @param {string} email - Email a verificar
     * @returns {boolean} - true si existe, false si no existe
     */
    const verificarEmailExiste = async (email) => {
        try {
            const API_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;
            const API_BASE_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                const exists = await response.json(); // true o false
                return exists;
            }
            return false;
        } catch (error) {
            console.error('Error verificando email:', error);
            return false;
        }
    };

    /**
     * ✅ FUNCIÓN OPTIMIZADA: Reemplaza la pesada por la eficiente
     * @param {string} email - Email a verificar
     * @returns {boolean} - true si el usuario fue verificado
     */
    const verificarEstadoEmail = async (email) => {
        // Usar el nuevo método súper eficiente
        return await verificarEmailExiste(email);
    };

    /**
     * ✅ FUNCIÓN SIMPLIFICADA: Validación previa (sin popups)
     * @param {string} email - Email a validar
     * @returns {boolean} - true si puede registrarse, false si no
     */
    const validarAntesDelRegistro = async (email) => {
        try {
            const existe = await verificarEmailExiste(email);
            return !existe; // Retorna true si NO existe (puede registrarse)
        } catch (error) {
            console.error('Error validando email:', error);
            return false;
        }
    };

    /**
     * ✅ FUNCIÓN SIMPLIFICADA: Manejo de login real (CON MANEJO DE POPUP)
     * @param {string} email - Email del usuario
     * @returns {boolean} - true si login exitoso, false si no
     */
    const manejarLoginReal = async (email) => {
        try {
            console.log("Verificando login...", email);
            
            const emailExiste = await verificarEmailExiste(email);
            
            if (emailExiste) {
                console.log("✅ Usuario encontrado, procediendo con login...");
                
                // ✅ Usar mostrarSwalPersistente para no volver a mostrar popup (login exitoso)
                await mostrarSwalPersistente({
                    title: '✅ Usuario encontrado',
                    text: `Bienvenido de vuelta`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                // Aquí puedes agregar más lógica de autenticación (JWT, etc.)
                return true; // Login exitoso
            }
            
            // Si no existe, el error ya se muestra en validarDato
            return false; // Login fallido
            
        } catch (error) {
            console.error('Error en login:', error);
            
            // ✅ Usar mostrarSwal para volver a mostrar popup después del error
            await mostrarSwal({
                title: '❌ Error en login',
                text: 'Hubo un problema al verificar tu cuenta. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Reintentar'
            });
            
            return false;
        }
    };

    /**
     * ✅ FUNCIÓN POLLING SIN useRef - CON MANEJO DE POPUP
     */
    const iniciarVerificacionPeriodica = (email) => {
        // ✅ Ocultar popup y marcar SweetAlert como activo
        setSwalActivo(true);
        setMostrarPopupLogin(false);
        
        // Mostrar SweetAlert2 de espera
        Swal.fire({
            title: '⏳ Esperando verificación',
            html: `
                <p>Hemos enviado un email de verificación a:</p>
                <strong style="color: #2d79f3;">${email}</strong>
                <br><br>
                <p>Revisa tu email y haz clic en el enlace...</p>
                <div style="margin-top: 15px; width: 100%;">
                    <div class="spinner" style="
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #2d79f3;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    "></div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `,
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cancelar registro',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            // Si el usuario cancela, detener el polling y volver a mostrar popup
            if (result.dismiss === Swal.DismissReason.cancel) {
                detenerPolling();
                setSwalActivo(false);
                setMostrarPopupLogin(true);
            }
        });

        // ✅ INICIAR POLLING CON ESTADOS LIMPIOS
        setEmailParaVerificar(email);
        setTiempoInicioPolling(Date.now());
        setPollingActivo(true);
    };

    /**
     * ✅ FUNCIÓN PARA DETENER POLLING CON MANEJO DE POPUP
     */
    const detenerPolling = () => {
        setPollingActivo(false);
        setEmailParaVerificar('');
        setTiempoInicioPolling(null);
        Swal.close();
        // ✅ Al detener polling, marcar SweetAlert como inactivo
        setSwalActivo(false);
    };

    /**
     * ✅ FUNCIÓN ALTERNAR MODO SIN useRef
     */
    const alternarModo = () => {
        setModoRegistro(!modoRegistro);
        // ✅ LIMPIAR POLLING CON ESTADOS
        detenerPolling();
        // ✅ ASEGURAR que el popup esté visible
        setMostrarPopupLogin(true);
    };

    /**
     * ✅ FUNCIÓN MANEJAR SUBMIT MEJORADA (CON VALIDACIÓN DOBLE)
     */
    const manejarSubmit = async (evento) => {
        // ✅ VALIDACIÓN ASÍNCRONA: Primero validar formulario básico
        const formularioValido = await validarFormulario(evento);
        
        if (!formularioValido) {
            console.log("❌ Formulario con errores básicos, revisar campos");
            return;
        }

        // ✅ VALIDACIÓN ESPECÍFICA DE EMAIL: Doble verificación antes de proceder
        const email = datosFormulario.email;
        const emailExiste = await verificarEmailExiste(email);
        
        if (modoRegistro) {
            // En modo REGISTRO: el email NO debe existir
            if (emailExiste) {
                setErrores([`Este email ya está registrado. Cambia a modo login.`]);
                console.log("❌ Email ya existe, no proceder con registro");
                return;
            }
            
            // ✅ REGISTRO: Email libre, proceder
            console.log("✅ Email libre, registrando usuario...", email);
            await registrarConEmail(email);
            iniciarVerificacionPeriodica(email);
            
        } else {
            // En modo LOGIN: el email SÍ debe existir
            if (!emailExiste) {
                setErrores([`Este email no está registrado. Cambia a modo registro.`]);
                console.log("❌ Email no existe, no proceder con login");
                return;
            }
            
            // ✅ LOGIN: Email existe, proceder
            const loginExitoso = await manejarLoginReal(email);
            
            if (loginExitoso) {
                setTimeout(() => {
                    cerrarLogin();
                }, 1500);
            }
        }
    };

    /**
     * Función para registrar usuario con email (CON MANEJO DE POPUP)
     * @param {string} email - Email del usuario a registrar
     */
    const registrarConEmail = async (email) => {
        try {
            // Obtener variables de entorno (igual que en chatApi.js)
            const API_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;
            const API_BASE_URL = import.meta.env.VITE_API_URL;

            console.log("🔍 API_TOKEN:", API_TOKEN);
            console.log("🔍 API_BASE_URL:", API_BASE_URL);

            // ✅ Mostrar loading y ocultar popup
            setSwalActivo(true);
            setMostrarPopupLogin(false);
            
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
                // ✅ Éxito - Email enviado (cerrar loading y mostrar éxito)
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
                }).then(() => {
                    // ✅ No volver a mostrar popup aquí porque iniciarVerificacionPeriodica manejará la visibilidad
                    setSwalActivo(false);
                });
            } else {
                // Error del servidor
                throw new Error(data.detail || 'Error en el registro');
            }

        } catch (error) {
            console.error('Error en registro:', error);
            
            // ✅ Error - Mostrar error y volver a mostrar popup
            await mostrarSwal({
                title: '❌ Error en el registro',
                text: error.message || 'No se pudo enviar el email de verificación',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    /**
     * Función para manejar cuando el usuario ha verificado su email exitosamente (CON MANEJO DE POPUP)
     * Esta se puede llamar desde otras partes de la app cuando se detecte la verificación
     * @param {string} email - Email del usuario verificado
     */
    const emailVerificado = (email) => {
        // ✅ Usar mostrarSwalPersistente porque después se cierra el popup completamente
        return mostrarSwalPersistente({
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
     * Función para mostrar estado de espera de verificación (CON MANEJO DE POPUP)
     * Útil para mostrar cuando el usuario está esperando verificar
     */
    const esperandoVerificacion = (email) => {
        // ✅ Usar mostrarSwal para volver a mostrar popup después
        return mostrarSwal({
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

    const manejarLoginGoogle = () => {
        console.log('Iniciar sesión con Google');
        // Lógica para Google OAuth
        cerrarLogin(); // Cerrar popup
    };

    const manejarLoginApple = () => {
        console.log('Iniciar sesión con Apple');
        // Lógica para Apple OAuth
        cerrarLogin(); // Cerrar popup
    };

    const manejarLoginGitHub = () => {
        console.log('Iniciar sesión con GitHub');
        // Lógica para GitHub OAuth
        cerrarLogin(); // Cerrar popup
    };

    const cerrarLogin = () => {
        setMostrarLogin(false);
        setMostrarPopupLogin(false);
    };

    // ✅ USEEFFECT PARA POLLING AUTOMÁTICO CON MANEJO DE POPUP
    useEffect(() => {
        if (!pollingActivo || !emailParaVerificar) return;

        console.log('🔍 Iniciando polling para:', emailParaVerificar);

        const intervalo = setInterval(async () => {
            console.log('🔍 Verificando si el email fue confirmado...', emailParaVerificar);
            
            // ✅ Verificar si ha pasado el timeout (10 minutos)
            if (tiempoInicioPolling && Date.now() - tiempoInicioPolling > 600000) {
                detenerPolling();
                
                // ✅ Usar mostrarSwal para volver a mostrar popup después del timeout
                await mostrarSwal({
                    title: '⏰ Tiempo agotado',
                    text: 'El tiempo de verificación ha expirado. Puedes intentar registrarte nuevamente.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#f39c12'
                });
                
                console.log('⏰ Timeout: Dejando de verificar el email');
                return;
            }
            
            // ✅ Verificar si el email fue confirmado
            const usuarioVerificado = await verificarEstadoEmail(emailParaVerificar);
            
            if (usuarioVerificado) {
                // ¡Email verificado! Detener polling
                detenerPolling();

                // Mostrar popup de éxito
                await emailVerificado(emailParaVerificar);

                // ✅ AUTO-LOGIN: Usuario verificado exitosamente
                console.log('🎉 Usuario verificado, iniciando sesión automática...');
                
                // ✅ Usar mostrarSwalPersistente porque después se cierra todo
                await mostrarSwalPersistente({
                    title: '🎉 ¡Cuenta verificada!',
                    text: 'Tu cuenta ha sido creada exitosamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Cerrar popup después del éxito
                setTimeout(() => {
                    cerrarLogin();
                }, 2000);
            }
        }, 3000); // Verificar cada 3 segundos

        // Cleanup: limpiar intervalo cuando el componente se desmonte o cambie el estado
        return () => {
            clearInterval(intervalo);
        };
    }, [pollingActivo, emailParaVerificar, tiempoInicioPolling]);

    // ✅ USEEFFECT PARA LIMPIAR TIMEOUTS AL DESMONTAR
    useEffect(() => {
        return () => {
            // Limpiar timeout de validación en tiempo real
            if (window.emailValidationTimeout) {
                clearTimeout(window.emailValidationTimeout);
            }
            // Detener cualquier polling activo
            detenerPolling();
        };
    }, []);

    // ✅ VALORES DEL CONTEXTO - CON MANEJO AUTOMÁTICO DE POPUP
    const valoresContexto = {
        // ✅ ESTADOS
        usuario,
        datosFormulario,
        errores,
        mostrarLogin,
        mostrarPopupLogin: mostrarPopupLogin && !swalActivo, // ✅ Ocultar si hay SweetAlert activo
        modoRegistro,
        pollingActivo,
        swalActivo,                      // ← Nuevo estado
        
        // ✅ FUNCIONES BÁSICAS
        registrarUsuario,
        actualizarDato,
        validarFormulario,
        
        // ✅ FUNCIONES OPTIMIZADAS (CON MANEJO DE POPUP)
        verificarEmailExiste,
        verificarEstadoEmail,
        validarEmailEnTiempoReal,
        manejarLoginReal,
        registrarConEmail,
        emailVerificado,
        esperandoVerificacion,
        iniciarVerificacionPeriodica,
        detenerPolling,
        mostrarSwal,                     // ← Nueva función
        mostrarSwalPersistente,          // ← Nueva función
        
        // ✅ FUNCIONES DE CONTROL
        alternarModo,
        manejarSubmit,
        manejarLoginGoogle,
        manejarLoginApple,
        manejarLoginGitHub,
        cerrarLogin,
    };

    return (
        <ContextoSesion.Provider value={valoresContexto}>
            {children}
        </ContextoSesion.Provider>
    );
};

export default ProveedorSesion;
export { ContextoSesion };