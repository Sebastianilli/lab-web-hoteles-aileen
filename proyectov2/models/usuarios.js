'use strict';

var mongoose = require('mongoose');

var usuarios = mongoose.Schema({
  nombre:   String,
  aPaterno:    String, // Año en el que fue creado el lenguaje
  aMaterno:    String,
  correo:    String,
  contrasena:    String,
  fNacimiento:    String,
  estatus: String,
  codigo: String
});

module.exports = mongoose.model('Usuarios', usuarios);