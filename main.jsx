/**
 * Punto de entrada principal de la aplicación Agent Chat
 * Configura React y renderiza la aplicación en el DOM
 * Autor: Miguel Ángel
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Configuración de desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Agent Chat iniciado en modo desarrollo');
  console.log('📡 API configurada en:', import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api');
}

// Crear la raíz de React y renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);