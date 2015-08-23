angular.module('alacena.filters',[])
/**
* Filtro de las fechas que controla cómo se muestran las fechas de caducidad
* También se controla el color del elemento si la fecha de caducidad se acerca
*/
.filter('filterDate', function($rootScope)
    {
        return function(input,elemento)
        {
          var _date = "";
            if(input !== null){
              var formato = "YYYY-MM-DD";

              var entrada = moment(input,formato).hours(0).minutes(0).seconds(0).milliseconds(0);
              var hoy =  moment().hours(0).minutes(0).seconds(0).milliseconds(0);
              var maniana = moment().add(1,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var pasado = moment().add(2,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var sigSemana = moment().add(7,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var quinceDias = moment().add(15,'days').hours(0).minutes(0).seconds(0).milliseconds(0);

              var info = "caduca ";

              if(hoy>entrada){
                _date = "CADUCADO!";
                elemento.colorElemento = "item item-assertive item-complex item-right-editable";
                elemento.colorBotones = "button-assertive";
              }else if(hoy<=entrada && entrada<maniana){
                _date = info+"hoy";
                elemento.colorElemento = "item item-assertive item-complex item-right-editable";
                elemento.colorBotones = "button-assertive";
              }else if (maniana<=entrada && entrada<pasado){
                _date = info+"mañana";
                elemento.colorElemento = "item item-energized item-complex item-right-editable";
                elemento.colorBotones = "button-energized";
              }else if (pasado<=entrada && entrada<sigSemana){
                _date = info+"esta semana";
                elemento.colorElemento = "item item-energized item-complex item-right-editable";
                elemento.colorBotones = "button-energized";
              }else if (sigSemana<=entrada && entrada<quinceDias){
                _date = info+"la semana que viene";
                elemento.colorElemento = elemento.colorElementoNoCaducado;
                elemento.colorBotones = elemento.colorBotonesNoCaducado;
              }else{
                _date = info+"el "+entrada.format("D MM YY");
                elemento.colorElemento = elemento.colorElementoNoCaducado;
                elemento.colorBotones = elemento.colorBotonesNoCaducado;
              }
            }
            return _date;
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

            if (item.nombreLista.toLowerCase().indexOf(searchString) > -1) {
                result.push(item);
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
