import { Component } from '@angular/core';
import {
  IonicPage,
  ActionSheetController,
  AlertController,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';

import { ListItem } from '../../classes/listItem';
import { List } from '../../classes/list';

import { OrderBy } from '../../pipes/orderBy';
import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ListPage } from '../list-page/list-page';

import { Color } from '../../classes/color';

/**
 * Page to manage the list of lists
 * 
 * @export
 * @class ListsPage
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
    private globalVars: GlobalVars,
    private toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    this.globalVars.getListsData().then(data => {
      this.lists = <List[]>data;
      this.reorderAllowed = false;
    });
  }
  /**
	 * Event to allow reorder the lists or not
	 * 
	 * @param {any} event 
	 * @memberof ListsPage
	 */
  reorder(event) {
    this.reorderAllowed = !this.reorderAllowed;
  }
  /**
	 * Event to reorder lists as user select
	 * 
	 * @param {any} indexes 
	 * @memberof ListsPage
	 */
  reorderItems(indexes) {
    let element = this.lists[indexes.from];
    this.lists.splice(indexes.from, 1);
    this.lists.splice(indexes.to, 0, element);
  }
  /**
	 * Event to remove a list
	 * 
	 * @param {any} event 
	 * @param {string} name 
	 * @memberof ListsPage
	 */
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
  /**
		* Event to edit the color of a list
		* 
		* @param {any} event 
		* @param {List} list 
		* @memberof ListsPage
	   */
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
  /**
		* Event to edit the name of a list
		* 
		* @param {any} event 
		* @param {List} list 
		* @memberof ListsPage
	   */
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
  /**
	 * Event to add a new list
	 * 
	 * @param {string} newList 
	 * @memberof ListsPage
	 */
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
  /**
	 * Event to remove a list of lists selected
	 * 
	 * @param {string[]} removed 
	 * @memberof ListsPage
	 */
  removeLists(removed: string[]) {
    this.lists = this.lists.filter(
      list => removed.indexOf(list.nombreLista) < 0
    );
    this.globalVars.setListsData(this.lists);
    removed.forEach(listToRemove => {
      this.globalVars.removetItemListData(listToRemove);
    });
  }
  /**
	 * Event to navigate to selected list
	 * 
	 * @param {any} event 
	 * @param {List} list 
	 * @memberof ListsPage
	 */
  listSelected(event, list: List) {
    this.nav.push(ListPage, {
      list: list
    });
  }
}
