var app = angular.module('starter', ['ionic', 'starter.controllers','ngMessages'])

.filter('capitalize', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  })

.run(function ($ionicPlatform, $ionicPopup, $state, $ionicHistory, $rootScope) {
    $rootScope.TituloMenu = {
        titulo: ''
    };
    $rootScope.usuario = {};
    $rootScope.usuario.tipoDocumento = "";
    $rootScope.usuario.documento = "";

    $rootScope.lPreguntas = {};
    $rootScope.ids_preguntas = [];
    $rootScope.index_preguntas = 0;
    $rootScope.pregunta_actual = {};
    $rootScope.obj_respuestas = {};
    $rootScope.mostrarMensajesError = true;

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
    /*
    $ionicPlatform.registerBackButtonAction(function(event) {
        if (true) 
        {
            if ($ionicHistory.currentStateName() == "app.home" || $ionicHistory.currentStateName() == "app.identificar_persona") ionic.Platform.exitApp();
            else if ($ionicHistory.currentStateName() == "app.programas_inscritos") $ionicHistory.goBack(-2);
            else $ionicHistory.goBack();            
        }
    }, 100);
    
    $ionicPlatform.on('resume', function () {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $rootScope.mostrarMensajesError = false;
        $rootScope.usuario = {};
        $rootScope.usuario.tipoDocumento = "";
        $rootScope.usuario.documento = "";

        localStorage.removeItem("Focalizacion");
        byaSite._removeVar("lPreguntas");
     
        //$state.go("app.home");
    });
    */
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
      })
    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                cache: false,
                controller: 'HomeCtrl',
                templateUrl: 'templates/home.html'
            }
        }
    })
    .state('app.identificar_persona', {
        url: '/identificar_persona',
        views: {
            'menuContent': {
                cache: false,
                controller: "IdentificarPersonaCtrl",
                templateUrl: 'templates/identificar_persona.html'
            }
        }
    })
    .state('app.pregunta_validacion', {
        url: '/pregunta_validacion',
        views: {
            'menuContent': {
                cache: false,
                controller: 'PreguntasPersonasCtrl',
                templateUrl: 'templates/pregunta_validacion.html'
            }
        }
    })
    .state('app.programas_inscritos', {
        url: '/programas_inscritos',
        views: {
            'menuContent': {
                cache: false,
                controller: 'ProgramasInscritosCtrl',
                templateUrl: 'templates/programas_inscritos.html'
            }
        }
    })
    .state('app.menu-familias-en-accion', {
        url: '/menu-familias-en-accion',
        views: {
            'menuContent': {
                cache: false,
                controller: 'MenuFamiliasEnAccionCtrl',
                templateUrl: 'templates/menu-familias-en-accion.html'
            }
        }
    })
    .state('app.datos-familia', {
        url: '/datos-familia',
        views: {
            'menuContent': {
                cache: false,
                controller: 'EstadoFamiliaCtrl',
                templateUrl: 'templates/datos-familia.html'
            }
        }
    })
    .state('app.novedades', {
        url: '/novedades',
        views: {
            'menuContent': {
                cache: false,
                controller: 'NovedadesCtrl',
                templateUrl: 'templates/novedades.html'
            }
        }
    })
    .state('app.cumplimiento', {
        url: '/cumplimiento',
        views: {
            'menuContent': {
                cache: false,
                controller: 'CumplimientoCtrl',
                templateUrl: 'templates/cumplimiento.html'
            }
        }
    })
    .state('app.antifraude', {
        url: '/antifraude',
        views: {
            'menuContent': {
                cache: false,
                controller: 'AntifraudeCtrl',
                templateUrl: 'templates/antifraude.html'
            }
        }
    })
    .state('app.liquidacionypagos', {
        url: '/liquidacionypagos',
        views: {
            'menuContent': {
                cache: false,
                controller: 'LiquidacionYPagoCtrl',
                templateUrl: 'templates/liquidacionesypagos.html'
            }
        }
    })
    .state('app.identificar_persona_potencial', {
        url: '/identificar_persona_potencial',
        views: {
            'menuContent': {
                cache: false,
                controller: "IdentificarPersonaPotencialCtrl",
                templateUrl: 'templates/identificar_persona_potencial.html'
            }
        }
    })
    .state('app.seleccionar_personas', {
        url: '/seleccionar_persona',
        views: {
            'menuContent': {
                cache: false,
                controller: "SeleccionarPersonaCtrl",
                templateUrl: 'templates/seleccionar_persona.html'
            }
        }
    })
    .state('app.programas_potencial', {
        url: '/programas_potencial',
        views: {
            'menuContent': {
                cache: false,
                controller: "ProgramasPotencialCtrl",
                templateUrl: 'templates/programas_potencial.html'
            }
        }
    })
    .state('app.informacion_programa', {
        url: '/informacion_programa',
        views: {
            'menuContent': {
                cache: false,
                controller: "InformacionProgramaCtrl",
                templateUrl: 'templates/informacion_programa.html'
            }
        }
    })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

