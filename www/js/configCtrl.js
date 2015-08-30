angular.module('alacena.configController', ['ionic'])
/**
* Controlador de la pantalla de configuración
*/
.controller('ConfigCtrl', function($rootScope,$scope,jsonFactory,LocalStorage,logdata) {
  /**
  * Inicializa la pantalla de configuración
  */
  $scope.initialize = function(){
    logdata.debug('ConfigCtrl:initialize:Inicio');
    $rootScope.showReorderbutton = false;

    jsonFactory.getConfigData(function(data){
      $rootScope.configData = data;
      $scope.claseLista = $rootScope.configData.colorDefault;
      $scope.claseElemento = $rootScope.configData.colorDefaultElement;
    });
/*
    jsonFactory.getListData(function(data){
      $scope.listas = data;
    });
*/
    //$scope.nombreLista = $scope.configData.ListaDefecto;
    //$scope.idiomaSeleccionado = $scope.configData.idiomaDefault;
    logdata.debug('ConfigCtrl:initialize:Fin');
  }
    /**
    * Cambiar el color por defecto para las listas
    */
    $scope.changeColor = function(claseLista){
      logdata.debug('ConfigCtrl:changeColor:'+claseLista);
      $rootScope.configData.colorDefault = claseLista;
      LocalStorage.set('configData',$rootScope.configData);
    };
    /**
    * Cambiar el color por defecto de los elementos de las listas
    */
    $scope.changeColorElement = function(claseElemento){
      logdata.debug('ConfigCtrl:changeColorElement:'+claseElemento);
      $rootScope.configData.colorDefaultElement = claseElemento;
      LocalStorage.set('configData',$rootScope.configData);
    };
/*
    $scope.changeListaDefecto = function(nombreLista){
      $scope.configData.ListaDefecto = nombreLista;
      LocalStorage.set('configData',$scope.configData);
    };
*/
/*
    $scope.changeIdioma = function(idiomaSeleccionado){
      alert(JSON.stringify(idiomaSeleccionado));
    };
*/

});
