angular.module('alacena.controllers', ['ngCordova'])
/**
* Controlador general
*/
.controller('AppCtrl', function($log) {
  $log.debug('AppCtrl:Inicio');
  $log.debug('AppCtrl:Fin');

})
/**
* Controlador del menú
*/
.controller('MenuCtrl', function($rootScope,$log) {
  $log.debug('MenuCtrl:Inicio');

  /**
  * Habilitar la reordenación
  */
  $rootScope.reorder = function(){
      $rootScope.showReorder = !$rootScope.showReorder;
  }
  $log.debug('MenuCtrl:Fin');
});
