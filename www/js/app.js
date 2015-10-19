// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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

.config(function($stateProvider, $urlRouterProvider) {
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
                templateUrl: 'templates/home.html'
            }
        }
    })
    .state('app.identificar_persona', {
        url: '/identificar_persona',
        views: {
            'menuContent': {
                templateUrl: 'templates/identificar_persona.html'
            }
        }
    })
    .state('app.pregunta_validacion', {
        url: '/pregunta_validacion',
        views: {
            'menuContent': {
                templateUrl: 'templates/pregunta_validacion.html'
            }
        }
    })
    .state('app.programas_inscritos', {
        url: '/programas_inscritos',
        views: {
            'menuContent': {
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
});
