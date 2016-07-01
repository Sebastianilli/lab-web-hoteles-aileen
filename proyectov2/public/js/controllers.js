angular.module('app.controllers', [])
    .controller('InicioController', function ($scope, $http, $location) {
        $scope.title = 'Login';
        
        $scope.login = function(correo, contrasena) {
            $http.post('login', { correo: correo, contrasena: contrasena })
                .success(function(data, status) {
                    $scope.mensaje = data.mensaje;
                    if ($scope.mensaje == "Usuario") {
                        window.location = 'indexUsuario#/reservar';
                    } else if ($scope.mensaje == "Admin1") {
                        window.location = 'indexAdmin#/altaHoteles';
                    } else if ($scope.mensaje == "Admin2") {
                        window.location = 'indexAdmin#/listaHoteles';
                    }
            })
        };
        
         $scope.entrarFB = function() {
            window.location = 'indexUsuario#/reservar';
        };
    })
    .controller('AdminController', function ($scope, $http) {
        $scope.title = 'Alta Administradores';
        $scope.roles = ["admin1: (Lectura y escritura)", "admin2: (Lectura)"];
        
         $http.get('/modUsuarios').then(function(response) {
            $scope.datos = response.data.datos;
            if ($scope.datos[0].rol == "admin2") {
                $scope.var = false;
                window.location = 'indexAdmin#/listaHoteles';
            } else if ($scope.datos[0].rol == undefined) {
                window.location = '/';
            }
        }, function(err) {
            console.log(err);
        });
    })
    .controller('AltaTarjetasController', function ($scope) {
        $scope.title = 'Alta Tarjeta';
        $scope.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        $scope.ano = [2016, 2017, 2018, 2019, 2020];
    })
    .controller('ReservacionesController', function ($scope, $http) {
        $scope.title = 'Reservaciones';

        $http.get('/modUsuarios').then(function(response) {
            $scope.datos = response.data.datos;
            if ($scope.datos[0].rol == "admin2") {
                $scope.var = false;
                $http.get('/reservacioness').then(function(response) {
                    $scope.reservaciones = response.data.reservaciones;
                }, function(err) {
                    console.log(err);
                });
            } else if ($scope.datos[0].rol == undefined) {
                window.location = '/';
            } else {
                $scope.var = true;
                $http.get('/reservacioness').then(function(response) {
                    $scope.reservaciones = response.data.reservaciones;
                }, function(err) {
                    console.log(err);
                });
            }
        }, function(err) {
            console.log(err);
        });
        
    })
    .controller('ReservarController', function ($scope, $http, StateService, $location) {
        $scope.title = 'Reservar';

        $scope.users = [];
        $scope.personas = [1, 2, 3, 4];
        $scope.dias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 , 31];
        $scope.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        $http.get('/reservar').then(function(response) {
            $scope.users = response.data;
        }, function(err) {
            console.log(err);
        });
        
        $scope.buscar = function(ciudad, fEdia, fEmes, fSdia, fSmes, nPersonas, nHabitaciones) {
            $http.post('reservar2', {ciudad: ciudad, fEdia: fEdia, fEmes: fEmes, fSdia: fSdia, fSmes: fSmes, nPersonas: nPersonas, nHabitaciones: nHabitaciones})
                .success(function(data, status) {
                    $scope.vida = data.vida;
                    $scope.datos = data.datos;
                    $scope.valoraciones = data.valoraciones;
                    $scope.nombreHotel = data.datos.nombre;
                    $scope.habitacion = data.habitacion;
                    $scope.fEntrada = data.fEdia + " " + data.fEmes;
                    $scope.fSalida = data.fSdia + " " + data.fSmes;
                    $scope.noches = parseInt(data.noches);
                    $scope.imagen = data.datos.imagen;
                    $scope.nHabitaciones = parseInt(data.nohab);
                    $scope.nPersonas = parseInt(nPersonas);
                    $scope.costo = parseInt(data.costo) * parseInt(data.noches) * parseInt(data.nohab);
            })
        };
        
        $scope.reservar = function(ciudad, fEntrada, fSalida, nPersonas, nHabitaciones, nombre, direccion, habitacion, noches, costo) {
            $http.post('reservarfinal2', {ciudad: ciudad, fEntrada: fEntrada, fSalida: fSalida, nPersonas: nPersonas, nhab: nHabitaciones,
                                        nombre: nombre, direccion: direccion, habitacion: habitacion, noches: noches, costo: costo
            }).success(function(data, status) {
                StateService.addProduct(ciudad);
                StateService.addProduct(fEntrada);
                StateService.addProduct(fSalida);
                StateService.addProduct(nPersonas);
                StateService.addProduct(nHabitaciones);
                StateService.addProduct(nombre);
                StateService.addProduct(direccion);
                StateService.addProduct(habitacion);
                StateService.addProduct(noches);
                StateService.addProduct(costo);
                StateService.addProduct(data.tarjetas);

                $location.path("/registrarfinal");
            })
        };
    })
    .controller('RegistrarFinalController', function ($scope, StateService, $http, $location) {
        $scope.title = 'Estas a punto de reservar';
        $scope.ciudad = StateService.getProducts();
        $scope.tarjetas = StateService.getProducts()[10];
        $scope.costo = StateService.getProducts()[9];
        $scope.impuesto = $scope.costo * 0.16;
        $scope.costoTotal = $scope.costo + $scope.impuesto;

        $scope.buscar = function(ciudad, nombre, direccion, fEntrada, fSalida, nPersonas, habitacion, nohab, noches, costo, titular, noTarjeta, fExpedicion) {
           $http.post('reservarRegistro2', {ciudad: ciudad, nombre: nombre, direccion: direccion, fEntrada: fEntrada, fSalida: fSalida, nPersonas: nPersonas,
                                        habitacion: habitacion, nohab: nohab, noches: noches, costo: costo, titular: titular, noTarjeta: noTarjeta, fExpedicion: fExpedicion
            }).success(function(data, status) {
                $location.path("/confirmacionReservacion");
            })
        }
    })
    .controller('ConfirmacionReservacionController', function ($scope) {
        $scope.title = 'Confirmación de reservación';
    })
    .controller('ConfirmacionAltaHotelesController', function ($scope) {
        $scope.title = 'Confirmación de alta de hotel';
    })
    .controller('ConfirmacionAltaAdminController', function ($scope, $http) {
        $scope.title = 'Confirmación de alta de administrador';
    })
    .controller('ConfirmacionRegistroController', function ($scope) {
        $scope.title = 'Confirmación de registro';
    })
    .controller('AltaHotelesController', function ($scope, $http) {
        $scope.title = 'Alta de Hoteles';
        
        $http.get('/modUsuarios').then(function(response) {
            $scope.datos = response.data.datos;
            if ($scope.datos[0].rol == "admin2") {
                window.location = 'indexAdmin#/listaHoteles';
            } else if ($scope.datos[0].rol == undefined) {
                window.location = '/';
            }
        }, function(err) {
            console.log(err);
        });
    })
    .controller('ListaHotelesController', function ($scope, $http) {
        $scope.title = 'Lista de Hoteles';
        
         $http.get('/modUsuarios').then(function(response) {
            $scope.datos = response.data.datos;
            if ($scope.datos[0].rol == "admin2") {
                $scope.var = false;
                $http.get('/listaHoteles').then(function(response) {
                $scope.datos = response.data.datos;
                }, function(err) {
                    console.log(err);
                });
            } else if ($scope.datos[0].rol == undefined) {
                window.location = '/';
            } else {
                $scope.var = true;
                $http.get('/listaHoteles').then(function(response) {
                    $scope.datos = response.data.datos;
                }, function(err) {
                    console.log(err);
                });
            }
        }, function(err) {
            console.log(err);
        });
        
    })
    .controller('ListaUsuariosController', function ($scope, $http) {
        $scope.title = 'Lista de Usuarios';
        
        $http.get('/modUsuarios').then(function(response) {
            $scope.datos = response.data.datos;
            if ($scope.datos[0].rol == "admin2") {
                $scope.var = false;
                 $http.get('/listaUsuarios').then(function(response) {
                    $scope.datos = response.data.datos;
                }, function(err) {
                    console.log(err);
                });
            } else if ($scope.datos[0].rol == undefined) {
                window.location = '/';
            } else {
                $scope.var = true;
                 $http.get('/listaUsuarios').then(function(response) {
                    $scope.datos = response.data.datos;
                }, function(err) {
                    console.log(err);
                });
            }
        }, function(err) {
            console.log(err);
        });
    })
    .controller('ListaAdminController', function ($scope, $http) {
        $scope.title = 'Lista de Administradores';
        
        $http.get('/modUsuarios').then(function(response) {
            $scope.datos = response.data.datos;
            if ($scope.datos[0].rol == "admin2") {
                $scope.var = false;
                $http.get('/listaAdmin').then(function(response) {
                    $scope.datos = response.data.datos;
                }, function(err) {
                    console.log(err);
                });
            } else if ($scope.datos[0].rol == undefined) {
                window.location = '/';
            } else {
                $scope.var = true;
                $http.get('/listaAdmin').then(function(response) {
                    $scope.datos = response.data.datos;
                }, function(err) {
                    console.log(err);
                });
            }
        }, function(err) {
            console.log(err);
        });
    })
    .controller('ListaTarjetasController', function ($scope, $http) {
        $scope.title = 'Lista de Tarjetas';
        
        $http.get('/listaTarjetas').then(function(response) {
            $scope.datos = response.data.datos;
        }, function(err) {
            console.log(err);
        });
        
    })
    .controller('RegistroController', function ($scope) {
        $scope.title = 'Regístrate';
        $scope.dias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 , 31];
        $scope.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        $scope.anos = [1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000];
    })
    .controller('ConsultarReservacionController', function ($scope, $http) {
        $scope.title = 'Consulta tu Reservación';
        
        $scope.buscar = function(codigoReservacion) {
            $http.post('consultarReservacion2', { codigoReservacion: codigoReservacion })
                .success(function(data, status) {
                    $scope.msg1 = "Nombre del hotel";
                    $scope.msg2 = "Dirección del hotel";
                    $scope.msg3 = "Ciudad";
                    $scope.msg4 = "Tipo de habitación";
                    $scope.msg5 = "Número de habitaciones";
                    $scope.msg6 = "Fecha de entrada";
                    $scope.msg7 = "Fecha de salida";
                    $scope.msg8 = "Costo";
                    $scope.msg9 = "Titular de la tarjeta";
                    $scope.msg10 = "Número de tarjeta";
                    $scope.msg11 = "Fecha de vencimiento";

                    $scope.datos = data.datos;
            })
        };
        
    })
    .controller('ComentariosController', function ($scope, $http) {
        $scope.title = 'Comentarios';
        
        $scope.numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        $http.get('/comentarioss').then(function(response) {
            $scope.names = response.data;
        }, function(err) {
            console.log(err);
        });
        
        $scope.buscar1= function(ciudad) {
            $http.post('comentarioss', {ciudad: ciudad})
                .success(function(data, status) {
                    $scope.names = data;
            })
        };
    })
    .controller('ComentariosAdminController', function ($scope, $http,  $route) {
        $scope.title = 'Comentarios';
        $scope.numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
         $http.get('/modUsuarios').then(function(response) {
            $scope.datos = response.data.datos;
            if ($scope.datos[0].rol == "admin2") {
                $scope.var = false;
                $http.get('/comentarioss').then(function(response) {
                    $scope.names = response.data;
                }, function(err) {
                    console.log(err);
                });
            }  else if ($scope.datos[0].rol == undefined) {
                window.location = '/';
            } else {
                $scope.var = true;
                $http.get('/comentarioss').then(function(response) {
                    $scope.names = response.data;
                }, function(err) {
                    console.log(err);
                });
            }
        }, function(err) {
            console.log(err);
        });
        
        $scope.buscar = function(id) {
            $http.post('deleteComentario', { id: id})
                .success(function(data, status) {
                    $route.reload();
            })
        };
    })
    .controller('ModUsuariosController', function ($scope, $http) {
        $scope.title = 'Mi Perfil';
        
        $http.get('/modUsuarios').then(function(response) {
            $scope.datos = response.data.datos;
            $scope.mensaje = response.data.mensaje;
        }, function(err) {
            console.log(err);
        });
    })
    .controller('PostCtrl', function (messages, $http, $scope, $route){
        var self = this;
                                     
        self.newMessage = 'Tu Mensaje';

        self.addMessage = function(message, ciudad, numero) {
            $http.post('guardarComentario', { nombreHotel: ciudad, valoracion: numero, mensaje: message
                }).success(function(data, status) {
                    $route.reload();
                })
            messages.add(message, ciudad, numero);
            self.newMessage = '';
        };
    })
    .factory('messages', function($http) {
        var messages = {};
        messages.list = [];
                              
        messages.add = function(message, ciudad, numero){
            messages.list.push({id: ciudad, valoracion: numero, text: message});
        };
        
        return messages;
    })
    .controller('ListCtrl', function (messages, $location){
        var self = this;
        $location.path("/comentarios");
        self.messages = messages.list; 
    })
    .service('StateService', function() {
      var productList = [];
    
      var addProduct = function(newObj) {
          productList.push(newObj);
      };
    
      var getProducts = function(){
          return productList;
      };
    
      return {
        addProduct: addProduct,
        getProducts: getProducts
      };
    
    })
    .directive('piePagina', function() {
        return {
          restrict: 'AEC',
          replace: true,
          template: "<footer align=" + "center" + ">" + "Hoteles Aileen" + "</footer>"
        }
     });