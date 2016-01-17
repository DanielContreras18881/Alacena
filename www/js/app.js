// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var buscar = '';
angular.module('alacena', ['ionic', 'ngCordova','pascalprecht.translate','jett.ionic.filter.bar','angucomplete-alt',
                                    'ionic-timepicker','ionic-datepicker','angular-web-notification',//'ion-autocomplete',
                                    'gapi','ngm.ngDrive',//'auth0','angular-storage','angular-jwt',
                                    'alacena.devdataController',
                                    'alacena.controllers',
                                    'alacena.cantidadElementosController',
                                    'alacena.configController',
                                    'alacena.elementosController',                                                                                                            'alacena.listasController',
                                    'alacena.services',
                                    'alacena.googleServices',
                                    'alacena.directives',
                                    'alacena.filters'])

  .value('GoogleApp', {
    apiKey: '',
    clientId: '1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com',
    scopes: [
      // whatever scopes you need for your app, for example:
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/userinfo.profile'
      // ...
    ]})

.provider('OauthService', ngDrive.Config)
    .config(function (OauthServiceProvider) {
        OauthServiceProvider.setScopes('https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/userinfo.profile');
        OauthServiceProvider.setClientID('1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com');
        OauthServiceProvider.setTokenRefreshPolicy(ngDrive.TokenRefreshPolicy.PRIOR_TO_EXPIRY);
        OauthServiceProvider.setImmediateMode(false);
    })

/**
* Factoría que muestra el spinner de carga
*/

.factory('Spinner', function ($ionicLoading) {
  return{
    show:function(){
      $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-royal"></ion-spinner>',
            animation: 'fade-in',
            hideOnStateChange : false,
            duration: 2500,
            showBackdrop: false
          });
    },
    hide:function(){
      $ionicLoading.hide();
    }
  };
})
/**
* Ejecución de la aplicación
*/
.run(function(
                $ionicPlatform,$state,$ionicHistory,$ionicPopup,
                logdata,$rootScope,$cordovaGlobalization,$translate,
                Spinner,$ionicSideMenuDelegate,jsonFactory) {//,auth
  //auth.hookEvents();
  //
  document.addEventListener("pause", onPause, false);
	function onPause() {
		$rootScope.segundoPlano = true;
	}
	document.addEventListener("resume", onResume, false);

	function onResume() {
		$rootScope.segundoPlano = false;
	}

  jsonFactory.getConfigData(function(data){
    $rootScope.configData = data;
    if(typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function(language) {
            console.log('app:run:getPreferredLanguage='+language);
            $translate.use((language.value).split("-")[0]).then(function(data) {}, function(error) {});
        }, function(error){
          logdata.messageError('app:run:getPreferredLanguage:error='+JSON.stringify(error));
        });
    }else{
      console.log('app:run:getPreferredLanguage:navegador=es');
      $translate.use(($rootScope.configData.idiomaDefault).split("-")[0]).then(function(data) {}, function(error) {});
    }
  });

  $ionicSideMenuDelegate.canDragContent(true);
  $rootScope.nombreUsuario = '';
  $rootScope.imagenUsuario = 'img/ionic.png';
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    Spinner.show();
  });

  $ionicPlatform.ready(function() {

    if (window.cordova) {
      //console.log(JSON.stringify(cordova));
      if (ionic.Platform.isAndroid()) {
        $rootScope.dataDirectory = cordova.file.externalDataDirectory;
      }else if (ionic.Platform.isIOS()) {
        $rootScope.dataDirectory = cordova.file.documentsDirectory;
      }else{
        $rootScope.dataDirectory = cordova.file.dataDirectory;
      }
      console.log('app:run:$rootScope.dataDirectory='+$rootScope.dataDirectory);

      $rootScope.$on('$cordovaLocalNotification:trigger',
      function (event, notification, state) {
        if(!$rootScope.segundoPlano){
          $ionicPopup.alert({
            title: notification.title,
            template: notification.text
          });
        }
      });

      $rootScope.$on('$cordovaLocalNotification:click',
      function (event, notification, state) {
        if(!$rootScope.segundoPlano){
          $ionicPopup.alert({
            title: notification.title,
            template: notification.text
          });
        }else{
          var dataNotification = JSON.parse(notification.data);
          $state.go('app.lista', {
            nombreLista: dataNotification.nombreLista,
            colorLista: dataNotification.colorLista,
            listaEditable: dataNotification.listaEditable
          });
        }
      });

    } else {
      console.log('app:run:Navegador');
      $rootScope.isWebBrowser = true;
      $rootScope.dataDirectory = "";
    }

    if(window.AdMob && !$rootScope.isWebBrowser) {
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
          adSize: AdMob.AD_SIZE.SMART_BANNER,
          autoShow: true,
          overlap: true
        });
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
    }else{
      console.log('app:run:getPreferredLanguage:navegador=es');
      $translate.use(('es').split("-")[0]).then(function(data) {}, function(error) {});
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
      logdata.messageLog('app:run:registerBackButtonAction:principal:'+$state.current.principal);
      logdata.messageLog('app:run:registerBackButtonAction:url:'+$state.current.url);
       if($state.current.principal==='SI'){//Si es la página inicial mostramos una advertencia
           $translate(['SALIR','SALIR_PREGUNTA','NO','SI']).then(function (translations) {
             $ionicPopup.confirm({
                  title: translations.SALIR,
                  template: translations.SALIR_PREGUNTA,
                  cancelText: translations.NO,
                  okText: translations.SI
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
.config(function($stateProvider,$translateProvider,$urlRouterProvider,$ionicFilterBarConfigProvider,$compileProvider) {//,authProvider,$httpProvider,jwtInterceptorProvider
/*
    jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
      var idToken = store.get('token');
      var refreshToken = store.get('refreshToken');
      if (!idToken || !refreshToken) {
        return null;
      }
      if (jwtHelper.isTokenExpired(idToken)) {
        return auth.refreshIdToken(refreshToken).then(function(idToken) {
          store.set('token', idToken);
          return idToken;
        });
      } else {
        return idToken;
      }
    }

    $httpProvider.interceptors.push('jwtInterceptor');

    authProvider.init({
      domain: 'accounts.google.com/',
      clientID: '1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com',
      loginState: 'login' // This is the name of the state where you'll show the login, which is defined above...
    });
*/
  //$translateProvider.registerAvailableLanguageKeys(['en', 'de', 'fr', 'it','es','ja'], {
  //$translateProvider.registerAvailableLanguageKeys(['en', 'fr', 'it','es'], {
  $translateProvider.registerAvailableLanguageKeys(['en', 'es'], {
      'en-US': 'en',
      'en-UK': 'en',
      //'de-DE': 'de',
      //'de-CH': 'de',
      //'fr-FR': 'fr',
      //'it-IT': 'it',
      'es-ES': 'es',
      //'ja-JP': 'ja',
  });

  $translateProvider.useStaticFilesLoader({
      prefix: 'locales/locale-',
      suffix: '.json'
  });

  //$translateProvider.preferredLanguage("es");
  $translateProvider.useSanitizeValueStrategy('escape');
  //$translateProvider.fallbackLanguage("es");

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

  // This is the state where you'll show the login
/*
    .state('app.login', { // Notice: this state name matches the loginState property value to set in authProvider.init({...}) below...
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
    })
*/
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
  $urlRouterProvider.otherwise('/app/listas');
});
