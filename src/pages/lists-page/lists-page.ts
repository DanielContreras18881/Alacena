import { Component } from '@angular/core';
import {
  IonicPage,
  ActionSheetController,
  AlertController,
  ModalController,
  NavController,
  NavParams,
  PopoverController,
  ToastController
} from 'ionic-angular';

import { ListItem } from '../../classes/listItem';
import { List } from '../../classes/list';

import { PopoverPage } from '../../components/popover/popover';
import { OrderBy } from '../../pipes/orderBy';
import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ListPage } from '../list-page/list-page';

import { Color } from '../../classes/color';

/**
 * Generated class for the ListsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lists-page',
  templateUrl: 'lists-page.html'
})
export class ListsPage {
  type: string = 'List';
  lists: List[] = [];
  reorderAllowed: boolean;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private nav: NavController,
    private navParams: NavParams,
    private mod: ModalController,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private globalVars: GlobalVars,
    private toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    this.globalVars.getListsData().then(data => {
      this.lists = <List[]>data;
      this.reorderAllowed = false;
    });
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(
      PopoverPage,
      {},
      { cssClass: 'popover', showBackdrop: true, enableBackdropDismiss: true }
    );
    popover.present({ ev: event });
    popover.onDidDismiss(data => {
      if (!data) {
        return;
      }
    });
  }

  reorder(event) {
    this.reorderAllowed = !this.reorderAllowed;
  }

  reorderItems(indexes) {
    let element = this.lists[indexes.from];
    this.lists.splice(indexes.from, 1);
    this.lists.splice(indexes.to, 0, element);
  }

  removeList(event, name: string) {
    let confirm = this.alertCtrl.create({
      title: 'Removing ' + name,
      message: 'Do you like to remove ' + name + ' list?',
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
            this.lists = this.lists.filter(list => list.nombreLista !== name);
            this.globalVars.setListsData(this.lists);
            this.globalVars.removetItemListData(name);
          }
        }
      ]
    });
    confirm.present();
  }
  editColor(event, list: List) {
    this.globalVars.getColorsData().then(data => {
      let buttons: any = [];
      let colorsList: Color[] = JSON.parse(JSON.stringify(data));
      colorsList.forEach(colorData => {
        if (colorData.cssClass !== list.colorLista) {
          buttons.push({
            text: colorData.color,
            cssClass: colorData.cssClass,
            handler: () => {
              list.colorLista = colorData.cssClass;
              list.colorBotones = colorData.buttons;
              this.globalVars.setListsData(this.lists);
            }
          });
        }
      });
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Change list color',
        buttons: buttons
      });
      actionSheet.present();
    });
  }
  editList(event, list: List) {
    let oldName = list.nombreLista;
    let edit = this.alertCtrl.create({
      title: 'Edit List',
      inputs: [
        {
          name: 'nombreLista',
          value: oldName,
          type: 'text',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            this.globalVars.getListData(oldName).then(listData => {
              list.nombreLista = data.nombreLista;
              this.globalVars.setListsData(this.lists);
              this.globalVars.setListData(
                data.nombreLista,
                <ListItem[]>listData
              );
              this.globalVars.removetItemListData(oldName);
            });
          }
        }
      ]
    });

    edit.present();
  }

  addList(newList: string) {
    if (
      this.lists.filter(
        list => list.nombreLista.toLowerCase() === newList.toLowerCase()
      ).length === 0
    ) {
      this.lists.push({
        nombreLista: newList,
        colorLista: 'white-list',
        colorBotones: 'black-buttons',
        listaEditable: true
      });
      this.globalVars.setListsData(this.lists);
      this.globalVars.setListData(newList, []);
    } else {
      const toast = this.toastCtrl.create({
        message: 'This list already exists!',
        duration: 1000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  removeLists(removed: string[]) {
    this.lists = this.lists.filter(
      list => removed.indexOf(list.nombreLista) < 0
    );
    this.globalVars.setListsData(this.lists);
    removed.forEach(listToRemove => {
      this.globalVars.removetItemListData(listToRemove);
    });
  }

  listSelected(event, list: List) {
    this.nav.push(ListPage, {
      list: list
    });
  }
}
