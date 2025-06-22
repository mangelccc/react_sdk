/**
 * Componente de inicio de sesión
 * Formulario para autenticación de usuarios
 * Autor: Miguel Ángel
 */

import React, { useState } from 'react';
import ContenedorInicioSesion from '../../contenedores/ContenedorInicioSesion.jsx';

const InicioSesion = ({ onLogin }) => {
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
    if (onLogin) onLogin(); // Cerrar popup
  };

  const manejarLoginApple = () => {
    console.log('Iniciar sesión con Apple');
    // Lógica para Apple OAuth
    if (onLogin) onLogin(); // Cerrar popup
  };

  return (
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
            placeholder="Enter your Email" 
            className="inicioSesion__input" 
            type="email" 
            name="email"
            value={datosFormulario.email}
            onChange={(evento) => {
              actualizarDato(evento);
            }}
          />
        </div>

        {/* Campo Password */}
        <div className="inicioSesion__flexColumn">
          <label className="inicioSesion__label">Password</label>
        </div>
        <div className="inicioSesion__inputForm">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="-64 0 512 512" height={20}>
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
          </svg>        
          <input 
            placeholder="Enter your Password" 
            className="inicioSesion__input" 
            type="password" 
            name="password"
            value={datosFormulario.password}
            onChange={(evento) => {
              actualizarDato(evento);
            }}
          />
        </div>

        {/* Remember Me y Forgot Password */}
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
            <label className="inicioSesion__checkboxLabel">Remember me</label>
          </div>
          <span className="inicioSesion__forgotPassword">Forgot password?</span>
        </div>

        {/* Botón de envío */}
        <input
          type='button'
          value='Sign In'
          className="inicioSesion__buttonSubmit"
          onClick={(evento) => {
            if (validarFormulario(evento)) {
              console.log("Envío datos al servidor...", datosFormulario);
              if (onLogin) onLogin(); // Cerrar popup
            }
          }}
        />

        {/* Control de errores */}
        {errores.length > 0 && (
          <div className="inicioSesion__errores">
            {errores.map((error, index) => (
              <p key={index} className="inicioSesion__error">{error}</p>
            ))}
          </div>
        )}

        {/* Enlaces de registro */}
        <p className="inicioSesion__text">
          Don't have an account? 
          <span className="inicioSesion__signUpLink">Sign Up</span>
        </p>

        <p className="inicioSesion__text inicioSesion__divider">Or With</p>

        {/* Botones de OAuth */}
        <div className="inicioSesion__flexRow">
          <button 
            type="button" 
            className="inicioSesion__oauthButton inicioSesion__googleButton"
            onClick={manejarLoginGoogle}
          >
            <svg 
              xmlSpace="preserve" 
              style={{enableBackground: 'new 0 0 512 512'}} 
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
                C103.821,274.792,107.225,292.797,113.47,309.408z" style={{fill: '#FBBB00'}} />
              <path d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
                c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
                c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" style={{fill: '#518EF8'}} />
              <path d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
                c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
                c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" style={{fill: '#28B446'}} />
              <path d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
                c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
                C318.115,0,375.068,22.126,419.404,58.936z" style={{fill: '#F14336'}} />
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
              style={{enableBackground: 'new 0 0 22.773 22.773'}} 
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
        </div>
      </form>
    </ContenedorInicioSesion>
  );
};

export default InicioSesion;