import { Component, ElementRef, ViewChild } from '@angular/core';
import moment from 'moment';
import {
  AlertController,
  ModalController,
  NavParams,
  PopoverController,
  ViewController
} from 'ionic-angular';

import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';

import { PopoverPage } from '../../components/popover/popover';
import { RemindersComponent } from '../../components/reminders-component/reminders-component';
import { OrderBy } from '../../pipes/orderBy';
import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ItemInfoPage } from '../item-info/item-info';

@Component({
  templateUrl: 'list.html',
  providers: [OrderBy]
})
export class ListPage {
  @ViewChild('popoverContent', { read: ElementRef })
  content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef })
  text: ElementRef;

  type: string = 'ListItem';

  selectedItem: any;
  list: any[] = [];
  searchBar: boolean;
  searchItem: string;
  icons: any;
  orderSelected: number = 1;
  defaultCategory: any;
  minimumAmount: number;

  dataConfig: any = {};

  constructor(
    private navParams: NavParams,
    private view: ViewController,
    public mod: ModalController,
    public alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private globalVars: GlobalVars,
    private order: OrderBy,
    private localNotification: PhonegapLocalNotification
  ) {}

  ngOnInit() {
    this.searchBar = false;
    this.selectedItem = this.navParams.get('list')
      ? this.navParams.get('list')
      : 'LISTA_COMPRA';
    this.globalVars.getDefaulIconsData().then(data => {
      this.icons = data;
      this.initializeItems(null);
    });
    this.globalVars.getConfigData().then(data => {
      this.defaultCategory = (<any>data).categoryDefault;
      this.minimumAmount = (<any>data).cantidadMinimaDefecto;
      this.dataConfig = {
        deleteAt0: (<any>data).deleteAt0,
        askAddListaCompra: (<any>data).askAddListaCompra
      };
    });
  }

  initializeItems(filter: string) {
    this.globalVars.getListData(this.selectedItem).then(listData => {
      this.list = <any[]>listData;
      this.sortItems(this.orderSelected);
      if (filter) {
        this.list = this.list.filter(item => {
          return (
            item.nombreElemento
              .toLowerCase()
              .indexOf(this.searchItem.toLowerCase()) > -1
          );
        });
      }
    });
  }

  searchMatches(event) {
    if (this.searchItem && this.searchItem.trim() !== '') {
      this.initializeItems(this.searchItem);
    } else {
      this.initializeItems(null);
    }
  }

  toggleSearchBar(event) {
    this.searchBar = !this.searchBar;
  }

  sortItems(orderBy: number) {
    this.orderSelected = orderBy;
    switch (orderBy) {
      case 1:
        this.list = this.order.transform(this.list, ['+nombreElemento']);
        break;
      case 2:
        this.list = this.list.sort((a: any, b: any) => {
          if (a.category.categoryName < b.category.categoryName) return -1;
          if (a.category.categoryName > b.category.categoryName) return 1;
          return 0;
        });
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
        checked: this.orderSelected === 3
      });
    }
    reorder.addInput({
      type: 'radio',
      label: 'NOMBRE',
      value: '1',
      checked: this.orderSelected === 1
    });
    reorder.addInput({
      type: 'radio',
      label: 'CATEGORIA',
      value: '2',
      checked: this.orderSelected === 2
    });

    reorder.addButton('Cancel');
    reorder.addButton({
      text: 'OK',
      handler: data => {
        this.sortItems(Number.parseInt(data));
      }
    });
    reorder.present();
  }

  removeItem(item) {
    let confirm = this.alertCtrl.create({
      title: 'Removing ' + item.nombreElemento,
      message:
        'Do you like to remove ' +
        item.nombreElemento +
        ' from ' +
        item.nombreLista +
        ' ?',
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
            this.list.splice(this.list.indexOf(item), 1);
            this.globalVars.setListData(this.selectedItem, this.list);
          }
        }
      ]
    });
    confirm.present();
  }

  saveItem(item) {
    //TODO: Check on device
    if (item.caduca) {
      let milisecondsToCaducidad1 =
        moment(item.fechaCaducidad)
          .add(-1, 'days')
          .subtract(1, 'hour')
          .toDate()
          .getTime() -
        moment()
          .toDate()
          .getTime();
      setTimeout(() => {
        this.localNotification.create('CADUCIDAD_ELEMENTO', {
          tag: 'CADUCA_MANIANA',
          body:
            item.nombreLista +
            '\n' +
            item.nombreElemento +
            '\n' +
            'CADUCA_MANIANA',
          icon: 'assets/icon/favicon.ico'
        });
      }, milisecondsToCaducidad1);
      let milisecondsToCaducidad3 =
        moment(item.fechaCaducidad)
          .add(-7, 'days')
          .subtract(1, 'hour')
          .toDate()
          .getTime() -
        moment()
          .toDate()
          .getTime();
      setTimeout(() => {
        this.localNotification.create('CADUCIDAD_ELEMENTO', {
          tag: 'CADUCA_7_DIAS',
          body:
            item.nombreLista +
            '\n' +
            item.nombreElemento +
            '\n' +
            'CADUCA_7_DIAS',
          icon: 'assets/icon/favicon.ico'
        });
      }, milisecondsToCaducidad3);
    }
    this.list[this.list.indexOf(item)] = item;
    this.globalVars.setListData(this.selectedItem, this.list);
  }

  editItem(item) {
    let infoListModal = this.mod.create(ItemInfoPage, {
      newItem: item,
      editing: true,
      icons: this.icons
    });
    infoListModal.onDidDismiss(item => {
      // TODO: check if needed or action with items list
      this.list[this.list.indexOf(item)] = item;
      this.globalVars.setListData(this.selectedItem, this.list);
    });
    infoListModal.present();
  }

  moveItem(event) {
    let item = event.item;
    if (event.toShopingList) {
      this.globalVars.getListData('LISTA_COMPRA').then(result => {
        let dest = (<any[]>result).find(
          x => x.nombreElemento === item.nombreElemento
        );
        if (dest) {
          dest.cantidadElemento += item.cantidadMinima;
        } else {
          item.marked = false;
          item.caduca = false;
          item.cantidadElemento = item.cantidadMinima;
          (<any[]>result).push(item);
        }
        this.globalVars.setListData('LISTA_COMPRA', <any[]>result);
      });
    } else {
      let move = this.alertCtrl.create();
      move.setTitle('Move to');

      this.globalVars.getListsData().then(data => {
        let lists: any = data;
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
            if (data === 'LISTA_COMPRA') {
              item.caduca = false;
            }
            this.list.splice(this.list.indexOf(item), 1);
            this.globalVars.setListData(this.selectedItem, this.list);
            item.nombreLista = data;
            this.globalVars.getListData(data).then(result => {
              let dest = (<any[]>result).find(
                x => x.nombreElemento === item.nombreElemento
              );
              if (dest) {
                dest.cantidadElemento += item.cantidadElemento;
              } else {
                (<any[]>result).push(item);
              }
              this.globalVars.setListData(data, <any[]>result);
            });
          }
        });
        move.present();
      });
    }
  }

  addNotification() {
    let reminderModal = this.mod.create(RemindersComponent);
    reminderModal.onDidDismiss(data => {
      if (data) {
        this.localNotification.requestPermission().then(permission => {
          if (permission === 'granted') {
            let milliseconds =
              moment(data.notificationDate)
                .toDate()
                .getTime() -
              moment()
                .toDate()
                .getTime();
            setTimeout(() => {
              this.localNotification.create('REMINDER!', {
                body: data.message,
                icon: 'assets/icon/favicon.ico'
              });
            }, milliseconds);
          }
        });
      }
    });
    reminderModal.present();
  }

  removeElements(removed: any[]) {
    removed.forEach(itemRemoved => {
      this.list = this.list.filter(item => item.nombreElemento !== itemRemoved);
      this.globalVars.setListData(this.selectedItem, this.list);
    });
  }

  addItem(event) {
    // TODO: Check data structure, redefine and refactor with category, measurement and unitStep
    let newItem = {
      category: this.defaultCategory,
      nombreElemento: '',
      colorElemento: '',
      colorBotones: '',
      colorElementoNoCaducado: '',
      colorBotonesNoCaducado: '',
      nombreLista: this.selectedItem,
      cantidadElemento: this.minimumAmount,
      caduca: false,
      fechaCaducidad: new Date().toISOString(),
      cantidadMinima: this.minimumAmount,
      marked: false
    };
    let infoListModal = this.mod.create(ItemInfoPage, {
      newItem: newItem,
      editing: false,
      icons: this.icons
    });
    infoListModal.onDidDismiss(item => {
      if (item !== undefined) {
        if (
          this.list.filter(
            element =>
              element.nombreElemento.toLowerCase() === item.nombreElemento
          ).length === 0
        ) {
          this.list.push(item);
          this.globalVars.setListData(this.selectedItem, this.list);
          this.globalVars.addOneItem(item);
        } else {
          let addAmount = this.alertCtrl.create();
          addAmount.setTitle(
            item.nombreElemento + ' already exists, choose an option'
          );
          addAmount.addButton('Discard');
          addAmount.addButton({
            text: 'Add amount',
            handler: data => {
              this.list.filter(
                element =>
                  element.nombreElemento.toLowerCase() ===
                  item.nombreElemento.toLowerCase()
              )[0].cantidadElemento +=
                item.cantidadElemento;
              this.globalVars.setListData(this.selectedItem, this.list);
            }
          });
          addAmount.present();
        }
      }
    });
    infoListModal.present();
  }
  // TODO: check if needed
  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage, {
      list: this.list,
      selectedItem: this.selectedItem
      // TODO : Store changes
    });
    popover.present({
      ev: event
    });
  }
}

// TODO: reminders functionality
