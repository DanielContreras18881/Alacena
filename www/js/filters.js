angular.module('alacena.filters',[])
/**
* Filtro de los nombres de los ficheros json
*/
.filter('filterNameJson', function($filter)
  {
    return function(input)
      {
        return input.replace('.json','');
      };
  })
  /**
  * Filtro del nombre del elemento seleccionado en el autocompletar
  */
  .filter('filterNombreElemento', function($filter)
    {
      return function(input)
        {
          if (input!==undefined && input!==null){
            if(input.originalObject!==undefined){
              if(input.originalObject.nombreElemento!==undefined){
                input = input.originalObject.nombreElemento;
                return input.originalObject.nombreElemento;
              }else{
                input = input.originalObject; 
                return input.originalObject;
              }
            }else{
              return input;
            }
          }
        };
    })
/**
* Filtro de las fechas que controla cómo se muestran las fechas de backup
*/
.filter('filterDateBckp', function($filter)
  {
    return function(input)
      {
        var _date = "";
          if(input !== null){
            var formato = "YYYY-MM-DD";

            var entrada = moment(input,formato).hours(0).minutes(0).seconds(0).milliseconds(0);
            var hoy =  moment().hours(0).minutes(0).seconds(0).milliseconds(0);
            var ayer = moment().add(-1,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
            var anteayer = moment().add(-2,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
            var semanaPasada = moment().add(-7,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
            var quinceDias = moment().add(-15,'days').hours(0).minutes(0).seconds(0).milliseconds(0);

            var info = $filter('translate')('ULTIMO_BACKUP');

            if(hoy<=entrada && entrada>ayer){
              _date = info+' '+$filter('translate')('HOY');
            }else if (ayer<=entrada && entrada>anteayer){
              _date = info+' '+$filter('translate')('AYER');
            }else if (anteayer<=entrada && entrada<semanaPasada){
              _date = info+' '+$filter('translate')('ANTEAYER');
            }else if (semanaPasada<=entrada && entrada<quinceDias){
              _date = info+' '+$filter('translate')('SEMANA_PASADA');
            }else{
              _date = info+' '+$filter('translate')('EL')+' '+entrada.format("D/MM/YY");
            }
          }
          return _date;
      };
  })
/**
* Filtro de las fechas que controla cómo se muestran las fechas de caducidad
* También se controla el color del elemento si la fecha de caducidad se acerca
*/
.filter('filterDate', function($filter)
    {
        return function(input,elemento)
        {
          var _date = "";
            if(elemento.caduca){

              var entrada = moment(input).hours(0).minutes(0).seconds(0).milliseconds(0);
              var hoy =  moment().hours(0).minutes(0).seconds(0).milliseconds(0);
              var maniana = moment().add(1,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var pasado = moment().add(2,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var sigSemana = moment().add(7,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var quinceDias = moment().add(15,'days').hours(0).minutes(0).seconds(0).milliseconds(0);

              var info = $filter('translate')('FECHA_CADUCA');

              if(hoy>entrada){
                _date = $filter('translate')('CADUCADO');
                elemento.colorElemento = "item item-assertive item-complex item-right-editable";
                elemento.colorBotones = "button-assertive";
              }else if(hoy<=entrada && entrada<maniana){
                _date = info+' '+$filter('translate')('HOY');
                elemento.colorElemento = "item item-assertive item-complex item-right-editable";
                elemento.colorBotones = "button-assertive";
              }else if (maniana<=entrada && entrada<pasado){
                _date = info+' '+$filter('translate')('MANIANA');
                elemento.colorElemento = "item item-energized item-complex item-right-editable";
                elemento.colorBotones = "button-energized";
              }else if (pasado<=entrada && entrada<sigSemana){
                _date = info+' '+$filter('translate')('ESTA_SEMANA');
                elemento.colorElemento = "item item-energized item-complex item-right-editable";
                elemento.colorBotones = "button-energized";
              }else if (sigSemana<=entrada && entrada<quinceDias){
                _date = info+' '+$filter('translate')('SEMANA_SIGUIENTE');
                elemento.colorElemento = elemento.colorElementoNoCaducado;
                elemento.colorBotones = elemento.colorBotonesNoCaducado;
              }else{
                _date = info+' '+$filter('translate')('EL')+' '+entrada.format("D/MM/YY");
                elemento.colorElemento = elemento.colorElementoNoCaducado;
                elemento.colorBotones = elemento.colorBotonesNoCaducado;
              }
              //console.log(input+':'+entrada+'='+_date);
              return _date;
            }else{
              elemento.colorElemento = elemento.colorElementoNoCaducado;
              elemento.colorBotones = elemento.colorBotonesNoCaducado;
            }
        };
    })
/**
* Filtro de la lista de elementos por el nombre de la lista a la que pertenecen
*/
.filter('filtrarLista', function() {

    return function(arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        angular.forEach(arr, function(item) {
          if(item!==null && item!==undefined && item.nombreLista!==null && item.nombreLista!==undefined && item.nombreLista!==''){
            if (item.nombreLista.toLowerCase().indexOf(searchString) > -1) {
                result.push(item);
            }
          }
        });

        return result;

    };

})
/**
* Filtro de la lista de listas quitando la lista a la que pertecene un elemento
*/
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
/**
 * Filtra los elementos según el valor facilitado
 */
.filter('filtrarElementos', function() {

    return function(arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        angular.forEach(arr, function(item) {
          if(item!==null && item!==undefined && item.nombreElemento!==null){
            if (item.nombreElemento.toLowerCase().indexOf(searchString) > -1) {
                result.push({id: item.nombreElemento, name: item.nombreElemento, view: item.nombreElemento});
            }
          }
        });

        return result;

    };

})
;
