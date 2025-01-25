import mongoose from 'mongoose';
import { config } from './config.js';

class DbConnection {
  constructor() {
    this.connect();
  }

  connect() {
    if (!config.mongo_url) {
      console.error('La URL de MongoDB no está definida en las variables de entorno.');
      return;
    }

    mongoose.connect(config.mongo_url)
      .then(() => {
        console.log('Conectado a MongoDB');
      })
      .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
      });
  }

  static getInstance() {
    if (!DbConnection.instance) {
      DbConnection.instance = new DbConnection();
    }
    return DbConnection.instance;
  }
}

export default DbConnection;
