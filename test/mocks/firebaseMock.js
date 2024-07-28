// firebasemock.js

const initializeApp = jest.fn(() => ({
    // Puedes devolver objetos o funciones simuladas necesarias para tu prueba
  }));
  
  const getAnalytics = jest.fn();
  const getAuth = jest.fn(() => ({
    // Puedes devolver objetos o funciones simuladas necesarias para tu prueba
  }));
  const GoogleAuthProvider = jest.fn();
  const getFirestore = jest.fn();
  
  module.exports = {
    initializeApp,
    getAnalytics,
    getAuth,
    GoogleAuthProvider,
    getFirestore,
  };
  