angular.module('alacena.elementosController', ['ionic'])
/**
* Controlador de la pantalla de elementos
*/
.controller('ElementosCtrl', function($rootScope,$scope,jsonFactory,LocalStorage,$filter,$ionicPopup,$ionicModal,$ionicListDelegate,$ionicFilterBar,logdata) {

  var filterBarInstance;
  /**
  * Se muestra el filtro de la lista de elementos
  */
  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      cancelText: 'Cancelar',
      debounce: true,
      delay: 25,
      items: $rootScope.elementos,
      update: function (filteredItems, filterText) {
        $rootScope.elementos = filteredItems;
        logdata.debug('ElementosCtrl:showFilterBar:Filtrado por:'+filterText);
      }
    });
  };
  /**
  * Inicializa la pantalla de lista de elementos
  */
  $scope.initialize = function(){
    logdata.debug('ElementosCtrl:initialize:Inicio');
    $rootScope.showReorderbutton = false;

    jsonFactory.getElementData(function(data){
      $rootScope.elementos = data;
    });

    jsonFactory.getElementListData(function(data){
      $rootScope.elementosLista = data;
    });

    jsonFactory.getListData(function(data){
      $rootScope.listas = data;
    });

    jsonFactory.getConfigData(function(data){
      $scope.colorDefaultElement = data.colorDefaultElement;
      $scope.colorbotonesEditablesDefaultElement = $filter('filter')(data.configColorsElements, {"claseElemento":data.colorDefaultElement}, true)[0].botonesEditables;
    });
    logdata.debug('ElementosCtrl:initialize:Fin');
  }
  /**
  * Ventana modal que copia un elemento en la lista de la compra
  */
  $ionicModal.fromTemplateUrl('templates/createElement.html', {
    scope: $scope
  }).then(function(modalCreateElement) {
    $scope.modalCreateElement = modalCreateElement;
  });
  /**
  * Cambia que el elemento tenga fecha de caducidad o no
  */
  $scope.cambioCaducidad = function(){
    logdata.debug('ElementosCtrl:cambioCaducidad');
    $scope.fechaDisabled=!$scope.fechaDisabled;
    $scope.elementoLista.fechaCaducidad = null;
  }
  /**
  * Copia el elemento en la lista de la compra del elemento
  */
  $scope.changeLista = function(){
    logdata.debug('ElementosCtrl:changeLista');
    if($scope.elementoLista.caduca){
      var entrada =new moment($scope.elementoLista.fechaCaducidad);
      var formato = "YYYY-MM-DD";
      $scope.elementoLista.fechaCaducidad = entrada.format(formato);
    }
    $rootScope.elementosLista.push($scope.elementoLista);
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $scope.modalCreateElement.hide();
  };
  /**
  * Se muestran las listas en las que se encuentra el elemento
  */
  $scope.mostrarListas = function(nombre) {
    logdata.debug('ElementosCtrl:mostrarListas:'+nombre);
    var elementosListaFiltrados = $filter('filter')($rootScope.elementosLista,
                                                    function(value, index) {
                                                      return value.nombreElemento === nombre;
                                                    });
    if(elementosListaFiltrados.length>0){
      var listasElemento = '';
        angular.forEach(elementosListaFiltrados, function(item) {
            if (item.nombreLista !== 'Lista de la Compra'){
              listasElemento+='Hay '+item.cantidadElemento+' en '+item.nombreLista;
            }else{
              listasElemento+='Hay que comprar '+item.cantidadElemento;
            }
            listasElemento+='<br/>';
        });
         var alertPopup = $ionicPopup.alert({
           title: nombre,
           template: listasElemento
         });
         alertPopup.then(function(res) {});
    }else{
      var confirmPopup = $ionicPopup.confirm({
        title: 'No existe el elemento',
        template: '¿Deseas añadir '+nombre+' a la Lista de la Compra?',
        cancelText: 'No',
        okText: 'Si'
      });
      confirmPopup.then(function(res) {
        if(res) {
          $scope.fechaDisabled = false;
          $scope.elementoLista = {
            "nombreElemento":nombre,
            "colorElemento":$scope.colorDefaultElement,
            "colorBotones":$scope.colorbotonesEditablesDefaultElement,
            "colorElementoNoCaducado":$scope.colorDefaultElement,
            "colorBotonesNoCaducado":$scope.colorbotonesEditablesDefaultElement,
            "nombreLista":'Lista de la Compra',
            "cantidadElemento":1,
            "caduca":!$scope.fechaDisabled,
            "fechaCaducidad":moment().toDate(),
            "cantidadMinima":0,
            "marked":false
          };
          $scope.modalCreateElement.show();
        }
      });
    }
  };
  /**
  * Se borra un elemento
  */
  $scope.onItemDelete = function(item) {
    logdata.debug('ElementosCtrl:onItemDelete:'+JSON.stringify(item));
    $rootScope.elementos.splice($rootScope.elementos.indexOf(item), 1);
    LocalStorage.set('elementos',$rootScope.elementos);
    $scope.showConfirm(item.nombreElemento);
  };
  /**
  * Se muestra una ventana modal de confirmación
  */
  $scope.showConfirm = function(nombre) {
   logdata.debug('ElementosCtrl:showConfirm:'+nombre);
   var confirmPopup = $ionicPopup.confirm({
     title: 'Borrar '+nombre,
     template: '¿Deseas borrar '+nombre+' de todas sus listas?',
     cancelText: 'No',
     okText: 'Si'
   });
   confirmPopup.then(function(res) {
     if(res) {
        logdata.debug('ElementosCtrl:showConfirm:confirmado:'+res);
        $rootScope.elementosLista = $filter('filter')($rootScope.elementosLista, function(value, index) {return value.nombreElemento !== nombre;});
        LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        $ionicListDelegate.closeOptionButtons();
     }
   });
  };

});
