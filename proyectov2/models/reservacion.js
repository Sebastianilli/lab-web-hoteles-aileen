'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var reservaciones = mongoose.Schema({
  correo: String,
  nombreHotel: String,
  direccionHotel: String,
  ciudad: String,
  tipoHab: String,
  noHab: Number,
  nPersonas: Number,
  noches: Number,
  costo: Number,
  fEntrada: String,
  fSalida: String,
  nombreTitular: String,
  noTarjeta: Number,
  fExpedicion: Date
});

module.exports = mongoose.model('Reservaciones', reservaciones);