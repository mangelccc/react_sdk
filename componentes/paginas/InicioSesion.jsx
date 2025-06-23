/**
 * Componente de inicio de sesión y registro
 * Formulario para autenticación de usuarios con alternancia
 * Autor: Miguel Ángel
 */

import React, { useState } from 'react';
import ContenedorInicioSesion from '../../contenedores/ContenedorInicioSesion.jsx';
import usarContextoSesion from '../../hooks/usarContextoSesion.js';

const InicioSesion = () => {
    const {
        actualizarDato,
        validarFormulario,
        datosFormulario,
        errores,
        manejarLoginGoogle,
        manejarLoginApple,
        cerrarLogin
    } = usarContextoSesion();

    // Estado para alternar entre login y registro
    const [modoRegistro, setModoRegistro] = useState(false);

    const alternarModo = () => {
        setModoRegistro(!modoRegistro);
    };

    const manejarSubmit = (evento) => {
        if (validarFormulario(evento)) {
            if (modoRegistro) {
                console.log("Registrando usuario...", datosFormulario);
                // Aquí irá la lógica de registro
            } else {
                console.log("Iniciando sesión...", datosFormulario);
                // Aquí va la lógica de login
            }
            if (cerrarLogin) cerrarLogin();
        }
    };

    return (
        <div className="login-popup-overlay">
            <div className="login-popup-container" onClick={(e) => e.stopPropagation()}>
                <ContenedorInicioSesion>
                    <form className="inicioSesion__form">

                        {/* Campo Email */}
                        <div className="inicioSesion__flexColumn">
                            <label className="inicioSesion__label">Email</label>
                        </div>
                        <div className="inicioSesion__inputForm">
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 32 32" height={20}>
                                <g data-name="Layer 3" id="Layer_3">
                                    <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                                </g>
                            </svg>
                            <input
                                placeholder="Introduce tu Email..."
                                className="inicioSesion__input"
                                type="email"
                                name="email"
                                value={datosFormulario.email}
                                onChange={(evento) => {
                                    actualizarDato(evento);
                                }}
                            />
                        </div>

                        {/* Remember Me y Forgot Password (solo para login) */}
                        {!modoRegistro && (
                            <div className="inicioSesion__flexRow">
                                <div className="inicioSesion__checkboxContainer">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={datosFormulario.rememberMe}
                                        onChange={(evento) => {
                                            actualizarDato(evento);
                                        }}
                                        className="inicioSesion__checkbox"
                                    />
                                    <label className="inicioSesion__checkboxLabel">Recordarme</label>
                                </div>
                                <span className="inicioSesion__forgotPassword">¿Olvidaste tu contraseña?</span>
                            </div>
                        )}

                        {/* Términos y condiciones (solo para registro) */}
                        {modoRegistro && (
                            <div className="inicioSesion__flexRow">
                                <div className="inicioSesion__checkboxContainer">
                                    <input
                                        type="checkbox"
                                        name="aceptarTerminos"
                                        checked={datosFormulario.aceptarTerminos || false}
                                        onChange={(evento) => {
                                            actualizarDato(evento);
                                        }}
                                        className="inicioSesion__checkbox"
                                    />
                                    <label className="inicioSesion__checkboxLabel">
                                        Acepto los <span className="inicioSesion__link">términos y condiciones</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Botón de envío */}
                        <input
                            type='button'
                            value={modoRegistro ? 'Registrarse' : 'Iniciar Sesión'}
                            className="inicioSesion__buttonSubmit"
                            onClick={manejarSubmit}
                        />

                        {/* Control de errores */}
                        {errores.length > 0 && (
                            <div className="inicioSesion__errores">
                                {errores.map((error, index) => (
                                    <p key={index} className="inicioSesion__error">{error}</p>
                                ))}
                            </div>
                        )}

                        {/* Enlaces de alternancia */}
                        <p className="inicioSesion__text">
                            {modoRegistro ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
                            <span
                                className="inicioSesion__signUpLink"
                                onClick={alternarModo}
                                style={{ cursor: 'pointer' }}
                            >
                                {modoRegistro ? 'Inicia sesión' : 'Regístrate'}
                            </span>
                        </p>

                        <p className="inicioSesion__text inicioSesion__divider"><span>O con</span></p>

                        {/* Botones de OAuth */}
                        <div className="inicioSesion__flexColum">
                            <button
                                type="button"
                                className="inicioSesion__oauthButton inicioSesion__googleButton"
                                onClick={manejarLoginGoogle}
                            >
                                <svg
                                    xmlSpace="preserve"
                                    style={{ enableBackground: 'new 0 0 512 512' }}
                                    viewBox="0 0 512 512"
                                    y="0px"
                                    x="0px"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    xmlns="http://www.w3.org/2000/svg"
                                    id="Layer_1"
                                    width={20}
                                    version="1.1"
                                >
                                    <path d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
                    c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
                    C103.821,274.792,107.225,292.797,113.47,309.408z" style={{ fill: '#FBBB00' }} />
                                    <path d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
                    c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
                    c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" style={{ fill: '#518EF8' }} />
                                    <path d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
                    c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
                    c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" style={{ fill: '#28B446' }} />
                                    <path d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
                    c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
                    C318.115,0,375.068,22.126,419.404,58.936z" style={{ fill: '#F14336' }} />
                                </svg>
                                Google
                            </button>

                            <button
                                type="button"
                                className="inicioSesion__oauthButton inicioSesion__appleButton"
                                onClick={manejarLoginApple}
                            >
                                <svg
                                    xmlSpace="preserve"
                                    style={{ enableBackground: 'new 0 0 22.773 22.773' }}
                                    viewBox="0 0 22.773 22.773"
                                    y="0px"
                                    x="0px"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    xmlns="http://www.w3.org/2000/svg"
                                    id="Capa_1"
                                    width={20}
                                    height={20}
                                    version="1.1"
                                >
                                    <g>
                                        <g>
                                            <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                                            <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
                                        </g>
                                    </g>
                                </svg>
                                Apple
                            </button>
                            <button
                                type="button"
                                className="inicioSesion__oauthButton inicioSesion__githubButton"
                                onClick={manejarLoginApple}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width={20}
                                    height={20}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                >
                                    <path d="M12 0.297C5.37 0.297 0 5.667 0 12.297c0 5.29 3.438 9.787 8.205 11.387.6.11.82-.26.82-.577 
    0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 
    1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.775.42-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 
    0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.005 2.045.14 
    3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 
    5.92.435.375.81 1.096.81 2.21 0 1.595-.015 2.88-.015 3.27 0 .315.21.69.825.57C20.565 22.08 24 17.58 24 
    12.297c0-6.63-5.37-12-12-12"/>
                                </svg>
                                GitHub
                            </button>

                        </div>
                    </form>
                </ContenedorInicioSesion>
            </div>
        </div>
    );
};

export default InicioSesion;