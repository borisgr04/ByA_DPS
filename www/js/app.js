var app = angular.module('starter', ['ionic', 'starter.controllers','ngMessages'])
.run(function ($ionicPlatform) {
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
                controller: 'HomeCtrl',
                templateUrl: 'templates/home.html'
            }
        }
    })
    .state('app.identificar_persona', {
        url: '/identificar_persona',
        views: {
            'menuContent': {
                controller: "IdentificarPersonaCtrl",
                templateUrl: 'templates/identificar_persona.html'
            }
        }
    })
    .state('app.pregunta_validacion', {
        url: '/pregunta_validacion',
        views: {
            'menuContent': {
                controller: 'PreguntasPersonasCtrl',
                templateUrl: 'templates/pregunta_validacion.html'
            }
        }
    })
    .state('app.programas_inscritos', {
        url: '/programas_inscritos',
        views: {
            'menuContent': {
                controller: 'ProgramasInscritosCtrl',
                templateUrl: 'templates/programas_inscritos.html'
            }
        }
    })
    .state('app.menu-familias-en-accion', {
        url: '/menu-familias-en-accion',
        views: {
            'menuContent': {
                controller: 'MenuFamiliasEnAccionCtrl',
                templateUrl: 'templates/menu-familias-en-accion.html'
            }
        }
    })
    .state('app.datos-familia', {
        url: '/datos-familia',
        views: {
            'menuContent': {
                controller: 'EstadoFamiliaCtrl',
                templateUrl: 'templates/datos-familia.html'
            }
        }
    })
    .state('app.novedades', {
        url: '/novedades',
        views: {
            'menuContent': {
                controller: 'NovedadesCtrl',
                templateUrl: 'templates/novedades.html'
            }
        }
    })
    .state('app.cumplimiento', {
        url: '/cumplimiento',
        views: {
            'menuContent': {
                controller: 'CumplimientoCtrl',
                templateUrl: 'templates/cumplimiento.html'
            }
        }
    })
    .state('app.antifraude', {
        url: '/antifraude',
        views: {
            'menuContent': {
                templateUrl: 'templates/antifraude.html'
            }
        }
    })
    .state('app.liquidacionypagos', {
        url: '/liquidacionypagos',
        views: {
            'menuContent': {
                controller: 'LiquidacionYPagoCtrl',
                templateUrl: 'templates/liquidacionesypagos.html'
            }
        }
    })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

