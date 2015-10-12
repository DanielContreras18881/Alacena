angular.module('alacena.controllers', [])
/**
* Controlador general
*/
.controller('AppCtrl', function(LocalStorage) {

})
/**
* Controlador del menú
*/
.controller('MenuCtrl', function(LocalStorage,$rootScope) {
  $rootScope.optionsOpen = false;
  $rootScope.hayFechaUltimoBackup = false;
  var hayFecha = LocalStorage.get('hayFechaUltimoBackup');
  if(hayFecha!=null && hayFecha!='null' && hayFecha!=undefined){
    $rootScope.hayFechaUltimoBackup = hayFecha;
    $rootScope.fechaUltimoBackup  = LocalStorage.get('fechaUltimoBackup');
  }
});
