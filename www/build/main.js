webpackJsonp([0],{

/***/ 1020:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BottomButtonsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Bottom button component to use on App pages
 *
 * @export
 * @class BottomButtonsComponent
 */
var BottomButtonsComponent = /** @class */ (function () {
    function BottomButtonsComponent(actionSheetCtrl, alertCtrl, toastCtrl, globalVars, translate) {
        var _this = this;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.globalVars = globalVars;
        this.translate = translate;
        this.finishedNotifications = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.finishedRemoved = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.finishedAdd = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.finishNotification = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.finishFavorite = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.right = false;
        globalVars.getConfigData().then(function (config) {
            _this.right =
                config.rightHand !== undefined ? config.rightHand : true;
        });
    }
    /**
     * Method on response of notification button pushed
     *
     * @memberof BottomButtonsComponent
     */
    BottomButtonsComponent.prototype.setNotification = function () {
        this.finishNotification.emit();
    };
    /**
     * Method on response of save or recover button pushed
     *
     * @param {Event} event Event object associated
     * @memberof BottomButtonsComponent
     */
    BottomButtonsComponent.prototype.saveRecoverList = function (event) {
        var _this = this;
        this.globalVars.getFavoritesListsData().then(function (listFavorites) {
            var askButtons = [];
            askButtons.push({
                text: _this.translate.instant('Guardar'),
                handler: function () {
                    _this.alertCtrl
                        .create({
                        title: _this.translate.instant('GuardarComo'),
                        inputs: [
                            {
                                name: 'name'
                            }
                        ],
                        buttons: [
                            {
                                text: _this.translate.instant('Cancelar'),
                                role: 'cancel'
                            },
                            {
                                text: _this.translate.instant('Guardar'),
                                handler: function (data) {
                                    if (data.name.trim() == '' || data.name == null) {
                                        var toast = _this.toastCtrl.create({
                                            message: _this.translate.instant('ValorValido'),
                                            duration: 1500,
                                            position: 'bottom'
                                        });
                                        toast.present();
                                        return;
                                    }
                                    _this.globalVars.setListData(data.name.trim(), _this.object);
                                    listFavorites.push(data.name.trim());
                                    _this.globalVars.setFavoritesListsData(listFavorites);
                                }
                            }
                        ]
                    })
                        .present();
                }
            });
            if (listFavorites.length > 0) {
                askButtons.push({
                    text: _this.translate.instant('Cargar'),
                    handler: function () {
                        var buttons = [];
                        listFavorites.forEach(function (favorite) {
                            buttons.push({
                                text: favorite,
                                handler: function () {
                                    _this.globalVars.getListData(favorite).then(function (data) {
                                        _this.globalVars.setListData('LISTA_COMPRA', data);
                                        _this.finishFavorite.emit(data);
                                    });
                                }
                            });
                        });
                        var actionSheet = _this.actionSheetCtrl.create({
                            title: _this.translate.instant('ListaCargar'),
                            buttons: buttons
                        });
                        actionSheet.present();
                    }
                });
                askButtons.push({
                    text: _this.translate.instant('Borrar'),
                    handler: function () {
                        var buttons = [];
                        listFavorites.forEach(function (favorite) {
                            buttons.push({
                                text: favorite,
                                handler: function () {
                                    _this.globalVars.removetItemListData(favorite);
                                    listFavorites = listFavorites.filter(function (list) { return list !== favorite; });
                                    _this.globalVars.setFavoritesListsData(listFavorites);
                                }
                            });
                        });
                        var actionSheet = _this.actionSheetCtrl.create({
                            title: _this.translate.instant('ListaBorrar'),
                            buttons: buttons
                        });
                        actionSheet.present();
                    }
                });
            }
            askButtons.push({ text: _this.translate.instant('Cancelar'), role: 'cancel' });
            var askFavorite = _this.alertCtrl.create({
                title: _this.translate.instant('GuardarListaCompra'),
                buttons: askButtons
            });
            askFavorite.present();
        });
    };
    /**
     * Method on response of remove button pushed
     *
     * @param {Event} event Event object associated
     * @memberof BottomButtonsComponent
     */
    BottomButtonsComponent.prototype.removeItems = function (event) {
        var _this = this;
        var remove = this.alertCtrl.create();
        remove.setTitle(this.translate.instant('Borrar'));
        var existElements = false;
        this.object.forEach(function (item) {
            var nombre = _this.type === 'List'
                ? item.nombreLista
                : _this.type === 'Categories'
                    ? item.categoryName
                    : item.nombreElemento;
            if (nombre !== 'LISTA_COMPRA') {
                existElements = true;
                remove.addInput({
                    type: 'checkbox',
                    label: nombre,
                    value: nombre,
                    checked: false
                });
            }
        });
        remove.addButton(this.translate.instant('Cancelar'));
        remove.addButton({
            text: this.translate.instant('OK'),
            handler: function (data) {
                if (data.length === 0) {
                    var toast_1 = _this.toastCtrl.create({
                        message: _this.translate.instant('SeleccionaParaBorrar', { value: _this.type }),
                        duration: 1500,
                        position: 'bottom'
                    });
                    toast_1.present();
                    return;
                }
                _this.finishedRemoved.emit(data);
                var toast = _this.toastCtrl.create({
                    message: _this.translate.instant('Borrados', { cuantos: __WEBPACK_IMPORTED_MODULE_4_firebase__["database"].length, tipo: _this.type }),
                    duration: 1500,
                    position: 'bottom'
                });
                toast.present();
            }
        });
        if (existElements)
            remove.present();
    };
    /**
     * Method on response of add button pushed
     *
     * @param {Event} event Event object associated
     * @memberof BottomButtonsComponent
     */
    BottomButtonsComponent.prototype.addItem = function (event) {
        var _this = this;
        var type = this.type;
        if (type === 'List' || type === 'Item') {
            this.alertCtrl
                .create({
                title: 'Add New ' + type,
                inputs: [
                    {
                        name: 'name'
                    }
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    },
                    {
                        text: 'Add',
                        handler: function (data) {
                            if (data.name.trim() == '' || data.name == null) {
                                var toast = _this.toastCtrl.create({
                                    message: _this.translate.instant('ValorValido'),
                                    duration: 1500,
                                    position: 'bottom'
                                });
                                toast.present();
                                return;
                            }
                            _this.finishedAdd.emit(data.name);
                        }
                    }
                ]
            })
                .present();
        }
        else {
            this.finishedAdd.emit();
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], BottomButtonsComponent.prototype, "notifications", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], BottomButtonsComponent.prototype, "favorites", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], BottomButtonsComponent.prototype, "remove", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], BottomButtonsComponent.prototype, "add", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], BottomButtonsComponent.prototype, "object", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], BottomButtonsComponent.prototype, "type", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["P" /* Output */])(),
        __metadata("design:type", Object)
    ], BottomButtonsComponent.prototype, "finishedNotifications", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["P" /* Output */])(),
        __metadata("design:type", Object)
    ], BottomButtonsComponent.prototype, "finishedRemoved", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["P" /* Output */])(),
        __metadata("design:type", Object)
    ], BottomButtonsComponent.prototype, "finishedAdd", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["P" /* Output */])(),
        __metadata("design:type", Object)
    ], BottomButtonsComponent.prototype, "finishNotification", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["P" /* Output */])(),
        __metadata("design:type", Object)
    ], BottomButtonsComponent.prototype, "finishFavorite", void 0);
    BottomButtonsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'bottom-buttons-component',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/bottom-buttons-component/bottom-buttons-component.html"*/'<ion-toolbar>\n  <ion-segment *ngIf="right">\n    <ion-segment-button (click)="setNotification($event)" value="" *ngIf="notifications">\n      <ion-icon ios="ios-notifications" md="md-notifications"></ion-icon>\n    </ion-segment-button>\n    <ion-segment-button (click)="saveRecoverList($event)" value="" *ngIf="favorites">\n      <ion-icon ios="ios-star" md="md-star"></ion-icon>\n    </ion-segment-button>\n    <ion-segment-button (click)="removeItems($event)" value="" *ngIf="remove">\n      <ion-icon ios="ios-trash" md="md-trash"></ion-icon>\n    </ion-segment-button>\n    <ion-segment-button (click)="addItem($event)" value="" *ngIf="add">\n      <ion-icon ios="ios-add" md="md-add"></ion-icon>\n    </ion-segment-button>\n  </ion-segment>\n  <ion-segment *ngIf="!right">\n    <ion-segment-button (click)="addItem($event)" value="" *ngIf="add">\n      <ion-icon ios="ios-add" md="md-add"></ion-icon>\n    </ion-segment-button>\n    <ion-segment-button (click)="removeItems($event)" value="" *ngIf="remove">\n      <ion-icon ios="ios-trash" md="md-trash"></ion-icon>\n    </ion-segment-button>\n    <ion-segment-button (click)="saveRecoverList($event)" value="" *ngIf="favorites">\n      <ion-icon ios="ios-star" md="md-star"></ion-icon>\n    </ion-segment-button>\n    <ion-segment-button (click)="setNotification($event)" value="" *ngIf="notifications">\n      <ion-icon ios="ios-notifications" md="md-notifications"></ion-icon>\n    </ion-segment-button>\n  </ion-segment>\n</ion-toolbar>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/bottom-buttons-component/bottom-buttons-component.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__["c" /* TranslateService */]])
    ], BottomButtonsComponent);
    return BottomButtonsComponent;
}());

//# sourceMappingURL=bottom-buttons-component.js.map

/***/ }),

/***/ 1021:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Item; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_listItem__ = __webpack_require__(1022);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment_timezone__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment_timezone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment_timezone__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic2_auto_complete__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_categories_categoriesService__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__items_on_list__ = __webpack_require__(1023);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Component to show a form for a item of a list, in a modal window
 *
 * @export
 * @class Item
 * @implements {OnInit}
 */
var Item = /** @class */ (function () {
    function Item(catService, alertCtrl, itemsOnList, toastCtrl, translate) {
        this.catService = catService;
        this.alertCtrl = alertCtrl;
        this.itemsOnList = itemsOnList;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.remove = new __WEBPACK_IMPORTED_MODULE_3__angular_core__["w" /* EventEmitter */]();
        this.move = new __WEBPACK_IMPORTED_MODULE_3__angular_core__["w" /* EventEmitter */]();
        this.edit = new __WEBPACK_IMPORTED_MODULE_3__angular_core__["w" /* EventEmitter */]();
        this.save = new __WEBPACK_IMPORTED_MODULE_3__angular_core__["w" /* EventEmitter */]();
        this.oldMeasurement = '';
        this.right = true;
        this.defaultIcon = 'assets/images/icons/default.png';
        this.nombreantiguo = this.translate.instant('NuevoElemento');
    }
    Item.prototype.ngOnInit = function () {
        this.oldMeasurement = this.item.category.measurement;
        this.nombreantiguo = this.item.nombreElemento;
        this.right = this.config !== undefined ? this.config.rightHand : true;
    };
    /**
     * Event to change measurement when unit step is changed
     *
     * @param {any} measurement
     * @memberof Item
     */
    Item.prototype.changeUnitStep = function (measurement) {
        if (measurement === 'UNIDADES') {
            this.item.category.unitStep = 1;
            if (this.creating || measurement !== this.oldMeasurement) {
                this.item.cantidadElemento = 1;
                this.item.cantidadMinima = 1;
            }
        }
        else if (measurement === 'GRAMOS') {
            this.item.category.unitStep = 100;
            if (this.creating || measurement !== this.oldMeasurement) {
                this.item.cantidadElemento = 100;
                this.item.cantidadMinima = 100;
            }
        }
        else if (measurement === 'LITROS') {
            this.item.category.unitStep = 0.25;
            if (this.creating || measurement !== this.oldMeasurement) {
                this.item.cantidadElemento = 1;
                this.item.cantidadMinima = 1;
            }
        }
        else {
            this.item.category.unitStep = 0.5;
            if (this.creating || measurement !== this.oldMeasurement) {
                this.item.cantidadElemento = 1;
                this.item.cantidadMinima = 1;
            }
        }
        this.oldMeasurement = this.item.category.measurement;
        this.save.emit(this.item);
    };
    /**
     * Event change on a new unit step selected
     *
     * @param {any} event
     * @memberof Item
     */
    Item.prototype.onChange = function (event) {
        this.changeUnitStep(this.item.category.measurement);
    };
    /**
     * Event on plus button pushed
     *
     * @param {any} event
     * @param {any} amount
     * @memberof Item
     */
    Item.prototype.plusElement = function (event, amount) {
        if (amount) {
            var added = this.item.cantidadElemento + this.item.category.unitStep;
            this.item.cantidadElemento = Math.round(added * 100) / 100;
        }
        else {
            var added = this.item.cantidadMinima + this.item.category.unitStep;
            this.item.cantidadMinima = Math.round(added * 100) / 100;
        }
        this.save.emit(this.item);
    };
    /**
     * Event on minus button pushed
     *
     * @param {any} event
     * @param {any} amount
     * @memberof Item
     */
    Item.prototype.minusElement = function (event, amount) {
        var _this = this;
        if (amount) {
            var removed = this.item.cantidadElemento - this.item.category.unitStep;
            if (removed > this.item.cantidadMinima) {
                this.item.cantidadElemento = removed;
                this.save.emit(this.item);
            }
            else {
                if (removed <= this.item.cantidadMinima && removed > 0) {
                    if (this.config.askAddListaCompra) {
                        this.item.cantidadElemento = removed;
                        this.save.emit(this.item);
                        var confirm_1 = this.alertCtrl.create({
                            title: this.translate.instant('NoSuficiente', { value: this.item.nombreElemento }),
                            message: this.translate.instant('PreguntaMoverListaCompra', { value: this.item.nombreElemento }),
                            buttons: [
                                {
                                    text: this.translate.instant('No'),
                                    handler: function () { }
                                },
                                {
                                    text: this.translate.instant('Si'),
                                    handler: function () {
                                        var newItem = JSON.parse(JSON.stringify(_this.item));
                                        newItem.nombreLista = 'LISTA_COMPRA';
                                        _this.move.emit({ item: newItem, toShopingList: true });
                                    }
                                }
                            ]
                        });
                        confirm_1.present();
                    }
                    else {
                        this.item.cantidadElemento = removed;
                        this.save.emit(this.item);
                    }
                }
                else if (removed <= 0) {
                    if (this.config.deleteAt0) {
                        this.remove.emit(this.item);
                    }
                    else {
                        this.item.cantidadElemento = 0;
                        this.save.emit(this.item);
                    }
                }
            }
        }
        else {
            var removed = this.item.cantidadMinima - this.item.category.unitStep;
            if (removed < 0)
                this.item.cantidadMinima = 0;
            else
                this.item.cantidadMinima = removed;
            this.save.emit(this.item);
        }
    };
    /**
     * Check if the expiry date needs to be shown
     *
     * @param {ListItem} item
     * @memberof Item
     */
    Item.prototype.showExpiryDate = function (item) {
        var text = this.checkExpiryDate(item.fechaCaducidad);
        // TODO: Translate text variable
        var toast = this.toastCtrl.create({
            message: item.nombreElemento +
                ' ' +
                text +
                ' ' +
                __WEBPACK_IMPORTED_MODULE_1_moment_timezone___default()(item.fechaCaducidad).format('DD/MMM/YYYY'),
            duration: 2500,
            position: 'top',
            cssClass: 'expiryWarning'
        });
        toast.present();
    };
    Item.prototype.newExpire = function () {
        if (this.item.caduca)
            this.item.fechaCaducidad = __WEBPACK_IMPORTED_MODULE_1_moment_timezone___default.a.tz(__WEBPACK_IMPORTED_MODULE_1_moment_timezone___default.a.tz.guess()).format();
    };
    /**
     * Check expiry date of the item
     *
     * @param {any} expiryDate
     * @returns
     * @memberof Item
     */
    Item.prototype.checkExpiryDate = function (expiryDate) {
        if (__WEBPACK_IMPORTED_MODULE_1_moment_timezone___default()().isAfter(__WEBPACK_IMPORTED_MODULE_1_moment_timezone___default()(expiryDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'))) {
            return 'expired';
        }
        else {
            if (__WEBPACK_IMPORTED_MODULE_1_moment_timezone___default()().isAfter(__WEBPACK_IMPORTED_MODULE_1_moment_timezone___default()(expiryDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').subtract(7, 'days'))) {
                return 'nearToExpire';
            }
            else {
                return 'onTime';
            }
        }
    };
    /**
     * Mark item on the shopping list
     *
     * @param {any} event
     * @memberof Item
     */
    Item.prototype.markItem = function (event) {
        this.item.marked = !this.item.marked;
        this.save.emit(this.item);
    };
    /**
     * Edit item event
     *
     * @param {any} event
     * @memberof Item
     */
    Item.prototype.editItem = function (event) {
        this.edit.emit(this.item);
    };
    /**
     * Remove item event
     *
     * @param {any} event
     * @memberof Item
     */
    Item.prototype.removeItem = function (event) {
        this.remove.emit(this.item);
    };
    /**
     * Move item event
     *
     * @param {any} event
     * @memberof Item
     */
    Item.prototype.moveItem = function (event) {
        this.move.emit({ item: this.item, toShopingList: false });
    };
    /**
     * Event to edit category of the item
     *
     * @param {any} event
     * @memberof Item
     */
    Item.prototype.editCategory = function (event) {
        var _this = this;
        this.catService.changeCategory(this.item.category, this.item).then(function (data) {
            _this.item = data;
            _this.changeUnitStep(_this.item.category.measurement);
        });
    };
    /**
     * Event on selected result on the search input results
     *
     * @param {any} event
     * @memberof Item
     */
    Item.prototype.seleccionado = function (event) {
        if (this.searchbar.suggestions.length === 0) {
            this.item.nombreElemento = this.searchbar.keyword;
        }
        else {
            this.item.nombreElemento = this.searchbar.suggestions[0].nombreElemento;
            this.searchbar.keyword = this.searchbar.suggestions[0].nombreElemento;
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["E" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__classes_listItem__["a" /* ListItem */])
    ], Item.prototype, "item", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], Item.prototype, "creating", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["E" /* Input */])(),
        __metadata("design:type", Array)
    ], Item.prototype, "icons", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], Item.prototype, "config", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["P" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__angular_core__["w" /* EventEmitter */])
    ], Item.prototype, "remove", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["P" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__angular_core__["w" /* EventEmitter */])
    ], Item.prototype, "move", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["P" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__angular_core__["w" /* EventEmitter */])
    ], Item.prototype, "edit", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["P" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_3__angular_core__["w" /* EventEmitter */])
    ], Item.prototype, "save", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["_9" /* ViewChild */])('searchbar'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4_ionic2_auto_complete__["a" /* AutoCompleteComponent */])
    ], Item.prototype, "searchbar", void 0);
    Item = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["n" /* Component */])({
            selector: 'item',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/item-data/item-data.html"*/'<ion-card>\n  <ion-card-header>\n    <ion-row class="fila" *ngIf="!right">\n      <ion-col col-1 *ngIf="!creating && item.nombreLista===\'LISTA_COMPRA\'">\n        <button [hidden]="!item.marked" item-center dark clear (click)="markItem($event)" class="buttonOperation">\n          <ion-icon ios="ios-checkmark-circle-outline" md="md-checkmark-circle-outline"></ion-icon>\n        </button>\n        <button [hidden]="item.marked" item-center dark clear (click)="markItem($event)" class="buttonOperation">\n          <ion-icon ios="ios-radio-button-off" md="md-radio-button-off"></ion-icon>\n        </button>\n      </ion-col>\n      <ion-col col-7 offset-1>\n        <ion-label *ngIf="!creating" class="nameElement">{{item.nombreElemento}}</ion-label>\n        <ion-auto-complete *ngIf="creating" #searchbar [dataProvider]="itemsOnList" (itemSelected)="seleccionado($event)" (autoBlur)="seleccionado($event)"\n          [options]="{ placeholder : nombreantiguo }"></ion-auto-complete>\n      </ion-col>\n      <ion-col col-2 offset-1>\n        <div>\n          <ion-avatar item-left class="category-icon" (click)="editCategory($event)">\n            <img class="icon" src="item.category.icon.src" />\n            <h2 *ngIf="creating" class="labelCategory">{{item.category.categoryName}}</h2>\n          </ion-avatar>\n        </div>\n      </ion-col>\n      <ion-col col-1>\n        <div *ngIf="item.caduca && item.fechaCaducidad">\n          <ion-icon ios="ios-alert" md="md-alert" (click)="showExpiryDate(item)" [ngClass]="checkExpiryDate(item.fechaCaducidad)"></ion-icon>\n        </div>\n      </ion-col>\n    </ion-row>\n    <ion-row class="fila" *ngIf="right">\n      <ion-col col-2>\n        <div *ngIf="item.category">\n          <ion-avatar item-left class="category-icon">\n            <img class="icon" src="{{item.category.icon.src}}" (click)="editCategory($event)" />\n            <h2 *ngIf="creating" class="labelCategory">{{item.category.categoryName}}</h2>\n          </ion-avatar>\n        </div>\n      </ion-col>\n      <ion-col col-7>\n        <ion-label *ngIf="!creating" class="nameElement">{{item.nombreElemento}}</ion-label>\n        <ion-auto-complete *ngIf="creating" #searchbar [dataProvider]="itemsOnList" (itemSelected)="seleccionado($event)" (autoBlur)="seleccionado($event)"\n          [options]="{ placeholder : nombreantiguo }"></ion-auto-complete>\n      </ion-col>\n      <ion-col col-1>\n        <div *ngIf="item.caduca && item.fechaCaducidad">\n          <ion-icon ios="ios-alert" md="md-alert" (click)="showExpiryDate(item)" [ngClass]="checkExpiryDate(item.fechaCaducidad)"></ion-icon>\n        </div>\n      </ion-col>\n      <ion-col col-1 *ngIf="!creating && item.nombreLista===\'LISTA_COMPRA\'">\n        <button [hidden]="!item.marked" item-center dark clear (click)="markItem($event)" class="buttonOperation">\n          <ion-icon ios="ios-checkmark-circle-outline" md="md-checkmark-circle-outline"></ion-icon>\n        </button>\n        <button [hidden]="item.marked" item-center dark clear (click)="markItem($event)" class="buttonOperation">\n          <ion-icon ios="ios-radio-button-off" md="md-radio-button-off"></ion-icon>\n        </button>\n      </ion-col>\n    </ion-row>\n    <ion-row class="fila" *ngIf="!creating && !right">\n      <ion-col col-4>\n        <ion-item class="amountItem">\n          <button item-center default large clear (click)="minusElement($event, item, true)" class="amountButton">\n            <ion-icon class="amountIcon" ios="ios-remove-circle" md="md-remove-circle"></ion-icon>\n          </button>\n          <button clear class="amountButton">\n            <ion-badge class="amount amountIcon" large>{{item.cantidadElemento}}</ion-badge>\n          </button>\n          <button item-center default large clear (click)="plusElement($event, item, true)" class="amountButton">\n            <ion-icon class="amountIcon" default large ios="ios-add-circle" md="md-add-circle"></ion-icon>\n          </button>\n        </ion-item>\n      </ion-col>\n      <ion-col col-4>\n        <ion-row>\n          <ion-col col-4>\n            <button item-center secondary clear (click)="moveItem($event)" class="buttonOperation">\n              <ion-icon ios="ios-return-right" md="md-return-right"></ion-icon>\n            </button>\n          </ion-col>\n          <ion-col col-4>\n            <button item-center secondary clear (click)="editItem($event)" class="buttonOperation">\n              <ion-icon ios="ios-create" md="md-create"></ion-icon>\n            </button>\n          </ion-col>\n          <ion-col col-4>\n            <button item-center danger clear (click)="removeItem($event)" class="buttonOperation">\n              <ion-icon ios="ios-trash" md="md-trash"></ion-icon>\n            </button>\n          </ion-col>\n        </ion-row>\n      </ion-col>\n    </ion-row>\n    <ion-row class="fila" *ngIf="!creating && right">\n      <ion-col col-4 offset-2>\n        <ion-row>\n          <ion-col col-4>\n            <button item-center secondary clear (click)="moveItem($event)" class="buttonOperation">\n              <ion-icon ios="ios-return-right" md="md-return-right"></ion-icon>\n            </button>\n          </ion-col>\n          <ion-col col-4>\n            <button item-center secondary clear (click)="editItem($event)" class="buttonOperation">\n              <ion-icon ios="ios-create" md="md-create"></ion-icon>\n            </button>\n          </ion-col>\n          <ion-col col-4>\n            <button item-center danger clear (click)="removeItem($event)" class="buttonOperation">\n              <ion-icon ios="ios-trash" md="md-trash"></ion-icon>\n            </button>\n          </ion-col>\n        </ion-row>\n      </ion-col>\n      <ion-col col-6>\n        <ion-item class="amountItem">\n          <button item-center default large clear (click)="minusElement($event, item, true)" class="amountButton">\n            <ion-icon class="amountIcon" ios="ios-remove-circle" md="md-remove-circle"></ion-icon>\n          </button>\n          <button clear class="amountButton">\n            <ion-badge class="amount amountIcon" large>{{item.cantidadElemento}}</ion-badge>\n          </button>\n          <button item-center default large clear (click)="plusElement($event, item, true)" class="amountButton">\n            <ion-icon class="amountIcon" default large ios="ios-add-circle" md="md-add-circle"></ion-icon>\n          </button>\n        </ion-item>\n      </ion-col>\n    </ion-row>\n    <ion-row *ngIf="creating">\n      <ion-col>\n        <ion-item>\n          <!--<ion-label stacked>MEASUREMENT</ion-label>-->\n          <ion-select class="measurement" id="measurement" [(ngModel)]="item.category.measurement" (ngModelChange)="onChange($event)">\n							<ion-option value="UNIDADES">{{ \'Unidades\' | translate }}</ion-option>\n							<ion-option value="GRAMOS">{{ \'Gramos\' | translate }}</ion-option>\n							<ion-option value="KILOS">{{ \'Kilos\' | translate }}</ion-option>\n							<ion-option value="LITROS">{{ \'Litros\' | translate }}</ion-option>\n          </ion-select>\n        </ion-item>\n      </ion-col>\n    </ion-row>\n  </ion-card-header>\n  <ion-card-content *ngIf="creating">\n    <ion-row>\n      <ion-label class="labelExpire">{{ \'Caduca\' | translate }}</ion-label>\n      <ion-toggle id="expire" checked="item.caduca" [(ngModel)]="item.caduca" (ngModelChange)="newExpire($event)"></ion-toggle>\n    </ion-row>\n    <ion-row [hidden]="!item.caduca">\n      <ion-item>\n        {{item.fechaCaducidad}}\n        <ion-datetime class="expireDate" id="fechaCaducidad" displayFormat="DD MMMM YYYY" pickerFormat="DD MMMM YYYY" [(ngModel)]="item.fechaCaducidad"\n          [disabled]="!creating" max="3000">\n        </ion-datetime>\n      </ion-item>\n    </ion-row>\n    <ion-row>\n      <ion-col col-5>\n        <p class="labelMinAmout">\n          {{ \'CantidadMinima\' | translate }}\n        </p>\n      </ion-col>\n      <ion-col col-7>\n        <ion-item>\n          <button item-center default large clear (click)="minusElement($event, false)" class="amountButton">\n            <ion-icon class="amountIcon" ios="ios-remove-circle" md="md-remove-circle"></ion-icon>\n          </button>\n          <button clear class="amountButton">\n            <ion-badge class="minimum amountIcon" large>{{item.cantidadMinima}}</ion-badge>\n          </button>\n          <button item-center default large clear (click)="plusElement($event, false)" class="amountButton">\n            <ion-icon class="amountIcon" default large ios="ios-add-circle" md="md-add-circle"></ion-icon>\n          </button>\n        </ion-item>\n      </ion-col>\n    </ion-row>\n    <ion-row>\n      <ion-col col-5>\n        <p class="labelAmount">\n          {{ \'Cantidad\' | translate }}\n        </p>\n      </ion-col>\n      <ion-col col-7>\n        <ion-item>\n          <button item-center default large clear (click)="minusElement($event, true)" class="amountButton">\n            <ion-icon class="amountIcon" ios="ios-remove-circle" md="md-remove-circle"></ion-icon>\n          </button>\n          <button clear class="amountButton">\n            <ion-badge class="amount amountIcon" large>{{item.cantidadElemento}}</ion-badge>\n          </button>\n          <button item-center default large clear (click)="plusElement($event, true)" class="amountButton">\n            <ion-icon class="amountIcon" default large ios="ios-add-circle" md="md-add-circle"></ion-icon>\n          </button>\n        </ion-item>\n      </ion-col>\n    </ion-row>\n  </ion-card-content>\n</ion-card>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/item-data/item-data.html"*/,
            inputs: ['item', 'creating'],
            providers: [__WEBPACK_IMPORTED_MODULE_6__providers_categories_categoriesService__["a" /* CategoriesService */], __WEBPACK_IMPORTED_MODULE_7__items_on_list__["a" /* ItemsOnList */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__providers_categories_categoriesService__["a" /* CategoriesService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_7__items_on_list__["a" /* ItemsOnList */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */]])
    ], Item);
    return Item;
}());

//# sourceMappingURL=item-data.js.map

/***/ }),

/***/ 1022:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListItem; });
/**
 * Class to define a ListItem object
 *
 * @export
 * @class ListItem Class with the listItem properties
 */
var ListItem = /** @class */ (function () {
    function ListItem() {
    }
    return ListItem;
}());

//# sourceMappingURL=listItem.js.map

/***/ }),

/***/ 1023:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemsOnList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_global_vars_global_vars__ = __webpack_require__(27);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Directive to get items on a list as a searchable input
 *
 * @export
 * @class ItemsOnList
 * @implements {AutoCompleteService}
 */
var ItemsOnList = /** @class */ (function () {
    function ItemsOnList(globalVars) {
        var _this = this;
        this.globalVars = globalVars;
        this.labelAttribute = 'nombreElemento';
        this.items = [];
        this.globalVars.getItemsData().then(function (data) {
            _this.items = data;
        });
    }
    /**
      * Return search results based on the input typed
      *
      * @param {string} keyword
      * @returns
      * @memberof ItemsOnList
     */
    ItemsOnList.prototype.getResults = function (keyword) {
        if (!keyword) {
            return [];
        }
        return this.items.filter(function (item) {
            if (item.nombreElemento) {
                return item.nombreElemento.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
            }
        });
    };
    ItemsOnList = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__providers_global_vars_global_vars__["a" /* GlobalVars */]])
    ], ItemsOnList);
    return ItemsOnList;
}());

//# sourceMappingURL=items-on-list.js.map

/***/ }),

/***/ 1024:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Alacena; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_admob_free__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_fcm__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_insomnia__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_about_page_about_page__ = __webpack_require__(591);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_backup_page_backup_page__ = __webpack_require__(592);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_categorys_page_categorys_page__ = __webpack_require__(594);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_config_page_config_page__ = __webpack_require__(596);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_dashboard_page_dashboard_page__ = __webpack_require__(597);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_items_page_items_page__ = __webpack_require__(600);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_list_page_list_page__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_lists_page_lists_page__ = __webpack_require__(601);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__providers_log_log__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ngx_translate_core__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




















var Alacena = /** @class */ (function () {
    function Alacena(platform, menu, app, splashScreen, statusBar, storage, fcm, admobFree, globalVars, log, translateService, insomnia) {
        var _this = this;
        this.menu = menu;
        this.app = app;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.storage = storage;
        this.fcm = fcm;
        this.admobFree = admobFree;
        this.globalVars = globalVars;
        this.log = log;
        this.translateService = translateService;
        this.insomnia = insomnia;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_13__pages_dashboard_page_dashboard_page__["a" /* DashboardPage */];
        this.log.setLogger(this.constructor.name);
        this.insomnia.keepAwake()
            .then(function () { return _this.log.logs[_this.constructor.name].info('Awake activated'); }, function () { return _this.log.logs[_this.constructor.name].info('Awake error'); });
        this.translateService.setDefaultLang('es');
        this.translateService.use('es');
        this.globalVars.getConfigData().then(function (data) {
            var version = data.version;
            if (!version) {
                _this.log.logs[_this.constructor.name].info('Getting Data from previous version');
                _this.globalVars.getOldData();
            }
        });
        //Firebase configuration
        __WEBPACK_IMPORTED_MODULE_5_firebase___default.a.initializeApp({
            // TEST: "REVERSED_CLIENT_ID": "com.googleusercontent.apps.354280052179-amrn5f7si36l9lsdinjf8u7q5a5thpri"
            //apiKey: 'AIzaSyD_NlhDQlkGPnjyDhVrphHkRLnDH30WvqM', //Firebase production?
            apiKey: 'AIzaSyCq_XZBezFcC_iAWa-i12swT0YL9sqvjfM',
            //apiKey: "AIzaSyCYbNChWjDtLYXkm_ayPQeb4t4TjWDXWd0",//GoogleDevConsole
            authDomain: 'alacena-58699.firebaseapp.com',
            databaseURL: 'https://alacena-58699.firebaseio.com',
            projectId: 'alacena-58699',
            storageBucket: 'alacena-58699.appspot.com',
            messagingSenderId: '354280052179'
        });
        platform.ready().then(function () {
            //Initial platform configuration
            _this.splashScreen.hide();
            _this.statusBar.hide();
            /*
              platforms: {
                ios: {
                  statusbarPadding: true
                }
              }
            */
            //this.statusBar.overlaysWebView(false);
            //Admob Configuration
            var adMobId = 'ca-app-pub-7863580056712493~5233178966';
            if (platform.is('android')) {
                // for android
                adMobId = 'ca-app-pub-7863580056712493~5233178966';
            }
            else if (platform.is('ios')) {
                // for ios
                adMobId = 'ca-app-pub-7863580056712493~8186645366';
            }
            //Show admob banner
            var bannerConfig = {
                id: adMobId,
                isTesting: true,
                autoShow: true,
                overlap: false,
                size: 'LARGE_BANNER',
                bannerAtTop: false
            };
            _this.admobFree.banner.config(bannerConfig);
            _this.admobFree.banner
                .prepare()
                .then(function () {
                _this.log.logs[_this.constructor.name].info('Showing AddMob banner');
                _this.admobFree.banner.show();
            })
                .catch(function (e) { return _this.log.logs[_this.constructor.name].error(e); });
            _this.fcm.subscribeToTopic('notifications');
            _this.fcm.getToken().then(function (token) {
                _this.log.logs[_this.constructor.name].info(token);
            });
            _this.fcm.onTokenRefresh().subscribe(function (token) {
                _this.log.logs[_this.constructor.name].info(token);
            });
            _this.fcm.onNotification().subscribe(function (data) {
                if (data.wasTapped) {
                    _this.log.logs[_this.constructor.name].info('Tapped Notification');
                    //TODO: send to the List relative to the notification
                    //Notification was received on device tray and tapped by the user.
                    //this.navCtrl.setRoot('DetailPage', { profileId: data.profileId });
                }
                else {
                    _this.log.logs[_this.constructor.name].info('Foreground Notification');
                    //TODO: send to the List relative to the notification
                    //Notification was received in foreground. Maybe the user needs to be notified.
                    //this.navCtrl.push('DetailPage', { profileId: data.profileId });
                }
            });
        });
        //List of pages for side menu
        this.pages = [
            { title: 'Inicio', component: __WEBPACK_IMPORTED_MODULE_13__pages_dashboard_page_dashboard_page__["a" /* DashboardPage */], icon: 'contact' },
            { title: 'LISTA_COMPRA', component: __WEBPACK_IMPORTED_MODULE_15__pages_list_page_list_page__["a" /* ListPage */], icon: 'basket' },
            { title: 'Lists', component: __WEBPACK_IMPORTED_MODULE_16__pages_lists_page_lists_page__["a" /* ListsPage */], icon: 'list-box' },
            { title: 'Items', component: __WEBPACK_IMPORTED_MODULE_14__pages_items_page_items_page__["a" /* ItemsPage */], icon: 'list' },
            { title: 'Categories', component: __WEBPACK_IMPORTED_MODULE_11__pages_categorys_page_categorys_page__["a" /* CategorysPage */], icon: 'paper' },
            { title: 'Config', component: __WEBPACK_IMPORTED_MODULE_12__pages_config_page_config_page__["a" /* ConfigPage */], icon: 'cog' },
            { title: 'Backup', component: __WEBPACK_IMPORTED_MODULE_10__pages_backup_page_backup_page__["a" /* BackupPage */], icon: 'disc' },
            { title: 'About', component: __WEBPACK_IMPORTED_MODULE_9__pages_about_page_about_page__["a" /* AboutPage */], icon: 'information-circle' }
        ];
    }
    /**
     * Open a page from side menu
     *
     * @param {any} page Object with the page information
     * @memberof Alacena
     */
    Alacena.prototype.openPage = function (page) {
        this.log.logs[this.constructor.name].info('Moving to:' + page.title);
        this.menu.close();
        this.nav.setRoot(page.component, {
            list: page.title
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_7_ionic_angular__["h" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_7_ionic_angular__["h" /* Nav */])
    ], Alacena.prototype, "nav", void 0);
    Alacena = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-root',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/app/app.html"*/'<ion-split-pane>\n\n  <ion-menu type="overlay" swipeEnabled="true" [content]="content">\n    <ion-content color="dark" class="menu-content">\n      <ion-toolbar color="dark">\n        <ion-title>\n          <ion-item color="dark" class="item-header-toolbar" *ngIf="!globalVars.getUserConnected() || !globalVars.getUserProfile().photoURL">\n            <ion-avatar item-left class="item-header-toolbar-avatar">\n              <img class="icon" src="assets/imgs/logo.png" />\n            </ion-avatar>\n          </ion-item>\n          <ion-item color="dark" class="item-header-toolbar" *ngIf="globalVars.getUserConnected() && globalVars.getUserProfile().photoURL">\n            <ion-avatar item-left class="item-header-toolbar-avatar">\n              <img class="icon" [src]="globalVars.getUserProfile().photoURL">\n            </ion-avatar>\n          </ion-item>\n        </ion-title>\n      </ion-toolbar>\n      <ion-list color="dark" class="menu-list">\n        <button color="dark" ion-item detail-none *ngFor="let p of pages" (click)="openPage(p)">\n          <ion-icon ios="ios-{{p.icon}}" md="md-{{p.icon}}"></ion-icon>\n          {{p.title | translate}}\n        </button>\n      </ion-list>\n\n    </ion-content>\n\n  </ion-menu>\n\n  <ion-nav class="app-content" [root]="rootPage" main #content swipe-back-enabled="false" dark></ion-nav>\n\n</ion-split-pane>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_7_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_7_ionic_angular__["f" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_7_ionic_angular__["c" /* App */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_fcm__["a" /* FCM */],
            __WEBPACK_IMPORTED_MODULE_1__ionic_native_admob_free__["a" /* AdMobFree */],
            __WEBPACK_IMPORTED_MODULE_17__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_18__providers_log_log__["a" /* Log */],
            __WEBPACK_IMPORTED_MODULE_19__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_insomnia__["a" /* Insomnia */]])
    ], Alacena);
    return Alacena;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 1025:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RateServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_rate__ = __webpack_require__(1026);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RateServiceProvider = /** @class */ (function () {
    function RateServiceProvider(platform) {
        var _this = this;
        this.platform = platform;
        this.appRate = __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_rate__["a" /* AppRate */];
        this.platform.ready().then(function () {
            return (_this.appRate.preference = {
                storeAppURL: {
                    ios: "1078098531",
                    android: "market://details?id=developapps.chony.alacena"
                },
                promptAgainForEachNewVersion: true,
                usesUntilPrompt: 5,
                customLocale: {
                    title: "Rate Us... Pretty Please?",
                    message: "Without ratings we starve =(",
                    cancelButtonLabel: "Pass",
                    rateButtonLabel: "Rate it!",
                    laterButtonLabel: "Ask Later"
                }
            });
        });
    }
    RateServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* Platform */]])
    ], RateServiceProvider);
    return RateServiceProvider;
}());

//# sourceMappingURL=rate-service.js.map

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RemindersProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_localStorage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Provider to manage reminders data
 *
 * @export
 * @class RemindersProvider
 */
var RemindersProvider = /** @class */ (function () {
    function RemindersProvider(http, localStorage, log) {
        this.http = http;
        this.localStorage = localStorage;
        this.log = log;
        this.log.setLogger(this.constructor.name);
    }
    RemindersProvider.prototype.setReminder = function (reminder) {
        var _this = this;
        this.log.logs[this.constructor.name].info('setReminder:' + JSON.stringify(reminder));
        this.localStorage.getFromLocal('reminders', null).then(function (data) {
            if (data === undefined || data === null) {
                data = [];
            }
            data.push(reminder);
            _this.localStorage.setToLocal('reminders', data);
        });
    };
    RemindersProvider.prototype.removeReminder = function (reminder) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeReminder:' + reminder);
        this.localStorage.getFromLocal('reminders', null).then(function (data) {
            if (data === undefined || data === null) {
                data = [];
            }
            data = data.filter(function (item) { return item.message !== reminder.message || item.time !== reminder.time; });
            _this.localStorage.setToLocal('reminders', data);
        });
    };
    RemindersProvider.prototype.getReminders = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('getReminders');
        return new Promise(function (resolve) {
            _this.localStorage.getFromLocal('reminders', null).then(function (data) {
                if (data === undefined || data === null) {
                    data = [];
                }
                resolve(data);
            });
        });
    };
    RemindersProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_0__data_localStorage__["a" /* LocalStorage */],
            __WEBPACK_IMPORTED_MODULE_4__log_log__["a" /* Log */]])
    ], RemindersProvider);
    return RemindersProvider;
}());

//# sourceMappingURL=reminders-provider.js.map

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_reminders_provider__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_timezone__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_moment_timezone__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_phonegap_local_notification__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_local_notifications__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_reminders_component_reminders_component__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pipes_orderBy__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_item_info_item_info__ = __webpack_require__(599);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




//import moment from 'moment';








/**
 * Page to manage the items of a list
 *
 * @export
 * @class ListPage
 */
var ListPage = /** @class */ (function () {
    function ListPage(navParams, view, mod, alertCtrl, globalVars, order, plt, localNotification, localNotifications, reminders, log, translate) {
        this.navParams = navParams;
        this.view = view;
        this.mod = mod;
        this.alertCtrl = alertCtrl;
        this.globalVars = globalVars;
        this.order = order;
        this.plt = plt;
        this.localNotification = localNotification;
        this.localNotifications = localNotifications;
        this.reminders = reminders;
        this.log = log;
        this.translate = translate;
        this.type = 'ListItem';
        this.list = [];
        this.orderSelected = 1;
        this.dataConfig = {};
        this.native = false;
        this.log.setLogger(this.constructor.name);
    }
    ListPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('ionViewDidLoad');
        if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
            this.native = true;
        }
        this.searchBar = false;
        this.selectedItem = this.navParams.get('list')
            ? this.navParams.get('list')
            : 'LISTA_COMPRA';
        this.globalVars.getDefaulIconsData().then(function (data) {
            _this.icons = data;
            _this.initializeItems(null);
        });
        this.globalVars.getConfigData().then(function (data) {
            _this.defaultCategory = data.categoryDefault;
            _this.minimumAmount = data.cantidadMinimaDefecto;
            _this.expireReminders = data.expireReminders;
            _this.dataConfig = {
                deleteAt0: data.deleteAt0,
                askAddListaCompra: data.askAddListaCompra,
                rightHand: data.rightHand
            };
        });
    };
    /**
     * Initialize the items of the list
     *
     * @param {string} filter
     * @memberof ListPage
     */
    ListPage.prototype.initializeItems = function (filter) {
        var _this = this;
        this.log.logs[this.constructor.name].info('initializeItems:' + filter);
        this.globalVars.getListData(this.selectedItem).then(function (listData) {
            _this.list = listData;
            _this.sortItems(_this.orderSelected);
            if (filter) {
                _this.list = _this.list.filter(function (item) {
                    return (item.nombreElemento
                        .toLowerCase()
                        .indexOf(_this.searchItem.toLowerCase()) > -1);
                });
            }
        });
    };
    /**
     * Even to search based on input filled
     *
     * @param {any} event
     * @memberof ListPage
     */
    ListPage.prototype.searchMatches = function (event) {
        if (this.searchItem && this.searchItem.trim() !== '') {
            this.initializeItems(this.searchItem);
        }
        else {
            this.initializeItems(null);
        }
    };
    /**
     * Event to show or hide a search bar
     *
     * @param {any} event
     * @memberof ListPage
     */
    ListPage.prototype.toggleSearchBar = function (event) {
        this.searchBar = !this.searchBar;
    };
    /**
     * Event to sort items on the list
     *
     * @param {number} orderBy
     * @memberof ListPage
     */
    ListPage.prototype.sortItems = function (orderBy) {
        this.log.logs[this.constructor.name].info('sortItems:' + orderBy);
        this.orderSelected = orderBy;
        switch (orderBy) {
            case 1:
                this.list = this.order.transform(this.list, ['+nombreElemento']);
                break;
            case 2:
                this.list = this.list.sort(function (a, b) {
                    if (a.category.categoryName < b.category.categoryName)
                        return -1;
                    if (a.category.categoryName > b.category.categoryName)
                        return 1;
                    return 0;
                });
                break;
            case 3:
                this.list = this.order.transform(this.list, ['+fechaCaducidad']);
                break;
        }
    };
    /**
     * Event to show options to sort the list
     *
     * @param {any} event
     * @memberof ListPage
     */
    ListPage.prototype.reorder = function (event) {
        var _this = this;
        var reorder = this.alertCtrl.create();
        reorder.setTitle(this.translate.instant('Ordenar'));
        if (this.selectedItem !== 'LISTA_COMPRA') {
            reorder.addInput({
                type: 'radio',
                label: this.translate.instant('FechaCaducidad'),
                value: '3',
                checked: this.orderSelected === 3
            });
        }
        reorder.addInput({
            type: 'radio',
            label: this.translate.instant('Nombre'),
            value: '1',
            checked: this.orderSelected === 1
        });
        reorder.addInput({
            type: 'radio',
            label: this.translate.instant('Categoria'),
            value: '2',
            checked: this.orderSelected === 2
        });
        reorder.addButton(this.translate.instant('Cancelar'));
        reorder.addButton({
            text: this.translate.instant('OK'),
            handler: function (data) {
                _this.sortItems(Number.parseInt(data));
            }
        });
        reorder.present();
    };
    /**
     * Event to remove a item
     *
     * @param {ListItem} item
     * @memberof ListPage
     */
    ListPage.prototype.removeItem = function (item) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeItem:' + item);
        var confirm = this.alertCtrl.create({
            title: this.translate.instant('Borrando', { value: item.nombreElemento }),
            message: this.translate.instant('PreguntaBorrarElementoLista', { value: item.nombreElemento, lista: item.nombreLista }),
            buttons: [
                {
                    text: this.translate.instant('No'),
                    handler: function () { }
                },
                {
                    text: this.translate.instant('Si'),
                    handler: function () {
                        _this.list.splice(_this.list.indexOf(item), 1);
                        _this.globalVars.setListData(_this.selectedItem, _this.list);
                    }
                }
            ]
        });
        confirm.present();
    };
    /**
     * Event to save edit item
     *
     * @param {ListItem} item
     * @memberof ListPage
     */
    ListPage.prototype.saveItem = function (item) {
        this.log.logs[this.constructor.name].info('saveItem:' + JSON.stringify(item));
        if (this.expireReminders) {
            if (item.caduca) {
                this.localNotifications.schedule({
                    id: __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default()(item.fechaCaducidad)
                        .add(-1, 'days')
                        .add(1, 'hour')
                        .unix(),
                    title: this.translate.instant('CaducaManiana'),
                    text: item.nombreLista +
                        '\n' +
                        item.nombreElemento +
                        '\n' +
                        this.translate.instant('CaducaManiana'),
                    at: __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default()(item.fechaCaducidad)
                        .add(-1, 'days')
                        .add(1, 'hour')
                        .toDate()
                });
                this.localNotifications.schedule({
                    id: __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default()(item.fechaCaducidad)
                        .add(-7, 'days')
                        .subtract(1, 'hour')
                        .unix(),
                    title: this.translate.instant('Caduca7Dias'),
                    text: item.nombreLista +
                        '\n' +
                        item.nombreElemento +
                        '\n' +
                        this.translate.instant('Caduca7Dias'),
                    at: __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default()(item.fechaCaducidad)
                        .add(-7, 'days')
                        .add(1, 'hour')
                        .toDate()
                });
            }
        }
        this.list[this.list.indexOf(item)] = item;
        this.globalVars.setListData(this.selectedItem, this.list);
    };
    /**
     * Event to show a modal to edit item
     *
     * @param {ListItem} item
     * @memberof ListPage
     */
    ListPage.prototype.editItem = function (item) {
        var _this = this;
        this.log.logs[this.constructor.name].info('editItem:' + item);
        var infoListModal = this.mod.create(__WEBPACK_IMPORTED_MODULE_10__components_item_info_item_info__["a" /* ItemInfoPage */], {
            newItem: JSON.parse(JSON.stringify(item)),
            editing: true,
            icons: this.icons
        });
        infoListModal.onDidDismiss(function (itemEdited) {
            if (itemEdited !== undefined) {
                _this.list[_this.list.indexOf(item)] = itemEdited;
                _this.globalVars.setListData(_this.selectedItem, _this.list);
            }
            else {
                _this.list[_this.list.indexOf(item)] = item;
            }
        });
        infoListModal.present();
    };
    /**
     * Event to move item to other list
     *
     * @param {any} event
     * @memberof ListPage
     */
    ListPage.prototype.moveItem = function (event) {
        var _this = this;
        this.log.logs[this.constructor.name].info('moveItem');
        var item = event.item;
        if (event.toShopingList) {
            this.globalVars.getListData('LISTA_COMPRA').then(function (result) {
                var dest = result.find(function (x) { return x.nombreElemento === item.nombreElemento; });
                if (dest) {
                    dest.cantidadElemento += item.cantidadMinima;
                }
                else {
                    item.marked = false;
                    item.caduca = false;
                    item.cantidadElemento = item.cantidadMinima;
                    result.push(item);
                }
                _this.globalVars.setListData('LISTA_COMPRA', result);
            });
        }
        else {
            var move_1 = this.alertCtrl.create();
            move_1.setTitle('Move to');
            this.globalVars.getListsData().then(function (data) {
                var lists = data;
                lists.forEach(function (list) {
                    var selected = false;
                    if (list.nombreLista !== item.nombreLista) {
                        if (list.nombreLista === 'LISTA_COMPRA') {
                            selected = true;
                        }
                        move_1.addInput({
                            type: 'radio',
                            label: list.nombreLista,
                            value: list.nombreLista,
                            checked: selected
                        });
                    }
                });
                move_1.addButton('Cancel');
                move_1.addButton({
                    text: 'OK',
                    handler: function (data) {
                        if (data === 'LISTA_COMPRA') {
                            item.caduca = false;
                        }
                        _this.list.splice(_this.list.indexOf(item), 1);
                        _this.globalVars.setListData(_this.selectedItem, _this.list);
                        item.nombreLista = data;
                        _this.globalVars.getListData(data).then(function (result) {
                            var dest = result.find(function (x) { return x.nombreElemento === item.nombreElemento; });
                            if (dest) {
                                dest.cantidadElemento += item.cantidadElemento;
                            }
                            else {
                                result.push(item);
                            }
                            _this.globalVars.setListData(data, result);
                        });
                    }
                });
                move_1.present();
            });
        }
    };
    /**
     * Event to add a notification on that list
     *
     */
    ListPage.prototype.addNotification = function () {
        var _this = this;
        var currentTime = __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz(__WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz.guess()).format();
        this.log.logs[this.constructor.name].info('addNotification');
        var reminderModal = this.mod.create(__WEBPACK_IMPORTED_MODULE_7__components_reminders_component_reminders_component__["a" /* RemindersComponent */], {
            time: currentTime,
            editing: false
        });
        reminderModal.onDidDismiss(function (data) {
            if (data) {
                _this.localNotification.requestPermission().then(function (permission) {
                    if (permission === 'granted') {
                        var reminder = {
                            message: data.message,
                            time: __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default()(data.notificationDate).seconds(0).milliseconds(0).tz(__WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz.guess()).format()
                        };
                        _this.reminders.setReminder(reminder);
                        if (_this.native) {
                            _this.localNotifications.schedule({
                                id: __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default()(data.notificationDate).seconds(0).milliseconds(0).tz(__WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz.guess()).unix(),
                                title: _this.translate.instant('Recuerda'),
                                text: data.message,
                                at: __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default()(data.notificationDate).seconds(0).milliseconds(0).tz(__WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz.guess()).toISOString()
                            });
                        }
                        else {
                            var timeOutHandler = setTimeout(function () {
                                alert(data.message);
                                _this.reminders.removeReminder(data);
                            }, __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default()(data.notificationDate).seconds(0).milliseconds(0).tz(__WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz.guess()).subtract(__WEBPACK_IMPORTED_MODULE_4_moment_timezone___default()(currentTime).tz(__WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz.guess()).seconds(0).milliseconds(0).valueOf(), 'milliseconds').valueOf());
                        }
                    }
                });
            }
        });
        reminderModal.present();
    };
    /**
     * Event to remove selected items
     *
     * @param {string[]} removed
     * @memberof ListPage
     */
    ListPage.prototype.removeElements = function (removed) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeElements:' + removed);
        removed.forEach(function (itemRemoved) {
            _this.list = _this.list.filter(function (item) { return item.nombreElemento !== itemRemoved; });
            _this.globalVars.setListData(_this.selectedItem, _this.list);
        });
    };
    /**
     * Event to add a new item
     *
     * @param {any} event
     * @memberof ListPage
     */
    ListPage.prototype.addItem = function (event) {
        var _this = this;
        this.log.logs[this.constructor.name].info('addItem');
        var newItem = {
            category: this.defaultCategory,
            nombreElemento: '',
            colorElemento: '',
            colorBotones: '',
            colorElementoNoCaducado: '',
            colorBotonesNoCaducado: '',
            nombreLista: this.selectedItem,
            cantidadElemento: this.minimumAmount,
            caduca: false,
            fechaCaducidad: __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz(__WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz.guess()).format(),
            cantidadMinima: this.minimumAmount,
            marked: false
        };
        this.log.logs[this.constructor.name].info(newItem);
        var infoListModal = this.mod.create(__WEBPACK_IMPORTED_MODULE_10__components_item_info_item_info__["a" /* ItemInfoPage */], {
            newItem: newItem,
            editing: true,
            icons: this.icons
        });
        infoListModal.onDidDismiss(function (item) {
            if (item !== undefined) {
                if (_this.list.filter(function (element) {
                    return element.nombreElemento.toLowerCase() === item.nombreElemento.toLowerCase();
                }).length === 0) {
                    _this.list.push(item);
                    _this.saveItem(item);
                    _this.globalVars.addOneItem(item);
                }
                else {
                    var addAmount = _this.alertCtrl.create();
                    addAmount.setTitle(_this.translate.instant('YaExisteSelecciona', { value: item.nombreElemento }));
                    addAmount.addButton('Discard');
                    addAmount.addButton({
                        text: _this.translate.instant('AniadirCantidad'),
                        handler: function (data) {
                            _this.list.filter(function (element) {
                                return element.nombreElemento.toLowerCase() ===
                                    item.nombreElemento.toLowerCase();
                            })[0].cantidadElemento +=
                                item.cantidadElemento;
                            _this.globalVars.setListData(_this.selectedItem, _this.list);
                        }
                    });
                    addAmount.present();
                }
            }
        });
        infoListModal.present();
    };
    ListPage.prototype.loadFavorite = function (list) {
        this.list = list;
    };
    ListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
            selector: 'page-list-page',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/list-page/list-page.html"*/'<ion-header>\n  <ion-navbar color="dark" [hidden]="searchBar">\n    <button ion-button menuToggle>\n      <ion-icon ios="ios-menu" md="md-menu"></ion-icon>\n    </button>\n    <ion-title>{{selectedItem}}</ion-title>\n    <ion-buttons end>\n      <button ion-button secondary (click)="reorder($event)">\n        <ion-icon class="icon-toolbar" ios="ios-repeat" md="md-repeat"></ion-icon>\n      </button>\n      <button ion-button secondary (click)="toggleSearchBar($event)">\n        <ion-icon class="icon-toolbar" ios="ios-search" md="md-search"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n  <ion-searchbar [hidden]="!searchBar" [(ngModel)]="searchItem" [debounce]=500 [showCancelButton]="true" [autocomplete]="true"\n                (ionInput)="searchMatches($event)" (ionCancel)="toggleSearchBar($event)">\n  </ion-searchbar>\n</ion-header>\n\n<ion-content class="list">\n  <ion-list inset>\n\n    <div *ngIf="selectedItem!==\'LISTA_COMPRA\'">\n      <div *ngFor="let itemData of list; let i = index">\n        <item [(item)]="list[i]" [creating]="false" [icons]="icons" (edit)="editItem(list[i])" (remove)="removeItem(list[i])" (move)="moveItem($event)"\n          (save)="saveItem(list[i])" [config]="dataConfig"></item>\n      </div>\n    </div>\n\n    <div *ngIf="selectedItem===\'LISTA_COMPRA\'">\n      <div *ngFor="let itemData of list; let i = index">\n        <item *ngIf="!list[i].marked" [(item)]="list[i]" [creating]="false" [icons]="icons" (edit)="editItem(list[i])" (remove)="removeItem(list[i])"\n          (move)="moveItem($event)" (save)="saveItem(list[i])" [config]="dataConfig"></item>\n      </div>\n      <div *ngFor="let itemData of list; let i = index">\n        <item *ngIf="list[i].marked" [(item)]="list[i]" [creating]="false" [icons]="icons" (edit)="editItem(list[i])" (remove)="removeItem(list[i])"\n          (move)="moveItem($event)" (save)="saveItem(list[i])" [config]="dataConfig"></item>\n      </div>\n    </div>\n\n  </ion-list>\n</ion-content>\n<ion-footer>\n  <bottom-buttons-component [type]="type" [object]="list" [add]=true [remove]=true [notifications]=true [favorites]="selectedItem===\'LISTA_COMPRA\'"\n    (finishedAdd)="addItem($event)" (finishedRemoved)="removeElements($event,list)" (finishNotification)="addNotification()"\n    (finishFavorite)="loadFavorite($event)">\n  </bottom-buttons-component>\n</ion-footer>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/list-page/list-page.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_8__pipes_orderBy__["a" /* OrderBy */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_9__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_8__pipes_orderBy__["a" /* OrderBy */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_phonegap_local_notification__["a" /* PhonegapLocalNotification */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_local_notifications__["a" /* LocalNotifications */],
            __WEBPACK_IMPORTED_MODULE_0__providers_reminders_provider__["a" /* RemindersProvider */],
            __WEBPACK_IMPORTED_MODULE_11__providers_log_log__["a" /* Log */],
            __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */]])
    ], ListPage);
    return ListPage;
}());

//# sourceMappingURL=list-page.js.map

/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Log; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_logging_service__ = __webpack_require__(415);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Service to get logs of the app behaviour, for support purposes (Sentry)
 *
 * @export
 * @class Log
 */
var Log = /** @class */ (function () {
    function Log(loggingService) {
        this.loggingService = loggingService;
        this.data = null;
        this.logs = [];
    }
    /**
     * Create logger for a component/provider of the application
     */
    Log.prototype.setLogger = function (className) {
        this.logs[className] = this.loggingService.getLogger(className);
    };
    /**
     * Return all log messages stored
     */
    Log.prototype.getLogMessages = function () {
        return this.loggingService.getLogMessages();
    };
    Log = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_logging_service__["a" /* LoggingService */]])
    ], Log);
    return Log;
}());

//# sourceMappingURL=log.js.map

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RemindersComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Component to show and control reminders for a list, on a modal window
 *
 * @export
 * @class RemindersComponent
 */
var RemindersComponent = /** @class */ (function () {
    function RemindersComponent(view, params, log) {
        this.view = view;
        this.log = log;
        this.minDate = __WEBPACK_IMPORTED_MODULE_1_moment___default()().seconds(0).milliseconds(0)
            .toDate()
            .toISOString();
        this.data = {};
        this.log.setLogger(this.constructor.name);
        this.log.logs[this.constructor.name].info('constructor');
        this.data.notificationDate = params.data.time;
        this.data.message = params.data.message;
    }
    /**
     * Close modal saving data
     *
     * @memberof RemindersComponent
     */
    RemindersComponent.prototype.save = function () {
        this.log.logs[this.constructor.name].info('save');
        this.view.dismiss(this.data);
    };
    /**
     * Close modal discarding data
     *
     * @memberof RemindersComponent
     */
    RemindersComponent.prototype.close = function () {
        this.view.dismiss();
    };
    RemindersComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'reminders-component',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/reminders-component/reminders-component.html"*/'<ion-header>\n	<ion-toolbar dark>\n		<ion-title [hidden]="!editing">\n			{{ \'EditaRecordatorio\' | translate }}\n		</ion-title>\n		<ion-title [hidden]="editing">\n			{{ \'NuevoRecordatorio\' | translate }}\n		</ion-title>\n		<ion-buttons end>\n			<button primary (click)="save()">\n				<ion-icon ios="ios-archive" md="md-archive"></ion-icon>\n			</button>\n			<button (click)="close()">\n				<ion-icon ios="ios-close" md="md-close"></ion-icon>\n			</button>\n		</ion-buttons>\n	</ion-toolbar>\n</ion-header>\n\n<ion-content>\n	<ion-item>\n		<ion-label>{{ \'Mensaje\' | translate }}</ion-label>\n		<ion-input id="message" type="text" [(ngModel)]="data.message" placeholder="NEW MESSAGE"></ion-input>\n	</ion-item>\n	<ion-item>\n		{{data.notificationDate}}\n		<ion-datetime class="expireDate" id="notificationDate" displayFormat="DD MMMM YYYY HH:mm" pickerformat="HH:mm DD MMMM YYYY"\n		 [(ngModel)]="data.notificationDate" min="{{minDate}}" max="3000">\n		</ion-datetime>\n	</ion-item>\n</ion-content>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/reminders-component/reminders-component.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__providers_log_log__["a" /* Log */]])
    ], RemindersComponent);
    return RemindersComponent;
}());

//# sourceMappingURL=reminders-component.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DefaultIcons; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Provider to get default icons data for use on the categories of the app
 *
 * @export
 * @class DefaultIcons
 */
var DefaultIcons = /** @class */ (function () {
    function DefaultIcons(http, log) {
        this.http = http;
        this.log = log;
        this.icons = null;
        this.path = 'assets/json/defaultIcons.json';
        this.log.setLogger(this.constructor.name);
    }
    /**
     * Get icons data from a local file
     *
     * @returns {*}
     * @memberof DefaultIcons
     */
    DefaultIcons.prototype.getIcons = function () {
        var _this = this;
        if (this.icons) {
            this.log.logs[this.constructor.name].info('getIcons:' + this.icons.length);
            return Promise.resolve(this.icons);
        }
        return new Promise(function (resolve) {
            _this.http
                .get(_this.path)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.icons = data;
                _this.log.logs[_this.constructor.name].info('getIcons:' + _this.icons.length);
                resolve(_this.icons);
            });
        });
    };
    DefaultIcons = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_3__log_log__["a" /* Log */]])
    ], DefaultIcons);
    return DefaultIcons;
}());

//# sourceMappingURL=default-icons.js.map

/***/ }),

/***/ 230:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 230;

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalVars; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__categorys_provider__ = __webpack_require__(545);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_provider__ = __webpack_require__(584);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__items_provider__ = __webpack_require__(585);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__list_provider__ = __webpack_require__(586);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lists_provider__ = __webpack_require__(587);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__default_icons_default_icons__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Provider to manage, centralised, the app data
 *
 * @export
 * @class GlobalVars
 */
var GlobalVars = /** @class */ (function () {
    function GlobalVars(listsDataProvider, listDataProvider, itemsDataProvider, iconsDataService, categoriesDataProvider, configProvider, log) {
        this.listsDataProvider = listsDataProvider;
        this.listDataProvider = listDataProvider;
        this.itemsDataProvider = itemsDataProvider;
        this.iconsDataService = iconsDataService;
        this.categoriesDataProvider = categoriesDataProvider;
        this.configProvider = configProvider;
        this.log = log;
        this.server = false;
        this.userProfile = null;
        this.userConnected = false;
        this.appLocale = 'es';
        this.log.setLogger(this.constructor.name);
    }
    /**
     * Save user profile on login and load local data to cloud service
     *
     * @param {*} userProfile
     * @returns {*}
     * @memberof GlobalVars
     */
    GlobalVars.prototype.setUserProfile = function (userProfile, token) {
        var _this = this;
        this.log.logs[this.constructor.name].info('UserProfile:' + JSON.stringify(userProfile));
        return new Promise(function (resolve) {
            _this.userProfile = userProfile;
            if (userProfile !== null) {
                _this.userConnected = true;
                if (token !== null) {
                    _this.configProvider.setUserToken(token, userProfile);
                }
                _this.categoriesDataProvider
                    .getCategoriesData(_this.userProfile)
                    .then(function (data) {
                    _this.setCategoriesData(data);
                });
                _this.configProvider.getConfigData(_this.userProfile).then(function (data) {
                    _this.setConfigData(data);
                });
                _this.itemsDataProvider.getItemsData(_this.userProfile).then(function (data) {
                    _this.setItemsData(data);
                });
                _this.listsDataProvider.getListsData(_this.userProfile).then(function (data) {
                    _this.setListsData(data);
                    data.forEach(function (element) {
                        _this.listDataProvider
                            .getListItemsData(element.nombreLista, userProfile)
                            .then(function (result) {
                            _this.setListData(element.nombreLista, result);
                        });
                    });
                });
                resolve();
            }
            else {
                _this.userConnected = false;
                resolve();
            }
        });
    };
    /**
     * Return user profile
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getUserProfile = function () {
        return this.userProfile;
    };
    /**
     * Disconnect user
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.disconnectUser = function () {
        this.userConnected = false;
    };
    /**
     * Return if user is connected or not
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getUserConnected = function () {
        return this.userConnected;
    };
    /**
     * Save config data
     *
     * @param {any} value
     * @memberof GlobalVars
     */
    GlobalVars.prototype.setConfigData = function (value) {
        this.configProvider.setConfigData(value, this.userProfile);
    };
    /**
     * Recover config data
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getConfigData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.configProvider.getConfigData(_this.userProfile).then(function (data) {
                _this.log.logs[_this.constructor.name].info('getConfigData:' + JSON.stringify(data));
                resolve(data);
            });
        });
    };
    /**
     * Get colors data
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getColorsData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.listsDataProvider.getColorsData(_this.userProfile).then(function (data) {
                _this.log.logs[_this.constructor.name].info('getColorsData:' + JSON.stringify(data));
                resolve(data);
            });
        });
    };
    /**
     * Save favorites lists data
     *
     * @param {any} value
     * @memberof GlobalVars
     */
    GlobalVars.prototype.setFavoritesListsData = function (value) {
        this.listsDataProvider.setFavoriteListsData(value, this.userProfile);
    };
    /**
     * Recover favorites lists data
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getFavoritesListsData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.listsDataProvider
                .getFavoritesListsData(_this.userProfile)
                .then(function (data) {
                _this.log.logs[_this.constructor.name].info('getFavoritesListsData:' + JSON.stringify(data));
                resolve(data);
            });
        });
    };
    /**
     * Save lists data
     *
     * @param {any} value
     * @memberof GlobalVars
     */
    GlobalVars.prototype.setListsData = function (value) {
        this.listsDataProvider.setListsData(value, this.userProfile);
    };
    /**
     * Recover lists data
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getListsData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.listsDataProvider.getListsData(_this.userProfile).then(function (data) {
                _this.log.logs[_this.constructor.name].info('getListsData:' + JSON.stringify(data));
                resolve(data);
            });
        });
    };
    /**
     * Recover list data of a list provided
     *
     * @param {string} name
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getListData = function (name) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.listDataProvider
                .getListItemsData(name, _this.userProfile)
                .then(function (data) {
                _this.log.logs[_this.constructor.name].info('getListData:' + JSON.stringify(data));
                resolve(data);
            });
        });
    };
    /**
     * Save list data of a list provided
     *
     * @param {string} name
     * @param {ListItem[]} data
     * @memberof GlobalVars
     */
    GlobalVars.prototype.setListData = function (name, data) {
        this.listDataProvider.setListData(name, data, this.userProfile);
    };
    /**
     * Remove items data of a list provided
     *
     * @param {string} name
     * @memberof GlobalVars
     */
    GlobalVars.prototype.removetItemListData = function (name) {
        this.listDataProvider.removeListData(name, this.userProfile);
    };
    /**
     * Save items data
     *
     * @param {any} value
     * @memberof GlobalVars
     */
    GlobalVars.prototype.setItemsData = function (value) {
        this.itemsDataProvider.setItemsData(value, this.userProfile);
    };
    /**
     * Add one item to items data
     *
     * @param {ListItem} value
     * @memberof GlobalVars
     */
    GlobalVars.prototype.addOneItem = function (value) {
        var _this = this;
        this.itemsDataProvider.getItemsData(this.userProfile).then(function (data) {
            var exist = data.filter(function (item) { return item.nombreElemento === value.nombreElemento; })
                .length > 0;
            if (!exist) {
                data.push(value);
                _this.itemsDataProvider.setItemsData(data, _this.userProfile);
            }
        });
    };
    /**
     * Recover items data
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getItemsData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.itemsDataProvider.getItemsData(_this.userProfile).then(function (data) {
                _this.log.logs[_this.constructor.name].info('getItemsData:' + JSON.stringify(data));
                resolve(data);
            });
        });
    };
    /**
     * Save categories data
     *
     * @param {any} value
     * @memberof GlobalVars
     */
    GlobalVars.prototype.setCategoriesData = function (value) {
        this.categoriesDataProvider.setCategoriesData(value, this.userProfile);
    };
    /**
     * Recover categories data
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getCategoriesData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.categoriesDataProvider
                .getCategoriesData(_this.userProfile)
                .then(function (data) {
                _this.log.logs[_this.constructor.name].info('getCategoriesData:' + JSON.stringify(data));
                resolve(data);
            });
        });
    };
    /**
     * Recover default icons data
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getDefaulIconsData = function () {
        var _this = this;
        if (this.iconsData) {
            this.log.logs[this.constructor.name].info('getDefaulIconsData:' + JSON.stringify(this.iconsData));
            return Promise.resolve(this.iconsData);
        }
        else {
            return new Promise(function (resolve) {
                _this.iconsDataService.getIcons().then(function (data) {
                    _this.iconsData = data;
                    _this.log.logs[_this.constructor.name].info('getDefaulIconsData:' + JSON.stringify(data));
                    resolve(data);
                });
            });
        }
    };
    /**
     * Recover old version app data
     *
     * @returns
     * @memberof GlobalVars
     */
    GlobalVars.prototype.getOldData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.configProvider.getOldConfigData();
            _this.itemsDataProvider.getOldItems();
            _this.categoriesDataProvider.getCategoriesData(null);
            _this.listsDataProvider.getOldLists().then(function (lists) {
                _this.listDataProvider.getOldListItemsData(lists);
            });
        });
    };
    GlobalVars = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__lists_provider__["a" /* ListsProvider */],
            __WEBPACK_IMPORTED_MODULE_4__list_provider__["a" /* ListProvider */],
            __WEBPACK_IMPORTED_MODULE_3__items_provider__["a" /* ItemsProvider */],
            __WEBPACK_IMPORTED_MODULE_6__default_icons_default_icons__["a" /* DefaultIcons */],
            __WEBPACK_IMPORTED_MODULE_1__categorys_provider__["a" /* CategorysProvider */],
            __WEBPACK_IMPORTED_MODULE_2__config_provider__["a" /* ConfigProvider */],
            __WEBPACK_IMPORTED_MODULE_7__log_log__["a" /* Log */]])
    ], GlobalVars);
    return GlobalVars;
}());

//# sourceMappingURL=global-vars.js.map

/***/ }),

/***/ 283:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 283;

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocalStorage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Provider to manage data on a local db
 *
 * @export
 * @class LocalStorage
 */
var LocalStorage = /** @class */ (function () {
    function LocalStorage(http, storage, log) {
        this.http = http;
        this.storage = storage;
        this.log = log;
        this.log.setLogger(this.constructor.name);
    }
    /**
     * Get data from local db
     *
     * @param {string} name
     * @param {string} path
     * @returns
     * @memberof LocalStorage
     */
    LocalStorage.prototype.getFromLocal = function (name, path) {
        var _this = this;
        this.log.logs[this.constructor.name].info('Get:' + name + ':' + path);
        return new Promise(function (resolve, reject) {
            _this.storage
                .get(name)
                .then(function (val) {
                if (val !== undefined && val !== null) {
                    resolve(val);
                }
                else {
                    var oldLocal = window.localStorage[name];
                    if (!oldLocal || oldLocal === undefined || oldLocal === '') {
                        _this.http
                            .get(path)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            _this.storage.set(name, data);
                            resolve(data);
                        }, function (err) {
                            resolve(null);
                        });
                    }
                    else {
                        _this.storage.set(name, JSON.parse(oldLocal));
                        resolve(JSON.parse(oldLocal));
                    }
                }
            })
                .catch(function (error) {
                resolve([]);
            });
        });
    };
    /**
     * Store data on local db
     *
     * @param {string} name
     * @param {*} data
     * @memberof LocalStorage
     */
    LocalStorage.prototype.setToLocal = function (name, data) {
        this.log.logs[this.constructor.name].info('Add:' + name);
        this.storage.set(name, data);
    };
    /**
     * Remove data from local db
     *
     * @param {string} name
     * @memberof LocalStorage
     */
    LocalStorage.prototype.removeFromLocal = function (name) {
        this.log.logs[this.constructor.name].info('Remove:' + name);
        this.storage.remove(name);
    };
    LocalStorage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */], __WEBPACK_IMPORTED_MODULE_4__log_log__["a" /* Log */]])
    ], LocalStorage);
    return LocalStorage;
}());

//# sourceMappingURL=localStorage.js.map

/***/ }),

/***/ 544:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemsBestBeforeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pipes_orderBy__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Component to show and manage items near to expire for the dashboard
 *
 * @export
 * @class ItemsBestBeforeComponent
 */
var ItemsBestBeforeComponent = /** @class */ (function () {
    function ItemsBestBeforeComponent(globalVars, order, view, log) {
        this.globalVars = globalVars;
        this.order = order;
        this.view = view;
        this.log = log;
        this.list = [];
        this.log.setLogger(this.constructor.name);
    }
    ItemsBestBeforeComponent.prototype.ionViewDidLoad = function () {
        this.initializeItems();
    };
    ItemsBestBeforeComponent.prototype.initializeItems = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('initializeItems');
        this.globalVars.getListsData().then(function (data) {
            var lists = data;
            var itemsOnLists = [];
            lists.forEach(function (element) {
                _this.globalVars.getListData(element.nombreLista).then(function (data) {
                    data.forEach(function (item) {
                        itemsOnLists.push(item);
                    });
                    itemsOnLists.forEach(function (item, index) {
                        var auxItem = item;
                        if (auxItem.caduca) {
                            if (_this.list.filter(function (listItem) { return listItem.nombreElemento === auxItem.nombreElemento; }).length <= 0) {
                                _this.list.push(auxItem);
                            }
                        }
                    });
                });
            });
            _this.list = _this.order.transform(_this.list, ['+fechaCaducidad']);
        });
    };
    /**
     * Check expiry date of the item
     *
     * @param {any} expiryDate
     * @returns
     * @memberof Item
     */
    ItemsBestBeforeComponent.prototype.checkExpiryDate = function (expiryDate) {
        if (__WEBPACK_IMPORTED_MODULE_2_moment___default()().isAfter(__WEBPACK_IMPORTED_MODULE_2_moment___default()(expiryDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'))) {
            return 'expired';
        }
        else {
            if (__WEBPACK_IMPORTED_MODULE_2_moment___default()().isAfter(__WEBPACK_IMPORTED_MODULE_2_moment___default()(expiryDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').subtract(7, 'days'))) {
                return 'nearToExpire';
            }
        }
    };
    /**
     * Close modal discarding data
     *
     * @memberof ItemsBestBeforeComponent
     */
    ItemsBestBeforeComponent.prototype.close = function () {
        this.view.dismiss();
    };
    ItemsBestBeforeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["n" /* Component */])({
            selector: 'items-best-before-component',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/items-best-before-component/items-best-before-component.html"*/'<ion-header>\n	<ion-toolbar dark>\n		<ion-title>\n			{{ \'ElementosCaducables\' | translate }}\n		</ion-title>\n		<ion-buttons end>\n			<button (click)="close()">\n				<ion-icon ios="ios-close" md="md-close"></ion-icon>\n			</button>\n		</ion-buttons>\n	</ion-toolbar>\n</ion-header>\n\n<div class="list">\n	<ion-list inset>\n\n		<div *ngFor="let itemData of list; let i = index">\n			<ion-card>\n				<ion-card-header>\n					<ion-row class="fila" [ngClass]="checkExpiryDate(itemData.fechaCaducidad)">\n						<ion-col col-5>\n							<ion-label class="nameElement">{{itemData.nombreElemento}}</ion-label>\n						</ion-col>\n\n						<ion-col col-4>\n							<ion-label class="nameList">{{itemData.nombreLista}}</ion-label>\n						</ion-col>\n\n						<ion-col col-3>\n							<ion-item>\n								{{itemData.fechaCaducidad | date:\'yyyy-MM-dd\'}}\n							</ion-item>\n						</ion-col>\n					</ion-row>\n				</ion-card-header>\n			</ion-card>\n		</div>\n\n	</ion-list>\n</div>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/items-best-before-component/items-best-before-component.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_1__pipes_orderBy__["a" /* OrderBy */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_1__pipes_orderBy__["a" /* OrderBy */],
            __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["m" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_5__providers_log_log__["a" /* Log */]])
    ], ItemsBestBeforeComponent);
    return ItemsBestBeforeComponent;
}());

//# sourceMappingURL=items-best-before-component.js.map

/***/ }),

/***/ 545:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategorysProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_cloudStorage__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_localStorage__ = __webpack_require__(54);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Provider to manage categories data
 *
 * @export
 * @class CategorysProvider
 */
var CategorysProvider = /** @class */ (function () {
    function CategorysProvider(cloudStorage, localStorage, network, plt) {
        this.cloudStorage = cloudStorage;
        this.localStorage = localStorage;
        this.network = network;
        this.plt = plt;
        this.path = 'assets/json/Categories.json';
    }
    /**
     * Save categories data
     *
     * @param {Category[]} data
     * @param {*} userProfile
     * @memberof CategorysProvider
     */
    CategorysProvider.prototype.setCategoriesData = function (data, userProfile) {
        if (userProfile) {
            if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
                this.cloudStorage.uploadCategoriesData(data, userProfile.uid);
            }
            else {
                if (this.network.type === 'NONE') {
                    this.localStorage.setToLocal('categories', data);
                }
                else {
                    this.cloudStorage.uploadCategoriesData(data, userProfile.uid);
                }
            }
        }
        else {
            this.localStorage.setToLocal('categories', data);
        }
    };
    /**
     * Recover caegories data
     *
     * @param {*} userProfile
     * @returns {*}
     * @memberof CategorysProvider
     */
    CategorysProvider.prototype.getCategoriesData = function (userProfile) {
        var _this = this;
        return new Promise(function (resolve) {
            if (userProfile) {
                if ((_this.plt.is('android') || _this.plt.is('ios')) && !_this.plt.is('mobileweb')) {
                    _this.cloudStorage.loadCategoriesData(userProfile.uid).then(function (data) {
                        if (data !== undefined && data !== null) {
                            _this.localStorage.setToLocal('categories', data);
                            resolve(data);
                        }
                        else {
                            _this.localStorage
                                .getFromLocal('categories', _this.path)
                                .then(function (data) {
                                if (data !== undefined && data !== null) {
                                    resolve(data);
                                }
                                else {
                                    resolve([]);
                                }
                            });
                        }
                    });
                }
                else {
                    if (_this.network.type === 'NONE') {
                        _this.localStorage
                            .getFromLocal('categories', _this.path)
                            .then(function (data) {
                            if (data !== undefined && data !== null) {
                                resolve(data);
                            }
                            else {
                                resolve([]);
                            }
                        });
                    }
                    else {
                        _this.cloudStorage.loadCategoriesData(userProfile.uid).then(function (data) {
                            if (data !== undefined) {
                                _this.localStorage.setToLocal('categories', data || []);
                                resolve(data || []);
                            }
                            else {
                                _this.localStorage
                                    .getFromLocal('categories', _this.path)
                                    .then(function (data) {
                                    if (data !== undefined && data !== null) {
                                        resolve(data);
                                    }
                                    else {
                                        resolve([]);
                                    }
                                });
                            }
                        });
                    }
                }
            }
            else {
                _this.localStorage.getFromLocal('categories', _this.path).then(function (data) {
                    if (data !== undefined && data !== null) {
                        resolve(data);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
        });
    };
    CategorysProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__data_cloudStorage__["a" /* CloudStorage */],
            __WEBPACK_IMPORTED_MODULE_4__data_localStorage__["a" /* LocalStorage */],
            __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* Platform */]])
    ], CategorysProvider);
    return CategorysProvider;
}());

//# sourceMappingURL=categorys-provider.js.map

/***/ }),

/***/ 584:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_cloudStorage__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_localStorage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_network__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Provider to manage config data
 *
 * @export
 * @class ConfigProvider
 */
var ConfigProvider = /** @class */ (function () {
    function ConfigProvider(cloudStorage, localStorage, network, plt, log) {
        this.cloudStorage = cloudStorage;
        this.localStorage = localStorage;
        this.network = network;
        this.plt = plt;
        this.log = log;
        this.configData = null;
        this.path = 'assets/json/Configuracion.json';
        this.log.setLogger(this.constructor.name);
    }
    ConfigProvider.prototype.setUserToken = function (token, userProfile) {
        this.cloudStorage.setUserToken(token, userProfile.uid);
    };
    /**
     * Save config data
     *
     * @param {*} data
     * @param {*} userProfile
     * @memberof ConfigProvider
     */
    ConfigProvider.prototype.setConfigData = function (data, userProfile) {
        var arrData = [];
        arrData.push(data);
        if (userProfile) {
            if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
                this.cloudStorage.uploadConfigData(arrData, userProfile.uid);
            }
            else {
                if (this.network.type === 'NONE') {
                    this.localStorage.setToLocal('config', data);
                }
                else {
                    this.cloudStorage.uploadConfigData(arrData, userProfile.uid);
                }
            }
        }
        else {
            this.localStorage.setToLocal('config', data);
        }
    };
    /**
     * Recover config data
     *
     * @param {*} userProfile
     * @returns {*}
     * @memberof ConfigProvider
     */
    ConfigProvider.prototype.getConfigData = function (userProfile) {
        var _this = this;
        return new Promise(function (resolve) {
            if (userProfile) {
                if ((_this.plt.is('android') || _this.plt.is('ios')) && !_this.plt.is('mobileweb')) {
                    _this.cloudStorage.loadConfigData(userProfile.uid).then(function (data) {
                        if (data !== undefined && data !== null) {
                            _this.localStorage.setToLocal('config', data);
                            resolve(data);
                        }
                        else {
                            _this.localStorage.getFromLocal('config', null).then(function (data) {
                                if (data !== undefined && data !== null) {
                                    resolve(data);
                                }
                                else {
                                    resolve({});
                                }
                            });
                        }
                    });
                }
                else {
                    if (_this.network.type === 'NONE') {
                        _this.localStorage.getFromLocal('config', _this.path).then(function (data) {
                            if (data !== undefined && data !== null) {
                                resolve(data);
                            }
                            else {
                                resolve({});
                            }
                        });
                    }
                    else {
                        _this.cloudStorage.loadConfigData(userProfile.uid).then(function (data) {
                            if (data !== undefined && data !== null) {
                                _this.localStorage.setToLocal('config', data);
                                resolve(data);
                            }
                            else {
                                _this.localStorage.getFromLocal('config', null).then(function (data) {
                                    if (data !== undefined && data !== null) {
                                        resolve(data);
                                    }
                                    else {
                                        resolve({});
                                    }
                                });
                            }
                        });
                    }
                }
            }
            else {
                _this.localStorage.getFromLocal('config', null).then(function (data) {
                    if (data !== undefined && data !== null) {
                        resolve(data);
                    }
                    else {
                        resolve({});
                    }
                });
            }
        });
    };
    /**
     * Recover old version app config data
     *
     * @returns {*}
     * @memberof ConfigProvider
     */
    ConfigProvider.prototype.getOldConfigData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.localStorage.getFromLocal('configData', null).then(function (data) {
                _this.log.logs[_this.constructor.name].info('OldData:' + JSON.stringify(data));
                if (data !== undefined && data !== null) {
                    if (!data.version) {
                        _this.localStorage.getFromLocal('config', _this.path).then(function (result) {
                            if (data.length === 0) {
                                data = result;
                            }
                            else {
                                data.version = true;
                                data.categoryDefault = result.categoryDefault;
                                data.unitDefault = result.unitDefault;
                                data.stepDefault = result.stepDefault;
                            }
                            _this.localStorage.setToLocal('config', data);
                            resolve(data);
                        });
                    }
                    else {
                        resolve(data);
                    }
                }
                else {
                    _this.localStorage.getFromLocal('config', _this.path).then(function (result) {
                        resolve(result);
                    });
                }
            });
        });
    };
    ConfigProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__data_cloudStorage__["a" /* CloudStorage */],
            __WEBPACK_IMPORTED_MODULE_3__data_localStorage__["a" /* LocalStorage */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_5__log_log__["a" /* Log */]])
    ], ConfigProvider);
    return ConfigProvider;
}());

//# sourceMappingURL=config-provider.js.map

/***/ }),

/***/ 585:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemsProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_cloudStorage__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_localStorage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_network__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Provider to manage items data
 *
 * @export
 * @class ItemsProvider
 */
var ItemsProvider = /** @class */ (function () {
    function ItemsProvider(cloudStorage, localStorage, network, plt, log) {
        this.cloudStorage = cloudStorage;
        this.localStorage = localStorage;
        this.network = network;
        this.plt = plt;
        this.log = log;
        this.itemData = null;
        this.path = 'assets/json/Elementos.json';
        this.log.setLogger(this.constructor.name);
    }
    /**
     * Save items data
     *
     * @param {Item[]} items
     * @param {*} userProfile
     * @memberof ItemsProvider
     */
    ItemsProvider.prototype.setItemsData = function (items, userProfile) {
        if (userProfile) {
            if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
                this.cloudStorage.uploadItemsData(items, userProfile.uid);
            }
            else {
                if (this.network.type === 'NONE') {
                    this.localStorage.setToLocal('items', items);
                }
                else {
                    this.cloudStorage.uploadItemsData(items, userProfile.uid);
                }
            }
        }
        else {
            this.localStorage.setToLocal('items', items);
        }
    };
    /**
     * Recover items data
     *
     * @param {any} userProfile
     * @returns {*}
     * @memberof ItemsProvider
     */
    ItemsProvider.prototype.getItemsData = function (userProfile) {
        var _this = this;
        return new Promise(function (resolve) {
            if (userProfile) {
                if ((_this.plt.is('android') || _this.plt.is('ios')) && !_this.plt.is('mobileweb')) {
                    _this.cloudStorage.loadItemsData(userProfile.uid).then(function (data) {
                        if (data !== undefined && data !== null) {
                            _this.localStorage.setToLocal('items', data);
                            resolve(data);
                        }
                        else {
                            _this.localStorage.getFromLocal('items', null).then(function (data) {
                                if (data !== undefined && data !== null) {
                                    resolve(data);
                                }
                                else {
                                    resolve([]);
                                }
                            });
                        }
                    });
                }
                else {
                    if (_this.network.type === 'NONE') {
                        _this.localStorage.getFromLocal('items', null).then(function (data) {
                            if (data !== undefined && data !== null) {
                                resolve(data);
                            }
                            else {
                                resolve([]);
                            }
                        });
                    }
                    else {
                        _this.cloudStorage.loadItemsData(userProfile.uid).then(function (data) {
                            if (data !== undefined) {
                                _this.localStorage.setToLocal('items', data || []);
                                resolve(data || []);
                            }
                            else {
                                _this.localStorage.getFromLocal('items', null).then(function (data) {
                                    if (data !== undefined && data !== null) {
                                        resolve(data);
                                    }
                                    else {
                                        resolve([]);
                                    }
                                });
                            }
                        });
                    }
                }
            }
            else {
                _this.localStorage.getFromLocal('items', null).then(function (data) {
                    if (data !== undefined && data !== null) {
                        resolve(data);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
        });
    };
    /**
     * Recover old version app items
     *
     * @memberof ItemsProvider
     */
    ItemsProvider.prototype.getOldItems = function () {
        var _this = this;
        this.localStorage.getFromLocal('elementos', null).then(function (data) {
            _this.log.logs[_this.constructor.name].info('OldData:' + JSON.stringify(data));
            if (data !== undefined && data !== null) {
                _this.localStorage.getFromLocal('items', _this.path).then(function (result) {
                    if (data.length === 0) {
                        data = result;
                    }
                    else {
                        data.forEach(function (item) {
                            item.category = {
                                icon: { src: 'assets/images/icons/default.png' },
                                measurement: 'UNIDADES',
                                categoryName: 'No Category',
                                unitStep: 1
                            };
                        });
                    }
                    _this.localStorage.setToLocal('items', data);
                });
            }
            else {
                _this.localStorage.getFromLocal('items', _this.path).then(function (result) {
                    _this.localStorage.setToLocal('items', result);
                });
            }
        });
    };
    ItemsProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__data_cloudStorage__["a" /* CloudStorage */],
            __WEBPACK_IMPORTED_MODULE_3__data_localStorage__["a" /* LocalStorage */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_5__log_log__["a" /* Log */]])
    ], ItemsProvider);
    return ItemsProvider;
}());

//# sourceMappingURL=items-provider.js.map

/***/ }),

/***/ 586:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_cloudStorage__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_localStorage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Provider to manage list data
 *
 * @export
 * @class ListProvider
 */
var ListProvider = /** @class */ (function () {
    function ListProvider(cloudStorage, localStorage, network, plt, log) {
        this.cloudStorage = cloudStorage;
        this.localStorage = localStorage;
        this.network = network;
        this.plt = plt;
        this.log = log;
        this.listData = null;
        this.path = 'assets/json/lists/';
        this.log.setLogger(this.constructor.name);
    }
    /**
     * Save list data
     *
     * @param {string} name
     * @param {any[]} data
     * @param {*} userProfile
     * @memberof ListProvider
     */
    ListProvider.prototype.setListData = function (name, data, userProfile) {
        if (userProfile) {
            if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
                this.cloudStorage.uploadListData(name, data, userProfile.uid);
            }
            else {
                if (this.network.type === 'NONE') {
                    this.localStorage.setToLocal(name, data);
                }
                else {
                    this.cloudStorage.uploadListData(name, data, userProfile.uid);
                }
            }
        }
        else {
            this.localStorage.setToLocal(name, data);
        }
    };
    /**
     * Remove list data
     *
     * @param {string} name
     * @param {*} userProfile
     * @memberof ListProvider
     */
    ListProvider.prototype.removeListData = function (name, userProfile) {
        if (userProfile) {
            if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
                this.cloudStorage.removeListData(name, userProfile.uid);
                this.localStorage.removeFromLocal(name);
            }
            else {
                if (this.network.type === 'NONE') {
                    this.localStorage.removeFromLocal(name);
                }
                else {
                    this.cloudStorage.removeListData(name, userProfile.uid);
                    this.localStorage.removeFromLocal(name);
                }
            }
        }
        else {
            this.localStorage.removeFromLocal(name);
        }
    };
    /**
     * Recover list data
     *
     * @param {string} name
     * @param {*} userProfile
     * @returns
     * @memberof ListProvider
     */
    ListProvider.prototype.getListItemsData = function (name, userProfile) {
        var _this = this;
        return new Promise(function (resolve) {
            if (userProfile) {
                if ((_this.plt.is('android') || _this.plt.is('ios')) && !_this.plt.is('mobileweb')) {
                    _this.cloudStorage.loadListData(name, userProfile.uid).then(function (data) {
                        if (data !== undefined && data !== null) {
                            _this.localStorage.setToLocal(name, data);
                            resolve(data);
                        }
                        else {
                            _this.localStorage
                                .getFromLocal(name, _this.path + name + '.json')
                                .then(function (data) {
                                if (data !== undefined && data !== null) {
                                    resolve(data);
                                }
                                else {
                                    resolve([]);
                                }
                            });
                        }
                    });
                }
                else {
                    if (_this.network.type === 'NONE') {
                        _this.localStorage
                            .getFromLocal(name, _this.path + name + '.json')
                            .then(function (data) {
                            if (data !== undefined && data !== null) {
                                resolve(data);
                            }
                            else {
                                resolve([]);
                            }
                        });
                    }
                    else {
                        _this.cloudStorage.loadListData(name, userProfile.uid).then(function (data) {
                            if (data !== undefined && data !== null) {
                                _this.localStorage.setToLocal(name, data);
                                resolve(data);
                            }
                            else {
                                _this.localStorage
                                    .getFromLocal(name, _this.path + name + '.json')
                                    .then(function (data) {
                                    if (data !== undefined && data !== null) {
                                        resolve(data);
                                    }
                                    else {
                                        resolve([]);
                                    }
                                });
                            }
                        });
                    }
                }
            }
            else {
                _this.localStorage
                    .getFromLocal(name, _this.path + name + '.json')
                    .then(function (data) {
                    if (data !== undefined && data !== null) {
                        resolve(data);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
        });
    };
    /**
     * Recover old version app list data
     *
     * @param {List[]} lists
     * @memberof ListProvider
     */
    ListProvider.prototype.getOldListItemsData = function (lists) {
        var _this = this;
        this.localStorage
            .getFromLocal('cantidadElementosLista', null)
            .then(function (data) {
            _this.log.logs[_this.constructor.name].info('OldData:' + JSON.stringify(data));
            if (data !== undefined && data !== null) {
                lists.forEach(function (list) {
                    var listData = data.filter(function (item) {
                        return item.nombreLista
                            .toLowerCase()
                            .indexOf(list.nombreLista.toLowerCase()) > -1;
                    });
                    listData.forEach(function (item) {
                        item.category = {
                            icon: { src: 'assets/images/icons/default.png' },
                            measurement: 'UNIDADES',
                            categoryName: 'No Category',
                            unitStep: 1
                        };
                        var fecha = item.fechaCaducidad !== null
                            ? item.fechaCaducidad
                            : '3000-01-01';
                        item.fechaCaducidad = __WEBPACK_IMPORTED_MODULE_5_moment___default()(fecha)
                            .toDate()
                            .toISOString();
                    });
                    _this.localStorage.setToLocal(list.nombreLista, listData);
                });
            }
            else {
                lists.forEach(function (list) {
                    _this.localStorage.setToLocal(list.nombreLista, []);
                });
            }
        });
    };
    ListProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__data_cloudStorage__["a" /* CloudStorage */],
            __WEBPACK_IMPORTED_MODULE_4__data_localStorage__["a" /* LocalStorage */],
            __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_6__log_log__["a" /* Log */]])
    ], ListProvider);
    return ListProvider;
}());

//# sourceMappingURL=list-provider.js.map

/***/ }),

/***/ 587:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListsProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_cloudStorage__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_localStorage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_network__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Provider to manage lists data
 *
 * @export
 * @class ListsProvider
 */
var ListsProvider = /** @class */ (function () {
    function ListsProvider(cloudStorage, localStorage, network, plt, log) {
        this.cloudStorage = cloudStorage;
        this.localStorage = localStorage;
        this.network = network;
        this.plt = plt;
        this.log = log;
        this.path = 'assets/json/Listas.json';
        this.colors = 'assets/json/Colors.json';
        this.log.setLogger(this.constructor.name);
    }
    /**
     * Get colors data from local file
     *
     * @param {*} userProfile
     * @returns {*}
     * @memberof ListsProvider
     */
    ListsProvider.prototype.getColorsData = function (userProfile) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.localStorage.getFromLocal('colors', _this.colors).then(function (data) {
                if (data !== undefined && data !== null) {
                    resolve(data);
                }
                else {
                    resolve([]);
                }
            });
        });
    };
    /**
     * Save favorite lists data
     *
     * @param {*} lists
     * @param {*} userProfile
     * @memberof ListsProvider
     */
    ListsProvider.prototype.setFavoriteListsData = function (lists, userProfile) {
        if (userProfile) {
            if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
                this.cloudStorage.uploadFavoritesListsData(lists, userProfile.uid);
                this.localStorage.setToLocal('favorites', lists);
            }
            else {
                if (this.network.type === 'NONE') {
                    this.localStorage.setToLocal('favorites', lists);
                }
                else {
                    this.cloudStorage.uploadFavoritesListsData(lists, userProfile.uid);
                    this.localStorage.setToLocal('favorites', lists);
                }
            }
        }
        else {
            this.localStorage.setToLocal('favorites', lists);
        }
    };
    /**
     * Save lists data
     *
     * @param {*} lists
     * @param {*} userProfile
     * @memberof ListsProvider
     */
    ListsProvider.prototype.setListsData = function (lists, userProfile) {
        if (userProfile) {
            if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
                this.cloudStorage.uploadListsData(lists, userProfile.uid);
                this.localStorage.setToLocal('lists', lists);
            }
            else {
                if (this.network.type === 'NONE') {
                    this.localStorage.setToLocal('lists', lists);
                }
                else {
                    this.cloudStorage.uploadListsData(lists, userProfile.uid);
                    this.localStorage.setToLocal('lists', lists);
                }
            }
        }
        else {
            this.localStorage.setToLocal('lists', lists);
        }
    };
    /**
     * Recover favorites lists data
     *
     * @param {*} userProfile
     * @returns {*}
     * @memberof ListsProvider
     */
    ListsProvider.prototype.getFavoritesListsData = function (userProfile) {
        var _this = this;
        return new Promise(function (resolve) {
            if (userProfile) {
                if ((_this.plt.is('android') || _this.plt.is('ios')) && !_this.plt.is('mobileweb')) {
                    _this.cloudStorage
                        .loadFavoritesListsData(userProfile.uid)
                        .then(function (data) {
                        if (data !== undefined && data !== null) {
                            _this.localStorage.setToLocal('favorites', data);
                            resolve(data);
                        }
                        else {
                            _this.localStorage.getFromLocal('favorites', null).then(function (data) {
                                if (data !== undefined && data !== null) {
                                    resolve(data);
                                }
                                else {
                                    resolve([]);
                                }
                            });
                        }
                    });
                }
                else {
                    if (_this.network.type === 'NONE') {
                        _this.localStorage.getFromLocal('favorites', null).then(function (data) {
                            if (data !== undefined && data !== null) {
                                resolve(data);
                            }
                            else {
                                resolve([]);
                            }
                        });
                    }
                    else {
                        _this.cloudStorage
                            .loadFavoritesListsData(userProfile.uid)
                            .then(function (data) {
                            if (data !== undefined && data !== null) {
                                _this.localStorage.setToLocal('favorites', data);
                                resolve(data);
                            }
                            else {
                                _this.localStorage
                                    .getFromLocal('favorites', null)
                                    .then(function (data) {
                                    if (data !== undefined && data !== null) {
                                        resolve(data);
                                    }
                                    else {
                                        resolve([]);
                                    }
                                });
                            }
                        });
                    }
                }
            }
            else {
                _this.localStorage.getFromLocal('favorites', null).then(function (data) {
                    if (data !== undefined && data !== null) {
                        resolve(data);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
        });
    };
    /**
     * Recover lists data
     *
     * @param {*} userProfile
     * @returns {*}
     * @memberof ListsProvider
     */
    ListsProvider.prototype.getListsData = function (userProfile) {
        var _this = this;
        return new Promise(function (resolve) {
            if (userProfile) {
                if ((_this.plt.is('android') || _this.plt.is('ios')) && !_this.plt.is('mobileweb')) {
                    _this.cloudStorage.loadListsData(userProfile.uid).then(function (data) {
                        if (data !== undefined && data !== null) {
                            _this.localStorage.setToLocal('lists', data);
                            resolve(data);
                        }
                        else {
                            _this.localStorage.getFromLocal('lists', null).then(function (data) {
                                if (data !== undefined && data !== null) {
                                    resolve(data);
                                }
                                else {
                                    resolve([]);
                                }
                            });
                        }
                    });
                }
                else {
                    if (_this.network.type === 'NONE') {
                        _this.localStorage.getFromLocal('lists', null).then(function (data) {
                            if (data !== undefined && data !== null) {
                                resolve(data);
                            }
                            else {
                                resolve([]);
                            }
                        });
                    }
                    else {
                        _this.cloudStorage.loadListsData(userProfile.uid).then(function (data) {
                            if (data !== undefined && data !== null) {
                                _this.localStorage.setToLocal('lists', data);
                                resolve(data);
                            }
                            else {
                                _this.localStorage.getFromLocal('lists', null).then(function (data) {
                                    if (data !== undefined && data !== null) {
                                        resolve(data);
                                    }
                                    else {
                                        resolve([]);
                                    }
                                });
                            }
                        });
                    }
                }
            }
            else {
                _this.localStorage.getFromLocal('lists', null).then(function (data) {
                    if (data !== undefined && data !== null) {
                        resolve(data);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
        });
    };
    /**
     * Recover old version app lists data
     *
     * @returns {*}
     * @memberof ListsProvider
     */
    ListsProvider.prototype.getOldLists = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.localStorage.getFromLocal('listas', null).then(function (data) {
                _this.log.logs[_this.constructor.name].info('OldData:' + JSON.stringify(data));
                if (data !== undefined && data !== null) {
                    _this.localStorage.getFromLocal('lists', _this.path).then(function (result) {
                        if (data.length === 0) {
                            data = result;
                        }
                        else {
                            data.forEach(function (item) {
                                switch (item.colorBotones) {
                                    case 'button-dark':
                                        item.colorLista = 'black-list';
                                        item.colorBotones = 'white-buttons';
                                        break;
                                    case 'button-royal':
                                        item.colorLista = 'purple-list';
                                        item.colorBotones = 'black-buttons';
                                        break;
                                    case 'button-balanced':
                                        item.colorLista = 'green-list';
                                        item.colorBotones = 'black-buttons';
                                        break;
                                    case 'button-positive':
                                        item.colorLista = 'grey-list';
                                        item.colorBotones = 'black-buttons';
                                        break;
                                    case 'button-energized':
                                        item.colorLista = 'yellow-list';
                                        item.colorBotones = 'black-buttons';
                                        break;
                                    default:
                                        item.colorLista = 'white-list';
                                        item.colorBotones = 'black-buttons';
                                        break;
                                }
                            });
                        }
                        _this.localStorage.setToLocal('lists', data);
                        resolve(data);
                    });
                }
                else {
                    _this.localStorage.getFromLocal('lists', _this.path).then(function (result) {
                        _this.localStorage.setToLocal('lists', result);
                        resolve(result);
                    });
                }
            });
        });
    };
    ListsProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__data_cloudStorage__["a" /* CloudStorage */],
            __WEBPACK_IMPORTED_MODULE_3__data_localStorage__["a" /* LocalStorage */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_5__log_log__["a" /* Log */]])
    ], ListsProvider);
    return ListsProvider;
}());

//# sourceMappingURL=lists-provider.js.map

/***/ }),

/***/ 588:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemsNeededComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pipes_pipefilterElements__ = __webpack_require__(589);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Component to show and manage items needed to shop on the dashboard
 *
 * @export
 * @class ItemsNeededComponent
 */
var ItemsNeededComponent = /** @class */ (function () {
    function ItemsNeededComponent(globalVars, view, filterElements, log) {
        this.globalVars = globalVars;
        this.view = view;
        this.filterElements = filterElements;
        this.log = log;
        this.list = [];
        this.shoppingList = [];
        this.log.setLogger(this.constructor.name);
    }
    ItemsNeededComponent.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.initializeItems();
        this.globalVars.getListData('LISTA_COMPRA').then(function (data) {
            _this.shoppingList = data;
        });
    };
    ItemsNeededComponent.prototype.initializeItems = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('initializeItems');
        this.globalVars.getItemsData().then(function (data) {
            var items = data;
            _this.globalVars.getListsData().then(function (data) {
                var lists = data;
                var itemsOnLists = [];
                lists.forEach(function (element) {
                    _this.globalVars.getListData(element.nombreLista).then(function (data) {
                        data.forEach(function (item) {
                            itemsOnLists.push(item);
                        });
                        items.forEach(function (item, index) {
                            var auxItem = item;
                            if (itemsOnLists.filter(function (itemOnList) {
                                return itemOnList.nombreElemento === item.nombreElemento;
                            }).length <= 0) {
                                if (_this.list.filter(function (listItem) {
                                    return listItem.nombreElemento === auxItem.nombreElemento;
                                }).length <= 0) {
                                    _this.list.push(auxItem);
                                }
                            }
                        });
                    });
                });
            });
        });
    };
    /**
     * Close modal discarding data
     *
     * @memberof ItemsBestBeforeComponent
     */
    ItemsNeededComponent.prototype.close = function () {
        this.view.dismiss();
    };
    /**
     * Add items to shopping list, from needed to shop
     *
     * @memberof DashboardPage
     */
    ItemsNeededComponent.prototype.addItemsToShoppingList = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('addItemsToShoppingList');
        this.list.forEach(function (item, index) {
            var newItem = {
                category: item.category,
                nombreElemento: item.nombreElemento,
                colorElemento: '',
                colorBotones: '',
                nombreLista: 'LISTA_COMPRA',
                cantidadElemento: 1,
                caduca: false,
                fechaCaducidad: null,
                cantidadMinima: 1,
                marked: false
            };
            _this.shoppingList.push(newItem);
            _this.globalVars.setListData('LISTA_COMPRA', _this.shoppingList);
            _this.list = _this.list.filter(function (aux) { return aux.nombreElemento !== item.nombreElemento; });
        });
        this.view.dismiss();
    };
    ItemsNeededComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
            selector: 'items-needed-component',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/items-needed-component/items-needed-component.html"*/'<ion-header>\n	<ion-toolbar dark>\n		<ion-title>\n      {{ \'ElementosNecesariosComprar\' | translate }}\n		</ion-title>\n		<ion-buttons end>\n			<button (click)="addItemsToShoppingList()" *ngIf="list.length>0">\n				<ion-icon ios="ios-cart" md="md-cart"></ion-icon>\n			</button>\n			<button (click)="close()">\n				<ion-icon ios="ios-close" md="md-close"></ion-icon>\n			</button>\n		</ion-buttons>\n	</ion-toolbar>\n</ion-header>\n\n<div class="list" *ngIf="list.length===0">\n	<ion-list inset>\n		<div>\n			<ion-card>\n        {{ \'ElementosNecesariosComprar\' | translate }}\n			</ion-card>\n		</div>\n	</ion-list>\n\n</div>\n\n<div class="list" *ngIf="list.length>0">\n	<ion-list inset>\n\n		<div *ngFor="let itemData of list; let i = index">\n			<ion-card>\n				<ion-card-header>\n					<ion-row class="fila">\n						<ion-col col-8>\n							<ion-label class="nameElement">{{itemData.nombreElemento}}</ion-label>\n						</ion-col>\n\n						<ion-col col-4>\n							<ion-item>\n								<ion-avatar item-left class="category-icon">\n									<img class="icon" src="{{itemData.category.icon}}" />\n									<h2 *ngIf="creating" class="labelCategory">{{itemData.category.categoryName}}</h2>\n								</ion-avatar>\n							</ion-item>\n						</ion-col>\n					</ion-row>\n				</ion-card-header>\n			</ion-card>\n		</div>\n	</ion-list>\n</div>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/items-needed-component/items-needed-component.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__pipes_pipefilterElements__["a" /* PipeFilterElements */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_3__pipes_pipefilterElements__["a" /* PipeFilterElements */],
            __WEBPACK_IMPORTED_MODULE_4__providers_log_log__["a" /* Log */]])
    ], ItemsNeededComponent);
    return ItemsNeededComponent;
}());

//# sourceMappingURL=items-needed-component.js.map

/***/ }),

/***/ 589:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PipeFilterElements; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Pipe to filter elements on a list
 *
 * @export
 * @class PipeFilterElements
 * @implements {PipeTransform}
 */
var PipeFilterElements = /** @class */ (function () {
    function PipeFilterElements() {
    }
    PipeFilterElements.prototype.transform = function (value, args) {
        var aux = [];
        value.forEach(function (dataValue) {
            if (dataValue.nombreElemento && args) {
                if (dataValue.nombreElemento.toLowerCase() === args.toLowerCase())
                    aux.push({
                        nombreLista: dataValue.nombreLista,
                        cantidadElemento: dataValue.cantidadElemento
                    });
            }
        });
        return aux;
    };
    PipeFilterElements = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Pipe */])({
            name: 'pipefilterElements'
        }),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])()
    ], PipeFilterElements);
    return PipeFilterElements;
}());

//# sourceMappingURL=pipefilterElements.js.map

/***/ }),

/***/ 590:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListIconsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Component to show a list of icons to choose, on a modal window
 *
 * @export
 * @class ListIconsPage
 */
var ListIconsPage = /** @class */ (function () {
    function ListIconsPage(nav, view, params, translate) {
        this.nav = nav;
        this.view = view;
        this.params = params;
        this.translate = translate;
    }
    ListIconsPage.prototype.ngOnInit = function () {
        this.icons = this.params.get('icons');
        this.selectedIcon = '';
    };
    /**
     * Selected icon event
     *
     * @param {any} event
     * @param {any} icon
     * @memberof ListIconsPage
     */
    ListIconsPage.prototype.selected = function (event, icon) {
        this.selectedIcon = icon;
        this.view.dismiss(this.selectedIcon);
    };
    /**
     * Close modal window
     *
     * @memberof ListIconsPage
     */
    ListIconsPage.prototype.close = function () {
        this.view.dismiss();
    };
    ListIconsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/icons/list-icons.html"*/'<ion-header>\n  <ion-toolbar dark>\n      <ion-title>\n          {{ \'SeleccionaIcono\' | translate }}\n      </ion-title>\n      <ion-buttons end>\n          <button (click)="close()"><ion-icon class="icon-toolbar" ios="ios-close" md="md-close"></ion-icon></button>\n      </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n\n  <button full small ion-button class="button-icon-search" (click)="selected($event,\'\')"><ion-icon ios="ios-search" md="md-search"></ion-icon></button>\n\n  <ion-row class="icon-row">\n    <ion-col *ngFor="let icon of icons" class="icon-col">\n      <img class="icon-img" src="{{icon.src}}" (click)="selected($event,icon)"/>\n    </ion-col>\n  </ion-row>\n</ion-content>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/icons/list-icons.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__["c" /* TranslateService */]])
    ], ListIconsPage);
    return ListIconsPage;
}());

//# sourceMappingURL=list-icons.js.map

/***/ }),

/***/ 591:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_app_version__ = __webpack_require__(411);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Page to show data about the author, the app, tutorials and a contact form
 *
 * @export
 * @class AboutPage
 */
var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl, appVersion, plt, formBuilder, http, toastCtrl, log, translate) {
        this.navCtrl = navCtrl;
        this.appVersion = appVersion;
        this.plt = plt;
        this.formBuilder = formBuilder;
        this.http = http;
        this.toastCtrl = toastCtrl;
        this.log = log;
        this.translate = translate;
        this.version = '';
        this.submitAttempt = false;
        this.messageRows = 10;
        this.log.setLogger(this.constructor.name);
        this.contactForm = formBuilder.group({
            name: [
                '',
                __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].compose([
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].maxLength(30),
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].pattern('[a-zA-Z ]*'),
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required
                ])
            ],
            email: [
                '',
                __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].compose([
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].pattern("[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*")
                ])
            ],
            message: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required])],
            logs: ['']
        });
    }
    AboutPage.prototype.save = function () {
        var _this = this;
        this.contactForm
            .get('logs')
            .setValue(JSON.stringify(this.log.getLogMessages()));
        if (this.contactForm.valid) {
            this.http
                .post('https://us-central1-alacena-58699.cloudfunctions.net/mail', 
            //'http://localhost:5000/alacena-58699/us-central1/mail',
            JSON.stringify(this.contactForm.value))
                .subscribe(function (data) {
                if (data.status === 200) {
                    _this.log.logs[_this.constructor.name].info('Message sent');
                    var toast = _this.toastCtrl.create({
                        message: data['_body'],
                        duration: 1000,
                        position: 'bottom'
                    });
                    toast.present();
                }
                else {
                    _this.log.logs[_this.constructor.name].error('Message not sent');
                    var toast = _this.toastCtrl.create({
                        message: data['_body'] + ", try again later",
                        duration: 1000,
                        position: 'bottom'
                    });
                    toast.present();
                }
            });
        }
        else {
            this.log.logs[this.constructor.name].warn('Form not valid');
            this.submitAttempt = true;
        }
    };
    AboutPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
            this.log.logs[this.constructor.name].info('On Device:' + this.plt.platforms());
            this.appVersion.getVersionNumber().then(function (version) {
                _this.version = version;
                _this.appVersion.getVersionCode().then(function (code) {
                    _this.version += ' : ' + code;
                });
            });
        }
        else {
            this.log.logs[this.constructor.name].info('On Browser:' + this.plt.userAgent());
            this.version = 'browser';
        }
    };
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-about-page',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/about-page/about-page.html"*/'<ion-header>\n  <ion-navbar color="dark">\n    <button ion-button menuToggle>\n      <ion-icon ios="ios-menu" md="md-menu"></ion-icon>\n    </button>\n    <ion-title>{{ \'Acerca\' | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding class="about">\n  <ion-card>\n    <ion-card-header>\n      <h2>{{ \'Alacena\' | translate }} : {{version}}</h2>\n      <p>{{ \'Desarrollado\' | translate }} Chony Apps Develop</p>\n    </ion-card-header>\n    <ion-card-content>\n      <p>\n        {{ \'Description1\' | translate }}\n      </p>\n      <p>\n        {{ \'Description2\' | translate }}\n      </p>\n    </ion-card-content>\n  </ion-card>\n  <ion-card>\n    <ion-item *ngIf="submitAttempt">\n      <p style="color: #ea6153;">{{ \'RellenaCamposContacto\' | translate }}</p>\n    </ion-item>\n\n\n    <ion-list no-lines>\n\n      <form [formGroup]="contactForm" (ngSubmit)="save()">\n\n        <ion-item>\n          <ion-label floating>{{ \'Nombre\' | translate }}</ion-label>\n          <ion-input formControlName="name" type="text"></ion-input>\n        </ion-item>\n\n        <ion-item>\n          <ion-label floating>{{ \'Email\' | translate }}</ion-label>\n          <ion-input formControlName="email" type="email"></ion-input>\n        </ion-item>\n\n        <ion-item>\n          <ion-label floating>{{ \'Mensaje\' | translate }}</ion-label>\n          <ion-textarea formControlName="message" type="text" [attr.rows]="messageRows"></ion-textarea>\n        </ion-item>\n\n      </form>\n\n    </ion-list>\n\n    <ion-item>\n      <button ion-button block round outline color="dark" (click)="save()">{{ \'Enviar\' | translate }} {{ \'Mensaje\' | translate }}</button>\n\n    </ion-item>\n\n\n\n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/about-page/about-page.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_app_version__["a" /* AppVersion */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_6__providers_log_log__["a" /* Log */],
            __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about-page.js.map

/***/ }),

/***/ 592:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_backup_data_backup_data__ = __webpack_require__(593);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Page to manage, create and remove local data backup
 *
 * @export
 * @class BackupPage
 */
var BackupPage = /** @class */ (function () {
    function BackupPage(alertCtrl, navCtrl, navParams, log, backup, translate) {
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.log = log;
        this.backup = backup;
        this.translate = translate;
        this.backupList = [];
        this.log.setLogger(this.constructor.name);
    }
    BackupPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('ionViewDidLoad');
        this.backup.getBackupList().then(function (data) {
            data.forEach(function (element) {
                _this.backupList.push(element.name);
            });
        });
    };
    BackupPage.prototype.makeBackup = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('makeBackup');
        this.backup.makeBackup().then(function (data) {
            _this.log.logs[_this.constructor.name].info("Backup saved");
        });
    };
    BackupPage.prototype.retrieveBackup = function (backup) {
        var _this = this;
        this.log.logs[this.constructor.name].info('retrieveBackup');
        var retrieve = this.alertCtrl.create();
        retrieve.setTitle(this.translate.instant('Recuperando', { value: backup }));
        retrieve.addButton(this.translate.instant('Descartar'));
        retrieve.addButton({
            text: this.translate.instant('Recuperar'),
            handler: function (result) {
                _this.backup.getBackup(backup).then(function (data) {
                    _this.log.logs[_this.constructor.name].info(_this.translate.instant('Recuperado', { value: backup }));
                });
            }
        });
        retrieve.present();
    };
    BackupPage.prototype.removeBackup = function (backup) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeBackup');
        var remove = this.alertCtrl.create();
        remove.setTitle(this.translate.instant('Borrando', { value: backup }));
        remove.addButton(this.translate.instant('Descartar'));
        remove.addButton({
            text: this.translate.instant('Borrar'),
            handler: function (result) {
                _this.backup.removeBackup(backup).then(function (data) {
                    _this.log.logs[_this.constructor.name].info("Backup " + backup + " removed");
                });
            }
        });
        remove.present();
    };
    BackupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
            selector: 'page-backup-page',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/backup-page/backup-page.html"*/'<ion-header>\n  <ion-navbar color="dark">\n    <button ion-button menuToggle>\n      <ion-icon ios="ios-menu" md="md-menu"></ion-icon>\n    </button>\n    <ion-title>{{ \'Backup\' | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding class="backup">\n  <ion-item>\n    <button ion-button block round outline color="dark" (click)="makeBackup()">{{ \'CrearNuevoBackup\' | translate }}</button>\n\n  </ion-item>\n\n\n  <ion-list inset>\n    <ion-item ion-item *ngFor="let backup of backupList; let i = index">\n      <p>\n        <button class="buttonOperation" item-center primary large clear (click)="retrieveBackup(backup)">\n          <ion-icon ios="ios-disc" md="md-disc"></ion-icon>\n        </button>\n        {{backup}}\n        <button class="buttonOperation" item-center primary large clear (click)="removeBackup(backup)">\n          <ion-icon ios="ios-basket" md="md-basket"></ion-icon>\n        </button>\n      </p>\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/backup-page/backup-page.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_4__providers_log_log__["a" /* Log */],
            __WEBPACK_IMPORTED_MODULE_0__providers_backup_data_backup_data__["a" /* BackupData */],
            __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */]])
    ], BackupPage);
    return BackupPage;
}());

//# sourceMappingURL=backup-page.js.map

/***/ }),

/***/ 593:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackupData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reminders_provider__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__log_log__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__data_localStorage__ = __webpack_require__(54);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










/**
 * Service to manage backup local data for the user
 *
 * @export
 * @class BackupData
 */
var BackupData = /** @class */ (function () {
    function BackupData(http, log, file, global, local, reminders, plt) {
        this.http = http;
        this.log = log;
        this.file = file;
        this.global = global;
        this.local = local;
        this.reminders = reminders;
        this.plt = plt;
        this.log.setLogger(this.constructor.name);
    }
    BackupData.prototype.getBackupList = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('getBackupList');
        return new Promise(function (resolve) {
            _this.plt.ready().then(function () {
                _this.file
                    .listDir(_this.file.dataDirectory + '/', 'backups')
                    .then(function (files) {
                    resolve([{ name: 'uno' }]);
                });
            });
        });
    };
    BackupData.prototype.removeBackup = function (backup) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeBackup:' + backup);
        return new Promise(function (resolve) {
            _this.file
                .removeDir(_this.file.dataDirectory + '/backups/', backup)
                .then(function (success) {
                return _this.log.logs[_this.constructor.name].info('removeBackup:' + success);
            })
                .catch(function (err) {
                _this.log.logs[_this.constructor.name].error('removeBackup:' + err);
            });
        });
    };
    BackupData.prototype.getBackup = function (backup) {
        var _this = this;
        this.log.logs[this.constructor.name].info('getBackup:' + backup);
        return new Promise(function (resolve) {
            _this.file
                .listDir(_this.file.dataDirectory + '/backups/', backup)
                .then(function (files) {
                files.forEach(function (file) {
                    _this.log.logs[_this.constructor.name].info('name:' + file.name);
                    _this.log.logs[_this.constructor.name].info('path:' +
                        _this.file.dataDirectory +
                        '/backups/' +
                        backup +
                        '/' +
                        file.name);
                    _this.file
                        .checkFile(_this.file.dataDirectory + '/backups/' + backup + '/', file.name)
                        .then(function (success) {
                        _this.file
                            .readAsText(_this.file.dataDirectory + '/backups/' + backup + '/', file.name)
                            .then(function (response) {
                            if (file.name == 'Elementos.json') {
                                _this.global.setItemsData(JSON.parse(response));
                            }
                            else if (file.name == 'Categories.json') {
                                _this.global.setCategoriesData(JSON.parse(response));
                            }
                            else if (file.name == 'Configuracion.json') {
                                _this.global.setConfigData(JSON.parse(response));
                            }
                            else if (file.name == 'Listas.json') {
                                _this.global.setListsData(JSON.parse(response));
                            }
                            else if (file.name == 'Reminders.json') {
                                JSON.parse(response).forEach(function (reminder) {
                                    _this.reminders.setReminder(reminder);
                                });
                            }
                            else {
                                _this.global.setListData(file.name.replace('.json', ''), JSON.parse(response));
                            }
                        })
                            .catch(function (err) {
                            _this.log.logs[_this.constructor.name].error('readAsText:' + err);
                        });
                    })
                        .catch(function (err) {
                        _this.log.logs[_this.constructor.name].error('checkfile:' + err);
                    });
                });
                resolve();
            })
                .catch(function (err) {
                _this.log.logs[_this.constructor.name].error('listDir:' + err);
                resolve();
            });
        });
    };
    BackupData.prototype.backup = function (day, dayFolder) {
        var _this = this;
        this.local
            .getFromLocal('lists', null)
            .then(function (lists) {
            _this.file
                .createFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Lists.json', true)
                .then(function (success) {
                _this.file
                    .writeFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Lists.json', JSON.stringify(lists))
                    .then(function (written) {
                    _this.log.logs[_this.constructor.name].info("File Lists written");
                })
                    .catch(function (err) {
                    _this.log.logs[_this.constructor.name].error('backup:writeFile:' + err);
                });
            })
                .catch(function (err) {
                _this.log.logs[_this.constructor.name].error('backup:createFile:' + err);
            });
            lists.forEach(function (list) {
                _this.local
                    .getFromLocal(list.nombreLista, null)
                    .then(function (itemsOnList) {
                    _this.file
                        .createFile(_this.file.dataDirectory +
                        '/backups/backup_' +
                        dayFolder +
                        '/', list.nombreLista + '.json', true)
                        .then(function (success) {
                        _this.file
                            .writeFile(_this.file.dataDirectory +
                            '/backups/backup_' +
                            dayFolder +
                            '/', list.nombreLista + '.json', JSON.stringify(itemsOnList))
                            .then(function (written) {
                            _this.log.logs[_this.constructor.name].info("File " + list.nombreLista + " written");
                        })
                            .catch(function (err) {
                            _this.log.logs[_this.constructor.name].error('backup:writeFile:' + err);
                        });
                    })
                        .catch(function (err) {
                        _this.log.logs[_this.constructor.name].error('backup:createFile:' + err);
                    });
                })
                    .catch(function (err) {
                    _this.log.logs[_this.constructor.name].error('backup:getFromLocal:' + err);
                });
            });
        })
            .catch(function (err) {
            _this.log.logs[_this.constructor.name].error('backup:getFromLocal:lists:' + err);
        });
        this.local
            .getFromLocal('items', null)
            .then(function (itemsOnItems) {
            _this.file
                .createFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Elementos.json', true)
                .then(function (success) {
                _this.file
                    .writeFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Elementos.json', JSON.stringify(itemsOnItems))
                    .then(function (written) {
                    _this.log.logs[_this.constructor.name].info("File Elementos written");
                })
                    .catch(function (err) {
                    _this.log.logs[_this.constructor.name].error('backup:writeFile:' + err);
                });
            })
                .catch(function (err) {
                _this.log.logs[_this.constructor.name].error('backup:createFile:' + err);
            });
        })
            .catch(function (err) {
            _this.log.logs[_this.constructor.name].error('backup:getFromLocal:items:' + err);
        });
        this.local
            .getFromLocal('favorites', null)
            .then(function (favorites) {
            _this.file
                .createFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Favoritos.json', true)
                .then(function (success) {
                _this.file
                    .writeFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Favoritos.json', JSON.stringify(favorites))
                    .then(function (written) {
                    _this.log.logs[_this.constructor.name].info("File Favoritos written");
                })
                    .catch(function (err) {
                    _this.log.logs[_this.constructor.name].error('backup:writeFile:' + err);
                });
            })
                .catch(function (err) {
                _this.log.logs[_this.constructor.name].error('backup:createFile:' + err);
            });
        })
            .catch(function (err) {
            _this.log.logs[_this.constructor.name].error('backup:getFromLocal:favorites:' + err);
        });
        this.local
            .getFromLocal('config', null)
            .then(function (configData) {
            _this.file
                .createFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Configuracion.json', true)
                .then(function (success) {
                _this.file
                    .writeFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Configuracion.json', JSON.stringify(configData))
                    .then(function (written) {
                    _this.log.logs[_this.constructor.name].info("File Configuracion written");
                })
                    .catch(function (err) {
                    _this.log.logs[_this.constructor.name].error('backup:writeFile:' + err);
                });
            })
                .catch(function (err) {
                _this.log.logs[_this.constructor.name].error('backup:createFile:' + err);
            });
        })
            .catch(function (err) {
            _this.log.logs[_this.constructor.name].error('backup:getFromLocal:config:' + err);
        });
        this.local
            .getFromLocal('categories', null)
            .then(function (categories) {
            _this.file
                .createFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Categories.json', true)
                .then(function (success) {
                _this.file
                    .writeFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Categories.json', JSON.stringify(categories))
                    .then(function (written) {
                    _this.log.logs[_this.constructor.name].info("File Categories written");
                })
                    .catch(function (err) {
                    _this.log.logs[_this.constructor.name].error('backup:writeFile:' + err);
                });
            })
                .catch(function (err) {
                _this.log.logs[_this.constructor.name].error('backup:createFile:' + err);
            });
        })
            .catch(function (err) {
            _this.log.logs[_this.constructor.name].error('backup:getFromLocal:categories:' + err);
        });
        this.local
            .getFromLocal('reminders', null)
            .then(function (reminders) {
            _this.file
                .createFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Reminders.json', true)
                .then(function (success) {
                _this.file
                    .writeFile(_this.file.dataDirectory + '/backups/backup_' + dayFolder + '/', 'Reminders.json', JSON.stringify(reminders))
                    .then(function (written) {
                    _this.log.logs[_this.constructor.name].info("File Reminders written");
                })
                    .catch(function (err) {
                    _this.log.logs[_this.constructor.name].error('backup:writeFile:' + err);
                });
            })
                .catch(function (err) {
                _this.log.logs[_this.constructor.name].error('backup:createFile:' + err);
            });
        })
            .catch(function (err) {
            _this.log.logs[_this.constructor.name].error('backup:getFromLocal:reminders:' + err);
        });
    };
    BackupData.prototype.makeBackup = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('getBackupList');
        var day = __WEBPACK_IMPORTED_MODULE_7_moment__().format('YYYY-MM-DD HH:mm:ss');
        var dayFolder = __WEBPACK_IMPORTED_MODULE_7_moment__().format('YYYY-MM-DD_HH-mm-ss');
        return new Promise(function (resolve) {
            _this.file
                .checkDir(_this.file.dataDirectory + '/', 'backups')
                .then(function (success) {
                _this.file
                    .checkDir(_this.file.dataDirectory + '/backups/', 'backup_' + dayFolder)
                    .then(function (success) {
                    _this.backup(day, dayFolder);
                    resolve();
                })
                    .catch(function (err) {
                    _this.file
                        .createDir(_this.file.dataDirectory + '/backups/', 'backup_' + dayFolder, false)
                        .then(function (success) {
                        _this.backup(day, dayFolder);
                        resolve();
                    })
                        .catch(function (err) {
                        _this.log.logs[_this.constructor.name].error('createDir:' + err);
                        resolve();
                    });
                });
            })
                .catch(function (err) {
                _this.log.logs[_this.constructor.name].error('checkdir:' + err);
                resolve();
            });
        });
    };
    BackupData = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_5__log_log__["a" /* Log */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__["a" /* File */],
            __WEBPACK_IMPORTED_MODULE_1__global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_9__data_localStorage__["a" /* LocalStorage */],
            __WEBPACK_IMPORTED_MODULE_0__reminders_provider__["a" /* RemindersProvider */],
            __WEBPACK_IMPORTED_MODULE_8_ionic_angular__["k" /* Platform */]])
    ], BackupData);
    return BackupData;
}());

//# sourceMappingURL=backup-data.js.map

/***/ }),

/***/ 594:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategorysPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pipes_orderBy__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_categories_categoriesService__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_category_info_category_info__ = __webpack_require__(595);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
 * Page to manage custom categories by the user
 *
 * @export
 * @class CategorysPage
 */
var CategorysPage = /** @class */ (function () {
    function CategorysPage(navCtrl, mod, alertCtrl, catService, globalVars, order, toastCtrl, log, translate) {
        this.navCtrl = navCtrl;
        this.mod = mod;
        this.alertCtrl = alertCtrl;
        this.catService = catService;
        this.globalVars = globalVars;
        this.order = order;
        this.toastCtrl = toastCtrl;
        this.log = log;
        this.translate = translate;
        this.categories = [];
        this.type = 'Categories';
        this.orderSelected = 1;
        this.log.setLogger(this.constructor.name);
    }
    CategorysPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('ionViewDidLoad');
        this.searchBar = false;
        this.globalVars.getDefaulIconsData().then(function (data) {
            _this.icons = data;
        });
        this.globalVars.getConfigData().then(function (data) {
            _this.measurement = data.unitDefault;
            _this.unitStep = data.stepDefault;
        });
        this.initializeCategories(null);
    };
    /**
     * Initialize data when open or search categories
     *
     * @param {string} filter
     * @memberof CategorysPage
     */
    CategorysPage.prototype.initializeCategories = function (filter) {
        var _this = this;
        this.log.logs[this.constructor.name].info('initializeCategories:' + filter);
        this.globalVars.getCategoriesData().then(function (data) {
            _this.categories = data;
            _this.sortItems(_this.orderSelected);
            if (filter) {
                _this.categories = _this.categories.filter(function (item) {
                    return (item.categoryName
                        .toLowerCase()
                        .indexOf(_this.searchCategory.toLowerCase()) > -1);
                });
            }
        });
    };
    /**
     * Event on search input filled
     *
     * @param {any} event
     * @memberof CategorysPage
     */
    CategorysPage.prototype.searchMatches = function (event) {
        this.log.logs[this.constructor.name].info('searchMatches:' + event);
        if (this.searchCategory && this.searchCategory.trim() !== '') {
            this.initializeCategories(this.searchCategory);
        }
        else {
            this.initializeCategories(null);
        }
    };
    /**
     * Event to show or hide search bar
     *
     * @param {any} event
     * @memberof CategorysPage
     */
    CategorysPage.prototype.toggleSearchBar = function (event) {
        this.searchBar = !this.searchBar;
    };
    /**
     * Event to change the category icon
     *
     * @param {any} event
     * @param {any} category
     * @memberof CategorysPage
     */
    CategorysPage.prototype.changeCategoryIcon = function (event, category) {
        this.catService.changeCategoryIcon(category, this.icons);
    };
    /**
     * Event to sort items by a selected value
     *
     * @param {number} orderBy
     * @memberof CategorysPage
     */
    CategorysPage.prototype.sortItems = function (orderBy) {
        this.log.logs[this.constructor.name].info('sortItems:' + orderBy);
        this.orderSelected = orderBy;
        switch (orderBy) {
            case 1:
                this.categories = this.order.transform(this.categories, [
                    '+categoryName'
                ]);
                break;
            case 2:
                this.categories = this.order.transform(this.categories, [
                    '+measurement'
                ]);
                break;
            case 3:
                this.categories = this.order.transform(this.categories, ['+unitStep']);
                break;
        }
    };
    /**
     * Event to show options to sort items
     *
     * @param {any} event
     * @memberof CategorysPage
     */
    CategorysPage.prototype.reorder = function (event) {
        var _this = this;
        var reorder = this.alertCtrl.create();
        reorder.setTitle(this.translate.instant('Ordenar'));
        reorder.addInput({
            type: 'radio',
            label: this.translate.instant('Nombre'),
            value: '1',
            checked: this.orderSelected === 1
        });
        reorder.addInput({
            type: 'radio',
            label: this.translate.instant('Medida'),
            value: '2',
            checked: this.orderSelected === 2
        });
        reorder.addInput({
            type: 'radio',
            label: this.translate.instant('PasoMedida'),
            value: '3',
            checked: this.orderSelected === 3
        });
        reorder.addButton(this.translate.instant('Cancelar'));
        reorder.addButton({
            text: this.translate.instant('OK'),
            handler: function (data) {
                _this.sortItems(Number.parseInt(data));
            }
        });
        reorder.present();
    };
    /**
     * Event to delete a selected category
     *
     * @param {any} event
     * @param {Category} category
     * @memberof CategorysPage
     */
    CategorysPage.prototype.deleteCategory = function (event, category) {
        var _this = this;
        this.log.logs[this.constructor.name].info('deleteCategory:' + category);
        var confirm = this.alertCtrl.create({
            title: this.translate.instant('Borrando', { value: category.categoryName }),
            message: this.translate.instant('PreguntaBorrarElemento', { value: category.categoryName }),
            buttons: [
                {
                    text: this.translate.instant('No'),
                    handler: function () { }
                },
                {
                    text: this.translate.instant('Si'),
                    handler: function () {
                        _this.categories.splice(_this.categories.indexOf(category), 1);
                        _this.globalVars.setCategoriesData(_this.categories);
                    }
                }
            ]
        });
        confirm.present();
    };
    /**
     * Event to remove multiple categories
     *
     * @param {string[]} removed
     * @memberof CategorysPage
     */
    CategorysPage.prototype.removeElements = function (removed) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeElements:' + removed);
        removed.forEach(function (categoryRemoved) {
            _this.categories = _this.categories.filter(function (category) { return category.categoryName !== categoryRemoved; });
            _this.globalVars.setCategoriesData(_this.categories);
        });
    };
    /**
     * Event to add new category
     *
     * @param {any} event
     * @memberof CategorysPage
     */
    CategorysPage.prototype.addCategory = function (event) {
        var _this = this;
        this.log.logs[this.constructor.name].info('addCategory:' + event);
        var newCategory = {
            categoryName: this.translate.instant('NuevaCategoria'),
            icon: {
                src: 'assets/images/icons/default.png'
            },
            measurement: this.measurement,
            unitStep: this.unitStep
        };
        var categoryModal = this.mod.create(__WEBPACK_IMPORTED_MODULE_6__components_category_info_category_info__["a" /* CategoryInfoPage */], {
            newCategory: newCategory,
            editing: false,
            icons: this.icons
        });
        categoryModal.onDidDismiss(function (item) {
            if (item !== undefined) {
                if (_this.categories.filter(function (cat) {
                    return cat.categoryName.toLowerCase() === item.categoryName.toLowerCase();
                }).length === 0) {
                    _this.categories.push(item);
                    _this.globalVars.setCategoriesData(_this.categories);
                }
                else {
                    var toast = _this.toastCtrl.create({
                        message: _this.translate.instant('CategoriaExiste'),
                        duration: 1000,
                        position: 'bottom'
                    });
                    toast.present();
                }
            }
        });
        categoryModal.present();
    };
    /**
     * Even to edit a category
     *
     * @param {any} event
     * @param {Category} category
     * @memberof CategorysPage
     */
    CategorysPage.prototype.editCategory = function (event, category) {
        var _this = this;
        this.log.logs[this.constructor.name].info('editCategory:' + category);
        var oldCategory = category.categoryName;
        var edit = this.alertCtrl.create({
            title: this.translate.instant('Edit Category'),
            inputs: [
                {
                    name: 'nombreCategory',
                    value: oldCategory,
                    type: 'text',
                    placeholder: this.translate.instant('Nombre')
                }
            ],
            buttons: [
                {
                    text: this.translate.instant('Cancelar'),
                    role: 'cancel'
                },
                {
                    text: this.translate.instant('Confirmar'),
                    handler: function (data) {
                        category.categoryName = data.nombreCategory;
                        _this.globalVars.setCategoriesData(_this.categories);
                    }
                }
            ]
        });
        edit.present();
    };
    /**
     * Event to change unit step on measurement change
     *
     * @param {any} event
     * @param {Category} category
     * @memberof CategorysPage
     */
    CategorysPage.prototype.onMeasurementChange = function (event, category) {
        this.log.logs[this.constructor.name].info('onMeasurementChange:' + category);
        if (category.measurement === 'UNIDADES') {
            category.unitStep = 0.1;
        }
        else if (category.measurement === 'GRAMOS') {
            category.unitStep = 100;
        }
        else if (category.measurement === 'LITROS') {
            category.unitStep = 0.5;
        }
        else {
            category.unitStep = 0.5;
        }
    };
    CategorysPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-categorys-page',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/categorys-page/categorys-page.html"*/'<ion-header>\n	<ion-navbar color="dark" [hidden]="searchBar">\n		<button ion-button menuToggle>\n			<ion-icon ios="ios-menu" md="md-menu"></ion-icon>\n		</button>\n		<ion-title>{{ \'Categorias\' | translate }}</ion-title>\n		<ion-buttons end>\n			<button (click)="reorder($event)">\n				<ion-icon ion-button secondary class="reorderAllowed icon-toolbar" *ngIf="reorderAllowed" ios="ios-repeat" md="md-repeat"></ion-icon>\n				<ion-icon ion-button secondary class="reorderNotAllowed icon-toolbar" *ngIf="!reorderAllowed" ios="ios-repeat" md="md-repeat"></ion-icon>\n			</button>\n			<button ion-button secondary (click)="toggleSearchBar($event)">\n				<ion-icon class="icon-toolbar" ios="ios-search" md="md-search"></ion-icon>\n			</button>\n		</ion-buttons>\n	</ion-navbar>\n	<ion-searchbar [hidden]="!searchBar" [(ngModel)]="searchCategory" [showCancelButton]="true"\n                  [debounce]=500 [autocomplete]="true"\n                  (ionInput)="searchMatches($event)" (ionCancel)="toggleSearchBar($event)">\n	</ion-searchbar>\n</ion-header>\n\n<ion-content padding class="categories">\n	<ion-list>\n		<ion-card *ngFor="let category of categories; let i = index">\n			<ion-card-header>\n				<ion-row>\n					<ion-col width-50>\n						<ion-avatar item-left class="category-icon">\n							<img class="icon" src="{{category.icon.src}}" (click)="changeCategoryIcon($event, category)" />\n						</ion-avatar>\n					</ion-col>\n					<ion-col width-15>\n						<button item-center secondary clear (click)="editCategory($event,category)" class="buttonOperation">\n							<ion-icon ios="ios-create" md="md-create"></ion-icon>\n						</button>\n					</ion-col>\n					<ion-col width-15>\n						<button class="removeCategoryButton" item-center danger large clear (click)="deleteCategory($event, category)">\n							<ion-icon ios="ios-trash" md="md-trash"></ion-icon>\n						</button>\n					</ion-col>\n				</ion-row>\n        <ion-row>\n					<ion-col width-50>\n						<ion-item>\n							<ion-select readonly="true" class="categoryMeasurement" id="measurement" [(ngModel)]="category.measurement" (ngModelChange)="onMeasurementChange($event,category)">\n                <ion-option value="UNIDADES">{{ \'Unidades\' | translate }}</ion-option>\n                <ion-option value="GRAMOS">{{ \'Gramos\' | translate }}</ion-option>\n                <ion-option value="KILOS">{{ \'Kilos\' | translate }}</ion-option>\n                <ion-option value="LITROS">{{ \'Litros\' | translate }}</ion-option>\n							</ion-select>\n						</ion-item>\n					</ion-col>\n					<ion-col width-25>\n						<ion-item readonly="true" class="measurementUnitStep">\n							<ion-label stacked>{{ \'PasoMedida\' | translate }}</ion-label>\n							<ion-input text-right [(ngModel)]="category.unitStep" min="1" type="number"></ion-input>\n						</ion-item>\n					</ion-col>\n        </ion-row>\n        <ion-row>\n            <ion-input readonly="true" class="categoryName" type="text" [(ngModel)]="category.categoryName">\n            </ion-input>\n        </ion-row>\n			</ion-card-header>\n		</ion-card>\n	</ion-list>\n</ion-content>\n<ion-footer>\n	<bottom-buttons-component [type]="type" [object]="categories" [add]=true [remove]=true [notifications]=false [favorites]=false\n	 (finishedAdd)="addCategory($event)" (finishedRemoved)="removeElements($event,category)">\n	</bottom-buttons-component>\n</ion-footer>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/categorys-page/categorys-page.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__pipes_orderBy__["a" /* OrderBy */], __WEBPACK_IMPORTED_MODULE_4__providers_categories_categoriesService__["a" /* CategoriesService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_categories_categoriesService__["a" /* CategoriesService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_3__pipes_orderBy__["a" /* OrderBy */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_7__providers_log_log__["a" /* Log */],
            __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__["c" /* TranslateService */]])
    ], CategorysPage);
    return CategorysPage;
}());

//# sourceMappingURL=categorys-page.js.map

/***/ }),

/***/ 595:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoryInfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_categories_categoriesService__ = __webpack_require__(95);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Category Info Page to add a Category, in a modal window
 *
 * @export
 * @class CategoryInfoPage
 */
var CategoryInfoPage = /** @class */ (function () {
    function CategoryInfoPage(view, catService, params, translate) {
        this.view = view;
        this.catService = catService;
        this.params = params;
        this.translate = translate;
    }
    CategoryInfoPage.prototype.ngOnInit = function () {
        this.category = this.params.get('newCategory');
        this.icons = this.params.get('icons');
    };
    /**
     * Change category event
     *
     * @param {any} event
     * @param {Category} category
     * @memberof CategoryInfoPage
     */
    CategoryInfoPage.prototype.changeCategoryIcon = function (event, category) {
        this.catService.changeCategoryIcon(category, this.icons);
    };
    /**
     * Change measurement type event
     *
     * @param {any} event
     * @memberof CategoryInfoPage
     */
    CategoryInfoPage.prototype.measurementChange = function (event) {
        if (this.category.measurement === 'UNIDADES') {
            this.category.unitStep = 0.1;
        }
        else if (this.category.measurement === 'GRAMOS') {
            this.category.unitStep = 100;
        }
        else if (this.category.measurement === 'LITROS') {
            this.category.unitStep = 0.5;
        }
        else {
            this.category.unitStep = 0.5;
        }
    };
    /**
     * Close the modal window, saving changes
     *
     * @memberof CategoryInfoPage
     */
    CategoryInfoPage.prototype.save = function () {
        this.view.dismiss(this.category);
    };
    /**
     * Close the modal window, discarding changes
     *
     * @memberof CategoryInfoPage
     */
    CategoryInfoPage.prototype.close = function () {
        this.view.dismiss();
    };
    CategoryInfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/category-info/category-info.html"*/'<ion-header>\n	<ion-toolbar dark>\n		<ion-title [hidden]="!editing">\n			{{ \'EditaCategoria\' | translate }}\n		</ion-title>\n		<ion-title [hidden]="editing">\n			{{ \'NuevaCategoria\' | translate }}\n		</ion-title>\n		<ion-buttons end>\n			<button primary (click)="save()"><ion-icon ios="ios-archive" md="md-archive"></ion-icon></button>\n			<button (click)="close()"><ion-icon ios="ios-close" md="md-close"></ion-icon></button>\n		</ion-buttons>\n	</ion-toolbar>\n</ion-header>\n\n<ion-content class="item-info">\n	<ion-card>\n		<ion-card-header>\n			<ion-row>\n				<ion-col width-66>\n					<ion-avatar item-left class="category-icon">\n						<img class="icon" src="{{category.icon.src}}" (click)="changeCategoryIcon($event, category)" />\n					</ion-avatar>\n				</ion-col>\n			</ion-row>\n			<ion-row>\n				<ion-col width-50>\n					<ion-input class="categoryName" type="text" [(ngModel)]="category.categoryName">\n					</ion-input>\n				</ion-col>\n				<ion-col width-33>\n					<ion-item>\n						<ion-select class="measurement" id="measurement" [(ngModel)]="category.measurement" (ngModelChange)="measurementChange($event)">\n							<ion-option value="UNIDADES">{{ \'Unidades\' | translate }}</ion-option>\n							<ion-option value="GRAMOS">{{ \'Gramos\' | translate }}</ion-option>\n							<ion-option value="KILOS">{{ \'Kilos\' | translate }}</ion-option>\n							<ion-option value="LITROS">{{ \'Litros\' | translate }}</ion-option>\n						</ion-select>\n					</ion-item>\n				</ion-col>\n				<ion-col width-25>\n					<ion-item class="measurementUnitStep">\n						<ion-label stacked>{{ \'PasoMedida\' | translate }}</ion-label>\n						<ion-input text-right [(ngModel)]="category.unitStep" min="1" type="number"></ion-input>\n					</ion-item>\n				</ion-col>\n			</ion-row>\n		</ion-card-header>\n	</ion-card>\n</ion-content>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/category-info/category-info.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_categories_categoriesService__["a" /* CategoriesService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_categories_categoriesService__["a" /* CategoriesService */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1__ngx_translate_core__["c" /* TranslateService */]])
    ], CategoryInfoPage);
    return CategoryInfoPage;
}());

//# sourceMappingURL=category-info.js.map

/***/ }),

/***/ 596:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Page to manage config data for the app
 *
 * @export
 * @class ConfigPage
 */
var ConfigPage = /** @class */ (function () {
    function ConfigPage(navCtrl, globalVars, log) {
        this.navCtrl = navCtrl;
        this.globalVars = globalVars;
        this.log = log;
        this.units = ['UNIDADES', 'LITROS', 'GRAMOS', 'KG'];
        this.pasos = ['0.25', '0.5', '1', '100'];
        this.categorySelected = '';
        this.log.setLogger(this.constructor.name);
    }
    ConfigPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('ionViewDidLoad');
        this.globalVars.getConfigData().then(function (result) {
            _this.configData = result;
            _this.idiomas = _this.configData.idiomas;
            _this.idiomaSelecciondo = _this.configData.idiomaDefault;
            _this.configData.stepDefault = _this.configData.categoryDefault
                ? _this.configData.categoryDefault.unitStep
                : 1;
            _this.configData.unitDefault = _this.configData.categoryDefault
                ? _this.configData.categoryDefault.measurement
                : 'UNIDADES';
            _this.categorySelected = _this.configData.categoryDefault
                ? _this.configData.categoryDefault.categoryName
                : 'No Category';
            _this.globalVars.getCategoriesData().then(function (data) {
                _this.categories = data;
                if (_this.categories.filter(function (cat) { return cat.categoryName === 'No Category'; })
                    .length <= 0) {
                    _this.categories.push({
                        icon: { src: 'assets/images/icons/default.png' },
                        measurement: 'UNIDADES',
                        categoryName: 'No Category',
                        unitStep: 1
                    });
                }
            });
        });
    };
    /**
     * On change it should save the data
     *
     * @memberof ConfigPage
     */
    ConfigPage.prototype.onChange = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('onChange');
        this.configData.categoryDefault = this.categories.filter(function (cat) { return cat.categoryName === _this.categorySelected; })[0];
        this.globalVars.setConfigData(this.configData);
    };
    ConfigPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-config-page',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/config-page/config-page.html"*/'<ion-header>\n  <ion-navbar color="dark">\n    <button ion-button menuToggle>\n      <ion-icon ios="ios-menu" md="md-menu"></ion-icon>\n    </button>\n    <ion-title>{{ \'Configuracion\' | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding class="list config">\n\n  <ion-list *ngIf="configData">\n    <ion-card>\n      <ion-card-header>\n        {{ \'ConfiguracionListas\' | translate }}\n      </ion-card-header>\n      <ion-card-content>\n        <ion-item>\n          <ion-label stacked>{{ \'CantidadMinimaDefecto\' | translate }}</ion-label>\n          <ion-input text-right [(ngModel)]="configData.cantidadMinimaDefecto" min="1" type="number" (ngModelChange)=\'onChange()\'></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>{{ \'BorrarAlLlegarA0\' | translate }}</ion-label>\n          <ion-toggle [(ngModel)]="configData.deleteAt0" checked="{{configData.deleteAt0}}" color="dark" (ngModelChange)=\'onChange()\'></ion-toggle>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>{{ \'PreguntaIncluirListaCompra\' | translate }}</ion-label>\n          <ion-toggle [(ngModel)]="configData.askAddListaCompra" checked="{{configData.askAddListaCompra}}" color="dark" (ngModelChange)=\'onChange()\'></ion-toggle>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>{{ \'AvisosFechaCaducidad\' | translate }}</ion-label>\n          <ion-toggle [(ngModel)]="configData.expireReminders" checked="{{configData.expireReminders}}" color="dark" (ngModelChange)=\'onChange()\'></ion-toggle>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>{{ \'Diestro\' | translate }}</ion-label>\n          <ion-toggle [(ngModel)]="configData.rightHand" checked="{{configData.rightHand}}" color="dark" (ngModelChange)=\'onChange()\'></ion-toggle>\n        </ion-item>\n      </ion-card-content>\n    </ion-card>\n    <ion-card>\n      <ion-card-header>\n        {{ \'ConfiguracionCategorias\' | translate }}\n      </ion-card-header>\n      <ion-card-content>\n        <ion-item>\n          <ion-label stacked>{{ \'CategoriaDefecto\' | translate }}</ion-label>\n          <ion-select text-right [(ngModel)]="categorySelected" (ngModelChange)=\'onChange()\'>\n            <ion-option *ngFor="let category of categories" value="{{category.categoryName}}">\n              {{category.categoryName | translate}}\n            </ion-option>\n          </ion-select>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>{{ \'PasoMedidaDefecto\' | translate }}</ion-label>\n          <ion-select text-right [(ngModel)]="configData.stepDefault" (ngModelChange)=\'onChange()\'>\n            <ion-option *ngFor="let paso of pasos" value="{{paso}}">\n              {{paso}}\n            </ion-option>\n          </ion-select>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>{{ \'UnidadDefecto\' | translate }}</ion-label>\n          <ion-select text-right [(ngModel)]="configData.unitDefault" (ngModelChange)=\'onChange()\'>\n            <ion-option *ngFor="let unit of units" value="{{unit}}">\n              {{unit | titlecase | translate}}\n            </ion-option>\n          </ion-select>\n        </ion-item>\n      </ion-card-content>\n    </ion-card>\n    <ion-card>\n      <ion-card-header>\n        {{ \'ConfiguracionApp\' | translate }}\n      </ion-card-header>\n      <ion-card-content>\n        <ion-item>\n          <ion-label stacked>{{ \'Idioma\' | translate }}</ion-label>\n          <ion-select text-right [(ngModel)]="configData.idiomaDefault" (ngModelChange)=\'onChange()\'>\n            <ion-option *ngFor="let idioma of idiomas" value="{{idioma.id_iso}}">{{idioma.idiomaSeleccionado}}</ion-option>\n          </ion-select>\n        </ion-item>\n      </ion-card-content>\n    </ion-card>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/config-page/config-page.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_3__providers_log_log__["a" /* Log */]])
    ], ConfigPage);
    return ConfigPage;
}());

//# sourceMappingURL=config-page.js.map

/***/ }),

/***/ 597:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_fcm__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_items_needed_component_items_needed_component__ = __webpack_require__(588);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_phonegap_local_notification__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_local_notifications__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_reminders_provider__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_auth_auth_service__ = __webpack_require__(598);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_google_plus__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_firebase__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_moment_timezone__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_moment_timezone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_moment_timezone__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_reminders_component_reminders_component__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_items_best_before_component_items_best_before_component__ = __webpack_require__(544);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__list_page_list_page__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pipes_orderBy__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


















/**
 * Page to show initial data and manage login
 *
 * @export
 * @class DashboardPage
 */
var DashboardPage = /** @class */ (function () {
    function DashboardPage(navCtrl, alertCtrl, toastCtrl, plt, fcm, order, googlePlus, globalVars, authService, remindersData, localNotification, localNotifications, mod, log, translate) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.plt = plt;
        this.fcm = fcm;
        this.order = order;
        this.googlePlus = googlePlus;
        this.globalVars = globalVars;
        this.authService = authService;
        this.remindersData = remindersData;
        this.localNotification = localNotification;
        this.localNotifications = localNotifications;
        this.mod = mod;
        this.log = log;
        this.translate = translate;
        this.shoppingListPage = {
            title: 'LISTA_COMPRA',
            component: __WEBPACK_IMPORTED_MODULE_14__list_page_list_page__["a" /* ListPage */],
            icon: 'basket'
        };
        this.userAccount = true;
        this.expires = true;
        this.reminders = false;
        this.remindersList = [];
        this.userProfile = null;
        this.native = false;
        this.log.setLogger(this.constructor.name);
    }
    DashboardPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('ionViewDidLoad');
        if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
            this.native = true;
        }
        this.recaptchaVerifier = new __WEBPACK_IMPORTED_MODULE_10_firebase___default.a.auth.RecaptchaVerifier('recaptcha-container');
        this.zone = new __WEBPACK_IMPORTED_MODULE_8__angular_core__["N" /* NgZone */]({});
        self = this;
        this.getDashboardData();
        __WEBPACK_IMPORTED_MODULE_10_firebase___default.a.auth().onAuthStateChanged(function (user) {
            // if login state changed
            _this.zone.run(function () {
                if (user) {
                    _this.userProfile = user;
                    _this.fcm
                        .getToken()
                        .then(function (token) {
                        _this.log.logs[_this.constructor.name].info('Getting FCM token');
                        // Your best bet is to here store the token on the user's profile on the
                        // Firebase database, so that when you want to send notifications to this
                        // specific user you can do it from Cloud Functions.
                        self.globalVars.setUserProfile(user, token).then(function () {
                            _this.log.logs[_this.constructor.name].info('UserProfileUpdated');
                        });
                    })
                        .catch(function (e) { return _this.log.logs[_this.constructor.name].error(e); });
                }
                else {
                    _this.userProfile = null;
                }
            });
        });
    };
    DashboardPage.prototype.getNotificationToken = function () { };
    /**
     * Get data to show on dashboard
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.getDashboardData = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('getDashboardData');
        this.remindersData.getReminders().then(function (data) {
            _this.log.logs[_this.constructor.name].info(JSON.stringify(data));
            _this.remindersList = data;
            if (_this.remindersList.length > 0) {
                _this.reminders = true;
            }
        });
    };
    /**
     * Open a page of the app
     *
     * @param {any} page
     * @memberof DashboardPage
     */
    DashboardPage.prototype.openInternalPage = function (page) {
        this.navCtrl.push(page.component, {
            list: page.title
        });
    };
    /**
     * Show items needed to shop
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.showItemsToShop = function () {
        var toShopModal = this.mod.create(__WEBPACK_IMPORTED_MODULE_1__components_items_needed_component_items_needed_component__["a" /* ItemsNeededComponent */]);
        toShopModal.present();
    };
    /**
     * Show list of items near to expire
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.showExpireItems = function () {
        var expiresModal = this.mod.create(__WEBPACK_IMPORTED_MODULE_13__components_items_best_before_component_items_best_before_component__["a" /* ItemsBestBeforeComponent */]);
        expiresModal.present();
    };
    /**
     * Remove a reminder
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.removeReminder = function (data, index) {
        this.log.logs[this.constructor.name].info('removeReminder');
        this.remindersData.removeReminder(data);
        this.remindersList.splice(index, 1);
        if (this.remindersList.length <= 0)
            this.reminders = false;
    };
    /**
     * Edit a reminder
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.editReminder = function (data) {
        var _this = this;
        this.log.logs[this.constructor.name].info('editReminder');
        var oldReminder = JSON.parse(JSON.stringify(data));
        data.editing = true;
        var reminderModal = this.mod.create(__WEBPACK_IMPORTED_MODULE_12__components_reminders_component_reminders_component__["a" /* RemindersComponent */], data);
        reminderModal.onDidDismiss(function (data) {
            if (data) {
                _this.localNotification.requestPermission().then(function (permission) {
                    if (permission === 'granted') {
                        var reminder = {
                            message: data.message,
                            time: __WEBPACK_IMPORTED_MODULE_11_moment_timezone___default()(data.notificationDate).seconds(0).milliseconds(0).tz(__WEBPACK_IMPORTED_MODULE_11_moment_timezone___default.a.tz.guess()).format()
                        };
                        _this.remindersData.setReminder(reminder);
                        _this.remindersList.push(reminder);
                        _this.remindersList = _this.remindersList.filter(function (item) {
                            return item.message !== oldReminder.message ||
                                item.time !== oldReminder.time;
                        });
                        if (_this.native) {
                            _this.localNotifications.schedule({
                                id: __WEBPACK_IMPORTED_MODULE_11_moment_timezone___default()(data.notificationDate).seconds(0).milliseconds(0).tz(__WEBPACK_IMPORTED_MODULE_11_moment_timezone___default.a.tz.guess()).unix(),
                                text: data.message,
                                at: __WEBPACK_IMPORTED_MODULE_11_moment_timezone___default()(data.notificationDate).seconds(0).milliseconds(0).tz(__WEBPACK_IMPORTED_MODULE_11_moment_timezone___default.a.tz.guess()).toISOString()
                            });
                        }
                        else {
                            var timeOutHandler = setTimeout(function () {
                                alert(data.message);
                                _this.remindersData.removeReminder(data);
                            }, __WEBPACK_IMPORTED_MODULE_11_moment_timezone___default()(data.notificationDate).seconds(0).milliseconds(0).tz(__WEBPACK_IMPORTED_MODULE_11_moment_timezone___default.a.tz.guess()).subtract(__WEBPACK_IMPORTED_MODULE_11_moment_timezone___default.a.tz(__WEBPACK_IMPORTED_MODULE_11_moment_timezone___default.a.tz.guess()).seconds(0).milliseconds(0).valueOf(), 'milliseconds').valueOf());
                        }
                    }
                });
            }
        });
        reminderModal.present();
        this.remindersData.removeReminder(oldReminder);
    };
    /**
     * Loggin by phone number
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.phoneLogin = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('phoneLogin');
        this.alertCtrl
            .create({
            title: this.translate.instant('InsertaTelefono'),
            subTitle: this.translate.instant('IncluirCodigoRegion'),
            inputs: [
                {
                    name: 'phoneNumber',
                    placeholder: '+ xx xxx xxx xxx'
                }
            ],
            buttons: [
                {
                    text: this.translate.instant('Cancelar'),
                    role: 'cancel'
                },
                {
                    text: this.translate.instant('Login'),
                    handler: function (data) {
                        if (data.phoneNumber.trim() == '' || data.phoneNumber == null) {
                            var toast = _this.toastCtrl.create({
                                message: _this.translate.instant('ValorValido'),
                                duration: 1500,
                                position: 'bottom'
                            });
                            toast.present();
                            return;
                        }
                        _this.authService
                            .phoneLogin(data.phoneNumber.trim())
                            .then(function (result) {
                            var prompt = _this.alertCtrl.create({
                                title: _this.translate.instant('IntroducirCodigoConfirmacion'),
                                inputs: [
                                    {
                                        name: 'confirmationCode',
                                        placeholder: _this.translate.instant('CodigoConfirmacion')
                                    }
                                ],
                                buttons: [
                                    {
                                        text: _this.translate.instant('Cancelar'),
                                        handler: function (data) {
                                            _this.log.logs[_this.constructor.name].error('Cancel clicked');
                                        }
                                    },
                                    {
                                        text: _this.translate.instant('Enviar'),
                                        handler: function (data) {
                                            result
                                                .confirm(data.confirmationCode)
                                                .then(function (result) {
                                                // User signed in successfully.
                                                this.log.logs[this.constructor.name].info('Send:' + result.user);
                                                // ...
                                            })
                                                .catch(function (error) {
                                                this.log.logs[this.constructor.name].error('SendError:' + error);
                                                // User couldn't sign in (bad verification code?)
                                                // ...
                                            });
                                        }
                                    }
                                ]
                            });
                            prompt.present();
                        });
                    }
                }
            ]
        })
            .present();
    };
    /**
     * Login by facebook
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.facebookLogin = function () {
        var _this = this;
        this.authService.facebookLogin().then(function (data) {
            _this.log.logs[_this.constructor.name].info('facebook:' + data);
        });
    };
    /**
     * Login by google
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.googleLogin = function () {
        var _this = this;
        this.authService.googleAuth().then(function (data) {
            _this.log.logs[_this.constructor.name].info('google:' + data);
        });
    };
    /**
     * Login by twitter
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.twitterLogin = function () {
        var _this = this;
        this.authService.twitterLogin().then(function (data) {
            _this.log.logs[_this.constructor.name].info('twitter:' + data);
        });
    };
    /**
     * Logout
     *
     * @memberof DashboardPage
     */
    DashboardPage.prototype.logout = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('logout');
        this.authService.logout().then(function (data) {
            _this.userProfile = null;
            _this.ionViewDidLoad();
        });
    };
    DashboardPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_8__angular_core__["n" /* Component */])({
            selector: 'page-dashboard-page',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/dashboard-page/dashboard-page.html"*/'<ion-header>\n  <ion-navbar color="dark">\n    <button ion-button menuToggle>\n      <ion-icon ios="ios-menu" md="md-menu"></ion-icon>\n    </button>\n    <ion-title>{{ \'Inicio\' | translate }}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding class="dashboard">\n\n  <div id="recaptcha-container"></div>\n\n  <ion-list>\n    <ion-card *ngIf="!userProfile">\n      <ion-card-header>\n        <ion-grid>\n          <ion-row>\n            <ion-col col-4>\n              <h4 class="userAccountLabel">{{ \'ConectarCon\' | translate }}</h4>\n            </ion-col>\n            <ion-col col-8>\n              <ion-row>\n                <ion-col col-6>\n                  <button type="button" class="mailLogo" ion-button icon-only (click)="phoneLogin()">\n                    <ion-icon ios="ios-call" md="md-call"></ion-icon>\n                  </button>\n                </ion-col>\n                <!--<ion-col col-6>\n                  <button type="button" class="twLogo" ion-button icon-only (click)="twitterLogin()">\n                    <ion-icon ios="logo-twitter" md="logo-twitter"></ion-icon>\n                  </button>\n                </ion-col>\n              </ion-row>\n              <ion-row>\n                <ion-col col-6>\n                  <button type="button" class="fbLogo" ion-button icon-only (click)="facebookLogin()">\n                    <ion-icon ios="logo-facebook" md="logo-facebook"></ion-icon>\n                  </button>\n                </ion-col>-->\n                <ion-col col-6>\n                  <button type="button" class="googleLogo" ion-button icon-only (click)="googleLogin()">\n                    <ion-icon name="logo-google"></ion-icon>\n                  </button>\n                </ion-col>\n              </ion-row>\n            </ion-col>\n          </ion-row>\n        </ion-grid>\n      </ion-card-header>\n    </ion-card>\n    <ion-card *ngIf="reminders">\n      <ion-card-header>\n        <ion-item>\n          <ion-avatar item-right>\n            <button clear dark>\n              <ion-icon class="reminderIcon" ios="ios-notifications" md="md-notifications"></ion-icon>\n            </button>\n          </ion-avatar>\n          <h5 class="reminderLabel">{{ \'Recordatorios\' | translate }}</h5>\n        </ion-item>\n        <ion-list inset>\n          <ion-item ion-item *ngFor="let reminder of remindersList; let i = index">\n            <p class="item-info">\n              <ion-icon class="item-icon" ios="ios-eye" md="md-eye" (click)="editReminder(reminder)"></ion-icon>\n              {{reminder.time | date:\'yyyy-MM-dd HH:mm\'}}\n              <ion-icon class="item-icon" ios="ios-arrow-round-forward" md="md-arrow-round-forward"></ion-icon>{{reminder.message}}\n              <ion-icon class="item-icon" ios="ios-trash" md="md-trash" (click)="removeReminder(reminder,i)"></ion-icon>\n            </p>\n          </ion-item>\n        </ion-list>\n      </ion-card-header>\n    </ion-card>\n    <ion-card>\n      <ion-card-header>\n        <ion-item>\n          <ion-avatar item-right>\n            <button clear dark>\n              <ion-icon class="neededsIcon" large item-right ios="ios-cart" md="md-cart"></ion-icon>\n            </button>\n          </ion-avatar>\n          <h5 class="neededsLabel">{{ \'CosasComprar\' | translate }}</h5>\n        </ion-item>\n        <ion-list inset>\n          <ion-item ion-item (click)="openInternalPage(shoppingListPage)">\n            <p class="item-info">\n              <ion-icon class="item-icon" ios="ios-cart" md="md-cart"></ion-icon>\n              {{ \'VerListaCompora\' | translate }}\n            </p>\n          </ion-item>\n          <ion-item ion-item (click)="showItemsToShop()">\n            <p class="item-info">\n              <ion-icon class="item-icon" ios="ios-basket" md="md-basket"></ion-icon>\n              {{ \'VerElementosComprar\' | translate }}\n            </p>\n          </ion-item>\n\n        </ion-list>\n      </ion-card-header>\n    </ion-card>\n    <ion-card *ngIf="expires">\n      <ion-card-header>\n        <ion-item>\n          <ion-avatar item-right>\n            <button clear dark>\n              <ion-icon class="expiresIcon" large item-right ios="ios-warning" md="md-warning"></ion-icon>\n            </button>\n          </ion-avatar>\n          <h5 class="expiresLabel">{{ \'ElementosCaducables\' | translate }}</h5>\n        </ion-item>\n        <ion-list inset>\n          <ion-item ion-item (click)="showExpireItems()">\n            <p class="item-info">\n              <ion-icon class="item-icon" ios="ios-eye" md="md-eye"></ion-icon>\n              {{ \'VerElementosCaducables\' | translate }}\n            </p>\n          </ion-item>\n        </ion-list>\n      </ion-card-header>\n    </ion-card>\n    <ion-card *ngIf="userProfile">\n      <ion-card-header>\n        <ion-item (click)="logout()">\n          <ion-avatar item-right>\n            <button clear danger>\n              <ion-icon class="userAccountIcon" ios="ios-log-out" md="md-log-out"></ion-icon>\n            </button>\n          </ion-avatar>\n          <ion-item>\n            <h3 class="userAccountLabel">{{ \'Desconectar\' | translate}}</h3>\n          </ion-item>\n        </ion-item>\n      </ion-card-header>\n    </ion-card>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/dashboard-page/dashboard-page.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_15__pipes_orderBy__["a" /* OrderBy */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_0__ionic_native_fcm__["a" /* FCM */],
            __WEBPACK_IMPORTED_MODULE_15__pipes_orderBy__["a" /* OrderBy */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_google_plus__["a" /* GooglePlus */],
            __WEBPACK_IMPORTED_MODULE_16__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_7__providers_auth_auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_reminders_provider__["a" /* RemindersProvider */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_phonegap_local_notification__["a" /* PhonegapLocalNotification */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_local_notifications__["a" /* LocalNotifications */],
            __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_17__providers_log_log__["a" /* Log */],
            __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */]])
    ], DashboardPage);
    return DashboardPage;
}());

//# sourceMappingURL=dashboard-page.js.map

/***/ }),

/***/ 598:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_google_plus__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




//import { TwitterConnect } from '@ionic-native/twitter-connect';
//import { Facebook } from '@ionic-native/facebook';



/**
 * Servie to manage login and logout on the cloud services for the app
 *
 * @export
 * @class AuthService
 */
var AuthService = /** @class */ (function () {
    function AuthService(plt, googlePlus, globalVars, log //private twitter: TwitterConnect, //public fb: Facebook
    ) {
        var _this = this;
        this.plt = plt;
        this.googlePlus = googlePlus;
        this.globalVars = globalVars;
        this.log = log;
        this.userProfile = null;
        this.type = 'google';
        this.FB_APP_ID = 157863821611771;
        this.log.setLogger(this.constructor.name);
        //this.fb.browserInit(this.FB_APP_ID, 'v2.8');
        this.zone = new __WEBPACK_IMPORTED_MODULE_1__angular_core__["N" /* NgZone */]({});
        self = this;
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth().onAuthStateChanged(function (user) {
            _this.log.logs[_this.constructor.name].info('user:' + user);
            _this.zone.run(function () {
                if (user) {
                    _this.userProfile = user;
                    self.globalVars.setUserProfile(user, null);
                }
                else {
                    _this.userProfile = null;
                }
            });
        });
    }
    /**
     * Logout of the user
     *
     * @param {string} type
     * @returns
     * @memberof AuthService
     */
    AuthService.prototype.logout = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('logout');
        this.globalVars.disconnectUser();
        return new Promise(function (resolve) {
            self = _this;
            switch (_this.type) {
                case 'twitter':
                    resolve('OK');
                    break;
                case 'google':
                    __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth().signOut();
                    _this.userProfile = null;
                    self.globalVars.setUserProfile(null, null);
                    resolve('OK');
                    break;
                case 'facebook':
                    resolve('OK');
                    break;
                case 'phone':
                    __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth().signOut();
                    _this.userProfile = null;
                    self.globalVars.setUserProfile(null, null);
                    resolve('OK');
                    break;
            }
        });
    };
    /**
     * Login with twitter
     *
     * @returns
     * @memberof AuthService
     */
    AuthService.prototype.twitterLogin = function () {
        var _this = this;
        //https://github.com/DanielContreras18881/ionic2-twitter-login
        //https://github.com/DanielContreras18881/ionic2-facebook-login
        //https://ionicframework.com/docs/native/twitter-connect/
        //https://fabric.io/kits?show_signup=true
        //https://apps.twitter.com/app/14555731
        this.type = 'twitter';
        return new Promise(function (resolve) {
            /*
            this.twitter.login().then(
              response => {
                const twitterCredential = firebase.auth.TwitterAuthProvider.credential(
                  response.token,
                  response.secret
                );
      
                firebase
                  .auth()
                  .signInWithCredential(twitterCredential)
                  .then(
                    userProfile => {
                      this.zone.run(() => {
                        this.userProfile = userProfile;
                        this.userProfile.twName = response.userName;
                        resolve(this.userProfile);
                      });
                    },
                    error => {
                      console.log(error);
                    }
                  );
              },
              error => {
                console.log('Error connecting to twitter: ', error);
              }
            );
            */
            resolve(_this.type);
        });
    };
    /**
     * Login with facebook
     *
     * @returns
     * @memberof AuthService
     */
    AuthService.prototype.facebookLogin = function () {
        var _this = this;
        /*
        IOS
        info.plist
    <key>CFBundleURLTypes</key>
    <array>
      <dict>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>fb157863821611771</string>
      </array>
      </dict>
    </array>
    <key>FacebookAppID</key>
    <string>157863821611771</string>
    <key>FacebookDisplayName</key>
    <string>Alacena</string>
    
    <key>LSApplicationQueriesSchemes</key>
    <array>
      <string>fbapi</string>
      <string>fb-messenger-api</string>
      <string>fbauth2</string>
      <string>fbshareextension</string>
    </array>
    
    AppDelegate.m
    
    //  AppDelegate.m
    #import <FBSDKCoreKit/FBSDKCoreKit.h>
    
    - (BOOL)application:(UIApplication *)application
        didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
      [[FBSDKApplicationDelegate sharedInstance] application:application
        didFinishLaunchingWithOptions:launchOptions];
      // Add any custom logic here.
      return YES;
    }
    
    - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
        sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    
      BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
        openURL:url
        sourceApplication:sourceApplication
        annotation:annotation
      ];
      // Add any custom logic here.
      return handled;
    }
    
    
    IOS10 o posterior
    
    - (BOOL)application:(UIApplication *)application
                openURL:(NSURL *)url
                options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    
      BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
        openURL:url
        sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
        annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
      ];
      // Add any custom logic here.
      return handled;
    
    
        */
        //https://github.com/javebratt/ionic2-firebase3-facebook-auth/blob/master/src/pages/home/home.ts
        //https://github.com/DanielContreras18881/ionic2-facebook-login/blob/master
        //https://ionicthemes.com/tutorials/about/ionic2-facebook-login
        //https://javebratt.com/ionic-2-facebook-login/157863821611771
        //https://developers.facebook.com/apps/157863821611771/settings/
        this.type = 'facebook';
        return new Promise(function (resolve) {
            var permissions = new Array();
            var env = _this;
            //the permissions your facebook app needs from the user
            permissions = ['public_profile'];
            /*
            this.fb.login(permissions).then(
              function(response) {
                let userId = response.authResponse.userID;
                let params = new Array<string>();
      
                //Getting name and gender properties
                env.fb.api('/me?fields=name,gender', params).then(function(user) {
                  user.picture =
                    'https://graph.facebook.com/' + userId + '/picture?type=large';
                  resolve('facebook');
                });
              },
              function(error) {
                console.log(error);
              }
            );
            */
            resolve(_this.type);
        });
    };
    /**
     * Login with phone number
     *
     * @returns
     * @memberof AuthService
     */
    AuthService.prototype.phoneLogin = function (data) {
        var _this = this;
        //https://firebase.google.com/docs/auth/ios/phone-auth
        //https://firebase.google.com/docs/auth/android/phone-auth
        //https://javebratt.com/firebase-phone-authentication/
        //https://github.com/DanielContreras18881/firebase-phone-authentication
        this.type = 'phone';
        return new Promise(function (resolve) {
            var appVerifier = new __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
            __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
                .auth()
                .signInWithPhoneNumber(data, appVerifier)
                .then(function (confirmationResult) {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                _this.log.logs[_this.constructor.name].info('SMS sent');
                resolve(confirmationResult);
            })
                .catch(function (error) {
                this.log.logs[this.constructor.name].error('SMS not sent:' + JSON.stringify(error));
                appVerifier = null;
            });
        });
    };
    /**
     * Login with google
     *
     * @returns
     * @memberof AuthService
     */
    AuthService.prototype.googleAuth = function () {
        var _this = this;
        this.type = 'google';
        return new Promise(function (resolve) {
            self = _this;
            var provider = new __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth.GoogleAuthProvider();
            var res = null;
            if ((_this.plt.is('android') || _this.plt.is('ios')) && !_this.plt.is('mobileweb')) {
                _this.googlePlus
                    .login({
                    webClientId: '354280052179-fkmk7g20grbpkctmdgtt53oiel3be7a1.apps.googleusercontent.com',
                    offline: true
                })
                    .then(function (res) {
                    __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
                        .auth()
                        .signInWithCredential(__WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth.GoogleAuthProvider.credential(res.idToken))
                        .then(function (success) {
                        _this.userProfile = success.user;
                        self.globalVars.setUserProfile(_this.userProfile, null);
                        _this.log.logs[_this.constructor.name].info('Google Login Success');
                        resolve('google');
                    })
                        .catch(function (error) {
                        _this.log.logs[_this.constructor.name].error('Firebase failure: ' + JSON.stringify(error));
                        resolve('Firebase failure: ' + JSON.stringify(error));
                    });
                })
                    .catch(function (err) {
                    _this.log.logs[_this.constructor.name].error('Error: ' + JSON.stringify(err));
                    resolve('Error: ' + JSON.stringify(err));
                });
            }
            else {
                __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
                    .auth()
                    .signInWithRedirect(provider)
                    .then(function (result) {
                    _this.userProfile = result.user;
                    self.globalVars.setUserProfile(_this.userProfile, null);
                    _this.log.logs[_this.constructor.name].info('Google Login Success');
                    resolve('google');
                }, function (error) {
                    _this.log.logs[_this.constructor.name].error('Firebase failure: ' + JSON.stringify(error));
                    resolve('Firebase failure: ' + JSON.stringify(error));
                });
            }
        });
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_google_plus__["a" /* GooglePlus */],
            __WEBPACK_IMPORTED_MODULE_0__global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_5__log_log__["a" /* Log */] //private twitter: TwitterConnect, //public fb: Facebook
        ])
    ], AuthService);
    return AuthService;
}());

//# sourceMappingURL=auth.service.js.map

/***/ }),

/***/ 599:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemInfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Modal continer to show item data to edit or create
 *
 * @export
 * @class ItemInfoPage
 */
var ItemInfoPage = /** @class */ (function () {
    function ItemInfoPage(view, params) {
        this.view = view;
        this.item = params.get('newItem');
        this.editing = params.get('editing');
        this.icons = params.get('icons');
    }
    /**
     * Close modal saving data
     *
     * @memberof ItemInfoPage
     */
    ItemInfoPage.prototype.save = function () {
        this.view.dismiss(this.item);
    };
    /**
     * Close modal without saving data
     *
     * @memberof ItemInfoPage
     */
    ItemInfoPage.prototype.close = function () {
        this.view.dismiss();
    };
    ItemInfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/item-info/item-info.html"*/'<ion-header>\n  <ion-toolbar dark>\n    <ion-title [hidden]="!editing">\n      {{ \'EditaElemento\' | translate }}\n    </ion-title>\n    <ion-title [hidden]="editing">\n      {{ \'AniadirElemento\' | translate }}\n    </ion-title>\n    <ion-buttons end>\n      <button primary (click)="save()">\n        <ion-icon ios="ios-archive" md="md-archive"></ion-icon>\n      </button>\n      <button (click)="close()">\n        <ion-icon ios="ios-close" md="md-close"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content class="item-info">\n  <item [(item)]="item" [creating]="editing" [icons]="icons"></item>\n</ion-content>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/components/item-info/item-info.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
    ], ItemInfoPage);
    return ItemInfoPage;
}());

//# sourceMappingURL=item-info.js.map

/***/ }),

/***/ 600:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pipes_orderBy__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pipes_pipefilterElements__ = __webpack_require__(589);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_categories_categoriesService__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Page to manage items on the app
 *
 * @export
 * @class ItemsPage
 */
var ItemsPage = /** @class */ (function () {
    function ItemsPage(mod, nav, alertCtrl, order, catService, globalVars, filterElements, toastCtrl, log, translate) {
        this.mod = mod;
        this.nav = nav;
        this.alertCtrl = alertCtrl;
        this.order = order;
        this.catService = catService;
        this.globalVars = globalVars;
        this.filterElements = filterElements;
        this.toastCtrl = toastCtrl;
        this.log = log;
        this.translate = translate;
        this.type = 'Item';
        this.orderSelected = 1;
        this.shoppingList = [];
        this.log.setLogger(this.constructor.name);
    }
    ItemsPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('ionViewDidLoad');
        this.searchBar = false;
        this.globalVars.getDefaulIconsData().then(function (data) {
            _this.icons = data;
            _this.initializeItems(null);
        });
        this.globalVars.getListData('LISTA_COMPRA').then(function (data) {
            _this.shoppingList = data;
        });
        this.globalVars.getConfigData().then(function (data) {
            _this.defaultCategory = data.categoryDefault;
        });
    };
    /**
     * Initialize items data
     *
     * @param {string} filter
     * @memberof ItemsPage
     */
    ItemsPage.prototype.initializeItems = function (filter) {
        var _this = this;
        this.log.logs[this.constructor.name].info('initializeItems:' + filter);
        this.globalVars.getItemsData().then(function (data) {
            _this.items = data;
            _this.globalVars.getListsData().then(function (data) {
                var lists = data;
                var itemsOnLists = [];
                lists.forEach(function (element) {
                    _this.globalVars.getListData(element.nombreLista).then(function (data) {
                        data.forEach(function (item) {
                            itemsOnLists.push(item);
                        });
                        var itemsFilled = [];
                        _this.items.forEach(function (item, index) {
                            var auxItem = item;
                            auxItem.lists = _this.filterElements.transform(itemsOnLists, item.nombreElemento);
                            itemsFilled.push(auxItem);
                        });
                        _this.items = itemsFilled;
                        /*
                            this.sortItems(this.orderSelected);
                        if (filter) {
                          this.items = this.items.filter(item => {
                            return (
                              item.nombreElemento
                                .toLowerCase()
                                .indexOf(this.searchItem.toLowerCase()) > -1
                            );
                          });
                            }
                            */
                    });
                });
            });
        });
    };
    /**
     * Event to search items based on input filled
     *
     * @param {any} event
     * @memberof ItemsPage
     */
    ItemsPage.prototype.searchMatches = function (event) {
        if (this.searchItem && this.searchItem.trim() !== '') {
            this.initializeItems(this.searchItem);
        }
        else {
            this.initializeItems(null);
        }
    };
    /**
     * Event to show or hide search bar
     *
     * @param {any} event
     * @memberof ItemsPage
     */
    ItemsPage.prototype.toggleSearchBar = function (event) {
        this.searchBar = !this.searchBar;
    };
    /**
     * Event to change category of the item
     *
     * @param {any} event
     * @param {Item} item
     * @memberof ItemsPage
     */
    ItemsPage.prototype.changeItemCategory = function (event, item) {
        var _this = this;
        this.catService.changeCategory(item.category, item).then(function (data) {
            if (!data.category) {
                data.category = _this.defaultCategory;
            }
            item = data;
        });
    };
    /**
     * Event to remove a item
     *
     * @param {any} event
     * @param {Item} item
     * @memberof ItemsPage
     */
    ItemsPage.prototype.removeItem = function (event, item) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeItem:' + item);
        var confirm = this.alertCtrl.create({
            title: this.translate.instant('Borrando', { value: item.nombreElemento }),
            message: this.translate.instant('PreguntaBorrarElemento', { value: item.nombreElemento }),
            buttons: [
                {
                    text: this.translate.instant('No'),
                    handler: function () { }
                },
                {
                    text: this.translate.instant('Si'),
                    handler: function () {
                        _this.items.splice(_this.items.indexOf(item), 1);
                        _this.globalVars.setItemsData(_this.items);
                    }
                }
            ]
        });
        confirm.present();
    };
    /**
     * Event to show events to send to shopping list
     *
     * @param {any} event
     * @memberof ItemsPage
     */
    ItemsPage.prototype.selectToSendShoppingList = function (event) {
        var _this = this;
        this.log.logs[this.constructor.name].info('selectToSendShoppingList');
        var move = this.alertCtrl.create();
        move.setTitle(this.translate.instant('MoverListaCompra'));
        this.items.forEach(function (item) {
            if (item.lists.length === 0) {
                move.addInput({
                    type: 'checkbox',
                    label: item.nombreElemento,
                    value: item.nombreElemento,
                    checked: false
                });
            }
        });
        move.addButton(this.translate.instant('Cancelar'));
        move.addButton({
            text: this.translate.instant('OK'),
            handler: function (data) {
                data.forEach(function (item, index) {
                    var auxItem = _this.filterElements.transform(_this.items, item)[0];
                    var newItem = {
                        category: auxItem.category,
                        nombreElemento: auxItem.nombreElemento,
                        colorElemento: '',
                        colorBotones: '',
                        nombreLista: 'LISTA_COMPRA',
                        cantidadElemento: 1,
                        caduca: false,
                        fechaCaducidad: null,
                        cantidadMinima: 1,
                        marked: false
                    };
                    _this.shoppingList.push(newItem);
                    _this.globalVars.setListData('LISTA_COMPRA', _this.shoppingList);
                    if (!auxItem.lists) {
                        auxItem.lists = [];
                    }
                    auxItem.lists.push(newItem);
                });
            }
        });
        move.present();
    };
    /**
     * Event to confirm to send to shopping list or discard elements
     *
     * @param {any} event
     * @param {Item} item
     * @memberof ItemsPage
     */
    ItemsPage.prototype.discardOrShop = function (event, item) {
        var _this = this;
        this.log.logs[this.constructor.name].info('discardOrShop:' + item);
        var discardRemove = this.alertCtrl.create();
        discardRemove.setTitle(this.translate.instant('DescartarOMover', { value: item.nombreElemento }));
        discardRemove.addButton({
            text: this.translate.instant('AListaCompra'),
            handler: function (data) {
                _this.sendToShoppingList(event, item);
            }
        });
        discardRemove.addButton({
            text: this.translate.instant('Descartar'),
            handler: function (data) {
                _this.removeElements([item.nombreElemento]);
            }
        });
        discardRemove.present();
    };
    /**
     * Event to remove selected items
     *
     * @param {string[]} removed
     * @memberof ItemsPage
     */
    ItemsPage.prototype.removeElements = function (removed) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeElements:' + removed);
        removed.forEach(function (itemRemoved) {
            _this.items = _this.items.filter(function (item) { return item.nombreElemento !== itemRemoved; });
            _this.globalVars.setItemsData(_this.items);
        });
    };
    /**
     * Event to edit a item
     *
     * @param {any} event
     * @param {Item} item
     * @memberof ItemsPage
     */
    ItemsPage.prototype.editItem = function (event, item) {
        var _this = this;
        this.log.logs[this.constructor.name].info('editItem:' + item);
        var oldItem = item.nombreElemento;
        var edit = this.alertCtrl.create({
            title: this.translate.instant('EditaElemento'),
            inputs: [
                {
                    name: 'nombreElemento',
                    value: oldItem,
                    type: 'text',
                    placeholder: this.translate.instant('Name')
                }
            ],
            buttons: [
                {
                    text: this.translate.instant('Cancel'),
                    role: 'cancel'
                },
                {
                    text: this.translate.instant('Confirmar'),
                    handler: function (data) {
                        if (item.lists.length > 0) {
                            _this.items.push(JSON.parse(JSON.stringify(item)));
                            item.lists = [];
                        }
                        item.nombreElemento = data.nombreElemento;
                        _this.globalVars.setItemsData(_this.items);
                        _this.sortItems(_this.orderSelected);
                    }
                }
            ]
        });
        edit.present();
    };
    /**
     * Even to add a new item
     *
     * @param {string} newItem
     * @memberof ItemsPage
     */
    ItemsPage.prototype.addItem = function (newItem) {
        this.log.logs[this.constructor.name].info('addItem:' + newItem);
        if (this.items.filter(function (item) { return item.nombreElemento.toLowerCase() === newItem.toLowerCase(); }).length === 0) {
            this.items.push({
                nombreElemento: newItem,
                category: this.defaultCategory
            });
            this.globalVars.setItemsData(this.items);
        }
        else {
            var toast = this.toastCtrl.create({
                message: 'This item already exists!',
                duration: 1000,
                position: 'bottom'
            });
            toast.present();
        }
    };
    /**
     * Event to sort items
     *
     * @param {number} orderBy
     * @memberof ItemsPage
     */
    ItemsPage.prototype.sortItems = function (orderBy) {
        this.log.logs[this.constructor.name].info('sortItems:' + orderBy);
        this.orderSelected = orderBy;
        switch (orderBy) {
            case 1:
                this.items = this.order.transform(this.items, ['+nombreElemento']);
                break;
            case 2:
                this.items = this.items.sort(function (a, b) {
                    if (a.category.categoryName < b.category.categoryName)
                        return -1;
                    if (a.category.categoryName > b.category.categoryName)
                        return 1;
                    return 0;
                });
                break;
            case 3:
                this.items = this.items.sort(function (a, b) {
                    if (a.category.measurement < b.category.measurement)
                        return -1;
                    if (a.category.measurement > b.category.measurement)
                        return 1;
                    return 0;
                });
                break;
        }
    };
    /**
     * Even to show options to sort items
     *
     * @param {any} event
     * @memberof ItemsPage
     */
    ItemsPage.prototype.reorder = function (event) {
        var _this = this;
        var reorder = this.alertCtrl.create();
        reorder.setTitle(this.translate.instant('Ordenar'));
        reorder.addInput({
            type: 'radio',
            label: this.translate.instant('Nombre'),
            value: '1',
            checked: this.orderSelected === 1
        });
        reorder.addInput({
            type: 'radio',
            label: this.translate.instant('Categoria'),
            value: '2',
            checked: this.orderSelected === 2
        });
        reorder.addInput({
            type: 'radio',
            label: this.translate.instant('PasoMedida'),
            value: '3',
            checked: this.orderSelected === 3
        });
        reorder.addButton(this.translate.instant('Cancelar'));
        reorder.addButton({
            text: this.translate.instant('OK'),
            handler: function (data) {
                _this.sortItems(Number.parseInt(data));
            }
        });
        reorder.present();
    };
    /**
     * Event to send a item to shopping list
     *
     * @param {any} event
     * @param {ListItem} item
     * @memberof ItemsPage
     */
    ItemsPage.prototype.sendToShoppingList = function (event, item) {
        var _this = this;
        this.log.logs[this.constructor.name].info('sendToShoppingList:' + item);
        var itemSelected = this.items[this.items.indexOf(item)];
        var newShoppingListItem = {
            category: itemSelected.category,
            nombreElemento: itemSelected.nombreElemento,
            colorElemento: '',
            colorBotones: '',
            nombreLista: 'LISTA_COMPRA',
            cantidadElemento: 1,
            caduca: false,
            fechaCaducidad: null,
            cantidadMinima: 1,
            marked: false
        };
        if (this.shoppingList.filter(function (element) { return element.nombreElemento.toLowerCase() === item.nombreElemento; }).length === 0) {
            this.items[this.items.indexOf(item)].lists.push(newShoppingListItem);
            this.shoppingList.push(newShoppingListItem);
            this.globalVars.setListData('LISTA_COMPRA', this.shoppingList);
        }
        else {
            var addAmount = this.alertCtrl.create();
            addAmount.setTitle(item.nombreElemento + ' already exists, choose an option');
            addAmount.addButton('Discard');
            addAmount.addButton({
                text: 'Add amount',
                handler: function (data) {
                    _this.shoppingList.filter(function (element) {
                        return element.nombreElemento.toLowerCase() ===
                            item.nombreElemento.toLowerCase();
                    })[0].cantidadElemento +=
                        item.cantidadElemento;
                    _this.globalVars.setListData('LISTA_COMPRA', _this.shoppingList);
                    _this.initializeItems(null);
                }
            });
            addAmount.present();
        }
    };
    ItemsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-items-page',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/items-page/items-page.html"*/'<ion-header>\n	<ion-navbar color="dark" [hidden]="searchBar">\n		<button ion-button menuToggle>\n			<ion-icon ios="ios-menu" md="md-menu"></ion-icon>\n		</button>\n		<ion-title>{{ \'Elementos\' | translate }}</ion-title>\n		<ion-buttons end>\n			<button ion-button secondary (click)="selectToSendShoppingList($event)">\n				<ion-icon class="icon-toolbar" ios="ios-basket" md="md-basket"></ion-icon>\n			</button>\n			<button ion-button secondary (click)="reorder($event)">\n				<ion-icon class="icon-toolbar" ios="ios-repeat" md="md-repeat"></ion-icon>\n			</button>\n			<button ion-button secondary (click)="toggleSearchBar($event)">\n				<ion-icon class="icon-toolbar" ios="ios-search" md="md-search"></ion-icon>\n			</button>\n		</ion-buttons>\n	</ion-navbar>\n	<ion-searchbar [hidden]="!searchBar" [(ngModel)]="searchItem" [showCancelButton]="true" [debounce]=500 [autocomplete]="true"\n	              (ionInput)="searchMatches($event)" (ionCancel)="toggleSearchBar($event)">\n	</ion-searchbar>\n</ion-header>\n\n<ion-content padding class="items">\n	<ion-list>\n		<ion-card *ngFor="let item of items; let i = index">\n			<ion-card-header>\n				<ion-row>\n					<ion-col width-50>\n						<div *ngIf="item.category">\n							<ion-avatar item-left class="category-icon">\n								<img class="icon" src="{{item.category.icon.src}}" (click)="changeItemCategory($event,item)" />\n								<h2 *ngIf="creating" class="labelCategory">{{item.category.categoryName}}</h2>\n							</ion-avatar>\n						</div>\n						<div *ngIf="!item.category">\n							<ion-avatar item-left class="category-icon">\n								<img class="icon" src="assets/images/icons/default.png" (click)="changeItemCategory($event,item)" />\n							</ion-avatar>\n						</div>\n					</ion-col>\n					<ion-col width-15>\n						<button class="buttonOperation" item-center primary large clear (click)="sendToShoppingList($event, item)">\n							<ion-icon ios="ios-basket" md="md-basket"></ion-icon>\n						</button>\n					</ion-col>\n					<ion-col width-15>\n						<button item-center secondary clear (click)="editItem($event,item)" class="buttonOperation">\n							<ion-icon ios="ios-create" md="md-create"></ion-icon>\n						</button>\n					</ion-col>\n					<ion-col width-15>\n						<button class="buttonOperation" item-center danger large clear (click)="removeItem($event, item)">\n							<ion-icon ios="ios-trash" md="md-trash"></ion-icon>\n						</button>\n					</ion-col>\n				</ion-row>\n				<ion-row>\n					<ion-col width-75>\n						<ion-item ion-item class="itemName">\n							<h2>{{item.nombreElemento}}</h2>\n						</ion-item>\n					</ion-col>\n				</ion-row>\n				<ion-row width-100 *ngIf="item.lists">\n					<ion-item (click)="discardOrShop($event,item)" *ngIf="item.lists.length==0">\n						<p class="item-advice">{{ \'NoTienes\' | translate }}</p>\n					</ion-item>\n					<ion-list inset *ngIf="item.lists.length>0">\n						<ion-item ion-item *ngFor="let list of item.lists">\n							<p class="item-info">\n								<ion-icon class="item-icon" ios="ios-eye" md="md-eye"></ion-icon>\n								{{ \'TienesEn\' | translate }} {{list.nombreLista}}\n							</p>\n							<ion-badge large item-right>{{list.cantidadElemento}}</ion-badge>\n							<p *ngIf="list.cantidadElemento==0" class="item-advice" (click)="discardOrShop($event,item)">{{ \'HayQueComprar\' | translate }}</p>\n						</ion-item>\n					</ion-list>\n				</ion-row>\n			</ion-card-header>\n		</ion-card>\n	</ion-list>\n</ion-content>\n<ion-footer>\n	<bottom-buttons-component [type]="type" [object]="items" [add]=true [remove]=true [notifications]=false [favorites]=false\n	 (finishedAdd)="addItem($event)" (finishedRemoved)="removeElements($event,category)">\n	</bottom-buttons-component>\n</ion-footer>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/items-page/items-page.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__pipes_pipefilterElements__["a" /* PipeFilterElements */], __WEBPACK_IMPORTED_MODULE_3__pipes_orderBy__["a" /* OrderBy */], __WEBPACK_IMPORTED_MODULE_5__providers_categories_categoriesService__["a" /* CategoriesService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__pipes_orderBy__["a" /* OrderBy */],
            __WEBPACK_IMPORTED_MODULE_5__providers_categories_categoriesService__["a" /* CategoriesService */],
            __WEBPACK_IMPORTED_MODULE_6__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_4__pipes_pipefilterElements__["a" /* PipeFilterElements */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_7__providers_log_log__["a" /* Log */],
            __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__["c" /* TranslateService */]])
    ], ItemsPage);
    return ItemsPage;
}());

//# sourceMappingURL=items-page.js.map

/***/ }),

/***/ 601:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__list_page_list_page__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_contacts__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Page to manage the list of lists
 *
 * @export
 * @class ListsPage
 */
var ListsPage = /** @class */ (function () {
    function ListsPage(actionSheetCtrl, nav, navParams, mod, alertCtrl, globalVars, toastCtrl, log, translate, contacts) {
        this.actionSheetCtrl = actionSheetCtrl;
        this.nav = nav;
        this.navParams = navParams;
        this.mod = mod;
        this.alertCtrl = alertCtrl;
        this.globalVars = globalVars;
        this.toastCtrl = toastCtrl;
        this.log = log;
        this.translate = translate;
        this.contacts = contacts;
        this.type = 'List';
        this.lists = [];
        this.log.setLogger(this.constructor.name);
    }
    ListsPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.log.logs[this.constructor.name].info('ionViewDidLoad');
        this.globalVars.getListsData().then(function (data) {
            _this.lists = data;
            _this.reorderAllowed = false;
        });
    };
    /**
     * Event to allow reorder the lists or not
     *
     * @param {any} event
     * @memberof ListsPage
     */
    ListsPage.prototype.reorder = function (event) {
        this.reorderAllowed = !this.reorderAllowed;
    };
    /**
     * Event to reorder lists as user select
     *
     * @param {any} indexes
     * @memberof ListsPage
     */
    ListsPage.prototype.reorderItems = function (indexes) {
        var element = this.lists[indexes.from];
        this.lists.splice(indexes.from, 1);
        this.lists.splice(indexes.to, 0, element);
    };
    /**
     * Event to remove a list
     *
     * @param {any} event
     * @param {string} name
     * @memberof ListsPage
     */
    ListsPage.prototype.removeList = function (event, name) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeList:' + name);
        var confirm = this.alertCtrl.create({
            title: this.translate.instant('Borrando', { value: name }),
            message: this.translate.instant('PreguntaBorrarLista', { value: name }),
            buttons: [
                {
                    text: this.translate.instant('No'),
                    handler: function () { }
                },
                {
                    text: this.translate.instant('Si'),
                    handler: function () {
                        _this.lists = _this.lists.filter(function (list) { return list.nombreLista !== name; });
                        _this.globalVars.setListsData(_this.lists);
                        _this.globalVars.removetItemListData(name);
                    }
                }
            ]
        });
        confirm.present();
    };
    /**
     * Event to edit the color of a list
     *
     * @param {any} event
     * @param {List} list
     * @memberof ListsPage
     */
    ListsPage.prototype.editColor = function (event, list) {
        var _this = this;
        this.log.logs[this.constructor.name].info('editColor:' + list);
        this.globalVars.getColorsData().then(function (data) {
            var buttons = [];
            var colorsList = JSON.parse(JSON.stringify(data));
            colorsList.forEach(function (colorData) {
                if (colorData.cssClass !== list.colorLista) {
                    buttons.push({
                        text: colorData.color,
                        cssClass: colorData.cssClass,
                        handler: function () {
                            list.colorLista = colorData.cssClass;
                            list.colorBotones = colorData.buttons;
                            _this.globalVars.setListsData(_this.lists);
                        }
                    });
                }
            });
            var actionSheet = _this.actionSheetCtrl.create({
                title: _this.translate.instant('CambiarColorLista'),
                buttons: buttons
            });
            actionSheet.present();
        });
    };
    /**
     * Event to edit the name of a list
     *
     * @param {any} event
     * @param {List} list
     * @memberof ListsPage
     */
    ListsPage.prototype.editList = function (event, list) {
        var _this = this;
        this.log.logs[this.constructor.name].info('editList:' + list);
        var oldName = list.nombreLista;
        var edit = this.alertCtrl.create({
            title: this.translate.instant('EditarLista'),
            inputs: [
                {
                    name: 'nombreLista',
                    value: oldName,
                    type: 'text',
                    placeholder: this.translate.instant('Nombre')
                }
            ],
            buttons: [
                {
                    text: this.translate.instant('Cancelar'),
                    role: 'cancel'
                },
                {
                    text: this.translate.instant('Confirmar'),
                    handler: function (data) {
                        _this.globalVars.getListData(oldName).then(function (listData) {
                            list.nombreLista = data.nombreLista;
                            _this.globalVars.setListsData(_this.lists);
                            _this.globalVars.setListData(data.nombreLista, listData);
                            _this.globalVars.removetItemListData(oldName);
                        });
                    }
                }
            ]
        });
        edit.present();
    };
    /**
     * Event to add a new list
     *
     * @param {string} newList
     * @memberof ListsPage
     */
    ListsPage.prototype.addList = function (newList) {
        this.log.logs[this.constructor.name].info('addList:' + newList);
        if (this.lists.filter(function (list) { return list.nombreLista.toLowerCase() === newList.toLowerCase(); }).length === 0) {
            this.lists.push({
                nombreLista: newList,
                colorLista: 'white-list',
                colorBotones: 'black-buttons',
                listaEditable: true
            });
            this.globalVars.setListsData(this.lists);
            this.globalVars.setListData(newList, []);
        }
        else {
            var toast = this.toastCtrl.create({
                message: this.translate.instant('Esta lista ya existe!'),
                duration: 1000,
                position: 'bottom'
            });
            toast.present();
        }
    };
    /**
     * Event to remove a list of lists selected
     *
     * @param {string[]} removed
     * @memberof ListsPage
     */
    ListsPage.prototype.removeLists = function (removed) {
        var _this = this;
        this.log.logs[this.constructor.name].info('removeLists:' + removed);
        this.lists = this.lists.filter(function (list) { return removed.indexOf(list.nombreLista) < 0; });
        this.globalVars.setListsData(this.lists);
        removed.forEach(function (listToRemove) {
            _this.globalVars.removetItemListData(listToRemove);
        });
    };
    /**
     * Event to navigate to selected list
     *
     * @param {any} event
     * @param {List} list
     * @memberof ListsPage
     */
    ListsPage.prototype.listSelected = function (event, list) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_4__list_page_list_page__["a" /* ListPage */], {
            list: list
        });
    };
    ListsPage.prototype.shareList = function (event, list) {
        this.contacts.find(["*"])
            .then(function (res) {
            var datosMostar = [];
            res.map(function (item) {
                // TODO:
                //  Filtrar por los usuarios de la app en firebase, por email y/o teléfono
                //  Mostrar selector de usuarios, diferenciando entre contactos y contactos con la app
                //  Enviar notificación al usuario a través de la función de firebase
                console.log({ funcion: 'CargarListaContactos', item: item });
            });
        }, function (error) {
            console.log({ error: error });
        });
    };
    ListsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-lists-page',template:/*ion-inline-start:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/lists-page/lists-page.html"*/'<ion-header>\n	<ion-navbar color="dark">\n		<button ion-button menuToggle>\n			<ion-icon ios="ios-menu" md="md-menu"></ion-icon>\n		</button>\n		<ion-title>{{ \'Listas\' | translate }}</ion-title>\n		<ion-buttons end>\n			<button (click)="reorder($event)">\n				<ion-icon secondary class="reorderAllowed icon-toolbar" *ngIf="reorderAllowed" ios="ios-repeat" md="md-repeat"></ion-icon>\n				<ion-icon secondary class="reorderNotAllowed icon-toolbar" *ngIf="!reorderAllowed" ios="ios-repeat" md="md-repeat"></ion-icon>\n			</button>\n		</ion-buttons>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding class="lists">\n	<ion-list inset reorder="{{reorderAllowed}}" (ionItemReorder)="reorderItems($event)">\n		<div *ngFor="let list of lists">\n			<ion-card ion-item *ngIf="list.nombreLista!==\'LISTA_COMPRA\'" class="listCard" [ngClass]="list.colorLista">\n				<ion-card-header>\n					<ion-grid>\n						<ion-row>\n							<ion-col (click)="listSelected($event, list.nombreLista)">\n								<ion-icon class="listName" dark large ios="ios-clipboard-outline" md="md-clipboard" [ngClass]="list.colorBotones">\n									{{list.nombreLista}}\n								</ion-icon>\n							</ion-col>\n						</ion-row>\n						<ion-row>\n							<ion-col col-2 offset-6>\n								<button item-center secondary clear (click)="editList($event,list)" class="buttonOperation" *ngIf="list.listaEditable" [ngClass]="list.colorBotones">\n									<ion-icon ios="ios-create" md="md-create"></ion-icon>\n								</button>\n							</ion-col>\n							<ion-col col-2>\n								<button item-center secondary clear (click)="editColor($event,list)" class="buttonOperation" *ngIf="list.listaEditable" [ngClass]="list.colorBotones">\n									<ion-icon ios="ios-color-palette" md="md-color-palette"></ion-icon>\n								</button>\n							</ion-col>\n							<ion-col col-2>\n								<button item-center danger clear (click)="removeList($event, list.nombreLista)" class="buttonOperation" *ngIf="list.listaEditable"\n								 [ngClass]="list.colorBotones">\n									<ion-icon ios="ios-trash" md="md-trash"></ion-icon>\n								</button>\n							</ion-col>\n						</ion-row>\n					</ion-grid>\n				</ion-card-header>\n				<ion-card-content>\n					<p class="info-list-items">\n						<ion-icon large primary ios="ios-cart" md="md-cart" class="iconListAdvice" [ngClass]="list.colorBotones">\n							Tienes\n							<ion-badge large item-right class="badge-info-list-items">4</ion-badge>elementos que deberías comprar\n						</ion-icon>\n					</p>\n					<p class="info-list-items">\n						<ion-icon large danger ios="ios-warning" md="md-warning" class="iconListAdvice" [ngClass]="list.colorBotones">\n							Tienes\n							<ion-badge large item-right class="badge-info-list-items">3</ion-badge>elementos cercanos a caducar\n						</ion-icon>\n					</p>\n				</ion-card-content>\n			</ion-card>\n		</div>\n	</ion-list>\n</ion-content>\n<ion-footer>\n	<bottom-buttons-component [type]="type" [object]="lists" [add]=true [remove]=true [notifications]=false [favorites]=false\n	 (finishedAdd)="addList($event)" (finishedRemoved)="removeLists($event,lists)">\n	</bottom-buttons-component>\n</ion-footer>\n'/*ion-inline-end:"/Users/danielcontrerasaladro/Documents/Projects/Alacena/src/pages/lists-page/lists-page.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_6__providers_log_log__["a" /* Log */],
            __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_contacts__["a" /* Contacts */]])
    ], ListsPage);
    return ListsPage;
}());

//# sourceMappingURL=lists-page.js.map

/***/ }),

/***/ 602:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(603);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(607);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 607:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export loadConfiguration */
/* unused harmony export createTranslateLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_admob_free__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_google_plus__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_storage__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_ionic2_auto_complete__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_app_version__ = __webpack_require__(411);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_camera__ = __webpack_require__(929);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_image_picker__ = __webpack_require__(930);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_file__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_mocks_file__ = __webpack_require__(931);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_fcm__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_insomnia__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_contacts__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ngx_translate_core__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ngx_translate_http_loader__ = __webpack_require__(932);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_ionic_configuration_service__ = __webpack_require__(414);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23_ionic_logging_service__ = __webpack_require__(415);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ionic_native_phonegap_local_notification__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ionic_native_local_notifications__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_reminders_component_reminders_component__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__components_items_best_before_component_items_best_before_component__ = __webpack_require__(544);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__components_items_needed_component_items_needed_component__ = __webpack_require__(588);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__components_bottom_buttons_component_bottom_buttons_component__ = __webpack_require__(1020);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__components_item_data_item_data__ = __webpack_require__(1021);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_about_page_about_page__ = __webpack_require__(591);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_backup_page_backup_page__ = __webpack_require__(592);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_categorys_page_categorys_page__ = __webpack_require__(594);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__components_icons_list_icons__ = __webpack_require__(590);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__components_category_info_category_info__ = __webpack_require__(595);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_config_page_config_page__ = __webpack_require__(596);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_dashboard_page_dashboard_page__ = __webpack_require__(597);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__components_item_info_item_info__ = __webpack_require__(599);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_items_page_items_page__ = __webpack_require__(600);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__pages_list_page_list_page__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__pages_lists_page_lists_page__ = __webpack_require__(601);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__providers_auth_auth_service__ = __webpack_require__(598);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__providers_categories_categoriesService__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__providers_categorys_provider__ = __webpack_require__(545);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__providers_data_cloudStorage__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__providers_config_provider__ = __webpack_require__(584);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__providers_items_provider__ = __webpack_require__(585);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__providers_list_provider__ = __webpack_require__(586);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__providers_lists_provider__ = __webpack_require__(587);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__providers_reminders_provider__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__providers_backup_data_backup_data__ = __webpack_require__(593);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__providers_data_localStorage__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__providers_default_icons_default_icons__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__providers_log_log__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__app_component__ = __webpack_require__(1024);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__providers_rate_service_rate_service__ = __webpack_require__(1025);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


























































function loadConfiguration(configurationService) {
    return function () { return configurationService.load('assets/settings.json'); };
}
function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_21__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, './assets/i18n/', '.json');
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_56__app_component__["a" /* Alacena */],
                __WEBPACK_IMPORTED_MODULE_37__pages_dashboard_page_dashboard_page__["a" /* DashboardPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_list_page_list_page__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_lists_page_lists_page__["a" /* ListsPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_items_page_items_page__["a" /* ItemsPage */],
                __WEBPACK_IMPORTED_MODULE_38__components_item_info_item_info__["a" /* ItemInfoPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_config_page_config_page__["a" /* ConfigPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_about_page_about_page__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_backup_page_backup_page__["a" /* BackupPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_categorys_page_categorys_page__["a" /* CategorysPage */],
                __WEBPACK_IMPORTED_MODULE_30__components_item_data_item_data__["a" /* Item */],
                __WEBPACK_IMPORTED_MODULE_29__components_bottom_buttons_component_bottom_buttons_component__["a" /* BottomButtonsComponent */],
                __WEBPACK_IMPORTED_MODULE_34__components_icons_list_icons__["a" /* ListIconsPage */],
                __WEBPACK_IMPORTED_MODULE_35__components_category_info_category_info__["a" /* CategoryInfoPage */],
                __WEBPACK_IMPORTED_MODULE_26__components_reminders_component_reminders_component__["a" /* RemindersComponent */],
                __WEBPACK_IMPORTED_MODULE_27__components_items_best_before_component_items_best_before_component__["a" /* ItemsBestBeforeComponent */],
                __WEBPACK_IMPORTED_MODULE_28__components_items_needed_component_items_needed_component__["a" /* ItemsNeededComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_11_ionic2_auto_complete__["b" /* AutoCompleteModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_10_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_56__app_component__["a" /* Alacena */], {
                    backButtonText: '',
                    modalEnter: 'modal-slide-in',
                    modalLeave: 'modal-slide-out',
                    spinner: 'bubbles',
                    loadingEnter: 'slide-in',
                    loadingLEave: 'slide-out',
                    pageTransition: 'slide'
                }, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_9__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_20__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                    loader: {
                        provide: __WEBPACK_IMPORTED_MODULE_20__ngx_translate_core__["a" /* TranslateLoader */],
                        useFactory: (createTranslateLoader),
                        deps: [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]]
                    }
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_10_ionic_angular__["d" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_56__app_component__["a" /* Alacena */],
                __WEBPACK_IMPORTED_MODULE_37__pages_dashboard_page_dashboard_page__["a" /* DashboardPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_list_page_list_page__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_lists_page_lists_page__["a" /* ListsPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_items_page_items_page__["a" /* ItemsPage */],
                __WEBPACK_IMPORTED_MODULE_38__components_item_info_item_info__["a" /* ItemInfoPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_config_page_config_page__["a" /* ConfigPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_about_page_about_page__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_backup_page_backup_page__["a" /* BackupPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_categorys_page_categorys_page__["a" /* CategorysPage */],
                __WEBPACK_IMPORTED_MODULE_30__components_item_data_item_data__["a" /* Item */],
                __WEBPACK_IMPORTED_MODULE_29__components_bottom_buttons_component_bottom_buttons_component__["a" /* BottomButtonsComponent */],
                __WEBPACK_IMPORTED_MODULE_34__components_icons_list_icons__["a" /* ListIconsPage */],
                __WEBPACK_IMPORTED_MODULE_35__components_category_info_category_info__["a" /* CategoryInfoPage */],
                __WEBPACK_IMPORTED_MODULE_26__components_reminders_component_reminders_component__["a" /* RemindersComponent */],
                __WEBPACK_IMPORTED_MODULE_27__components_items_best_before_component_items_best_before_component__["a" /* ItemsBestBeforeComponent */],
                __WEBPACK_IMPORTED_MODULE_28__components_items_needed_component_items_needed_component__["a" /* ItemsNeededComponent */]
            ],
            providers: [
                //{provide: ErrorHandler, useClass: SentryErrorHandler},
                //test and maybe change
                //{provide: ErrorHandler, useClass: IonicErrorHandler}
                __WEBPACK_IMPORTED_MODULE_22_ionic_configuration_service__["a" /* ConfigurationService */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* APP_INITIALIZER */],
                    useFactory: loadConfiguration,
                    deps: [__WEBPACK_IMPORTED_MODULE_22_ionic_configuration_service__["a" /* ConfigurationService */]],
                    multi: true
                },
                __WEBPACK_IMPORTED_MODULE_17__ionic_native_fcm__["a" /* FCM */],
                __WEBPACK_IMPORTED_MODULE_18__ionic_native_insomnia__["a" /* Insomnia */],
                __WEBPACK_IMPORTED_MODULE_19__ionic_native_contacts__["a" /* Contacts */],
                __WEBPACK_IMPORTED_MODULE_23_ionic_logging_service__["a" /* LoggingService */],
                __WEBPACK_IMPORTED_MODULE_55__providers_log_log__["a" /* Log */],
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_admob_free__["a" /* AdMobFree */],
                __WEBPACK_IMPORTED_MODULE_12__ionic_native_app_version__["a" /* AppVersion */],
                __WEBPACK_IMPORTED_MODULE_13__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_image_picker__["a" /* ImagePicker */],
                //File,
                { provide: __WEBPACK_IMPORTED_MODULE_15__ionic_native_file__["a" /* File */], useClass: __WEBPACK_IMPORTED_MODULE_16__ionic_native_mocks_file__["a" /* FileMock */] },
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_google_plus__["a" /* GooglePlus */],
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_45__providers_data_cloudStorage__["a" /* CloudStorage */],
                __WEBPACK_IMPORTED_MODULE_52__providers_data_localStorage__["a" /* LocalStorage */],
                __WEBPACK_IMPORTED_MODULE_43__providers_categories_categoriesService__["a" /* CategoriesService */],
                __WEBPACK_IMPORTED_MODULE_53__providers_default_icons_default_icons__["a" /* DefaultIcons */],
                __WEBPACK_IMPORTED_MODULE_44__providers_categorys_provider__["a" /* CategorysProvider */],
                __WEBPACK_IMPORTED_MODULE_49__providers_lists_provider__["a" /* ListsProvider */],
                __WEBPACK_IMPORTED_MODULE_48__providers_list_provider__["a" /* ListProvider */],
                __WEBPACK_IMPORTED_MODULE_47__providers_items_provider__["a" /* ItemsProvider */],
                __WEBPACK_IMPORTED_MODULE_50__providers_reminders_provider__["a" /* RemindersProvider */],
                __WEBPACK_IMPORTED_MODULE_51__providers_backup_data_backup_data__["a" /* BackupData */],
                __WEBPACK_IMPORTED_MODULE_38__components_item_info_item_info__["a" /* ItemInfoPage */],
                __WEBPACK_IMPORTED_MODULE_46__providers_config_provider__["a" /* ConfigProvider */],
                __WEBPACK_IMPORTED_MODULE_24__ionic_native_phonegap_local_notification__["a" /* PhonegapLocalNotification */],
                __WEBPACK_IMPORTED_MODULE_25__ionic_native_local_notifications__["a" /* LocalNotifications */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_54__providers_global_vars_global_vars__["a" /* GlobalVars */],
                __WEBPACK_IMPORTED_MODULE_42__providers_auth_auth_service__["a" /* AuthService */],
                __WEBPACK_IMPORTED_MODULE_57__providers_rate_service_rate_service__["a" /* RateServiceProvider */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* CUSTOM_ELEMENTS_SCHEMA */]]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 69:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CloudStorage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_operator_map__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_timezone__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_moment_timezone__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Provider to manage cloud storage of logged user
 *
 * @export
 * @class CloudStorage
 */
var CloudStorage = /** @class */ (function () {
    function CloudStorage(http, log) {
        this.http = http;
        this.log = log;
        this.log.setLogger(this.constructor.name);
    }
    CloudStorage.prototype.setUserToken = function (token, uid) {
        this.log.logs[this.constructor.name].info('setUserToken:' + uid + ':' + token);
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
            .database()
            .ref('tokens/' + uid)
            .set(token);
    };
    /**
     * Get config data
     *
     * @param {string} uid
     * @returns
     * @memberof CloudStorage
     */
    CloudStorage.prototype.loadConfigData = function (uid) {
        this.log.logs[this.constructor.name].info('loadConfigData:' + uid);
        return new Promise(function (resolve) {
            var ref = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.database().ref('/config/');
            ref.once('value').then(function (snapshot) {
                var object = JSON.parse(JSON.stringify(snapshot));
                if (object && object[uid]) {
                    var configs = JSON.parse(JSON.stringify(object[uid]));
                    var configArray = [];
                    for (var key in configs) {
                        if (configs.hasOwnProperty(key)) {
                            var config = JSON.parse(JSON.stringify(configs[key]));
                            configArray.push(config);
                        }
                    }
                    var data = JSON.parse(JSON.stringify(configArray[0]));
                    var languages = [];
                    for (var key in data.idiomas) {
                        if (data.idiomas.hasOwnProperty(key)) {
                            var language = JSON.parse(JSON.stringify(data.idiomas[key]));
                            languages.push(language);
                        }
                    }
                    data.idiomas = languages;
                    resolve(data);
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    /**
     * Get elements data
     *
     * @param {string} uid
     * @returns
     * @memberof CloudStorage
     */
    CloudStorage.prototype.loadElementData = function (uid) {
        this.log.logs[this.constructor.name].info('loadElementData:' + uid);
        return new Promise(function (resolve) {
            var ref = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.database().ref('/lists/');
            ref.once('value').then(function (snapshot) {
                var object = JSON.parse(JSON.stringify(snapshot));
                if (object && object[uid]) {
                    var lists = JSON.parse(JSON.stringify(object[uid]));
                    var listArray = [];
                    for (var key in lists) {
                        if (lists.hasOwnProperty(key)) {
                            var list = JSON.parse(JSON.stringify(lists[key]));
                            listArray.push(list);
                        }
                    }
                    resolve(listArray);
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    /**
     * Get data of a list provided
     *
     * @param {string} name
     * @param {string} uid
     * @returns
     * @memberof CloudStorage
     */
    CloudStorage.prototype.loadListData = function (name, uid) {
        var _this = this;
        this.log.logs[this.constructor.name].info('loadListData:' + uid);
        return new Promise(function (resolve) {
            var ref = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
                .database()
                .ref('/listItems/' + uid + '_' + name + '/URL');
            var content = _this.http;
            ref.on('value', function (snapshot) {
                var storageRef = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
                    .storage()
                    .ref('/lists/' + uid + '_' + name + '.json');
                storageRef.getDownloadURL().then(function (url) {
                    content
                        .get(url)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (data) {
                        resolve(data);
                    }, function (error) {
                        resolve(null);
                    });
                }, function (error) {
                    resolve(null);
                });
            });
        });
    };
    /**
     * Upload data for a list provided
     *
     * @param {string} name
     * @param {ListItem[]} data
     * @param {string} uid
     * @memberof CloudStorage
     */
    CloudStorage.prototype.uploadListData = function (name, data, uid) {
        this.log.logs[this.constructor.name].info('uploadListData:' + uid + ':' + name);
        var storage = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.storage();
        var fileName = uid + '_' + name + '.json';
        var fileRef = storage.ref('lists/' + fileName);
        var uploadTask = fileRef.putString(JSON.stringify(data));
        uploadTask.on('state_changed', function (snapshot) { }, function (error) { }, function () {
            var dataToSave = {
                URL: uploadTask.snapshot.downloadURL,
                name: uploadTask.snapshot.metadata.name,
                owners: [uid],
                lastUpdated: __WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz(__WEBPACK_IMPORTED_MODULE_4_moment_timezone___default.a.tz.guess()).format()
            };
            __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
                .database()
                .ref('listItems/' + uid + '_' + name)
                .set(dataToSave);
        });
    };
    /**
     * Remove data of a favorite list provided
     *
     * @param {string} name
     * @param {string} uid
     * @memberof CloudStorage
     */
    CloudStorage.prototype.removeFavoritesListData = function (name, uid) {
        this.log.logs[this.constructor.name].info('removeFavoritesListData:' + uid + ':' + name);
        var storage = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.storage();
        var fileName = uid + '_' + name + '.json';
        var fileRef = storage.ref('favorites/' + fileName);
        fileRef.delete();
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
            .database()
            .ref('listItems/' + uid + '_' + name)
            .remove();
    };
    /**
     * Remove data of a list provided
     *
     * @param {string} name
     * @param {string} uid
     * @memberof CloudStorage
     */
    CloudStorage.prototype.removeListData = function (name, uid) {
        this.log.logs[this.constructor.name].info('removeListData:' + uid + ':' + name);
        var storage = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.storage();
        var fileName = uid + '_' + name + '.json';
        var fileRef = storage.ref('lists/' + fileName);
        fileRef.delete();
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
            .database()
            .ref('listItems/' + uid + '_' + name)
            .remove();
    };
    /**
     * Upload data of favorites lists
     *
     * @param {List[]} lists
     * @param {string} uid
     * @memberof CloudStorage
     */
    CloudStorage.prototype.uploadFavoritesListsData = function (lists, uid) {
        this.log.logs[this.constructor.name].info('uploadFavoritesListsData:' + uid);
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
            .database()
            .ref('favorites/' + uid)
            .set(lists);
    };
    /**
     * Upload data of lists
     *
     * @param {List[]} lists
     * @param {string} uid
     * @memberof CloudStorage
     */
    CloudStorage.prototype.uploadListsData = function (lists, uid) {
        this.log.logs[this.constructor.name].info('uploadListsData:' + uid);
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
            .database()
            .ref('lists/' + uid)
            .set(lists);
    };
    /**
     * Upload config data
     *
     * @param {*} configs
     * @param {string} uid
     * @memberof CloudStorage
     */
    CloudStorage.prototype.uploadConfigData = function (configs, uid) {
        this.log.logs[this.constructor.name].info('uploadConfigData:' + uid);
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
            .database()
            .ref('config/' + uid)
            .set(configs);
    };
    /**
     * Upload elements data
     *
     * @param {Item[]} items
     * @param {string} uid
     * @memberof CloudStorage
     */
    CloudStorage.prototype.uploadItemsData = function (items, uid) {
        this.log.logs[this.constructor.name].info('uploadItemsData:' + uid);
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
            .database()
            .ref('elements/' + uid)
            .set(items);
    };
    /**
     * Upload categories data
     *
     * @param {Category[]} categories
     * @param {string} uid
     * @memberof CloudStorage
     */
    CloudStorage.prototype.uploadCategoriesData = function (categories, uid) {
        this.log.logs[this.constructor.name].info('uploadCategoriesData:' + uid);
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a
            .database()
            .ref('categories/' + uid)
            .set(categories);
    };
    /**
     * Get favorites lists data
     *
     * @param {string} uid
     * @returns
     * @memberof CloudStorage
     */
    CloudStorage.prototype.loadFavoritesListsData = function (uid) {
        this.log.logs[this.constructor.name].info('loadFavoritesListsData:' + uid);
        return new Promise(function (resolve) {
            var ref = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.database().ref('/favorites/');
            ref.once('value').then(function (snapshot) {
                var object = JSON.parse(JSON.stringify(snapshot));
                if (object && object[uid]) {
                    var lists = JSON.parse(JSON.stringify(object[uid]));
                    var listArray = [];
                    for (var key in lists) {
                        if (lists.hasOwnProperty(key)) {
                            var list = JSON.parse(JSON.stringify(lists[key]));
                            listArray.push(list);
                        }
                    }
                    resolve(listArray);
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    /**
     * Get lists data
     *
     * @param {string} uid
     * @returns
     * @memberof CloudStorage
     */
    CloudStorage.prototype.loadListsData = function (uid) {
        this.log.logs[this.constructor.name].info('loadListsData:' + uid);
        return new Promise(function (resolve) {
            var ref = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.database().ref('/lists/');
            ref.once('value').then(function (snapshot) {
                var object = JSON.parse(JSON.stringify(snapshot));
                if (object && object[uid]) {
                    var lists = JSON.parse(JSON.stringify(object[uid]));
                    var listArray = [];
                    for (var key in lists) {
                        if (lists.hasOwnProperty(key)) {
                            var list = JSON.parse(JSON.stringify(lists[key]));
                            listArray.push(list);
                        }
                    }
                    resolve(listArray);
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    /**
     * Get elements data
     *
     * @param {string} uid
     * @returns
     * @memberof CloudStorage
     */
    CloudStorage.prototype.loadItemsData = function (uid) {
        this.log.logs[this.constructor.name].info('loadItemsData:' + uid);
        return new Promise(function (resolve) {
            var ref = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.database().ref('/elements/');
            ref.once('value').then(function (snapshot) {
                var object = JSON.parse(JSON.stringify(snapshot));
                if (object && object[uid]) {
                    var items = JSON.parse(JSON.stringify(object[uid]));
                    var itemsArray = [];
                    for (var key in items) {
                        if (items.hasOwnProperty(key)) {
                            var item = JSON.parse(JSON.stringify(items[key]));
                            itemsArray.push(item);
                        }
                    }
                    resolve(itemsArray);
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    /**
     * Get categories data
     *
     * @param {string} uid
     * @returns
     * @memberof CloudStorage
     */
    CloudStorage.prototype.loadCategoriesData = function (uid) {
        this.log.logs[this.constructor.name].info('loadCategoriesData:' + uid);
        return new Promise(function (resolve) {
            var ref = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.database().ref('/categories/');
            ref.once('value').then(function (snapshot) {
                var object = JSON.parse(JSON.stringify(snapshot));
                if (object && object[uid]) {
                    var categories = JSON.parse(JSON.stringify(object[uid]));
                    var categoriesArray = [];
                    for (var key in categories) {
                        if (categories.hasOwnProperty(key)) {
                            var category = JSON.parse(JSON.stringify(categories[key]));
                            categoriesArray.push(category);
                        }
                    }
                    resolve(categoriesArray);
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    CloudStorage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_5__log_log__["a" /* Log */]])
    ], CloudStorage);
    return CloudStorage;
}());

//# sourceMappingURL=cloudStorage.js.map

/***/ }),

/***/ 938:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 417,
	"./af.js": 417,
	"./ar": 418,
	"./ar-dz": 419,
	"./ar-dz.js": 419,
	"./ar-kw": 420,
	"./ar-kw.js": 420,
	"./ar-ly": 421,
	"./ar-ly.js": 421,
	"./ar-ma": 422,
	"./ar-ma.js": 422,
	"./ar-sa": 423,
	"./ar-sa.js": 423,
	"./ar-tn": 424,
	"./ar-tn.js": 424,
	"./ar.js": 418,
	"./az": 425,
	"./az.js": 425,
	"./be": 426,
	"./be.js": 426,
	"./bg": 427,
	"./bg.js": 427,
	"./bm": 428,
	"./bm.js": 428,
	"./bn": 429,
	"./bn.js": 429,
	"./bo": 430,
	"./bo.js": 430,
	"./br": 431,
	"./br.js": 431,
	"./bs": 432,
	"./bs.js": 432,
	"./ca": 433,
	"./ca.js": 433,
	"./cs": 434,
	"./cs.js": 434,
	"./cv": 435,
	"./cv.js": 435,
	"./cy": 436,
	"./cy.js": 436,
	"./da": 437,
	"./da.js": 437,
	"./de": 438,
	"./de-at": 439,
	"./de-at.js": 439,
	"./de-ch": 440,
	"./de-ch.js": 440,
	"./de.js": 438,
	"./dv": 441,
	"./dv.js": 441,
	"./el": 442,
	"./el.js": 442,
	"./en-SG": 443,
	"./en-SG.js": 443,
	"./en-au": 444,
	"./en-au.js": 444,
	"./en-ca": 445,
	"./en-ca.js": 445,
	"./en-gb": 446,
	"./en-gb.js": 446,
	"./en-ie": 447,
	"./en-ie.js": 447,
	"./en-il": 448,
	"./en-il.js": 448,
	"./en-nz": 449,
	"./en-nz.js": 449,
	"./eo": 450,
	"./eo.js": 450,
	"./es": 451,
	"./es-do": 452,
	"./es-do.js": 452,
	"./es-us": 453,
	"./es-us.js": 453,
	"./es.js": 451,
	"./et": 454,
	"./et.js": 454,
	"./eu": 455,
	"./eu.js": 455,
	"./fa": 456,
	"./fa.js": 456,
	"./fi": 457,
	"./fi.js": 457,
	"./fo": 458,
	"./fo.js": 458,
	"./fr": 459,
	"./fr-ca": 460,
	"./fr-ca.js": 460,
	"./fr-ch": 461,
	"./fr-ch.js": 461,
	"./fr.js": 459,
	"./fy": 462,
	"./fy.js": 462,
	"./ga": 463,
	"./ga.js": 463,
	"./gd": 464,
	"./gd.js": 464,
	"./gl": 465,
	"./gl.js": 465,
	"./gom-latn": 466,
	"./gom-latn.js": 466,
	"./gu": 467,
	"./gu.js": 467,
	"./he": 468,
	"./he.js": 468,
	"./hi": 469,
	"./hi.js": 469,
	"./hr": 470,
	"./hr.js": 470,
	"./hu": 471,
	"./hu.js": 471,
	"./hy-am": 472,
	"./hy-am.js": 472,
	"./id": 473,
	"./id.js": 473,
	"./is": 474,
	"./is.js": 474,
	"./it": 475,
	"./it-ch": 476,
	"./it-ch.js": 476,
	"./it.js": 475,
	"./ja": 477,
	"./ja.js": 477,
	"./jv": 478,
	"./jv.js": 478,
	"./ka": 479,
	"./ka.js": 479,
	"./kk": 480,
	"./kk.js": 480,
	"./km": 481,
	"./km.js": 481,
	"./kn": 482,
	"./kn.js": 482,
	"./ko": 483,
	"./ko.js": 483,
	"./ku": 484,
	"./ku.js": 484,
	"./ky": 485,
	"./ky.js": 485,
	"./lb": 486,
	"./lb.js": 486,
	"./lo": 487,
	"./lo.js": 487,
	"./lt": 488,
	"./lt.js": 488,
	"./lv": 489,
	"./lv.js": 489,
	"./me": 490,
	"./me.js": 490,
	"./mi": 491,
	"./mi.js": 491,
	"./mk": 492,
	"./mk.js": 492,
	"./ml": 493,
	"./ml.js": 493,
	"./mn": 494,
	"./mn.js": 494,
	"./mr": 495,
	"./mr.js": 495,
	"./ms": 496,
	"./ms-my": 497,
	"./ms-my.js": 497,
	"./ms.js": 496,
	"./mt": 498,
	"./mt.js": 498,
	"./my": 499,
	"./my.js": 499,
	"./nb": 500,
	"./nb.js": 500,
	"./ne": 501,
	"./ne.js": 501,
	"./nl": 502,
	"./nl-be": 503,
	"./nl-be.js": 503,
	"./nl.js": 502,
	"./nn": 504,
	"./nn.js": 504,
	"./pa-in": 505,
	"./pa-in.js": 505,
	"./pl": 506,
	"./pl.js": 506,
	"./pt": 507,
	"./pt-br": 508,
	"./pt-br.js": 508,
	"./pt.js": 507,
	"./ro": 509,
	"./ro.js": 509,
	"./ru": 510,
	"./ru.js": 510,
	"./sd": 511,
	"./sd.js": 511,
	"./se": 512,
	"./se.js": 512,
	"./si": 513,
	"./si.js": 513,
	"./sk": 514,
	"./sk.js": 514,
	"./sl": 515,
	"./sl.js": 515,
	"./sq": 516,
	"./sq.js": 516,
	"./sr": 517,
	"./sr-cyrl": 518,
	"./sr-cyrl.js": 518,
	"./sr.js": 517,
	"./ss": 519,
	"./ss.js": 519,
	"./sv": 520,
	"./sv.js": 520,
	"./sw": 521,
	"./sw.js": 521,
	"./ta": 522,
	"./ta.js": 522,
	"./te": 523,
	"./te.js": 523,
	"./tet": 524,
	"./tet.js": 524,
	"./tg": 525,
	"./tg.js": 525,
	"./th": 526,
	"./th.js": 526,
	"./tl-ph": 527,
	"./tl-ph.js": 527,
	"./tlh": 528,
	"./tlh.js": 528,
	"./tr": 529,
	"./tr.js": 529,
	"./tzl": 530,
	"./tzl.js": 530,
	"./tzm": 531,
	"./tzm-latn": 532,
	"./tzm-latn.js": 532,
	"./tzm.js": 531,
	"./ug-cn": 533,
	"./ug-cn.js": 533,
	"./uk": 534,
	"./uk.js": 534,
	"./ur": 535,
	"./ur.js": 535,
	"./uz": 536,
	"./uz-latn": 537,
	"./uz-latn.js": 537,
	"./uz.js": 536,
	"./vi": 538,
	"./vi.js": 538,
	"./x-pseudo": 539,
	"./x-pseudo.js": 539,
	"./yo": 540,
	"./yo.js": 540,
	"./zh-cn": 541,
	"./zh-cn.js": 541,
	"./zh-hk": 542,
	"./zh-hk.js": 542,
	"./zh-tw": 543,
	"./zh-tw.js": 543
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 938;

/***/ }),

/***/ 94:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderBy; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Pipe to order elements on a list, generic
 *
 * @export
 * @class OrderBy
 * @implements {PipeTransform}
 */
var OrderBy = /** @class */ (function () {
    function OrderBy() {
    }
    OrderBy_1 = OrderBy;
    OrderBy._orderByComparator = function (a, b) {
        if (isNaN(parseFloat(a)) ||
            !isFinite(a) ||
            (isNaN(parseFloat(b)) || !isFinite(b))) {
            // Isn't a number so lowercase the string to properly compare
            if (a === undefined || a === null || a === '') {
                return 1;
            }
            else if (b === undefined || b === null || b === '') {
                return -1;
            }
            else {
                if (a.toLowerCase() < b.toLowerCase())
                    return -1;
                if (a.toLowerCase() > b.toLowerCase())
                    return 1;
            }
        }
        else {
            // Parse strings as numbers to compare properly
            if (parseFloat(a) < parseFloat(b))
                return -1;
            if (parseFloat(a) > parseFloat(b))
                return 1;
        }
        return 0; // equal each other
    };
    OrderBy.prototype.transform = function (input, _a) {
        var _b = _a[0], config = _b === void 0 ? '+' : _b;
        if (!Array.isArray(input))
            return input;
        if (!Array.isArray(config) ||
            (Array.isArray(config) && config.length === 1)) {
            var propertyToCheck = !Array.isArray(config) ? config : config[0];
            var desc_1 = propertyToCheck.substr(0, 1) === '-';
            // Basic array
            if (!propertyToCheck ||
                propertyToCheck === '-' ||
                propertyToCheck === '+') {
                return !desc_1 ? input.sort() : input.sort().reverse();
            }
            else {
                var property_1 = propertyToCheck.substr(0, 1) === '+' ||
                    propertyToCheck.substr(0, 1) === '-'
                    ? propertyToCheck.substr(1)
                    : propertyToCheck;
                return input.sort(function (a, b) {
                    return !desc_1
                        ? OrderBy_1._orderByComparator(a[property_1], b[property_1])
                        : -OrderBy_1._orderByComparator(a[property_1], b[property_1]);
                });
            }
        }
        else {
            // Loop over property of the array in order and sort
            return input.sort(function (a, b) {
                for (var i = 0; i < config.length; i++) {
                    var desc = config[i].substr(0, 1) === '-';
                    var property = config[i].substr(0, 1) === '+' || config[i].substr(0, 1) === '-'
                        ? config[i].substr(1)
                        : config[i];
                    var comparison = !desc
                        ? OrderBy_1._orderByComparator(a[property], b[property])
                        : -OrderBy_1._orderByComparator(a[property], b[property]);
                    // Don't return 0 yet in case of needing to sort by next property
                    if (comparison !== 0)
                        return comparison;
                }
                return 0; // equal each other
            });
        }
    };
    var OrderBy_1;
    OrderBy = OrderBy_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Pipe */])({ name: 'orderBy', pure: false })
    ], OrderBy);
    return OrderBy;
}());

//# sourceMappingURL=orderBy.js.map

/***/ }),

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoriesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_icons_list_icons__ = __webpack_require__(590);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_default_icons_default_icons__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_global_vars_global_vars__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__log_log__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






//import { Camera } from 'ionic-native';
//import { ImagePicker } from 'ionic-native';
/**
 * Service to manage categories
 *
 * @export
 * @class CategoriesService
 */
var CategoriesService = /** @class */ (function () {
    function CategoriesService(mod, alertCtrl, globalVars, iconsData, log) {
        var _this = this;
        this.mod = mod;
        this.alertCtrl = alertCtrl;
        this.globalVars = globalVars;
        this.iconsData = iconsData;
        this.log = log;
        this.log.setLogger(this.constructor.name);
        this.iconsData.getIcons().then(function (data) {
            _this.icons = data;
        });
    }
    /**
     * Event to change the category of a item on a list or generic, showing a modal window
     *
     * @param {Category} currentCategory
     * @param {any} item
     * @returns
     * @memberof CategoriesService
     */
    CategoriesService.prototype.changeCategory = function (currentCategory, item) {
        var _this = this;
        this.log.logs[this.constructor.name].info('changeCategory:' + currentCategory + ':' + item);
        return new Promise(function (resolve) {
            var change = _this.alertCtrl.create();
            var currentCategoryName = currentCategory !== undefined ? currentCategory.categoryName : '';
            change.setTitle('Change category ' + currentCategoryName + ' by:');
            _this.globalVars.getCategoriesData().then(function (data) {
                var listCategories = data;
                listCategories.forEach(function (category) {
                    if (currentCategoryName !== category.categoryName) {
                        change.addInput({
                            type: 'radio',
                            label: category.categoryName,
                            value: category,
                            checked: false
                        });
                    }
                });
                change.addButton({
                    text: 'Cancel',
                    handler: function (data) {
                        item.category = data;
                        resolve(item);
                    }
                });
                change.addButton({
                    text: 'OK',
                    handler: function (data) {
                        item.category = data;
                        resolve(item);
                    }
                });
                change.present();
            });
        });
    };
    /**
     * Event to change the icon of a category, showing a modal window to select from gallery or taking a photo
     *
     * @param {Category} category
     * @param {Icon[]} icons
     * @memberof CategoriesService
     */
    CategoriesService.prototype.changeCategoryIcon = function (category, icons) {
        var _this = this;
        this.log.logs[this.constructor.name].info('changeCategoryIcon:' + category);
        var paramIcons = icons !== null ? icons : this.icons;
        var changeIconModal = this.mod.create(__WEBPACK_IMPORTED_MODULE_2__components_icons_list_icons__["a" /* ListIconsPage */], { icons: paramIcons });
        changeIconModal.onDidDismiss(function (icon) {
            // Save data to storage
            if (icon !== undefined || category.icon !== undefined) {
                category.icon = icon || category.icon;
            }
            else {
                // TODO: check config for camera and gallery
                var confirm_1 = _this.alertCtrl.create({
                    title: 'Select Category Image',
                    message: 'What image do you want to use?',
                    buttons: [
                        {
                            text: 'Camera',
                            handler: function () {
                                /*
                                  Camera.getPicture({}).then(
                                    imageData => {
                                      this.log.logs[this.constructor.name].info(imageData);
                                      category.icon = imageData;
                                      // imageData is either a base64 encoded string or a file URI
                                      // If it's base64:
                                      // let base64Image = 'data:image/jpeg;base64,' + imageData;
                                      // this.log.logs[this.constructor.name].info(base64Image);
                                      // Save data to storage
                                    },
                                    err => {
                                      this.log.logs[this.constructor.name].error('cameraError:' + err);
                                    }
                                        );
                                        */
                            }
                        },
                        {
                            text: 'Gallery',
                            handler: function () {
                                /*
                                  ImagePicker.getPictures({}).then(
                                    results => {
                                      this.log.logs[this.constructor.name].info(results[0]);
                                      category.icon = results[0];
                
                                      for (var i = 0; i < results.length; i++) {
                                        this.log.logs[this.constructor.name].info('Image URI: ' + results[i]);
                                        // Save data to storage
                                      }
                                    },
                                    err => {
                                      this.log.logs[this.constructor.name].error('galleryError:' + err);
                                    }
                                        );
                                        */
                            }
                        }
                    ]
                });
                confirm_1.present();
            }
        });
        changeIconModal.present();
    };
    CategoriesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_global_vars_global_vars__["a" /* GlobalVars */],
            __WEBPACK_IMPORTED_MODULE_3__providers_default_icons_default_icons__["a" /* DefaultIcons */],
            __WEBPACK_IMPORTED_MODULE_5__log_log__["a" /* Log */]])
    ], CategoriesService);
    return CategoriesService;
}());

//# sourceMappingURL=categoriesService.js.map

/***/ })

},[602]);
//# sourceMappingURL=main.js.map