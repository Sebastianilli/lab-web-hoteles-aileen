var express = require('express');
var router = express.Router();
var correo = "";
var mensaje = "";
var nodemailer = require('nodemailer');
var passport = require('passport');

module.exports = router;

var Reservaciones = require(__dirname + '/../models/reservacion.js');
var Usuarios = require(__dirname + '/../models/usuarios.js');
var Administradores = require(__dirname + '/../models/administradores.js');
var Comentarios = require(__dirname + '/../models/comentarios.js');
var Hoteles = require(__dirname + '/../models/hoteles.js');
var Tarjetas = require(__dirname + '/../models/tarjetas.js');

require('../passport')(passport);
require('../models/usuarios');

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_birthday'] }));

router.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/indexUsuario#/modUsuarios', failureRedirect: '/login' }
));


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/indexUsuario', function(req, res, next) {
  res.render('indexUsuario');
});

router.get('/indexAdmin', function(req, res, next) {
  res.render('indexAdmin');
});

router.get('/confirmacionRegistro', function(req, res, next) {
  res.render('confirmacionRegistro', { correo: correo, mensaje: mensaje });
});

router.get('/reportes', function(req, res, next) {
  
  Usuarios.find(function (err, usuarios) {
    if (!err) console.log("");
    var fruits = [];
    var fb = [];
    usuarios.forEach(function (elemento) {
      if (correo == elemento.correo) {
        if (elemento.aMaterno == null && elemento.estatus == undefined) {
          fb.push(elemento);
        }
        if (correo == elemento.correo && elemento.estatus == "Si") {
          fruits.push(elemento);
        }
      }
    });
    
    if (fruits.length == 0) {
      Reservaciones.find(function (err, reservaciones) {
          var ene = 0;
          var feb = 0;
          var mar = 0;
          var abr = 0;
          var may = 0;
          var jun = 0;
          var jul = 0;
          var ago = 0;
          var sep = 0;
          var oct = 0;
          var nov = 0;
          var dic = 0;
          var simple = 0;
          var doble = 0;
          var premier = 0;
          var alta = 0;
          var baja = 0;
          var media = 0;
        if (!err) console.log("");
        reservaciones.forEach(function (elemento) {
          var mes = getmes(elemento.fEntrada.split(" ")[1]);
      
          if (mes == 0){
            alta++;
            ene++;
          } else if (mes == 1) {
            baja++;
            feb++;
          } else if (mes == 2) {
            alta++;
            mar++;
          } else if (mes == 3) {
            alta++;
            abr++;
          } else if (mes == 4) {
            media++;
            may++;
          } else if (mes == 5) {
            baja++;
            jun++;
          } else if (mes == 6) {
            media++;
            jul++;
          } else if (mes == 7) {
            media++;
            ago++;
          } else if (mes == 8) {
            baja++;
            sep++;
          } else if (mes == 9) {
            baja++;
            oct++;
          } else if (mes == 10) {
            media++;
            nov++;
          } else if (mes == 11) {
            alta++;
            dic++;
          }
          
          if (elemento.tipoHab == "Habitación Simple") {
            simple++;
          } else if (elemento.tipoHab == "Habitación Doble") {
            doble++;
          } else if (elemento.tipoHab == "Habitación Premier") {
            premier++;
          }
        });
          res.render('reportes', { ene: ene, feb: feb, mar: mar, abr: abr, may: may, jun: jun, jul: jul, ago: ago, sep: sep, oct: oct, nov: nov, dic: dic,
                                      simple: simple, doble: doble, premier: premier, alta: alta, media: media, baja: baja
          });
      });
    } else {
      res.render('index');
    }
  });
  
  
});

router.post('/comprobarCodigo', function(req, res, next) {
  Usuarios.find(function (err, usuarios) {
    if (!err) console.log("No error");
    var ya = "no";
    usuarios.forEach(function (elemento) {
      if (elemento.correo == correo && elemento.codigo == req.body.codigo) {
        ya = "si";
        var nombre1 = elemento.nombre;
        var aPaterno1 = elemento.aPaterno;
        var aMaterno1 = elemento.aMaterno;
        var correo1 = elemento.correo;
        var contra1 = elemento.contrasena;
        var fNacimiento1 = elemento.fNacimiento;
        var estatus1 = "Si";
        var bf = new Usuarios({ nombre: nombre1, aPaterno: aPaterno1, aMaterno: aMaterno1, correo: correo1, contrasena: contra1, fNacimiento: fNacimiento1, estatus: estatus1 });
        correo = elemento.correo;
        bf.save(function (err, obj) {
          if (!err) console.log(obj.nombre + ' ha sido guardado');});
          Usuarios.find({ codigo: req.body.codigo }).remove().exec();
          res.render('index');
        }
    });
    if (ya == "no" && req.body.codigo == "") {
      res.render('confirmacionRegistro', { correo: correo, mensaje: "El código no puede quedar vacío" });
    } else if (ya == "no" && req.body.codigo != "") {
      res.render('confirmacionRegistro', { correo: correo, mensaje: "Código no válido" });
    }
  });
});

router.all('/listaHoteles', function(req, res) {
  Hoteles.find(function (err, hoteles) {
    if (!err) console.log("");
    res.json({ datos: hoteles });
  });
});

router.post('/sigueHoteles', function (req, res) {
  var bf = new Hoteles({ id: req.body.id , nombre: req.body.nombre, ciudad: req.body.ciudad, direccion: req.body.direccion,
                        noHabitacionesSimple: req.body.simple, noHabitacionesDoble: req.body.doble,
                        noHabitacionesPremier: req.body.premier, imagen: req.body.imagen, HabitacionesSimpleReservedas: 0,
                        HabitacionesDobleReservedas: 0, HabitacionesPremierReservedas: 0, costoHabitacionesSimple: 1000,
                        costoHabitacionesDoble: 1800, costoHabitacionesPremier: 2500 });
  bf.save(function (err, obj) {
    console.log(obj);

  if (!err) console.log(obj.nombre + ' ha sido guardado');});
  res.redirect('indexAdmin#/confirmacionAltaHoteles');
});

router.post('/deleteHotel', function(req, res) {
  Hoteles.find(function (err, hoteles) {
    if (!err) console.log("");
    hoteles.forEach(function (elemento){
      if (elemento._id == req.body.id) {
        Hoteles.find({ _id: elemento._id }).remove().exec();
        res.redirect('indexAdmin#/listaHoteles');
      }
    });
  });
});

router.post('/deleteComentario', function(req, res) {
  Comentarios.find(function (err, comentarios) {
    if (!err) console.log("");
    comentarios.forEach(function (elemento){
      if (elemento._id == req.body.id) {
        Comentarios.find({ _id: elemento._id }).remove().exec();
        res.redirect('indexAdmin#/comentariosAdmin');
      }
    });
  });
});

router.get('/listaUsuarios', function(req, res, next) {
  Usuarios.find(function (err, usuarios) {
    if (!err) console.log("");
    var vida=[];
    usuarios.forEach(function (elemento){
      //if (elemento.estatus == "Si"){
         vida.push(elemento)
      //}
    }); 
    res.json({ datos: vida });
  });
  
});

router.post('/sigueRegistro', function (req, res) {
  var codigo = "577149dacf93b4392f0bf5cd";

  var fechaN = req.body.fdia + " " + req.body.fmes + " " + req.body.fano;
  console.log(fechaN);
  var bf = new Usuarios({ nombre: req.body.nombre , aPaterno: req.body.aPaterno, aMaterno: req.body.aMaterno, correo: req.body.correo, contrasena: req.body.contrasena, fNacimiento: fechaN, estatus: "No", codigo: codigo});
  bf.save(function (err, obj) {
    if (!err) {
      console.log(obj.nombre + ' ha sido guardado');
      correo = req.body.correo;
      
      var transporter = nodemailer.createTransport('smtps://smp2939%40gmail.com:labweb01@smtp.gmail.com');
      
      var mailOptions = {
        from: 'Hoteles Aileen <smp2939@gmail.com>', // sender address
        to: req.body.correo, // list of receivers
        subject: 'Hoteles Aileen: Correo de confirmación de cuenta', // Subject line
        text: 'Este es un correo de confirmación de cuenta. Para activar su cuenta ingrese el siguiente código: ' + codigo, // plaintext body
        //html: '<b>Hello world 🐴</b>'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });
      res.render('confirmacionRegistro', { correo: correo, mensaje: mensaje });
    } else {
      console.log(err);
    }
  });
});

router.post('/login', function (req, res) {
  if (req.body.correo == "" || req.body.correo == undefined) {
    res.json({ mensaje: "El campo correo no puede quedar vacío." });
  } else if (req.body.contrasena == "" || req.body.contrasena == undefined) {
    res.json({ mensaje: "El campo contraseña no puede quedar vacío." });
  } else if (req.body.contrasena == "" && req.body.correo != "" || req.body.contrasena == undefined && req.body.correo == undefined) {
    res.json({ mensaje: "Por rellena los campos vacíos." });
  }
  Usuarios.find(function (err, usuarios) {
    if (!err) console.log("");
    usuarios.forEach(function (elemento){
      if (req.body.correo == elemento.correo && req.body.contrasena == elemento.contrasena &&
          req.body.correo != "" && req.body.contrasena != "" && elemento.rol == undefined && elemento.estatus == "Si") {
          correo = req.body.correo;
          res.json({ mensaje: "Usuario" });
      } /*else if (req.body.correo == elemento.correo && req.body.contrasena == elemento.contrasena &&
          req.body.correo != "" && req.body.contrasena != "" && elemento.rol == undefined && elemento.estatus == "No") {
          res.json({ mensaje: "Por favor verifica tu cuenta." });
      }*/
    }); 
  });
  Administradores.find(function (err, administradores) {
    if (!err) console.log("");
    var vida=[];
    administradores.forEach(function (elemento){
      if (req.body.correo == elemento.correo && req.body.contrasena == elemento.contrasena &&
          req.body.correo != "" && req.body.contrasena != "" && elemento.rol == 'admin1') {
          correo = req.body.correo;
          res.json({ mensaje: "Admin1" });
      }
      if (req.body.correo == elemento.correo && req.body.contrasena == elemento.contrasena &&
          req.body.correo != "" && req.body.contrasena != "" && elemento.rol == 'admin2') {
          correo = req.body.correo;
          res.json({ mensaje: "Admin2" });
      }
    }); 
  });
});

router.post('/deleteUser', function(req, res) {
  Usuarios.find(function(err, usuarios) {
    if (!err) console.log("");
    usuarios.forEach(function (elemento) {
      if (elemento._id == req.body.id) {
        Usuarios.find({ _id: elemento._id }).remove().exec();
        res.redirect('indexAdmin#/listaUsuarios');
      }
    });
  });
});

router.post('/deleteReservacion', function(req, res) {
  Reservaciones.find(function(err, reservaciones) {
    if (!err) console.log("");
    reservaciones.forEach(function (elemento) {
      if (elemento._id == req.body.id) {
        Reservaciones.find({ _id: elemento._id }).remove().exec();
        res.redirect('indexAdmin#/reservaciones');
      }
    });
  });
});

router.post('/deleteAdmin', function(req, res) {
  Administradores.find(function(err, administradores) {
    if (!err) console.log("");
    administradores.forEach(function (elemento) {
      if (elemento._id == req.body.id) {
        Administradores.find({ _id: elemento._id }).remove().exec();
        res.redirect('indexAdmin#/listaAdmin');
      }
    });
  });
});

router.get('/listaAdmin', function(req, res, next) {
  Administradores.find(function (err, administradores) {
    if (!err) console.log("");
    res.json({ datos: administradores });
  });
});

router.post('/sigueAdmin', function (req, res) {
  var rol = "";
  if (req.body.rol == "admin2: (Lectura)") {
    rol = "admin2";
  } else if (req.body.rol == "admin1: (Lectura y escritura)") {
    rol = "admin2";
  }
  var bf = new Administradores({ nombre: req.body.nombre , aPaterno: req.body.aPaterno, aMaterno: req.body.aMaterno, correo: req.body.correo, contrasena: req.body.contrasena, rol: rol });
  bf.save(function (err, obj) {
  if (!err) console.log(obj.nombre + ' ha sido guardado');});
  res.redirect('indexAdmin#/confirmacionAltaAdmin');
});

router.post('/verDisponibilidad', function (req, res) {
  Hoteles.find(function (err, hoteles) {
    if (!err) console.log("");
    var vida=hoteles.length;
    var habitacion = "";
    var costo = 0;
    var fruits = [];
    var ciudades = [];
    var numeros = [1, 2, 3, 4];

    var diaInicial = parseInt(req.body.fEntrada.toString().split("/")[1]);
    var mesInicial = parseInt(req.body.fEntrada.toString().split("/")[0]);
    var diaFinal = parseInt(req.body.fSalida.toString().split("/")[1]);
    var mesFinal = parseInt(req.body.fSalida.toString().split("/")[0]);
    var noches = 0;
    
    if (mesInicial == mesFinal) {
      noches = diaFinal - diaInicial;
    } else if (mesFinal > mesInicial) {
      noches = (31 - diaInicial) + diaFinal;
    }
    
    hoteles.forEach(function (elemento){
      ciudades.push(elemento.ciudad);
      if (req.body.ciudad == elemento.ciudad && req.body.nPersonas == 1 &&
          elemento.HabitacionesSimpleReservedas < elemento.noHabitacionesSimple ) {
          habitacion = "Habitación Simple";
          costo = elemento.costoHabitacionesSimple;
          fruits.push(elemento);
      } else if (req.body.ciudad == elemento.ciudad && req.body.nPersonas == 2 &&
          elemento.HabitacionesDobleReservedas < elemento.noHabitacionesDoble ) {
          habitacion = "Habitación Doble";
          costo = elemento.costoHabitacionesDoble;
          fruits.push(elemento);
      } else if (req.body.ciudad == elemento.ciudad && (req.body.nPersonas > 2 && req.body.nPersonas < 5) &&
          elemento.HabitacionesPremierReservedas < elemento.noHabitacionesPremier ) {
          habitacion = "Habitación Premier";
          costo = elemento.costoHabitacionesPremier;
          fruits.push(elemento);
      }
    });
    ciudades = ciudades.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
    res.render('verDisponibilidad', { id: 'Id', nombre: 'Nombre del hotel', ciudad: 'Ciudad', direccion: 'Direccion',
                datos: fruits, vida: vida, correo: correo, habitacion: habitacion, costo: costo, nohab: req.body.nHabitaciones,
                fEntrada: req.body.fEntrada, fSalida: req.body.fSalida, noches: noches, ciudades: ciudades, numeros: numeros });
  });
});

router.get('/modUsuarios', function (req, res) {
  Usuarios.find(function (err, usuarios) {
    if (!err) console.log("");
    var fruits = [];
    var fb = [];
    usuarios.forEach(function (elemento){
      if (correo == elemento.correo) {
        if (elemento.aMaterno == null && elemento.estatus == undefined) {
          fb.push(elemento);
        }
        if (correo == elemento.correo && elemento.estatus == "Si") {
          fruits.push(elemento);
        }
      }
    });
  
    if (fb.length == 1) {
      res.json({ datos: fb, mensaje: "Por favor ingresa los datos faltantes y cambia la contraseña" });
    } else {
      if (fruits.length != 0) {
        res.json({ datos: fruits });
      } else {
        Administradores.find(function (err, administradores) {
          if (!err) console.log("");
          var fruits = [];
          administradores.forEach(function (elemento) {
            if (correo == elemento.correo) {
              fruits.push(elemento);
            }
          });
          res.json({ datos: fruits });
        });
      }
    }
  });
});

router.post('/updateUser', function (req, res) {
  Usuarios.find(function(err, usuarios) {
    if (!err) console.log(""),
    usuarios.forEach(function (elemento) {
      if (elemento._id == req.body.id) {
        Usuarios.find({ _id: elemento._id }).remove().exec();
        var bf = new Usuarios({ nombre: req.body.nombre , aPaterno: req.body.aPaterno, aMaterno: req.body.aMaterno,
                                correo: req.body.correo, contrasena: req.body.contrasena, fNacimiento: req.body.fNacimiento,
                                estatus: "Si"
        });
        correo = req.body.correo;
        bf.save(function (err, obj) {
        if (!err) console.log(obj.nombre + ' ha sido guardado');});
        res.redirect('indexUsuario#/modUsuarios');
      }
    });
  });
});

router.post('/sigueTarjeta', function (req, res) {
  console.log(req.body);
  var bf = new Tarjetas({ correo: correo, nombreTitular: req.body.nombreTitular,
                      noTarjeta: req.body.noTarjeta, fExpedicion: req.body.fmes + " " + req.body.fano});
  bf.save(function (err, obj) {
  if (!err) console.log(obj.nombre + ' ha sido guardado');});
  res.redirect('indexUsuario#/modUsuarios');
});

router.post('/deleteTarjeta', function(req, res) {
  Tarjetas.find(function(err, tarjetas) {
    if (!err) console.log("");
    tarjetas.forEach(function (elemento) {
      if (elemento._id == req.body.id) {
        Tarjetas.find({ _id: elemento._id }).remove().exec();
        res.redirect('indexUsuario#/listaTarjetas');  
      }
    })
  })
});

router.get('/listaTarjetas', function(req, res, next) {
  Tarjetas.find(function (err, tarjetas) {
    if (!err) console.log("");
    var vida=[];
    tarjetas.forEach(function (elemento){
      console.log(elemento);
      if (correo == elemento.correo) {
           vida.push(elemento);
         }
      });
    res.json({ datos: vida });
  });
});

router.post('/reservarfinal', function (req, res) {
   Tarjetas.find(function (err, tarjetas) {
    if (!err) console.log("");
    var vida=[];
    tarjetas.forEach(function (elemento){
         if (correo == elemento.correo) {
           vida.push(elemento);
         }
    });
    var mensajeTarjeta = "";
    if (vida.length == 0){
      mensajeTarjeta = "Por favor da de alta una tarjeta antes de reservar.";
    }
    res.render('reservarfinal', { datos: [req.body.id, req.body.ciudad, req.body.direccion, req.body.nombre, req.body.habitacion,
                                req.body.nhab, req.body.costo, req.body.fEntrada, req.body.fSalida, req.body.noches],
                                correo: correo, tarjetas: vida, mensajeTarjeta: mensajeTarjeta });
  });
});

router.post('/reservarRegistro', function (req, res) {
  var codigoR = "";
  var bf = new Reservaciones({ correo: req.body.correo, nombreHotel: req.body.nombreHotel, direccionHotel: req.body.direccion,
                      ciudad: req.body.ciudad, tipoHab: req.body.tipoHab, noHab: req.body.noHab, costo: req.body.costo,
                      fEntrada: req.body.fEntrada, fSalida: req.body.fSalida, nombreTitular: req.body.nombreTitular, 
                      noTarjeta: req.body.noTarjeta, fExpedicion: req.body.fExpedicion });
  bf.save(function (err, obj) {
  if (!err) console.log(obj.nombre + ' ha sido guardado');
    codigoR = obj._id;
  
    var transporter = nodemailer.createTransport('smtps://smp2939%40gmail.com:labweb01@smtp.gmail.com');
  
    var mailOptions = {
      from: 'Hoteles Aileen <smp2939@gmail.com>', // sender address
      to: req.body.correo, // list of receivers
      subject: 'Hoteles Aileen: Código de reservación ' + codigoR, // Subject line
      text: 'Este es tu código de reservación: ' + codigoR, // plaintext body
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  });
  
  res.redirect('indexUsuario#/reservar');
});

router.post('/guardarComentario', function (req, res) {
  var bf = new Comentarios({ nombreHotel: req.body.nombreHotel, valoracion: req.body.valoracion, mensaje: req.body.mensaje });
  bf.save(function (err, obj) {
    if (!err) console.log("El comentario ha sido guardado");
  })
  res.redirect('indexUsuario#/comentarios');
});

router.post('/consultarReservacion2', function(req, res, next) {
  Reservaciones.find(function (err, reservaciones) {
    if (!err) console.log("");
    var vida=[];
      reservaciones.forEach(function (elemento){
      if (req.body.codigoReservacion == elemento._id) {
           vida.push(elemento);
         }
      });
    res.json({ datos: vida });
  });
});

router.all('/reservar', function (req, res) {
  Hoteles.find(function (err, hoteles) {
    if (!err) console.log("");
    var ciudades = [];
    hoteles.forEach(function (elemento){
      ciudades.push(elemento.ciudad);
    });
    ciudades = ciudades.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
    res.json({ datos: ciudades });
  });
});

router.all('/comentarioss', function (req, res) {
  Hoteles.find(function (err, hoteles) {
    if (!err) console.log("");
    var ciudades = [];
    var com = [];
    hoteles.forEach(function (elemento){
      ciudades.push(elemento.nombre);
    });
    ciudades = ciudades.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
    Comentarios.find(function (err, comentarios) {
      if (!err) console.log("");
      comentarios.forEach(function (elemento){
        if (req.body.ciudad == undefined) {
          com.push(elemento);
        } else if (req.body.ciudad == elemento.nombreHotel) {
          com.push(elemento);
        }
      })
      res.json({ ciudad: ciudades, comentarios: com });
    });
  });
});

router.all('/reservar2', function (req, res) {
  Hoteles.find(function (err, hoteles) {
    if (!err) console.log("");
    var vida=hoteles.length;
    var habitacion = "";
    var costo = 0;
    var fruits = [];
    var ciudades = [];
    var numeros = [1, 2, 3, 4];
    var valoracion = 0;
    var noches = 0;
    var numero = 0;
    var valoraciones = [];
    
    var mesInicial = getmes(req.body.fEmes);
    var mesFinal = getmes(req.body.fSmes);
    var diaFinal = req.body.fSdia;
    var diaInicial = req.body.fEdia;

    if (mesInicial == mesFinal) {
      noches = diaFinal - diaInicial;
    } else if (mesFinal > mesInicial) {
      noches = (31 - diaInicial) + diaFinal;
    }
    
    hoteles.forEach(function (elemento) {
      ciudades.push(elemento.ciudad);
      if (req.body.ciudad == elemento.ciudad && req.body.nPersonas == 1 &&
          elemento.HabitacionesSimpleReservedas < elemento.noHabitacionesSimple &&
          elemento.noHabitacionesSimple > req.body.nHabitaciones) {
          habitacion = "Habitación Simple";
          costo = elemento.costoHabitacionesSimple;
          fruits.push(elemento);
      } else if (req.body.ciudad == elemento.ciudad && req.body.nPersonas == 2 &&
          elemento.HabitacionesDobleReservedas < elemento.noHabitacionesDoble &&
          elemento.noHabitacionesDoble > req.body.nHabitaciones) {
          habitacion = "Habitación Doble";
          costo = elemento.costoHabitacionesDoble;
          fruits.push(elemento);
      } else if (req.body.ciudad == elemento.ciudad && (req.body.nPersonas > 2 && req.body.nPersonas < 5) &&
          elemento.HabitacionesPremierReservedas < elemento.noHabitacionesPremier &&
          elemento.noHabitacionesPremier > req.body.nHabitaciones) {
          habitacion = "Habitación Premier";
          costo = elemento.costoHabitacionesPremier;
          fruits.push(elemento);
      }
    });
    ciudades = ciudades.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
    var keys = [];
    var values = [];
    Comentarios.find(function(err, comentarios) {
      if (!err) console.log("");
      comentarios.forEach(function (elementoComen) {
        keys.push(elementoComen.nombreHotel);
        values.push(elementoComen.valoracion);
      });
      
      var keys2 = keys.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
      })
      
      var uniq = keys2.slice() // slice makes copy of array before sorting it
      .sort(function(a,b){
        return a > b;
      })
      .reduce(function(a,b){
        if (a.slice(-1)[0] !== b) a.push(b); // slice(-1)[0] means last item in array without removing it (like .pop())
        return a;
      },[]);
  
      var a = 0;
      var b = 0;
      for(var i = 0; i < uniq.length; i++) {
        for(var j = 0; j < comentarios.length; j++) {
          if (comentarios[j].nombreHotel == uniq[i]) {
            b++;
            a+=comentarios[j].valoracion;
          }
        }
        valoraciones.push(a/b);
        a = 0;
        b = 0;
      }
      res.json({ datos: fruits, vida: vida, correo: correo, habitacion: habitacion, costo: costo, nohab: req.body.nHabitaciones,
                fEdia: diaInicial, fEmes: req.body.fEmes, fSdia: diaFinal, fSmes: req.body.fSmes,
                noches: noches, ciudades: ciudades, numeros: numeros, valoraciones: valoraciones});
      });
  });
});

router.all('/reservarfinal2', function (req, res) {
  Tarjetas.find(function (err, tarjetas) {
    if (!err) console.log("");
    var vida=[];
    tarjetas.forEach(function (elemento){
         if (correo == elemento.correo) {
           vida.push(elemento);
         }
    });
    var mensajeTarjeta = "";
    if (vida.length == 0){
      mensajeTarjeta = "Por favor da de alta una tarjeta antes de reservar.";
    }
    res.json({ datos: [req.body.ciudad, req.body.direccion, req.body.nombre, req.body.habitacion,
                                req.body.nhab, req.body.costo, req.body.fEntrada, req.body.fSalida, req.body.noches],
                                correo: correo, tarjetas: vida, mensajeTarjeta: mensajeTarjeta });
  });
});

router.post('/reservarRegistro2', function (req, res) {
  var codigoR = "";
  var bf = new Reservaciones({ correo: correo, nombreHotel: req.body.nombre, direccionHotel: req.body.direccion,
                      ciudad: req.body.ciudad, tipoHab: req.body.habitacion, noHab: req.body.nohab, costo: req.body.costo,
                      fEntrada: req.body.fEntrada, fSalida: req.body.fSalida, nombreTitular: req.body.titular, 
                      noTarjeta: req.body.noTarjeta, fExpedicion: req.body.fExpedicion, nPersonas: req.body.nPersonas,
                      noches: req.body.noches});
    Hoteles.find(function (err, hoteles) {
    if (!err) console.log("");
    var ciudades = [];
    hoteles.forEach(function (elemento){
      if (elemento.nombre == req.body.nombre) {
        Hoteles.find({_id: elemento._id}).remove().exec();
        
        if (req.body.habitacion == "Habitación Premier") {
          var bf = new Hoteles({ nombre: elemento.nombre, ciudad: elemento.ciudad, direccion: elemento.direccion,
                          noHabitacionesSimple: elemento.noHabitacionesSimple, noHabitacionesDoble: elemento.noHabitacionesDoble,
                          noHabitacionesPremier: elemento.noHabitacionesPremier, imagen: elemento.imagen, HabitacionesSimpleReservedas: 0,
                          HabitacionesDobleReservedas: 0, HabitacionesPremierReservedas: (elemento.HabitacionesPremierReservedas + req.body.nohab),
                          costoHabitacionesSimple: 1000, costoHabitacionesDoble: 1800, costoHabitacionesPremier: 2500 });
          bf.save(function (err, obj) {

          if (!err) console.log(obj.nombre + ' ha sido guardado');});
        } else if (req.body.habitacion == "Habitación Doble") {
          var bf = new Hoteles({ nombre: elemento.nombre, ciudad: elemento.ciudad, direccion: elemento.direccion,
                            noHabitacionesSimple: elemento.noHabitacionesSimple, noHabitacionesDoble: elemento.noHabitacionesDoble,
                            noHabitacionesPremier: elemento.noHabitacionesPremier, imagen: elemento.imagen, HabitacionesSimpleReservedas: 0,
                            HabitacionesDobleReservedas: (elemento.HabitacionesDobleReservedas + req.body.nohab), HabitacionesPremierReservedas: 0,
                            costoHabitacionesSimple: 1000, costoHabitacionesDoble: 1800, costoHabitacionesPremier: 2500 });
            bf.save(function (err, obj) {
            if (!err) console.log(obj.nombre + ' ha sido guardado');});
        } else if (req.body.habitacion == "Habitación Simple") {
          var bf = new Hoteles({ nombre: elemento.nombre, ciudad: elemento.ciudad, direccion: elemento.direccion,
                            noHabitacionesSimple: elemento.noHabitacionesSimple, noHabitacionesDoble:  elemento.noHabitacionesDoble,
                            noHabitacionesPremier: elemento.noHabitacionesPremier, imagen: elemento.imagen, HabitacionesSimpleReservedas: (elemento.HabitacionesSimpleReservedas + req.body.nohab),
                            HabitacionesDobleReservedas: 0, HabitacionesPremierReservedas: 0,
                            costoHabitacionesSimple: 1000, costoHabitacionesDoble: 1800, costoHabitacionesPremier: 2500 });
            bf.save(function (err, obj) {
            if (!err) console.log(obj.nombre + ' ha sido guardado');});
        }
      }
    });
  });

  bf.save(function (err, obj) {
  if (!err) console.log(obj.nombre + ' ha sido guardado');
    codigoR = obj._id;
    
    var transporter = nodemailer.createTransport('smtps://smp2939%40gmail.com:labweb01@smtp.gmail.com');
  
    var mailOptions = {
      from: 'Hoteles Aileen <smp2939@gmail.com>', // sender address
      to: correo, // list of receivers
      subject: 'Hoteles Aileen: Código de reservación ' + codigoR, // Subject line
      text: 'Este es tu código de reservación: ' + codigoR, // plaintext body
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  });
  res.redirect('indexUsuario#/confirmacionReservacion');
});

router.all('/reservacioness', function (req, res) {
  Reservaciones.find(function(err, reservaciones) {
      if (!err) console.log("");
      res.json({ reservaciones: reservaciones });
  });
});

function getmes(mes) {
  if (mes == "Enero") {
    return 0;
  } else if (mes == "Febrero") {
    return 1;
  } else if (mes == "Marzo") {
    return 2;
  } else if (mes == "Abril") {
    return 3;
  } else if (mes == "Mayo") {
    return 4;
  } else if (mes == "Junio") {
    return 5;
  } else if (mes == "Julio") {
    return 6;
  } else if (mes == "Agosto") {
    return 7;
  } else if (mes == "Septiembre") {
    return 8;
  } else if (mes == "Octubre") {
    return 9;
  } else if (mes == "Noviembre") {
    return 10;
  } else if (mes == "Diciembre") {
    return 11;
  }
}