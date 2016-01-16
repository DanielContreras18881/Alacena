angular.module('alacena.services', [])

/**
* Factoría que permite recuperar los datos de la aplicación
*/
.factory('jsonFactory',function($http,LocalStorage,logdata,googleServices){

	var jsonFactory = {};

	/**
	* Recupera los datos de configuración de la App, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getConfigData = function (callback){
		$http.get('./json/Configuracion.json').success(function(response) {
			var datosConfig = response;
			if(LocalStorage.get('configData')===null){
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
		if(LocalStorage.get('elementos')===null){
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
		if(LocalStorage.get('listas')===null){
			logdata.messageLog('Primera instalación');
			$http.get('./json/Listas.json').success(function(response) {
						LocalStorage.set('listas',response);
						//googleServices.writeFile('Listas.json',response);
        		callback(response);
    		});
		}else{
			logdata.messageLog('Se recuperan las listas');
			var data = LocalStorage.get('listas');
			//googleServices.writeFile('Listas.json',data);
			callback(data);
		}
	};

	/**
	* Recupera los datos de los elementos de una lista, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getElementListData = function (callback){
		if(LocalStorage.get('cantidadElementosLista')===null){
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
 * factory - description
 *
 * @param  {type} 'favoritas'         description
 * @param  {type} function($rootScope description
 * @param  {type} $cordovaFile        description
 * @param  {type} logdata             description
 * @param  {type} $translate          description
 * @return {type}                     description
 */
.factory('favoritas',function($rootScope,$cordovaFile,logdata,$translate) {

	/**
	 * saveFile - description
	 *
	 * @param  {type} listaGuardar description
	 * @param  {type} nombreLista  description
	 * @return {type}              description
	 */
	function saveFile(listaGuardar,nombreLista){
		logdata.messageLog('favoritas:saveFile:'+nombreLista+'-contenido:'+JSON.stringify(listaGuardar));
		$cordovaFile.createFile($rootScope.dataDirectory+'listasFavoritas/',nombreLista+".json", true)
			.then(function (success) {
				logdata.messageLog('favoritas:saveFile:FICHERO CREADO:'+$rootScope.dataDirectory+'listasFavoritas/'+nombreLista+".json");
				$cordovaFile.writeFile($rootScope.dataDirectory+'listasFavoritas/',nombreLista+".json", listaGuardar, true)
					.then(function (success) {
						logdata.messageLog('favoritas:saveFile:Escritura en fichero realizada'+JSON.stringify(success));
					}, function (error) {
						logdata.messageError('favoritas:saveFile:Error al escribir en fichero:'+strNombreLista+".json : "+JSON.stringify(error));
					}
				);
			}, function (error) {
				logdata.messageError('favoritas:saveFile:FICHERO NO CREADO:'+JSON.stringify(error));
		});
	}
	function loadFile(listaRecuperar,callback){
		logdata.messageLog('favoritas:loadFile:'+$rootScope.dataDirectory+'listasFavoritas/'+listaRecuperar);
		$cordovaFile.checkFile($rootScope.dataDirectory+'listasFavoritas/',listaRecuperar)
			.then(function (success) {
				$cordovaFile.readAsText($rootScope.dataDirectory+'listasFavoritas/', listaRecuperar)
					.then(function(success){
						logdata.messageLog('favoritas:loadFile:success');
						callback(success);
					},function(error){
						logdata.messageError('favoritas:loadFile:Lista no recuperada:Ha ocurrido un error:'+JSON.stringify(error));
						callback(null);
					});
			}, function (error) {
				logdata.messageError('favoritas:loadFile:Lista no recuperada:No se ha encontrado el fichero:'+JSON.stringify(error));
				callback(null);
		});
	}

	return{
		guardarLista: function(listaGuardar,nombreLista){
			logdata.messageLog('favoritas:guardarLista:'+nombreLista+'-contenido:'+JSON.stringify(listaGuardar));
			if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
				logdata.messageLog('favoritas:guardarLista:$rootScope.dataDirectory'+$rootScope.dataDirectory);
				$cordovaFile.checkDir($rootScope.dataDirectory, "listasFavoritas")
				.then(function (success) {
					saveFile(listaGuardar,nombreLista);
				}, function (error) {
					logdata.messageError('favoritas:guardarLista:ERROR:'+JSON.stringify(error));
					$cordovaFile.createDir($rootScope.dataDirectory, "listasFavoritas", false)
						.then(function (success) {
							saveFile(listaGuardar,nombreLista);
						}, function (error) {
								logdata.messageError('favoritas:guardarLista:Lista no guardada:No se ha podido crear el directorio:'+JSON.stringify(error));
						});
				});
			}
		},
		retrieveList: function(listaRecuperar,callback){
			logdata.messageLog('favoritas:recuperarLista:'+listaRecuperar);
			if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
				$cordovaFile.checkDir($rootScope.dataDirectory, "listasFavoritas")
				.then(function (success) {
					loadFile(listaRecuperar,callback);
				}, function (error) {
					logdata.messageError('favoritas:recuperarLista:No existen listas favoritas:No se ha encontrado el directorio:'+JSON.stringify(error));
					callback(null);
				});
			}
		},
		retriveListOfLists: function(callback){
			if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
				$cordovaFile.listDir($rootScope.dataDirectory, "listasFavoritas")
				.then(function (success) {
					logdata.messageError('favoritas:retriveListOfLists:Listado ficheros:'+JSON.stringify(success));
					callback(success);
				}, function (error) {
					logdata.messageError('favoritas:retriveListOfLists:No existen listas favoritas:No se ha encontrado el directorio:'+JSON.stringify(error));
					callback(null);
				});
			}else{
				callback(null);
			}
		}
	};
})

/**
* Factoría que guarda en ficheros las listas, y que permite recuperar el backup
*/
.factory('backup', function($cordovaFile,$rootScope,$filter,LocalStorage,logdata,$translate,$ionicPopup) {

			var formato = "YYYY-MM-DD HH:mm:ss";
			var dia;
			var formatoCarpeta = "YYYY-MM-DD_HH-mm-ss";
			var diaCarpeta;

			function backup(callback){
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
							$cordovaFile.createFile($rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/',strNombreLista+".json", true)
								.then(function (success) {
									logdata.messageLog('backup:makeBckp:FICHERO CREADO:'+$rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/'+strNombreLista+".json");
									$cordovaFile.writeFile($rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/', strNombreLista+".json", elementos_lista, true)
										.then(function (success) {
											logdata.messageLog('backup:makeBckp:Escritura en fichero realizada'+JSON.stringify(success));
										}, function (error) {
											logdata.messageError('backup:makeBckp:Error al escribir en fichero:'+strNombreLista+".json : "+JSON.stringify(error));
										}
									);
								}, function (error) {
									logdata.messageError('backup:makeBckp:FICHERO NO CREADO:'+JSON.stringify(error));
							});
						});
					});
					//Backup de la lista de listas
					$cordovaFile.createFile($rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/',"Listas.json", true)
						.then(function (success) {
							logdata.messageLog('backup:makeBckp:FICHERO CREADO:'+$rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/'+"Listas.json");
							$cordovaFile.writeFile($rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/', "Listas.json", $rootScope.listas, true)
								.then(function (success) {
									logdata.messageLog('backup:makeBckp:Escritura en fichero realizada'+JSON.stringify(success));
								}, function (error) {
									logdata.messageError('backup:makeBckp:Error al escribir en fichero:Listas.json : '+JSON.stringify(error));
								}
							);
						}, function (error) {
							logdata.messageError('backup:makeBckp:FICHERO NO CREADO:'+JSON.stringify(error));
					});
					//Backup de la lista general de elementos
					$cordovaFile.createFile($rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/',"Elementos.json", true)
						.then(function (success) {
							logdata.messageLog('backup:makeBckp:FICHERO CREADO:'+$rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/'+"Elementos.json");
							$cordovaFile.writeFile($rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/', "Elementos.json", $rootScope.elementos, true)
								.then(function (success) {
									logdata.messageLog('backup:makeBckp:Escritura en fichero realizada'+JSON.stringify(success));
								}, function (error) {
									logdata.messageError('backup:makeBckp:Error al escribir en fichero:Elementos.json : '+JSON.stringify(error));
								}
							);
						}, function (error) {
							logdata.messageError('backup:makeBckp:FICHERO NO CREADO:'+JSON.stringify(error));
					});
					//Backup de la configuración
					$cordovaFile.createFile($rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/',"Configuracion.json", true)
						.then(function (success) {
							logdata.messageLog('backup:makeBckp:FICHERO CREADO:'+$rootScope.dataDirectory+'backups'+'/'+'backup_'+diaCarpeta+'/'+"Configuracion.json");
							$cordovaFile.writeFile($rootScope.dataDirectory+'backups/backup_'+diaCarpeta+'/', "Configuracion.json", $rootScope.configData, true)
								.then(function (success) {
									logdata.messageLog('backup:makeBckp:Escritura en fichero realizada'+JSON.stringify(success));
								}, function (error) {
									logdata.messageError('backup:makeBckp:Error al escribir en fichero:elementos.json : '+JSON.stringify(error));
								}
							);
						}, function (error) {
							logdata.messageError('backup:makeBckp:FICHERO NO CREADO:'+JSON.stringify(error));
					});
					LocalStorage.set('fechaUltimoBackup',dia);
					$rootScope.fechaUltimoBackup = dia;
					$rootScope.hayFechaUltimoBackup = true;
					LocalStorage.set('hayFechaUltimoBackup',$rootScope.hayFechaUltimoBackup);
					logdata.messageLog('backup:makeBckp:Backup realizado:'+dia);
					callback(true);
				});
			}

			return{
				/**
				* Realiza un backup en ficheros json de cada lista de elementos y de la lista general de elementos, sobreescribiendo
				*/
				makeBckp: function(callback){
					dia = moment().format(formato);
					diaCarpeta = moment().format(formatoCarpeta);
					if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
						$cordovaFile.checkDir($rootScope.dataDirectory,"backups")
						.then(function(success){
							$cordovaFile.checkDir($rootScope.dataDirectory+"backups/", "backup_"+diaCarpeta)
							.then(function (success) {
								backup(callback);
							}, function (error) {
								$cordovaFile.createDir($rootScope.dataDirectory+"backups/", "backup_"+diaCarpeta, false)
									.then(function (success) {
										backup(callback);
									}, function (error) {
											logdata.messageLog('backup:makeBckp:Backup no realizado:No se ha podido crear el directorio:'+JSON.stringify(error));
											callback(false);
									});
							});
						}, function(error){
							$cordovaFile.createDir($rootScope.dataDirectory,"backups", false)
								.then(function (success) {
									$cordovaFile.checkDir($rootScope.dataDirectory+"backups/", "backup_"+diaCarpeta)
									.then(function (success) {
										backup(callback);
									}, function (error) {
										$cordovaFile.createDir($rootScope.dataDirectory+"backups/", "backup_"+diaCarpeta, false)
											.then(function (success) {
												backup(callback);
											}, function (error) {
													logdata.messageLog('backup:makeBckp:Backup no realizado:No se ha podido crear el directorio:'+JSON.stringify(error));
													callback(false);
											});
									});
								}, function (error) {
										logdata.messageLog('backup:makeBckp:Backup no realizado:No se ha podido crear el directorio:'+JSON.stringify(error));
										callback(false);
								});
						});
					}
				},
				/**
				* Recupera un backup de ficheros json de cada lista de elementos y de la lista general de elementos, sobreescribiendo
				*/
				retrieveBckp: function(backupRecuperar,callback){
					//recuperar de los ficheros, crear los JSON de elementos, cantidadElementosLista, listas (filtrar de cantidadElementosLista) y configuración
					if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
						$cordovaFile.listDir($rootScope.dataDirectory+"backups/",backupRecuperar)
						.then(function (ficherosBackup) {
							LocalStorage.put('cantidadElementosLista');
							angular.forEach(ficherosBackup, function(item) {
								logdata.messageLog('backup:retrieveBckp:name:'+item.name);
								logdata.messageLog('backup:retrieveBckp:path:'+$rootScope.dataDirectory+'backups/'+backupRecuperar+'/'+item.name);
								$cordovaFile.checkFile($rootScope.dataDirectory+'backups/'+backupRecuperar+'/',item.name)
									.then(function (success) {
										$cordovaFile.readAsText($rootScope.dataDirectory+'backups/'+backupRecuperar+'/',item.name)
											.then(function(response){
												logdata.messageLog('backup:retrieveBckp:name:'+item.name+':success');
												if(item.name=='Elementos.json'){
													LocalStorage.put('elementos');
													LocalStorage.set('elementos',JSON.parse(response));
												}else if (item.name=='Configuracion.json'){
													LocalStorage.put('configData');
													LocalStorage.set('configData',JSON.parse(response));
												}else if (item.name=='Listas.json'){
													LocalStorage.put('listas');
													LocalStorage.set('listas',JSON.parse(response));
												}else{
													var cantidadElementosLista = LocalStorage.get('cantidadElementosLista')!==null?LocalStorage.get('cantidadElementosLista'):[];
													angular.forEach(JSON.parse(response), function(item) {
														cantidadElementosLista.push(item);
													});
													LocalStorage.set('cantidadElementosLista',cantidadElementosLista);
												}
											},function(error){
												logdata.messageError('backup:retrieveBckp:name:'+item.name+':Ha ocurrido un error:'+JSON.stringify(error));
											});
									}, function (error) {
										logdata.messageError('backup:retrieveBckp:Backuo no recuperado:No se ha encontrado el fichero:'+JSON.stringify(error));
								});
							});
							callback(true);
						}, function (error) {
							logdata.messageError('backup:retrieveBckp:No existen backups:No se ha encontrado el directorio:'+JSON.stringify(error));
							callback(false);
						});
					}else{
						callback(false);
					}
				},
				/**
				* Recupera La lista de backups realizados
				*/
				retrieveBckpList: function(callback){
					if($rootScope.dataDirectory!=='' && $rootScope.dataDirectory!==undefined){
						$cordovaFile.listDir($rootScope.dataDirectory, "backups")
						.then(function (success) {
							logdata.messageLog('backup:retrieveBckpList:Listado ficheros:'+JSON.stringify(success));
							callback(success);
						}, function (error) {
							logdata.messageError('backup:retrieveBckpList:No existen backups:No se ha encontrado el directorio:'+JSON.stringify(error));
							callback(null);
						});
					}else{
						callback(null);
					}
				}
			};
})
;
