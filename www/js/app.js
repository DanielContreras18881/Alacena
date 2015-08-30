// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('alacena', ['ionic', 'ngCordova',
                                    'alacena.devdataController',
                                    'alacena.controllers',
                                    'alacena.cantidadElementosController',
                                    'alacena.configController',
                                    'alacena.elementosController',                                                                                                            'alacena.listasController',
                                    'alacena.services',
                                    'alacena.directives',
                                    'alacena.filters',
                                    'jett.ionic.filter.bar'])


/**
* Ejecución de la aplicación
*/
.run(function($ionicPlatform,$state,$ionicHistory,$ionicPopup,logdata,$rootScope) {

  $ionicPlatform.ready(function() {
    if (window.cordova) {
      if (ionic.Platform.isAndroid()) {
        console.log('cordova.file.externalDataDirectory: ' + cordova.file.externalDataDirectory);
        $rootScope.dataDirectory = cordova.file.externalDataDirectory;
      }else if (ionic.Platform.isIOS()) {
        console.log('cordova.file.documentsDirectory: ' + cordova.file.documentsDirectory);
        $rootScope.dataDirectory = cordova.file.documentsDirectory;
      }else{
        console.log('cordova.file.dataDirectory: ' + cordova.file.dataDirectory);
        $rootScope.dataDirectory = cordova.file.dataDirectory;
      }
    } else {
      $rootScope.dataDirectory = "";
    }

    logdata.createLogFile();

    if(navigator!==undefined){
      if(navigator.splashscreen!==undefined){
        navigator.splashscreen.hide();
      }
    }


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //Se registra el botón back para controlar su funcionamiento en Android
    $ionicPlatform.registerBackButtonAction(function () {
       if($state.current.principal==='SI'){//Si es la página inicial mostramos una advertencia
            $ionicPopup.confirm({
                 title: 'Salir',
                 template: '¿Quiere salir de la aplicación?'
             }).then(function(res){
               if( res ){
                 navigator.app.exitApp();
               } else {
                 logdata.debug('no salimos');
               }
             });
         }else{
             //En cualquier otra página volvemos hacia atrás
             $ionicHistory.goBack();
         }
      }, 100);

  });
})
/**
* Configuración de la aplicación
*/
.config(function($stateProvider, $urlRouterProvider,$ionicFilterBarConfigProvider,$compileProvider) {

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(file|https?|ftp|mailto|app):/);
  $ionicFilterBarConfigProvider.transition('vertical');
  $ionicFilterBarConfigProvider.placeholder('Buscar');

  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'MenuCtrl'
  })

  .state('app.devData', {
    url: "/devData",
    views: {
      'menuContent': {
        templateUrl: "templates/devdata.html",
        controller:'DevDataCtrl'
      }
    },
    principal:'SI'
  })

  .state('app.config', {
    url: "/config",
    views: {
      'menuContent': {
        templateUrl: "templates/config.html",
        controller:'ConfigCtrl'
      }
    },
    principal:'SI'
  })

  .state('app.elementos', {
    url: "/elementos",
    views: {
      'menuContent': {
        templateUrl: "templates/elementos.html",
        controller:'ElementosCtrl'
      }
    },
    principal:'SI'
  })
    .state('app.listas', {
      url: "/listas",
      views: {
        'menuContent': {
          templateUrl: "templates/listas.html",
          controller: 'ListasCtrl'
        }
      },
      principal:'SI'
    })

  .state('app.lista', {
    url: "/listas/:nombreLista/:colorLista/:listaEditable",
    views: {
      'menuContent': {
        templateUrl: "templates/lista.html",
        controller: 'ListaCtrl'
      }
    },
    principal:'NO'
  });
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/listas/Lista de la Compra');
  $urlRouterProvider.otherwise('/app/listas');
});
