'use strict';

var mongoose = require('mongoose');

var administradores = mongoose.Schema({
  nombre:   String,
  aPaterno:    String, // Año en el que fue creado el lenguaje
  aMaterno:    String,
  correo:    String,
  contrasena:    String,
  rol:    String,
});

module.exports = mongoose.model('Administradores', administradores);