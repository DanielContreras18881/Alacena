angular.module('alacena.controllers', ['ngCordova'])
/**
* Controlador general
*/
.controller('AppCtrl', function() {

})
/**
* Controlador del menú
*/
.controller('MenuCtrl', function($rootScope,logdata) {
  logdata.debug('MenuCtrl:Inicio');

  /**
  * Habilitar la reordenación
  */
  $rootScope.reorder = function(){
      $rootScope.showReorder = !$rootScope.showReorder;
  }
  logdata.debug('MenuCtrl:Fin');
});
