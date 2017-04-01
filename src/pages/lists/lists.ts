import {Component, ChangeDetectorRef, OnDestroy} from '@angular/core';

import { Modal, ModalController, AlertController, NavController, NavParams, Popover} from 'ionic-angular';

import {GlobalVars} from '../../providers/global-vars/global-vars';

import {ListPage} from '../list/list';

import {OrderBy} from '../../pipes/orderBy';

@Component({
  templateUrl: 'lists.html',
  providers: [OrderBy]
})
export class ListsPage {
  public lists: any;
  reorderAllowed: boolean;

  constructor(
              public nav: NavController,
              navParams: NavParams,
              public mod: ModalController,
              public alertCtrl: AlertController,
              private globalVars: GlobalVars) {
    this.lists = globalVars.getListsData();
    this.reorderAllowed = false;
  }

  reorder(event) {
    this.reorderAllowed = !this.reorderAllowed;
  }

  reorderItems(indexes) {
    let element = this.lists[indexes.from];
    this.lists.splice(indexes.from, 1);
    this.lists.splice(indexes.to, 0, element);
  }

  removeList(event) {
// TODO: remove list functionality, asking for remove or move items on that
      console.log(JSON.stringify(event));
    }

  editList(event) {
// TODO: edit list functionality
      console.log(JSON.stringify(event));
    }

addList(event) {
// TODO: create list functionality
    console.log(JSON.stringify(event));
  }

removeLists(event) {
// TODO: remove multiple lists functionality, looping wiyh removeList
    console.log(JSON.stringify(event));
  }

  listSelected(event, list) {
    this.nav.push(ListPage, {
      list: list
    });
    /*
    let infoListModal = this.mod.create(ListPage, {list: list});
      infoListModal.onDidDismiss((item) => {
    });
    infoListModal.present();
    */
    /*
    this.nav.push(ListPage, {
      list: list
    });
    */
  }
}
