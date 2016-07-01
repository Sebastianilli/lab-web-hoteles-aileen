var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
// Estrategia de autenticación con Twitter
//var TwitterStrategy = require('passport-twitter').Strategy;
// Estrategia de autenticación con Facebook
var FacebookStrategy = require('passport-facebook').Strategy;
// Fichero de configuración donde se encuentran las API keys
// Este archivo no debe subirse a GitHub ya que contiene datos
// que pueden comprometer la seguridad de la aplicación.
var config = require('./config');

// Exportamos como módulo las funciones de passport, de manera que
// podamos utilizarlas en otras partes de la aplicación.
// De esta manera, mantenemos el código separado en varios archivos
// logrando que sea más manejable.
module.exports = function(passport) {

	// Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// Deserializa el objeto usuario almacenado en la sesión para
	// poder utilizarlo
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	// Configuración del autenticado con Facebook
	passport.use(new FacebookStrategy({
		clientID			: config.facebook.id,
		clientSecret	: config.facebook.secret,
		callbackURL	 : '/auth/facebook/callback',
		profileFields : ['id', 'displayName', /*'provider',*/ 'photos', 'email', 'birthday', 'name']
	}, function(accessToken, refreshToken, profile, done) {
		// El campo 'profileFields' nos permite que los campos que almacenamos
		// se llamen igual tanto para si el usuario se autentica por Twitter o
		// por Facebook, ya que cada proveedor entrega los datos en el JSON con
		// un nombre diferente.
		// Passport esto lo sabe y nos lo pone más sencillo con ese campo
		User.findOne({provider_id: profile.id}, function(err, user) {
			if(err) throw(err);
			if(!err && user!= null) return done(null, user);

			// Al igual que antes, si el usuario ya existe lo devuelve
			// y si no, lo crea y salva en la base de datos
			var prof = profile._json;
			var user = new User({
				nombre:   prof.first_name,
				aPaterno:    prof.last_name, // Año en el que fue creado el lenguaje
				aMaterno:    null, //fb no da el apellido materno
				correo:    prof.email,
				contrasena:    prof.id,//la id de fb como contrasena
				fNacimiento:    prof.birthday
			});
			console.log(profile._json);
			
			user.save(function(err) {
				if(err) throw err;
				done(null, user);
			});
		});
	}));

};