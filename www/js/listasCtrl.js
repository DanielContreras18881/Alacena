angular.module('alacena.listasController', ['ionic'])
/**
* Controlador de la pantalla de listas
*/
.controller('ListasCtrl', function($rootScope,$scope,$ionicModal,$ionicListDelegate,jsonFactory,LocalStorage,$filter,logdata) {
  /**
  * Inicializa la pantalla de listas
  */
  $scope.initialize = function(){
    logdata.messageLog('ListasCtrl:initialize:Inicio');
    jsonFactory.getListData(function(data){
      $rootScope.listas = data;
      $rootScope.showReorderbutton = $rootScope.listas.length > 2;
    });

    jsonFactory.getConfigData(function(data){
      $scope.coloresListas = data.configColors;
      $scope.colorDefault = data.colorDefault;
      $scope.colorBotonesDefault = $filter('filter')(data.configColors, {"claseLista":data.colorDefault}, true)[0].botonesEditables;
    });

    jsonFactory.getElementListData(function(data){
      $rootScope.elementosLista = data;
    });
    logdata.messageLog('ListasCtrl:initialize:Fin');
  }
  /**
  * Compartir la lista con alguien
  */
  $scope.share = function(item) {
    logdata.messageLog('ListaCtrl:share:'+JSON.stringify(item));
    alert('Share Item: ' + item.nombreLista);
    $ionicListDelegate.closeOptionButtons();
  };
  /**
  * Muestra ventana modal para editar una lista
  */
  $scope.edit = function(item) {
    logdata.messageLog('ListaCtrl:edit:'+JSON.stringify(item));
    $scope.newList = item;
    $ionicListDelegate.closeOptionButtons();
    $scope.modalLista.show();
  };
  /**
  * Salva los datos de una lista editada o creada
  */
  $scope.save = function(element){
    logdata.messageLog('ListaCtrl:save:'+JSON.stringify(element));
    if($rootScope.listas.indexOf(element) === -1) {
      $rootScope.listas.push(element);
    }
    LocalStorage.set('listas',$rootScope.listas);
    $scope.modalLista.hide();
  };
  /**
  * Establece el color de la lista
  */
  $scope.setColor = function(claseLista){
    logdata.messageLog('ListaCtrl:setColor:'+claseLista);
    $scope.newList.colorLista = claseLista;
    $scope.newList.colorBotones = $filter('filter')($scope.coloresListas, {"claseLista":claseLista}, true)[0].botonesEditables;
  };
  /**
  * Muestra la ventana modal para crear una lista
  */
  $scope.addItem = function() {
    logdata.messageLog('ListaCtrl:addItem');
    $translate(['LISTA_NUEVA']).then(function (translations) {
      $scope.newList =   {
        "nombreLista":translations.LISTA_NUEVA,
        "colorLista":$scope.colorDefault,
        "colorBotones":$scope.colorBotonesDefault,
        "listaEditable":true
      };
      logdata.messageLog('ListaCtrl:addItem:$scope.newList'+JSON.stringify($scope.newList));
    });
    $scope.modalLista.show();
  };
  /**
  * Ventana modal para crear una lista
  */
  $ionicModal.fromTemplateUrl('templates/addLista.html', {
    scope: $scope
  }).then(function(modalLista) {
    $scope.modalLista = modalLista;
  });
  /**
  * Mueve una lista dentro de la lista de listas
  */
  $scope.moveItem = function(item, fromIndex, toIndex) {
    logdata.messageLog('ListaCtrl:moveItem:'+JSON.stringify(item)+' de '+fromIndex+' a '+toIndex);
    if(item.listaEditable && toIndex!==0){
      $rootScope.listas.splice(fromIndex, 1);
      $rootScope.listas.splice(toIndex, 0, item);
      LocalStorage.set('listas',$rootScope.listas);
    }
  };
  /**
  * Elimina una lista de la lista de listas
  */
  $scope.onItemDelete = function(item) {
    logdata.messageLog('ListaCtrl:onItemDelete:'+JSON.stringify(item));
    $rootScope.listas.splice($rootScope.listas.indexOf(item), 1);
    LocalStorage.set('listas',$rootScope.listas);
    $rootScope.elementosLista = $filter('filter')($rootScope.elementosLista, function(value, index) {return value.nombreLista !== item.nombreLista;});
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
  };

});
