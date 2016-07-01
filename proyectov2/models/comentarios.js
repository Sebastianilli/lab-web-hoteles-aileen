'use strict';

var mongoose = require('mongoose');

var comentarios = mongoose.Schema({
    nombreHotel: String,
    valoracion: Number,
    mensaje: String
});

module.exports = mongoose.model('Comentarios', comentarios);