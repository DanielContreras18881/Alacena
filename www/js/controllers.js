angular.module('alacena.controllers', [])
/**
* Controlador general
*/
.controller('AppCtrl', function(LocalStorage) {
  $rootScope.optionsOpen = false;
  $rootScope.hayFechaUltimoBackup = false;
  var hayFecha = LocalStorage.get('hayFechaUltimoBackup');
  if(hayFecha!==null && hayFecha!=='null' && hayFecha!==undefined){
    $rootScope.hayFechaUltimoBackup = hayFecha;
  }
})
/**
* Controlador del menú
*/
.controller('MenuCtrl', function($rootScope,logdata) {
  /**
  * Habilitar la reordenación
  */
  $rootScope.reorder = function(){
      $rootScope.showReorder = !$rootScope.showReorder;
  }
});
