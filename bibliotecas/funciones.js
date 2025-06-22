/**
 * Biblioteca de funciones auxiliares y utilidades generales
 * Contiene funciones reutilizables para toda la aplicación
 * Autor: Miguel Ángel
 */

/**
 * Genera un UUID aleatorio usando la API nativa del navegador
 * @returns {string} - UUID único
 */
const generarUuidAleatorio = () => {
  return crypto.randomUUID();
};

/**
 * Genera un número aleatorio dentro de un rango
 * @param {number} min - Número mínimo
 * @param {number} max - Número máximo
 * @returns {number} - Número aleatorio
 */
const generarNumeroAleatorio = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Genera un nombre aleatorio de una lista predefinida
 * @returns {string} - Nombre aleatorio
 */
const generarNombreAleatorio = () => {
  const nombres = [
    "Juan", "María", "Carlos", "Ana", "Luis", "Laura", 
    "Pedro", "Carmen", "Antonio", "Isabel", "Miguel", 
    "Sofia", "Javier", "Elena", "Diego", "Lucía"
  ];
  
  return nombres[Math.floor(Math.random() * nombres.length)];
};

/**
 * Genera un apellido aleatorio de una lista predefinida
 * @returns {string} - Apellido aleatorio
 */
const generarApellidosAleatorio = () => {
  const apellidos = [
    "García", "Rodríguez", "González", "Fernández", "López", 
    "Martínez", "Sánchez", "Pérez", "Gómez", "Martín", 
    "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno"
  ];
  
  return apellidos[Math.floor(Math.random() * apellidos.length)];
};

/**
 * Formatea un número con separadores de miles
 * @param {number} numero - Número a formatear
 * @returns {string} - Número formateado
 */
const formatearNumero = (numero) => {
  return new Intl.NumberFormat('es-ES').format(numero);
};

/**
 * Trunca un texto a una longitud específica
 * @param {string} texto - Texto a truncar
 * @param {number} longitud - Longitud máxima
 * @param {string} sufijo - Sufijo a agregar (default: '...')
 * @returns {string} - Texto truncado
 */
const truncarTexto = (texto, longitud, sufijo = '...') => {
  if (!texto || texto.length <= longitud) return texto;
  return texto.substring(0, longitud) + sufijo;
};

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} texto - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
const capitalizarTexto = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Valida si una cadena es un email válido
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Obtiene una clase CSS aleatoria de colores
 * @returns {string} - Clase CSS de color
 */
const obtenerColorAleatorio = () => {
  const colores = [
    'bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100',
    'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-gray-100'
  ];
  
  return colores[Math.floor(Math.random() * colores.length)];
};

/**
 * Pausa la ejecución por un tiempo determinado
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise<void>}
 */
const esperar = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Clona profundamente un objeto
 * @param {*} obj - Objeto a clonar
 * @returns {*} - Objeto clonado
 */
const clonarObjeto = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Mezcla aleatoriamente un array
 * @param {Array} array - Array a mezclar
 * @returns {Array} - Array mezclado
 */
const mezclarArray = (array) => {
  const arrayClonado = [...array];
  for (let i = arrayClonado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayClonado[i], arrayClonado[j]] = [arrayClonado[j], arrayClonado[i]];
  }
  return arrayClonado;
};

/**
 * Debounce para limitar la frecuencia de ejecución de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} - Función con debounce aplicado
 */
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle para limitar la frecuencia de ejecución de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite en milisegundos
 * @returns {Function} - Función con throttle aplicado
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};


export {
  generarUuidAleatorio,
  generarNumeroAleatorio,
  generarNombreAleatorio,
  generarApellidosAleatorio,
  formatearNumero,
  truncarTexto,
  capitalizarTexto,
  validarEmail,
  obtenerColorAleatorio,
  esperar,
  clonarObjeto,
  mezclarArray,
  debounce,
  throttle
};