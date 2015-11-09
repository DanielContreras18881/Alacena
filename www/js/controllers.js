angular.module('alacena.controllers', [])
/**
* Controlador general
*/
.controller('AppCtrl', function() {

})
/**
* Controlador del menú
*/
.controller('MenuCtrl', function(LocalStorage,$rootScope,$scope,logdata,googleServices,$ionicPopup,jsonFactory) {
  $rootScope.authorized = false;
  jsonFactory.getConfigData(function(data){
    $rootScope.configData = data;
    if($rootScope.configData.access_token!==null && $rootScope.configData.access_token!==undefined){
      $rootScope.authorized = true;
      googleServices.userInfo(function(data){
        if(data!==null){
          $rootScope.nombreUsuario = data.name;
          $rootScope.imagenUsuario = data.picture;
        }
      });
    }
  });
  $rootScope.optionsOpen = false;
  $rootScope.hayFechaUltimoBackup = false;
  var hayFecha = LocalStorage.get('hayFechaUltimoBackup');
  if(hayFecha!==null && hayFecha!=='null' && hayFecha!==undefined){
    $rootScope.hayFechaUltimoBackup = hayFecha;
    $rootScope.fechaUltimoBackup  = LocalStorage.get('fechaUltimoBackup');
  }
  /**
  * Muestra las opciones de reordenación
  */
  $rootScope.reorder = function(){
    $rootScope.showReorder = !$rootScope.showReorder;
  };
  /**
  * Función que realiza la autorización con Google
  */
  $scope.authorize = function () {
    logdata.messageLog('GAPI:Inicio');
    googleServices.init(function(data){
      LocalStorage.set('configData',$rootScope.configData);
      if(data!==null){
        $rootScope.nombreUsuario = data.name;
        $rootScope.imagenUsuario = data.picture;
      }else{
        $ionicPopup.alert({
          title: 'ERROR',
          template: 'No se ha podido hacer login contra Google.<br/>Inténtelo de nuevo más tarde'
        });
      }
    });
    logdata.messageLog('GAPI:Fin');
  };
});
