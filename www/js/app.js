// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('alacena', ['ionic', 'alacena.controllers','alacena.services', 'jett.ionic.filter.bar'])

.directive('resetField', ['$compile', '$timeout', function($compile, $timeout) {
    return {
    require: 'ngModel',
    scope: {},
    link: function(rootScope, el, attrs, ctrl) {

        // limit to input element of specific types
        var inputTypes = /text|search|tel|url|email|password/i;
        if (el[0].nodeName === "INPUT") {
            if (!inputTypes.test(attrs.type)) {
                throw new Error("Invalid input type for resetField: " + attrs.type);
            }
        } else if (el[0].nodeName !== "TEXTAREA") {
            throw new Error("resetField is limited to input and textarea elements");
        }

        // compiled reset icon template
        var template = $compile('<i ng-show="enabled" ng-mousedown="resetData()" class="icon ion-close-circled reset-field-icon"></i>')(rootScope);
        el.addClass("reset-field");
        el.after(template);

        rootScope.resetData = function() {
            ctrl.$setViewValue(null);
            ctrl.$render();
            $timeout(function() {
                el[0].focus();
            }, 0, false);
            rootScope.enabled = false;
        };

        el.bind('input', function() {
            rootScope.enabled = !ctrl.$isEmpty(el.val());
        })
        .bind('focus', function() {
            $timeout(function() { //Timeout just in case someone else is listening to focus and alters model
                rootScope.enabled = !ctrl.$isEmpty(el.val());
                rootScope.$apply();
            }, 0, false);
        })
       .bind('blur', function() {
            $timeout(function() {
                rootScope.enabled = false;
                rootScope.$apply();
            }, 0, false);
        })
      ;
    }
    };
}])

.run(function($ionicPlatform,$state,$ionicHistory,$ionicPopup) {

  $ionicPlatform.ready(function() {

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
                 console.log('no salimos');
               }
             });
         }else{
             //En cualquier otra página volvemos hacia atrás
             $ionicHistory.goBack();
         }
      }, 100);

  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicFilterBarConfigProvider) {

  $ionicFilterBarConfigProvider.transition('vertical');
  $ionicFilterBarConfigProvider.placeholder('Buscar');

  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'MenuCtrl'
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
