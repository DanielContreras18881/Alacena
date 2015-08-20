angular.module('alacena.controllers', ['ngCordova'])

.filter('filterDate', function()
    {
        return function(input)
        {
          var _date = "";
            if(input !== null){
              var formato = "YYYY-MM-DD";

              var entrada = moment(input,formato).hours(0).minutes(0).seconds(0).milliseconds(0);
              var hoy =  moment().hours(0).minutes(0).seconds(0).milliseconds(0);
              var maniana = moment().add(1,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var sigSemana = moment().add(7,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var quinceDias = moment().add(15,'days').hours(0).minutes(0).seconds(0).milliseconds(0);

              var info = "caduca ";

              if(entrada<hoy){
                _date = "CADUCADO!";
              }else if(hoy>=entrada){
                _date = info+"hoy";
              }else if (maniana>=entrada){
                _date = info+"mañana";
              }else if (sigSemana>=entrada){
                _date = info+"la semana que viene";
              /*}else if (quinceDias>=entrada){
                _date = info+"en dos semanas";*/
              }else{
                _date = info+"el "+entrada.format("D MM YY");
              }
            }
            return _date;
        };
    })

.filter('filtrarLista', function() {

    return function(arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        angular.forEach(arr, function(item) {

            if (item.nombreLista.toLowerCase().indexOf(searchString) > -1) {
                result.push(item);
            }

        });

        return result;

    };

})

.filter('filtrarQuitarLista', function() {

    return function(arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        angular.forEach(arr, function(item) {

            if (item.nombreLista.toLowerCase().indexOf(searchString) === -1) {
                result.push(item);
            }

        });

        return result;

    };

})

.controller('AppCtrl', function() {

})

.controller('MenuCtrl', function($rootScope) {

  $rootScope.reorder = function(){
      $rootScope.showReorder = !$rootScope.showReorder;
  }

})

.controller('ConfigCtrl', function($rootScope,$scope,jsonFactory,LocalStorage) {

  $scope.initialize = function(){
    $rootScope.showReorderbutton = false;

    jsonFactory.getConfigData(function(data){
      $scope.configData = data;
    });
/*
    jsonFactory.getListData(function(data){
      $scope.listas = data;
    });
*/
    $scope.claseLista = $scope.configData.colorDefault;
    $scope.claseElemento = $scope.configData.colorDefaultElement;
    //$scope.nombreLista = $scope.configData.ListaDefecto;
    //$scope.idiomaSeleccionado = $scope.configData.idiomaDefault;
  }

    $scope.changeColor = function(claseLista){
      $scope.configData.colorDefault = claseLista;
      LocalStorage.set('configData',$scope.configData);
    };

    $scope.changeColorElement = function(claseElemento){
      $scope.configData.colorDefaultElement = claseElemento;
      LocalStorage.set('configData',$scope.configData);
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

})

.controller('ElementosCtrl', function($rootScope,$scope,jsonFactory,LocalStorage,$filter,$ionicPopup) {

  $scope.initialize = function(){
    $rootScope.showReorderbutton = false;

    jsonFactory.getElementData(function(data){
      $rootScope.elementos = data;
    });

    jsonFactory.getElementListData(function(data){
      $scope.elementosLista = data;
    });
  }

  $scope.onItemDelete = function(item) {
    $rootScope.elementos.splice($rootScope.elementos.indexOf(item), 1);
    LocalStorage.set('elementos',$rootScope.elementos);
    $scope.showConfirm(item.nombreElemento);
  };

  $scope.showConfirm = function(nombre) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Borrado de elementos',
     template: '¿Desea borrar '+nombre+' de todas sus listas?'
   });
   confirmPopup.then(function(res) {
     if(res) {
        $scope.elementosLista = $filter('filter')($scope.elementosLista, function(value, index) {return value.nombreElemento !== nombre;});
        LocalStorage.set('cantidadElementosLista',$scope.elementosLista);
     }
   });
  };

})

.controller('ListasCtrl', function($rootScope,$scope,$ionicModal,$ionicListDelegate,jsonFactory,LocalStorage,$filter) {

  $scope.initialize = function(){

    jsonFactory.getListData(function(data){
      $scope.listas = data;
      $rootScope.showReorderbutton = $scope.listas.length > 2;
    });

    jsonFactory.getConfigData(function(data){
      $scope.coloresListas = data.configColors;
      $scope.colorDefault = data.colorDefault;
      $scope.colorBotonesDefault = $filter('filter')(data.configColors, {"claseLista":data.colorDefault}, true)[0].botonesEditables;
    });

    jsonFactory.getElementListData(function(data){
      $scope.elementosLista = data;
    });
  }

  $scope.share = function(item) {
    alert('Share Item: ' + item.nombreLista);
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.edit = function(item) {
    $scope.newList = item;
    $ionicListDelegate.closeOptionButtons();
    $scope.modalLista.show();
  };

  $scope.save = function(element){
    if($scope.listas.indexOf(element) === -1) {
      $scope.listas.push(element);
    }
    LocalStorage.set('listas',$scope.listas);
    $scope.modalLista.hide();
  };

  $scope.setColor = function(claseLista){
    $scope.newList.colorLista = claseLista;
    $scope.newList.colorBotones = $filter('filter')($scope.coloresListas, {"claseLista":claseLista}, true)[0].botonesEditables;
  };

  $scope.addItem = function() {
    $scope.newList =   {
      "nombreLista":"lista nueva",
      "colorLista":$scope.colorDefault,
      "colorBotones":$scope.colorBotonesDefault,
      "listaEditable":true
    };
    $scope.modalLista.show();
  };

  $ionicModal.fromTemplateUrl('templates/addLista.html', {
    scope: $scope
  }).then(function(modalLista) {
    $scope.modalLista = modalLista;
  });

  $scope.moveItem = function(item, fromIndex, toIndex) {
    if(item.listaEditable && toIndex!==0){
      $scope.listas.splice(fromIndex, 1);
      $scope.listas.splice(toIndex, 0, item);
      LocalStorage.set('listas',$scope.listas);
    }
  };

  $scope.onItemDelete = function(item) {
    $scope.listas.splice($scope.listas.indexOf(item), 1);
    LocalStorage.set('listas',$scope.listas);
    $scope.elementosLista = $filter('filter')($scope.elementosLista, function(value, index) {return value.nombreLista !== item.nombreLista;});
    LocalStorage.set('cantidadElementosLista',$scope.elementosLista);
  };

})

.controller('ListaCtrl', function($rootScope,$scope,$stateParams,$ionicModal,$ionicListDelegate,jsonFactory,LocalStorage,$filter,$cordovaLocalNotification,$ionicPopup) {

    $scope.initialize = function(){

      $scope.nombreLista = $stateParams.nombreLista;
      $scope.listaEditable = $stateParams.listaEditable;
      $scope.colorLista = $stateParams.colorLista;

      jsonFactory.getListData(function(data){
        $scope.listas = data;
      });

      jsonFactory.getElementListData(function(data){
        $scope.elementosLista = data;
        var elementosFiltrados = $filter('filtrarLista')($scope.elementosLista,$scope.nombreLista);
        $rootScope.showReorderbutton = elementosFiltrados.length > 1;
      });

      jsonFactory.getElementData(function(data){
        $rootScope.elementos = data;
      });

      jsonFactory.getConfigData(function(data){
        $scope.coloresElementos = data.configColorsElements;
        $scope.colorDefaultElement = data.colorDefaultElement;
        $scope.colorbotonesEditablesDefaultElement = $filter('filter')(data.configColorsElements, {"claseElemento":data.colorDefaultElement}, true)[0].botonesEditables;
        $scope.askAddListaCompra = data.askAddListaCompra;
      });
    }

  $scope.edit = function(item) {
    var formato = "YYYY-MM-DD";
    item.fechaCaducidad = moment(item.fechaCaducidad,formato).hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    $scope.newElement = item;
    $ionicListDelegate.closeOptionButtons();
    $scope.modalElemento.show();
  };

  $scope.setColor = function(claseElemento){
    $scope.newElement.colorElemento = claseElemento;
    $scope.newElement.colorBotones = $filter('filter')($scope.coloresElementos, {"claseElemento":claseElemento})[0].botonesEditables;
  };

  $scope.save = function(element){
    //Comprobar la cantidad de elementos y la cantidad minima por si hay que mandarlo a la lista de la compra
    var entrada =new moment(element.fechaCaducidad);
    var formato = "YYYY-MM-DD";
    element.fechaCaducidad = entrada.format(formato);
    if($filter('filter')($scope.elementosLista,element).length==0) {
      $scope.elementosLista.push(element);
      if($filter('filter')($scope.elementos,{"nombreElemento":element.nombreElemento}).length==0) {
        $rootScope.elementos.push({"nombreElemento":element.nombreElemento});
      }
    }
    LocalStorage.set('cantidadElementosLista',$scope.elementosLista);
    LocalStorage.set('elementos',$rootScope.elementos);
    $scope.modalElemento.hide();
  };

  $scope.changeLista = function(lista){
    $scope.elementoLista.nombreLista = lista;
    if($scope.elementosLista.indexOf($scope.elementoLista) === -1) {
      $scope.elementosLista.push($scope.elementoLista);
    }
    LocalStorage.set('cantidadElementosLista',$scope.elementosLista);
    $scope.modalMoveElement.hide();
  };

  $scope.preguntaTraslado = function(nombre,callback){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Mover '+nombre,
      template: '¿Desea mover '+nombre+' a la lista de la compra?'
    });
    confirmPopup.then(function(res) {
      if(res) {
         callback();
      }
    });
  }

  $scope.minusElement = function(item) {
    if(item.cantidadElemento>0){
      item.cantidadElemento = --item.cantidadElemento;
      if(item.cantidadElemento<item.cantidadMinima){
        $scope.preguntaTraslado(item.nombreElemento,function(){
          var elementosFiltrados = $filter('filter')($scope.elementosLista,
                {"nombreElemento":item.nombreElemento,"nombreLista":"Lista de la Compra"});
          if(elementosFiltrados.length > 0) {
            var cantidadActual = $scope.elementosLista[$scope.elementosLista.indexOf(elementosFiltrados[0])].cantidadElemento;
            $scope.elementosLista[$scope.elementosLista.indexOf(elementosFiltrados[0])].cantidadElemento=cantidadActual+elementosFiltrados[0].cantidadMinima;
            $scope.elementosLista.splice($scope.elementosLista.indexOf(item), 1);
          }else{
            item.nombreLista="Lista de la Compra";
            item.cantidadElemento = item.cantidadMinima;
          }
        });
      }
    }else{
      if(item.cantidadMinima==0){
        $scope.elementosLista.splice($scope.elementosLista.indexOf(item), 1);
      }else{
        $scope.preguntaTraslado(item.nombreElemento,function(){
          item.nombreLista="Lista de la Compra";
          item.cantidadElemento = item.cantidadMinima;
        });
      }
    }
    LocalStorage.set('cantidadElementosLista',$scope.elementosLista);
    $ionicListDelegate.closeOptionButtons();
    /*
    $cordovaLocalNotification.schedule({
      id: 1,
      title: 'Title here',
      text: 'Text here',
      data: {
        customProperty: 'custom value'
      }
    }).then(function (result) {
      alert('Prueba');
    });
    */
  };

  $scope.plusElement = function(item) {
    item.cantidadElemento = ++item.cantidadElemento;
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.moveTo = function(item) {
    $scope.elementoLista = item;
    var listasFiltradas = $filter('filtrarQuitarLista')($scope.listas,$scope.nombreLista);
    $scope.nuevoNombreLista = listasFiltradas[0].nombreLista;
    $scope.modalMoveElement.show();
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.markAcquired = function(item) {
    if(item.marked){
      item.marked = false;
    }else{
      item.marked = true;
    }
  };

  $ionicModal.fromTemplateUrl('templates/moveElement.html', {
    scope: $scope
  }).then(function(modalMoveElement) {
    $scope.modalMoveElement = modalMoveElement;
  });

  $scope.addItem = function() {
    $scope.newElement = {
      "nombreElemento":"elemento",
      "colorElemento":$scope.colorDefaultElement,
      "colorBotones":$scope.colorbotonesEditablesDefaultElement,
      "nombreLista":$scope.nombreLista,
      "cantidadElemento":1,
      "fechaCaducidad":moment().toDate(),
      "cantidadMinima":0
    };
    $scope.modalElemento.show();
  };

  $ionicModal.fromTemplateUrl('templates/addElemento.html', {
    scope: $scope
  }).then(function(modalElemento) {
    $scope.modalElemento = modalElemento;
  });

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.elementosLista.splice(fromIndex, 1);
    $scope.elementosLista.splice(toIndex, 0, item);
    LocalStorage.set('cantidadElementosLista',$scope.elementosLista);
  };

  $scope.onItemDelete = function(item) {
    $scope.elementosLista.splice($scope.elementosLista.indexOf(item), 1);
    LocalStorage.set('cantidadElementosLista',$scope.elementosLista);
    //$scope.showConfirm(item.nombreElemento);
  };

  $scope.showConfirm = function(nombre) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Borrado de elementos',
     template: '¿Desea borrar '+nombre+' de la lista general?'
   });
   confirmPopup.then(function(res) {
     if(res) {
      $rootScope.elementos = $filter('filter')($rootScope.elementos, function(value, index) {return value.nombreElemento !== nombre;});
      LocalStorage.set('elementos',$rootScope.elementos);
     }
   });
  };

});
