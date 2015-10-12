angular.module('alacena.services', [])

/**
* Factoría que permite
*/
.factory('jsonFactory',function($http,LocalStorage,logdata){

	var jsonFactory = {};

	/**
	* Recupera los datos de configuración de la App, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getConfigData = function (callback){
		$http.get('./json/Configuracion.json').success(function(response) {
			var datosConfig = response;
			if(LocalStorage.get('configData')==null){
					logdata.messageLog('Primera instalación');
					LocalStorage.set('configData',datosConfig);
					callback(datosConfig);
			}else{
				logdata.messageLog('Actualizando configuración');
				var configLocalData = LocalStorage.get('configData');
				configLocalData.configColorsElements = datosConfig.configColorsElements;
				configLocalData.configColors = datosConfig.configColors;
				configLocalData.idiomas = datosConfig.idiomas;
				callback(configLocalData);
			}
		});
	};

	/**
	* Recupera los datos de los elementos, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getElementData = function (callback){
		if(LocalStorage.get('elementos')==null){
			logdata.messageLog('Primera instalación');
			$http.get('./json/Elementos.json').success(function(response) {
				LocalStorage.set('elementos',response);
        		callback(response);
    		});
		}else{
			logdata.messageLog('Se recuperan los elementos');
			callback(LocalStorage.get('elementos'));
		}
	};

	/**
	* Recupera los datos de las listas, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getListData = function (callback){
		if(LocalStorage.get('listas')==null){
			logdata.messageLog('Primera instalación');
			$http.get('./json/Listas.json').success(function(response) {
				LocalStorage.set('listas',response);
        		callback(response);
    		});
		}else{
			logdata.messageLog('Se recuperan las listas');
			callback(LocalStorage.get('listas'));
		}
	};

	/**
	* Recupera los datos de los elementos de una lista, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getElementListData = function (callback){
		if(LocalStorage.get('cantidadElementosLista')==null){
			logdata.messageLog('Primera instalación');
			$http.get('./json/CantidadElementoLista.json').success(function(response) {
				LocalStorage.set('cantidadElementosLista',response);
        		callback(response);
    		});
		}else{
			logdata.messageLog('Se recuperan los elementos de una lista');
			callback(LocalStorage.get('cantidadElementosLista'));
		}
	};

	return jsonFactory;
})

/**
* Factoría que permite almacenar, recuperar y eliminar datos del localstorage
*/
.factory('LocalStorage', function(logdata) {

        return {
            /**
             * Guarda en la base de datos del dispositivo el valor asociándolo a la clave
             */
            set: function(key, value) {
								logdata.messageLog('Guarda:'+JSON.stringify(value));
                localStorage.setItem(key, JSON.stringify(value));
            },
            /**
             * Recupera de la base de datos del dispositivo el valor asociado a la clave solicitada
             */
            get: function(key) {
								logdata.messageLog('Recupera:'+key);
                var resultado = localStorage.getItem(key);
                if (resultado !== null && resultado !== 'undefined' && resultado !== undefined) {
										logdata.messageLog('Recuperado:'+JSON.stringify(resultado));
                    return JSON.parse(resultado);
                } else {
										logdata.messageError('No encontrado:'+key);
                    return null;
                }
            },
            /**
             * Elimina de la base de datos del dispositivo el valor asociado a la clave indicada
             */
            put: function(key) {
								logdata.messageLog('Borrado:'+key);
                localStorage.removeItem(key);
            }
        };
    })

/**
* Factoría que guarda en un fichero el log
*/
.factory('logdata', function($cordovaFile,$rootScope) {

			var formatoDia = 'YYYY_MM_DD';
			var formato = "YYYY-MM-DD HH:mm:ss";
			var dia = moment().format(formatoDia);

			return{
					createLogFile: function(){
						//console.log('createLogFile:'+$rootScope.dataDirectory+"alacena_"+dia+".log");
						if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
							//console.log($rootScope.dataDirectory+'logs/'+"alacena_"+dia+".log");
							$cordovaFile.checkDir($rootScope.dataDirectory, "logs")
					      .then(function (success) {
										$cordovaFile.createFile($rootScope.dataDirectory+'logs/',"alacena_"+dia+".log", true)
											.then(function (success) {
												console.log('FICHERO CREADO:'+$rootScope.dataDirectory+'logs/'+"alacena_"+dia+".log");
											}, function (error) {
												console.log('FICHERO NO CREADO:'+JSON.stringify(error));
										});
					      }, function (error) {
									$cordovaFile.createDir($rootScope.dataDirectory, "logs", false)
							      .then(function (success) {
											$cordovaFile.createFile($rootScope.dataDirectory+'logs/',"alacena_"+dia+".log", true)
												.then(function (success) {
													console.log('FICHERO CREADO:'+$rootScope.dataDirectory+'logs/'+"alacena_"+dia+".log");
												}, function (error) {
													console.log('FICHERO NO CREADO:'+JSON.stringify(error));
											});
							      }, function (error) {
							        console.log('FICHERO NO CREADO:NO SE HA PODIDO CREAR EL DIRECTORIO:'+JSON.stringify(error));
							      });
					      });
						}
					},
					messageLog: function(message){
						var txtLog = '{'+moment().format(formato)+'}===[LOG]...........'+message+'\n';
						//console.log(txtLog);
						//console.log($rootScope.dataDirectory+'logs/'+"alacena_"+dia+".log");
						if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
							$cordovaFile.writeExistingFile($rootScope.dataDirectory+'logs/', "alacena_"+dia+".log", txtLog)
								.then(function (success) {
										console.log(txtLog);
								}, function (error) {
										console.log(error);
								}
							);
						}else{
							console.log(txtLog);
						}
					},
					messageError: function(message){
						var txtLog = '{'+moment().format(formato)+'}###[ERROR]**********'+message+'\n';
						//console.log(txtLog);
						//console.log($rootScope.dataDirectory+'logs/'+"alacena_"+dia+".log");
						if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
							$cordovaFile.writeExistingFile($rootScope.dataDirectory+'logs/', "alacena_"+dia+".log", txtLog)
								.then(function (success) {
									console.log(txtLog);
								}, function (error) {
										console.log(error);
								}
							);
						}else{
							console.log(txtLog);
						}
					}
			};
})

/**
* Factoría que guarda en ficheros las listas, y que permite recuperar el backup
*/
.factory('backup', function($cordovaFile,$rootScope,$filter,LocalStorage,logdata,$translate,$ionicPopup) {

			var formato = "YYYY-MM-DD HH:mm:ss";
			var dia = moment().format(formato);
			var formatoCarpeta = "YYYY-MM-DD_HH-mm-ss";
			var diaCarpeta = moment().format(formatoCarpeta);

			function backup(){
				$translate(['LISTA_COMPRA']).then(function (translations) {
					//Backup de cada lista de elementos
					angular.forEach($rootScope.listas, function(item) {
						//console.log('Backup:'+JSON.stringify(item));
						var elementos_lista = $filter('filtrarLista')($rootScope.elementosLista,item.nombreLista);
						var strNombreLista = item.nombreLista;
						if(item.nombreLista==='LISTA_COMPRA'){
							strNombreLista = translations.LISTA_COMPRA;
						}
						angular.forEach(elementos_lista, function(item) {
							//console.log('Backup::'+JSON.stringify(item));
							$cordovaFile.createFile($rootScope.dataDirectory+'backup_'+diaCarpeta+'/',strNombreLista+".json", true)
								.then(function (success) {
									logdata.messageLog('backup:makeBckp:FICHERO CREADO:'+$rootScope.dataDirectory+'backup_'+diaCarpeta+'/'+strNombreLista+".json");
									$cordovaFile.writeFile($rootScope.dataDirectory+'backup_'+diaCarpeta+'/', strNombreLista+".json", elementos_lista, true)
										.then(function (success) {
											logdata.messageLog('backup:makeBckp:Escritura en fichero realizada'+JSON.stringify(success));
										}, function (error) {
											$rootScope.$broadcast('loading:hide');
											logdata.messageError('backup:makeBckp:Error al escribir en fichero:'+strNombreLista+".json : "+JSON.stringify(error));
										}
									);
								}, function (error) {
									$rootScope.$broadcast('loading:hide');
									logdata.messageError('backup:makeBckp:FICHERO NO CREADO:'+JSON.stringify(error));
							});
						});
					});
					//Backup de la lista general de elementos
					$cordovaFile.createFile($rootScope.dataDirectory+'backup_'+diaCarpeta+'/',"elementos.json", true)
						.then(function (success) {
							logdata.messageLog('backup:makeBckp:FICHERO CREADO:'+$rootScope.dataDirectory+'backup_'+diaCarpeta+'/'+"elementos.json");
							$cordovaFile.writeFile($rootScope.dataDirectory+'backup_'+diaCarpeta+'/', "elementos.json", $rootScope.elementos, true)
								.then(function (success) {
									logdata.messageLog('backup:makeBckp:Escritura en fichero realizada'+JSON.stringify(success));
								}, function (error) {
									$rootScope.$broadcast('loading:hide');
									logdata.messageError('backup:makeBckp:Error al escribir en fichero:elementos.json : '+JSON.stringify(error));
								}
							);
						}, function (error) {
							$rootScope.$broadcast('loading:hide');
							logdata.messageError('backup:makeBckp:FICHERO NO CREADO:'+JSON.stringify(error));
					});
					//TODO: hacer backup de la configuración
					LocalStorage.set('fechaUltimoBackup',dia);
					$rootScope.fechaUltimoBackup = dia;
					$rootScope.hayFechaUltimoBackup = true;
					LocalStorage.set('hayFechaUltimoBackup',$rootScope.hayFechaUltimoBackup);
					logdata.messageLog('backup:makeBckp:Backup realizado:'+dia);
					$rootScope.$broadcast('loading:hide');
					$ionicPopup.alert({
						title: 'EXITO',
						template: 'Backup realizado correctamente'
					});
				});
			};

			return{
				/**
				* Realiza un backup en ficheros json de cada lista de elementos y de la lista general de elementos, sobreescribiendo
				*/
				makeBckp: function(){
					if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
						$cordovaFile.checkDir(cordova.file.dataDirectory, "backup_"+diaCarpeta)
						.then(function (success) {
							backup();
						}, function (error) {
							$cordovaFile.createDir($rootScope.dataDirectory, "backup_"+diaCarpeta, false)
								.then(function (success) {
									backup();
								}, function (error) {
										logdata.messageLog('backup:makeBckp:Backup no realizado:No se ha podido el directorio:'+JSON.stringify(error));
										$rootScope.$broadcast('loading:hide');
										$ionicPopup.alert({
											title: 'ERROR',
											template: 'Backup no realizado correctamente'
										});
								});

						});
					}
				},
				/**
				* Recupera un backup de ficheros json de cada lista de elementos y de la lista general de elementos, sobreescribiendo
				*/
				retrieveBckp: function(){
					//IDEA I2
					//recuperar de los ficheros, crear los json de elementos, cantidadElementosLista y listas(ver si es necesario hacer backup) y configuración
				}
			}
})
;
