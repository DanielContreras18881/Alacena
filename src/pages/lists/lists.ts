import { Component, ChangeDetectorRef, OnDestroy } from "@angular/core";

import {
  Modal,
  ModalController,
  AlertController,
  NavController,
  NavParams,
  Popover
} from "ionic-angular";

import { GlobalVars } from "../../providers/global-vars/global-vars";

import { ListPage } from "../list/list";

import { OrderBy } from "../../pipes/orderBy";

@Component({
  templateUrl: "lists.html",
  providers: [OrderBy]
})
export class ListsPage {
  type: string = "List";
  public lists: any = [];
  reorderAllowed: boolean;

  constructor(
    public nav: NavController,
    navParams: NavParams,
    public mod: ModalController,
    public alertCtrl: AlertController,
    private globalVars: GlobalVars
  ) {
    globalVars.getListsData().then(data => {
      this.lists = data;
      this.reorderAllowed = false;
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

  removeList(event) {
    // TODO: remove list functionality, asking for remove or move items on that
    console.log(JSON.stringify(event));
  }

  editList(event) {
    // TODO: edit list functionality
    console.log(JSON.stringify(event));
  }

  addList(data) {
    this.lists.push({
      nombreLista: data,
      colorLista: "item-dark item item-complex",
      colorBotones: "button-dark",
      listaEditable: true
    });
    this.globalVars.setListsData(this.lists);
    this.globalVars.setItemListData(data, []);
  }

  removeLists(event) {
    // TODO: remove multiple lists functionality, looping wiyh removeList
    console.log("removeList");
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
