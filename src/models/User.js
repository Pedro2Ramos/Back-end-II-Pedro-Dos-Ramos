const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  role: { type: String, default: "user" },
});

// Encriptar contraseñas antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Método para generar token JWT
userSchema.methods.generateJwt = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;