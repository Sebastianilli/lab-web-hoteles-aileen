'use strict';

var mongoose = require('mongoose');

var hoteles = mongoose.Schema({
  id: Number,
  nombre:   String,
  ciudad:    String,
  direccion:    String,
  noHabitacionesSimple: Number,
  HabitacionesSimpleReservedas: Number,
  noHabitacionesDoble: Number,
  HabitacionesDobleReservedas: Number,
  noHabitacionesPremier: Number,
  HabitacionesPremierReservedas: Number,
  costoHabitacionesSimple: Number,
  costoHabitacionesDoble: Number,
  costoHabitacionesPremier: Number,
  imagen: String
});

module.exports = mongoose.model('Hoteles', hoteles);