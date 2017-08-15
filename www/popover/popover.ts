import {Component} from '@angular/core';

import {ModalController, ViewController, NavParams} from 'ionic-angular';

import {ItemInfoPage} from '../../pages/item-info/item-info';

import {OrderBy} from '../../pipes/orderBy';

@Component({
  selector: 'popover',
  templateUrl: 'build/components/popover/popover.html',
  providers: [OrderBy]
})

export class PopoverPage {
  list: any;
  selectedItem: string;
  globalVars: any;

  constructor(
              private navParams: NavParams,
              private mod: ModalController,
              private viewCtrl: ViewController,
              private order: OrderBy) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.list = this.navParams.data.list;
      this.selectedItem = this.navParams.data.selectedItem;
      this.globalVars = this.navParams.data.globalVars;
    }
  }

  reorder(orderBy: number) {
    switch (orderBy) {
    case 1:
        this.list = this.order.transform(this.list, ['+category']);
        break;
    case 2:
        this.list = this.order.transform(this.list, ['+nombreElemento']);
        break;
    case 3:
        this.list = this.order.transform(this.list, ['+fechaCaducidad']);
        break;
    }
  }

  optByCategory(event) {
    console.log('optByCategory');
    this.reorder(1);
  }
  optByName(event) {
    console.log('optByName');
    this.reorder(2);
  }
  optByDate(event) {
    console.log('optByDate');
    this.reorder(3);
  }


  optNotifications(event) {
    console.log('notificaciones');
    // this.funcion.next('notificaciones');
  }

  optRecoverList(event) {
    console.log('recuperarLista');
    // this.funcion.emit('recuperarLista');
  }

  optSaveList(event) {
    console.log('salvarLista');
    // this.funcion.emit('salvarLista');
  }

  optClean(event) {
    console.log('limpiar');
    // this.funcion.emit('limpiar');
  }

  optCleanMarked(event) {
    console.log('limpiarMarcados');
    // this.funcion.emit('limpiarMarcados');
  }

  optAddItem(event) {
    let newItem = {
            'category': {
                          'categoryName': 'fruta',
                          'icon': 'images/fruta.png'
                        },
            'measurement': 'UNIDADES',
            'nombreElemento': 'NEW_ELEMENT',
            'colorElemento': '',
            'colorBotones': '',
            'colorElementoNoCaducado': '',
            'colorBotonesNoCaducado': '',
            'nombreLista': this.selectedItem,
            'cantidadElemento': 1,
            'caduca': false,
            'fechaCaducidad': new Date(),
            'cantidadMinima': 1,
            'marked': false
          };
    let infoListModal = this.mod.create(ItemInfoPage, {newItem: newItem, editing: false});
    infoListModal.onDidDismiss((item) => {
      if (item !== undefined) {
        this.globalVars.getListData().push(item);
        this.list.push(item);
      }
    });
    infoListModal.present();
  }
}
