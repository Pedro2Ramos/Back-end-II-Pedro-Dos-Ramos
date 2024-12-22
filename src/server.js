const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nombreBaseDeDatos', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Mongoose está conectado a la base de datos');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose está desconectado');
});

// Función para verificar el estado de la conexión
const verificarConexion = () => {
  switch (mongoose.connection.readyState) {
    case 0:
      console.log('Mongoose no está conectado');
      break;
    case 1:
      console.log('Mongoose está conectado');
      break;
    case 2:
      console.log('Mongoose está desconectando');
      break;
    case 3:
      console.log('Mongoose está reconectando');
      break;
    default:
      console.log('Estado desconocido');
  }
};

verificarConexion();

// Aquí inicia tu aplicación
const app = require('./app');  // O archivo de configuración principal
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
