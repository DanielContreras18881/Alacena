angular.module('alacena.controllers', [])
/**
* Controlador general
*/
.controller('AppCtrl', function() {

})
/**
* Controlador del menú
*/
.controller('MenuCtrl', function(LocalStorage,$rootScope,$scope,logdata,$cordovaOauth) {
  $rootScope.authorized = false;

  $rootScope.optionsOpen = false;
  $rootScope.hayFechaUltimoBackup = false;
  var hayFecha = LocalStorage.get('hayFechaUltimoBackup');
  if(hayFecha!=null && hayFecha!='null' && hayFecha!=undefined){
    $rootScope.hayFechaUltimoBackup = hayFecha;
    $rootScope.fechaUltimoBackup  = LocalStorage.get('fechaUltimoBackup');
  }
  /**
  * Muestra las opciones de reordenación
  */
  $rootScope.reorder = function(){
    $rootScope.showReorder = !$rootScope.showReorder;
  }
  /**
  *
  */
  $scope.authorize = function () {
    logdata.messageLog('GAPI:Inicio');
    $cordovaOauth.google(
        "1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com",
        [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/contacts.readonly',
          'https://www.googleapis.com/auth/userinfo.profile'
        ],
        {redirect_uri: 'http://localhost/callback/'}
      ).then(function(result) {
        logdata.messageLog('GAPI:OK:'+JSON.stringify(result));
        $rootScope.authorized = true;
      }, function(error) {
        logdata.messageLog('GAPI:error:'+error);
      }
    );
    logdata.messageLog('GAPI:Fin');
  }

  /*
  $scope.googleLogin = function() {
        $cordovaOauth.google("1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com", ['https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/userinfo.profile']).then(function(result) {
            console.log(JSON.stringify(result));
        }, function(error) {
            console.log(error);
        });
    }
    */
});
