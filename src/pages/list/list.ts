import {Component, ViewChild, ElementRef, EventEmitter, Input, Output} from '@angular/core';

import { ModalController, AlertController, ViewController, NavParams, PopoverController} from 'ionic-angular';

import {GlobalVars} from '../../providers/global-vars/global-vars';

import {ItemData} from '../../components/item-data/item-data';

import {PopoverPage} from '../../components/popover/popover';

import {ItemInfoPage} from '../item-info/item-info';

import {OrderBy} from '../../pipes/orderBy';

@Component({
  templateUrl: 'list.html',
  providers: [OrderBy]
})
export class ListPage {
  @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;

  selectedItem: any;
  list: any;
  searchBar: boolean;
  searchItem: string;
  icons: any;

  constructor(
            private navParams: NavParams,
            private view: ViewController,
            public mod: ModalController,
            public alertCtrl: AlertController,
            private popoverCtrl: PopoverController,
            private globalVars: GlobalVars,
            private order: OrderBy) {}

  ngOnInit() {
    this.searchBar = false;
    this.selectedItem = this.navParams.get('list');
    this.icons = this.globalVars.getDefaulIconsData();
    this.initializeItems();
  }

  initializeItems() {
    this.list = this.globalVars.getListData().filter((item) => {
      if (item.nombreLista === this.selectedItem) {
        return item;
      }
    });
  }

  searchMatches(event) {
    this.initializeItems();
    if (this.searchItem && this.searchItem.trim() !== '') {
      this.list = this.list.filter((item) => {
        return (item.nombreElemento.toLowerCase().indexOf(this.searchItem.toLowerCase()) > -1);
      });
    }
  }

  toggleSearchBar(event) {
    this.searchBar = !this.searchBar;
  }

  sortItems(orderBy: number) {
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

  reorder(event) {
    let reorder = this.alertCtrl.create();
    reorder.setTitle('Sort by');

    if (this.selectedItem !== 'LISTA_COMPRA') {
      reorder.addInput({
        type: 'radio',
        label: 'FECHA_CADUCIDAD',
        value: '3',
        checked: false
      });
    }
    reorder.addInput({
      type: 'radio',
      label: 'NOMBRE',
      value: '1',
      checked: true
    });
    reorder.addInput({
      type: 'radio',
      label: 'CATEGORIA',
      value: '2',
      checked: false
    });

    reorder.addButton('Cancel');
    reorder.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
        this.sortItems(Number.parseInt(data.value));
      }
    });
    reorder.present();
  }

  removeItem(item) {
    let confirm = this.alertCtrl.create({
      title: 'Removing ' + item.nombreElemento,
      message: 'Do you like to remove ' + item.nombreElemento + ' from ' + item.nombreLista,
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No removed');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.globalVars.getListData().splice(this.globalVars.getListData().indexOf(item), 1);
            this.list.splice(this.list.indexOf(item), 1);
          }
        }
      ]
    });
    confirm.present();
  }

  editItem(item) {
    let infoListModal = this.mod.create(ItemInfoPage, {newItem: item, editing: true, icons: this.icons});
    infoListModal.onDidDismiss((item) => {
// TODO: check if needed or action with items list
    });
    infoListModal.present();
  }

  moveItem(item) {
    let move = this.alertCtrl.create();
    move.setTitle('Move to');

    let lists: any = this.globalVars.getListsData();

    lists.forEach((list: any) => {
      let selected = false;
      if (list.nombreLista !== item.nombreLista) {
        if (list.nombreLista === 'LISTA_COMPRA') {
          selected = true;
        }
        move.addInput({
          type: 'radio',
          label: list.nombreLista,
          value: list.nombreLista,
          checked: selected
        });
      }
    });

    move.addButton('Cancel');
    move.addButton({
      text: 'OK',
      handler: data => {
        // this.globalVars.getListData().splice(this.globalVars.getListData().indexOf(item), 1);
        if (item.nombreLista === 'LISTA_COMPRA') {
          item.caduca = false;
        }
        this.list.splice(this.list.indexOf(item), 1);
        this.globalVars.getListData()[this.globalVars.getListData().indexOf(item)].nombreLista = data;
        // this.globalVars.getListData().push(item);
      }
    });
    move.present();
  }

  addItem(event) {
    // TODO: Check data structure, redefine and refactor with category, measurement and unitStep
    let newItem = {
            'category': { 'icon': 'images/icons/default.png' },
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
    let infoListModal = this.mod.create(ItemInfoPage, {newItem: newItem, editing: false, icons: this.icons});
    infoListModal.onDidDismiss((item) => {
      if (item !== undefined) {
        this.globalVars.getListData().push(item);
        this.list.push(item);
      }
    });
    infoListModal.present();
  }
// TODO: check if needed
  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage, {
      list: this.list,
      selectedItem: this.selectedItem,
      globalVars: this.globalVars
    });
    popover.present({
      ev: event
    });
  }
}

// TODO: reminders functionality