angular.module('alacena.devdataController', ['ionic'])
/**
* Controlador de la pantalla de datos del desarrollador
*/
.controller('DevDataCtrl', function($scope,$rootScope,
                                    $cordovaAppVersion,$cordovaSocialSharing,$cordovaLocalNotification,$cordovaBarcodeScanner,
                                    $cordovaFile,$ionicPopup,logdata) {

  $scope.initialize = function(){

    $cordovaAppVersion.getVersionNumber().then(function (version) {
      $scope.appVersion = version;
    });

  }

  $scope.reportarError = function(){
    var formatoDia = 'YYYY_MM_DD';
    var dia = moment().format(formatoDia);
    $cordovaSocialSharing
      .shareViaEmail('Error encontrado en versión '+$scope.appVersion+'\n\n\n',
                    'ALACENA BUG NOTIFICATION : VERSION '+$scope.appVersion,
                    ['develop.apps.chony@gmail.com'],[],[],[$rootScope.dataDirectory+"alacena_"+dia+".log"])
        .then(function(result) {}, function(err) {});
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
