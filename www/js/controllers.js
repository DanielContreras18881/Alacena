angular.module('alacena.controllers', [])
/**
* Controlador general
*/
.controller('AppCtrl', function() {

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
  /**
  * Muestra las opciones de reordenación
  */
  $rootScope.reorder = function(){
    $rootScope.showReorder = !$rootScope.showReorder;
  }
});
