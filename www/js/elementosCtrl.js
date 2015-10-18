angular.module('alacena.elementosController', ['ionic'])
/**
* Controlador de la pantalla de elementos
*/
.controller('ElementosCtrl', function($rootScope,$scope,$translate,jsonFactory,LocalStorage,$filter,$ionicPopup,$ionicModal,$ionicListDelegate,$ionicFilterBar,logdata) {

  /**
  * Cuando termina de cargar los datos en pantalla
  */
  $scope.$watch('$viewContentLoaded', function(){
      $rootScope.$broadcast('loading:hide');
  });

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
        logdata.messageLog('ElementosCtrl:showFilterBar:Filtrado por:'+filterText);
      }
    });
  };
  /**
  * Inicializa la pantalla de lista de elementos
  */
  $scope.initialize = function(){
    logdata.messageLog('ElementosCtrl:initialize:Inicio');
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
    logdata.messageLog('ElementosCtrl:initialize:Fin');
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
    logdata.messageLog('ElementosCtrl:cambioCaducidad');
    $scope.fechaDisabled=!$scope.fechaDisabled;
    $scope.elementoLista.fechaCaducidad = null;
  }
  /**
  * Copia el elemento en la lista de la compra del elemento
  */
  $scope.changeLista = function(){
    logdata.messageLog('ElementosCtrl:changeLista');
    if($scope.elementoLista.caduca){
      logdata.messageLog('ElementosCtrl:changeLista:Se transforma la fecha de caducidad');
      var entrada = moment($scope.elementoLista.fechaCaducidad);
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
    logdata.messageLog('ElementosCtrl:mostrarListas:'+nombre);
    var elementosListaFiltrados = $filter('filter')($rootScope.elementosLista,
                                                    function(value, index) {
                                                      return value.nombreElemento === nombre;
                                                    });
    if(elementosListaFiltrados.length>0){
      $translate(['HAY_QUE_COMPRAR','TIENES','EN','VALE','LISTA_COMPRA']).then(function (translations) {
        var listasElemento = '';
          angular.forEach(elementosListaFiltrados, function(item) {
              if (item.nombreLista !== $rootScope.listaDeLaCompra){
                var strNombreLista = item.nombreLista;
                if(item.nombreLista==='LISTA_COMPRA'){
                  strNombreLista = translations.LISTA_COMPRA;
                }
                listasElemento+=translations.TIENES+item.cantidadElemento+translations.EN+strNombreLista;
              }else{
                listasElemento+=translations.HAY_QUE_COMPRAR+item.cantidadElemento;
              }
              listasElemento+='<br/>';
          });
           var alertPopup = $ionicPopup.alert({
             title: nombre,
             template: listasElemento,
             okText: translations.VALE
           });
           alertPopup.then(function(res) {
             logdata.messageLog('ElementosCtrl:changeLista:Se ha informado de la cantidad de '+nombre+'|'+JSON.stringify(res));
           });
        });
    }else{
      $translate(['NO_EXISTE_ELEMENTO','NO','SI']).then(function (translations) {
        var confirmPopup = $ionicPopup.confirm({
          title: translations.NO_EXISTE_ELEMENTO,
          template: $translate('INCLUIR_PREGUNTA', { nombre:nombre }),
          cancelText: translations.NO,
          okText: translations.SI
        });
        confirmPopup.then(function(res) {
          if(res) {
            logdata.messageLog('ElementosCtrl:changeLista:Se decide mover '+nombre+' a la Lista de la Compra|'+JSON.stringify(res));
            $scope.fechaDisabled = false;
            $scope.elementoLista = {
              "nombreElemento":nombre,
              "colorElemento":$scope.colorDefaultElement,
              "colorBotones":$scope.colorbotonesEditablesDefaultElement,
              "colorElementoNoCaducado":$scope.colorDefaultElement,
              "colorBotonesNoCaducado":$scope.colorbotonesEditablesDefaultElement,
              "nombreLista":$rootScope.listaDeLaCompra,
              "cantidadElemento":1,
              "caduca":!$scope.fechaDisabled,
              "fechaCaducidad":moment().toDate(),
              "cantidadMinima":0,
              "marked":false
            };
            logdata.messageLog('ElementosCtrl:changeLista:$scope.elementoLista='+JSON.stringify($scope.elementoLista));
            $scope.modalCreateElement.show();
          }
        });
      });
    }
  };
  /**
  * Se borra un elemento
  */
  $scope.onItemDelete = function(item) {
    logdata.messageLog('ElementosCtrl:onItemDelete:'+JSON.stringify(item));
    $rootScope.elementos.splice($rootScope.elementos.indexOf(item), 1);
    LocalStorage.set('elementos',$rootScope.elementos);
    $scope.showConfirm(item.nombreElemento);
  };
  /**
  * Se muestra una ventana modal de confirmación
  */
  $scope.showConfirm = function(nombre) {
   logdata.messageLog('ElementosCtrl:showConfirm:'+nombre);
   $translate(['BORRAR','NO','SI']).then(function (translations) {});
   var confirmPopup = $ionicPopup.confirm({
     title: translations.BORRAR+nombre,
     template: $translate('BORRAR_PREGUNTA_LISTAS', { nombre:nombre }),
     cancelText: translations.NO,
     okText: translations.SI
   });
   confirmPopup.then(function(res) {
     if(res) {
        logdata.messageLog('ElementosCtrl:showConfirm:Se decide borrar '+nombre+'|'+JSON.stringify(res));
        $rootScope.elementosLista = $filter('filter')($rootScope.elementosLista, function(value, index) {return value.nombreElemento !== nombre;});
        LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        $ionicListDelegate.closeOptionButtons();
     }
   });
  };
  /**
  * Crea un listado y muestra una ventana modal con los elementos que no existen en ninguna lista o tienen 0 en su cantidad
  */
  $scope.makeShopingList = function(){
    var elementosConCantidad = $filter('filter')($rootScope.elementosLista,
      function(value, index) {return (value.nombreLista !== 'LISTA_COMPRA' && value.cantidadElemento > 0);}
    );
    $rootScope.elementosSinLista = $filter('filter')($rootScope.elementos,
      function(value1, index1) {
        var elementos = $filter('filter')(elementosConCantidad,function(value2, index2) {return (value1.nombreElemento == value2.nombreElemento);});
        if(elementos.length==0){
          return value1;
        }
      }
    );
    logdata.messageLog('ElementosCtrl:makeShopingList:elementosSinLista:'+JSON.stringify($rootScope.elementosSinLista));
    $scope.modalAddToList.show();
  };
  /**
  * Ventana modal para mostrar elementos a añadir
  */
  $ionicModal.fromTemplateUrl('templates/addToList.html', {
    scope: $scope
  }).then(function(modalAddToList) {
    $scope.modalAddToList = modalAddToList;
  });
  /**
  * Se marca o desmarca un elemento de la lista candidata a la lista de la compra
  */
  $scope.markToAdd = function(item) {
    logdata.messageLog('ElementosCtrl:markToAdd:'+JSON.stringify(item));
    var busqueda = $filter('filter')($rootScope.elementosSinLista, {"nombreElemento":item.nombreElemento}, true);
    if(busqueda[0].marked){
      busqueda[0].marked = false;
    }else{
      busqueda[0].marked = true;
    }
    logdata.messageLog('ElementosCtrl:markToAdd:'+JSON.stringify(busqueda[0]));
  };
});
