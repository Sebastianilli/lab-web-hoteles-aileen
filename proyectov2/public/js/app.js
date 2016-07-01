'use strict';
angular.module('app', ['app.controllers', 'ngRoute']).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/inicio', {templateUrl: 'partials/inicio.html', controller: 'InicioController'}).
            when('/altaAdmin', {templateUrl: 'partials/altaAdmin.html', controller: 'AdminController'}).
            when('/reservar', {templateUrl: 'partials/reservar.html', controller: 'ReservarController'}).
            when('/registrarfinal', {templateUrl: 'partials/registrarfinal.html', controller: 'RegistrarFinalController'}).
            when('/altaHoteles', {templateUrl: 'partials/altaHoteles.html', controller: 'AltaHotelesController'}).
            when('/altaTarjetas', {templateUrl: 'partials/altaTarjetas.html', controller: 'AltaTarjetasController'}).
            when('/registro', {templateUrl: 'partials/registro.html', controller: 'RegistroController'}).
            when('/comentarios', {templateUrl: 'partials/comentarios.html', controller: 'ComentariosController'}).
            when('/comentariosAdmin', {templateUrl: 'partials/comentariosAdmin.html', controller: 'ComentariosAdminController'}).
            when('/confirmacionReservacion', {templateUrl: 'partials/confirmacionReservacion.html', controller: 'ConfirmacionReservacionController'}).
            when('/confirmacionAltaHoteles', {templateUrl: 'partials/confirmacionAltaHoteles.html', controller: 'ConfirmacionAltaHotelesController'}).
            when('/confirmacionRegistro', {templateUrl: 'partials/confirmacionRegistro.html', controller: 'ConfirmacionRegistroController'}).
            when('/confirmacionAltaAdmin', {templateUrl: 'partials/confirmacionAltaAdmin.html', controller: 'ConfirmacionAltaAdminController'}).
            when('/listaHoteles', {templateUrl: 'partials/listaHoteles.html', controller: 'ListaHotelesController'}).
            when('/listaUsuarios', {templateUrl: 'partials/listaUsuarios.html', controller: 'ListaUsuariosController'}).
            when('/listaAdmin', {templateUrl: 'partials/listaAdmin.html', controller: 'ListaAdminController'}).
            when('/listaTarjetas', {templateUrl: 'partials/listaTarjetas.html', controller: 'ListaTarjetasController'}).
            when('/modUsuarios', {templateUrl: 'partials/modUsuarios.html', controller: 'ModUsuariosController'}).
            when('/consultarReservacion', {templateUrl: 'partials/consultarReservacion.html', controller: 'ConsultarReservacionController'}).
            when('/reservaciones', {templateUrl: 'partials/reservaciones.html', controller: 'ReservacionesController'}).
            otherwise({redirectTo: '/inicio'});
    });