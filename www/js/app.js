// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var buscar = '';
angular.module('alacena', ['ionic', 'ngCordova','pascalprecht.translate',
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
.run(function($ionicPlatform,$state,$ionicHistory,$ionicPopup,logdata,$rootScope,$cordovaGlobalization,$translate) {

  $ionicPlatform.ready(function() {

    if(window.AdMob) {

        // Detect platform
        var adMobId = "";
        if (ionic.Platform.isAndroid()) { // for android
            adMobId = "ca-app-pub-7863580056712493/6709912168";
        } else if(ionic.Platform.isIOS()) { // for ios
            adMobId = "ca-app-pub-7863580056712493/9663378563";
        }
        console.log('app:run:AdMob Banner inicializado');
        // Create banner
        window.AdMob.createBanner({
        adId: adMobId,
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow: true });
    }

    if (window.cordova) {
      console.log('ionic.Platform.isAndroid():'+ionic.Platform.isAndroid());
      console.log(JSON.stringify(cordova.file));
      if (ionic.Platform.isAndroid()) {
        $rootScope.dataDirectory = cordova.file.externalDataDirectory;
      }else if (ionic.Platform.isIOS()) {
        $rootScope.dataDirectory = cordova.file.documentsDirectory;
      }else{
        $rootScope.dataTemp = JSON.stringify(cordova.file);
        $rootScope.dataDirectory = cordova.file.dataDirectory;
      }
      console.log('app:run:$rootScope.dataDirectory='+$rootScope.dataDirectory);
    } else {
      $rootScope.dataDirectory = "";
    }

    console.log('app:run:createLogFile');
    logdata.createLogFile();
    console.log('app:run:createLogFile:Creado');

    $translate(['LISTA_COMPRA']).then(function (translations) {
      $rootScope.listaDeLaCompra = translations.LISTA_COMPRA;
    });

    if(navigator!==undefined){
      if(navigator.splashscreen!==undefined){
        console.log('app:run:Se oculta la SplashScreen');
        navigator.splashscreen.hide();
      }
    }

    if(typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function(language) {
            console.log('app:run:getPreferredLanguage='+language);
            $translate.use((language.value).split("-")[0]).then(function(data) {}, function(error) {});
        }, function(error){
          logdata.messageError('app:run:getPreferredLanguage:error='+JSON.stringify(error));
        });
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      console.log('app:run:Tratamos el teclado');
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      console.log('app:run:Tratamos la barra de estado');
      StatusBar.styleDefault();
    }

    //Se registra el botón back para controlar su funcionamiento en Android
    $ionicPlatform.registerBackButtonAction(function () {
       if($state.current.principal==='SI'){//Si es la página inicial mostramos una advertencia
           $translate(['SALIR','SALIR_PREGUNTA']).then(function (translations) {
             $ionicPopup.confirm({
                  title: translations.SALIR,
                  template: translations.SALIR_PREGUNTA
              }).then(function(res){
                if( res ){
                  logdata.messageLog('app:run:registerBackButtonAction:Se sale de la App');
                  navigator.app.exitApp();
                } else {
                  logdata.messageLog('app:run:registerBackButtonAction:No se sale de la App');
                }
              });
           });
         }else{
             //En cualquier otra página volvemos hacia atrás
             logdata.messageLog('app:run:registerBackButtonAction:Vamos hacia atrás en la navegación');
             $ionicHistory.goBack();
         }
      }, 100);

  });
})
/**
* Configuración de la aplicación
*/
.config(function($stateProvider,$translateProvider,$urlRouterProvider,$ionicFilterBarConfigProvider,$compileProvider) {

  $translateProvider.registerAvailableLanguageKeys(['en', 'de', 'fr', 'it','es','ja'], {
      'en-US': 'en',
      'en-UK': 'en',
      'de-DE': 'de',
      'de-CH': 'de',
      'fr-FR': 'fr',
      'it-IT': 'it',
      'es-ES': 'es',
      'ja-JP': 'ja',
  });

  $translateProvider.useStaticFilesLoader({
      prefix: 'locales/locale-',
      suffix: '.json'
  });

  $translateProvider.preferredLanguage("es");
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.fallbackLanguage("es");

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(file|https?|ftp|mailto|app):/);
  $ionicFilterBarConfigProvider.transition('vertical');
  $ionicFilterBarConfigProvider.placeholder('');

  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    cache: false,
    templateUrl: "templates/menu.html",
    controller: 'MenuCtrl'
  })

  .state('app.devData', {
    url: "/devData",
    cache: false,
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
    cache: false,
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
    cache: false,
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
      cache: false,
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
    cache: false,
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
