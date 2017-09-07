import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  ModalController,
  AlertController,
  ViewController,
  NavParams,
  PopoverController
} from 'ionic-angular';

import { PopoverPage } from '../../components/popover/popover';

import { ItemInfoPage } from '../item-info/item-info';

import { GlobalVars } from '../../providers/global-vars/global-vars';

import { OrderBy } from '../../pipes/orderBy';

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
    private order: OrderBy
  ) {}

  ngOnInit() {
    this.searchBar = false;
    this.selectedItem = this.navParams.get('list')
      ? this.navParams.get('list')
      : 'LISTA_COMPRA';
    this.globalVars.getDefaulIconsData().then(data => {
      this.icons = data;
      this.initializeItems();
    });
  }

  initializeItems() {
    this.globalVars.getListData(this.selectedItem).then(listData => {
      this.list = listData;
    });
    /*				  
    this.globalVars.getListData().then(data => {
      this.list = data.filter(item => {
        if (item.nombreLista === this.selectedItem) {
          return item;
        }
      });
	 });
	 */
  }

  searchMatches(event) {
    this.initializeItems();
    if (this.searchItem && this.searchItem.trim() !== '') {
      this.list = this.list.filter(item => {
        return (
          item.nombreElemento
            .toLowerCase()
            .indexOf(this.searchItem.toLowerCase()) > -1
        );
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
    console.log(this.list);
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
      message:
        'Do you like to remove ' +
        item.nombreElemento +
        ' from ' +
        item.nombreLista,
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
            // TODO : Store changes
            this.list.splice(this.list.indexOf(item), 1);
            this.globalVars.setListData(this.selectedItem, this.list);
          }
        }
      ]
    });
    confirm.present();
  }

  saveItem(item) {
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

  moveItem(item) {
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
          // TODO : Store changes
          //this.globalVars.setListData(this.list);
        }
      });
      move.present();
    });
  }

  addElement(newElement: string) {
    //console.log(newElement);
  }

  removeElements(removed: any[]) {
    removed.forEach(itemRemoved => {
      this.list.splice(this.list.indexOf(itemRemoved), 1);
      this.globalVars.setListData(this.selectedItem, this.list);
    });
  }

  addItem(event) {
    // TODO: Check data structure, redefine and refactor with category, measurement and unitStep
    let newItem = {
      category: {
        icon: 'images/icons/default.png',
        measurement: 'UNIDADES',
        categoryName: 'No Category'
      },
      nombreElemento: '',
      colorElemento: '',
      colorBotones: '',
      colorElementoNoCaducado: '',
      colorBotonesNoCaducado: '',
      nombreLista: this.selectedItem,
      cantidadElemento: 1,
      caduca: false,
      fechaCaducidad: new Date().toISOString(),
      cantidadMinima: 1,
      marked: false
    };
    let infoListModal = this.mod.create(ItemInfoPage, {
      newItem: newItem,
      editing: false,
      icons: this.icons
    });
    infoListModal.onDidDismiss(item => {
      if (item !== undefined) {
        this.list.push(item);
        this.globalVars.setListData(this.selectedItem, this.list);
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
