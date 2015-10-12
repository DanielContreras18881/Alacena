angular.module('alacena.devdataController', ['ionic'])
/**
* Controlador de la pantalla de datos del desarrollador
*/
.controller('DevDataCtrl', function($scope,$rootScope,$cordovaAppVersion,$translate,$cordovaSocialSharing,
                                    $cordovaGlobalization,$cordovaLocalNotification,$cordovaBarcodeScanner,
                                    $cordovaFile,$ionicPopup,logdata) {


  /**
  * Cuando termina de cargar los datos en pantalla
  */
  $scope.$watch('$viewContentLoaded', function(){
      $rootScope.$broadcast('loading:hide');
  });
  
  $scope.initialize = function(){
    logdata.messageLog('DevDataCtrl:initialize:Inicio');
    $cordovaAppVersion.getVersionNumber().then(function (version) {
      $scope.appVersion = version;
    });
    logdata.messageLog('DevDataCtrl:initialize:Fin');
  }

  $scope.idioma = function(){
    logdata.messageLog('DevDataCtrl:idioma:inicio');
    var datos = '';
    $cordovaGlobalization.getPreferredLanguage().then(
      function(result) {
        logdata.messageLog('DevDataCtrl:idioma:getPreferredLanguage'+JSON.stringify(result));
        datos+= 'PreferredLanguage:'+JSON.stringify(result)+'\n';
        $cordovaGlobalization.getLocaleName().then(
          function(result) {
            logdata.messageLog('DevDataCtrl:idioma:getLocaleName'+JSON.stringify(result));
            datos+= 'LocaleName:'+JSON.stringify(result);
            alert(datos);
          },
          function(error) {
            logdata.messageError('DevDataCtrl:idioma:getLocaleName'+JSON.stringify(error));
        });
      },
      function(error) {
        logdata.messageError('DevDataCtrl:idioma:getPreferredLanguage'+JSON.stringify(error));
    });
    logdata.messageLog('DevDataCtrl:idioma:Fin');
  }

  $scope.reportarError = function(){
    logdata.messageLog('DevDataCtrl:reportarError:Inicio');
    var formatoDia = 'YYYY_MM_DD';
    var dia = moment().format(formatoDia);
    logdata.messageLog('DevDataCtrl:reportarError:Fichero:'+$rootScope.dataDirectory+"logs/alacena_"+dia+".log");
    $translate(['MAIL_TEXTO','MAIL_ASUNTO',]).then(function (translations) {
      $cordovaSocialSharing
        .shareViaEmail(translations.MAIL_TEXTO+$scope.appVersion+'\n\n\n',
                      translations.MAIL_ASUNTO,
                      ['develop.apps.chony@gmail.com'],[],[],[$rootScope.dataDirectory+"logs/alacena_"+dia+".log"])
          .then(function(result) {
                logdata.messageLog('DevDataCtrl:reportarError:success='+JSON.stringify(result));
          }, function(err) {
                logdata.messageError('DevDataCtrl:reportarError:error='+JSON.stringify(err));
          });
    });
    logdata.messageLog('DevDataCtrl:reportarError:Fin');
  }

  $scope.compartir = function(){
    $cordovaSocialSharing
    .share('Prueba', 'subject', null, null) // Share via native share sheet
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });
  }

  $scope.local = function(){
    $cordovaLocalNotification.schedule({
      id: 1,
      title: 'Title here',
      text: 'Text here',
      data: {
        customProperty: 'custom value'
      }
    }).then(function (result) {
      // ...
    });
  }

  $scope.barcode = function(){
    $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        // Success! Barcode data is here
      }, function(error) {
        // An error occurred
      });
  }

});
