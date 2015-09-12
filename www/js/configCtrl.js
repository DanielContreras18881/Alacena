angular.module('alacena.configController', ['ionic'])
/**
* Controlador de la pantalla de configuración
*/
.controller('ConfigCtrl', function($rootScope,$scope,$translate,jsonFactory,LocalStorage,logdata,backup) {
  /**
  * Inicializa la pantalla de configuración
  */
  $scope.initialize = function(){
    logdata.messageLog('ConfigCtrl:initialize:Inicio');
    $rootScope.showReorderbutton = false;

    jsonFactory.getConfigData(function(data){
      $rootScope.configData = data;
      $scope.claseLista = $rootScope.configData.colorDefault;
      $scope.claseElemento = $rootScope.configData.colorDefaultElement;
      $scope.idiomaSeleccionado = $scope.configData.idiomaDefault;
    });
/*
    jsonFactory.getListData(function(data){
      $scope.listas = data;
    });
*/
    //$scope.nombreLista = $scope.configData.ListaDefecto;
    logdata.messageLog('ConfigCtrl:initialize:Fin');
  }
    /**
    * Cambiar el color por defecto para las listas
    */
    $scope.changeColor = function(claseLista){
      logdata.messageLog('ConfigCtrl:changeColor:'+claseLista);
      $rootScope.configData.colorDefault = claseLista;
      LocalStorage.set('configData',$rootScope.configData);
    };
    /**
    * Cambiar el color por defecto de los elementos de las listas
    */
    $scope.changeColorElement = function(claseElemento){
      logdata.messageLog('ConfigCtrl:changeColorElement:'+claseElemento);
      $rootScope.configData.colorDefaultElement = claseElemento;
      LocalStorage.set('configData',$rootScope.configData);
    };
/*
    $scope.changeListaDefecto = function(nombreLista){
      $scope.configData.ListaDefecto = nombreLista;
      LocalStorage.set('configData',$scope.configData);
    };
*/
    /**
    * Cambia el idioma de la aplicación y lo guarda en el fichero de configuración
    */
    $scope.changeIdioma = function(idiomaSeleccionado){
      logdata.messageLog('ConfigCtrl:changeIdioma:'+idiomaSeleccionado);
      $translate.use(idiomaSeleccionado);
      $rootScope.configData.idiomaDefault= idiomaSeleccionado;
      LocalStorage.set('configData',$rootScope.configData);
    };
    /**
    *
    */
    $scope.hacerBackup = function(){
      logdata.messageLog('ConfigCtrl:hacerBackup:Se lanza el backup de la aplicación');
      backup.makeBckp();
      var formato = "YYYY-MM-DD HH:mm:ss";
      var dia = moment().format(formato);
      $rootScope.fechaUltimoBackup = dia;
      $rootScope.hayFechaUltimoBackup = true;
    };

});
