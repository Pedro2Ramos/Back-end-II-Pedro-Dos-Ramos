const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const User = require('../models/User');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Asegúrate de usar la variable de entorno
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  })
);

mongoose.connection.on('connected', () => {
  console.log('Mongoose está conectado a la base de datos');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose está desconectado');
});

module.exports = passport;
