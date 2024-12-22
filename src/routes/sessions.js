// sessions.js
const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// Ruta de registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear el nuevo usuario
    const newUser = new User({ first_name, last_name, email, password, age });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error); // Agrega log para seguimiento de errores
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
});

// Ruta de inicio de sesión
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos." });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = user.generateJwt();

    res.json({ message: "Inicio de sesión exitoso.", token });
  } catch (error) {
    console.error(error); // Agrega log para seguimiento de errores
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
});

// Ruta para obtener usuario autenticado
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      user: {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;
