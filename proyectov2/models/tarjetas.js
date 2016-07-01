'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var tarjetas = mongoose.Schema({
  correo: String,
  nombreTitular: String,
  noTarjeta: Number,
  fExpedicion: String
});

module.exports = mongoose.model('Tarjetas', tarjetas);