import { RemindersProvider } from '../../providers/reminders-provider';
import { Reminder } from '../../classes/reminder';
import { Component } from '@angular/core';
import {
  IonicPage,
  AlertController,
  ModalController,
  NavParams,
  ViewController,
  Platform
} from 'ionic-angular';

import { List } from '../../classes/list';
import { Category } from '../../classes/category';
import { ListItem } from '../../classes/listItem';
import moment from 'moment';

import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';

import { RemindersComponent } from '../../components/reminders-component/reminders-component';
import { OrderBy } from '../../pipes/orderBy';
import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ItemInfoPage } from '../../components/item-info/item-info';

import { Log } from '../../providers/log/log';
/**
 * Page to manage the items of a list
 *
 * @export
 * @class ListPage
 */
@IonicPage()
@Component({
  selector: 'page-list-page',
  templateUrl: 'list-page.html',
  providers: [OrderBy]
})
export class ListPage {
  type: string = 'ListItem';

  selectedItem: string;
  list: ListItem[] = [];
  searchBar: boolean;
  searchItem: string;
  icons: string[];
  orderSelected: number = 1;
  defaultCategory: Category;
  minimumAmount: number;
  expireReminders: boolean;

  dataConfig: any = {};

  native:boolean = false;

  constructor(
    private navParams: NavParams,
    private view: ViewController,
    public mod: ModalController,
    public alertCtrl: AlertController,
    private globalVars: GlobalVars,
    private order: OrderBy,
    public plt: Platform,
    private localNotification: PhonegapLocalNotification,
    private localNotifications: LocalNotifications,
    private reminders: RemindersProvider,
    public log: Log
  ) {
    this.log.setLogger(this.constructor.name);
  }

  ionViewDidLoad() {
    this.log.logs[this.constructor.name].info('ionViewDidLoad');
    if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
      this.native = true;
    }
    this.searchBar = false;
    this.selectedItem = this.navParams.get('list')
      ? this.navParams.get('list')
      : 'LISTA_COMPRA';
    this.globalVars.getDefaulIconsData().then(data => {
      this.icons = <string[]>data;
      this.initializeItems(null);
    });
    this.globalVars.getConfigData().then(data => {
      this.defaultCategory = (<any>data).categoryDefault;
      this.minimumAmount = (<any>data).cantidadMinimaDefecto;
      this.expireReminders = (<any>data).expireReminders;
      this.dataConfig = {
        deleteAt0: (<any>data).deleteAt0,
        askAddListaCompra: (<any>data).askAddListaCompra,
        rightHand: (<any>data).rightHand
      };
    });
  }
  /**
   * Initialize the items of the list
   *
   * @param {string} filter
   * @memberof ListPage
   */
  initializeItems(filter: string) {
    this.log.logs[this.constructor.name].info('initializeItems:' + filter);
    this.globalVars.getListData(this.selectedItem).then(listData => {
      this.list = <ListItem[]>listData;
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
  /**
   * Even to search based on input filled
   *
   * @param {any} event
   * @memberof ListPage
   */
  searchMatches(event) {
    if (this.searchItem && this.searchItem.trim() !== '') {
      this.initializeItems(this.searchItem);
    } else {
      this.initializeItems(null);
    }
  }
  /**
   * Event to show or hide a search bar
   *
   * @param {any} event
   * @memberof ListPage
   */
  toggleSearchBar(event) {
    this.searchBar = !this.searchBar;
  }
  /**
   * Event to sort items on the list
   *
   * @param {number} orderBy
   * @memberof ListPage
   */
  sortItems(orderBy: number) {
    this.log.logs[this.constructor.name].info('sortItems:' + orderBy);
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
  /**
   * Event to show options to sort the list
   *
   * @param {any} event
   * @memberof ListPage
   */
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
  /**
   * Event to remove a item
   *
   * @param {ListItem} item
   * @memberof ListPage
   */
  removeItem(item: ListItem) {
    this.log.logs[this.constructor.name].info('removeItem:' + item);
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
          handler: () => {}
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
  /**
   * Event to save edit item
   *
   * @param {ListItem} item
   * @memberof ListPage
   */
  saveItem(item: ListItem) {
    this.log.logs[this.constructor.name].info('saveItem:' + item);
    if (this.expireReminders) {
      if (item.caduca) {
        this.localNotifications.schedule(<ILocalNotification>{
          id: moment(item.fechaCaducidad)
            .add(-1, 'days')
            .add(1, 'hour')
            .unix(),
          title: 'CADUCA_MANIANA',
          text:
            item.nombreLista +
            '\n' +
            item.nombreElemento +
            '\n' +
            'CADUCA_MANIANA',
          at: moment(item.fechaCaducidad)
            .add(-1, 'days')
            .add(1, 'hour')
            .toDate()
        });
        this.localNotifications.schedule(<ILocalNotification>{
          id: moment(item.fechaCaducidad)
            .add(-7, 'days')
            .subtract(1, 'hour')
            .unix(),
          title: 'CADUCA_7_DIAS',
          text:
            item.nombreLista +
            '\n' +
            item.nombreElemento +
            '\n' +
            'CADUCA_7_DIAS',
          at: moment(item.fechaCaducidad)
            .add(-7, 'days')
            .add(1, 'hour')
            .toDate()
        });
      }
    }
    this.list[this.list.indexOf(item)] = item;
    this.globalVars.setListData(this.selectedItem, this.list);
  }
  /**
   * Event to show a modal to edit item
   *
   * @param {ListItem} item
   * @memberof ListPage
   */
  editItem(item: ListItem) {
    this.log.logs[this.constructor.name].info('editItem:' + item);
    let infoListModal = this.mod.create(ItemInfoPage, {
      newItem: JSON.parse(JSON.stringify(item)),
      editing: true,
      icons: this.icons
    });
    infoListModal.onDidDismiss(itemEdited => {
      if (itemEdited !== undefined) {
        this.list[this.list.indexOf(item)] = itemEdited;
        this.globalVars.setListData(this.selectedItem, this.list);
      } else {
        this.list[this.list.indexOf(item)] = item;
      }
    });
    infoListModal.present();
  }
  /**
   * Event to move item to other list
   *
   * @param {any} event
   * @memberof ListPage
   */
  moveItem(event) {
    this.log.logs[this.constructor.name].info('moveItem');
    let item = event.item;
    if (event.toShopingList) {
      this.globalVars.getListData('LISTA_COMPRA').then(result => {
        let dest = (<ListItem[]>result).find(
          x => x.nombreElemento === item.nombreElemento
        );
        if (dest) {
          dest.cantidadElemento += item.cantidadMinima;
        } else {
          item.marked = false;
          item.caduca = false;
          item.cantidadElemento = item.cantidadMinima;
          (<ListItem[]>result).push(item);
        }
        this.globalVars.setListData('LISTA_COMPRA', <ListItem[]>result);
      });
    } else {
      let move = this.alertCtrl.create();
      move.setTitle('Move to');

      this.globalVars.getListsData().then(data => {
        let lists: List[] = <List[]>data;
        lists.forEach((list: List) => {
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
              let dest = (<ListItem[]>result).find(
                x => x.nombreElemento === item.nombreElemento
              );
              if (dest) {
                dest.cantidadElemento += item.cantidadElemento;
              } else {
                (<ListItem[]>result).push(item);
              }
              this.globalVars.setListData(data, <ListItem[]>result);
            });
          }
        });
        move.present();
      });
    }
  }
  /**
   * Event to add a notification on that list
   *
   * @memberof ListPage
   */
  addNotification() {
    this.log.logs[this.constructor.name].info('addNotification');
    let reminderModal = this.mod.create(RemindersComponent, {
      time: moment(new Date()).add(1,'hour').toISOString()
    });
    reminderModal.onDidDismiss(data => {
      this.log.logs[this.constructor.name].info(moment(data.notificationDate).subtract(moment(new Date().toISOString()).add(1,'hour').valueOf(),'milliseconds').valueOf());
      if (data) {
        this.localNotification.requestPermission().then(permission => {
          if (permission === 'granted') {
            let reminder: Reminder = {
              message: data.message,
              time: moment(data.notificationDate).toISOString()
            };
            this.reminders.setReminder(reminder);
            if(this.native){
              this.localNotifications.schedule(<ILocalNotification>{
                id: moment(data.notificationDate).unix(),
                title: 'REMEMBER',
                text: data.message,
                at: moment(data.notificationDate).toISOString()
              });
            } else { 
              const timeOutHandler = setTimeout(
                ()=>{
                  alert(data.message);
                  this.reminders.removeReminder(data);
                },
                moment(data.notificationDate).subtract(moment(new Date().toISOString()).add(1,'hour').valueOf(),'milliseconds').valueOf()
              );
            }
          }
        });
      }
    });
    reminderModal.present();
  }
  /**
   * Event to remove selected items
   *
   * @param {string[]} removed
   * @memberof ListPage
   */
  removeElements(removed: string[]) {
    this.log.logs[this.constructor.name].info('removeElements:' + removed);
    removed.forEach(itemRemoved => {
      this.list = this.list.filter(item => item.nombreElemento !== itemRemoved);
      this.globalVars.setListData(this.selectedItem, this.list);
    });
  }
  /**
   * Event to add a new item
   *
   * @param {any} event
   * @memberof ListPage
   */
  addItem(event) {
    this.log.logs[this.constructor.name].info('addItem');
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
      editing: true,
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
          this.saveItem(item);
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
  loadFavorite(list: ListItem[]) {
    this.list = list;
  }
}
