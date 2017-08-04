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

  removeList(event, name) {
    this.lists = this.lists.filter(list => list.nombreLista !== name);
    this.globalVars.setListsData(this.lists);
    this.globalVars.removetItemListData(name);
  }

  editList(event, list) {
    let edit = this.alertCtrl.create({
      title: "Edit List",
      inputs: [
        {
          name: "name",
          value: list.nombreLista,
          type: "text",
          placeholder: "Name"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Confirm",
          handler: data => {
            //this.globalVars.setListsData(this.lists);
            this.globalVars.setItemListData(
              data.nombreLista,
              this.globalVars.getItemsListData(list.nombreLista)
            );
            //this.globalVars.removetItemListData(list.nombreLista);
          }
        }
      ]
    });

    edit.present();
  }

  addList(newList: string) {
    this.lists.push({
      nombreLista: newList,
      colorLista: "item-dark item item-complex",
      colorBotones: "button-dark",
      listaEditable: true
    });
    this.globalVars.setListsData(this.lists);
    this.globalVars.setItemListData(newList, []);
  }

  removeLists(removed: any[]) {
    this.lists = this.lists.filter(
      list => removed.indexOf(list.nombreLista) < 0
    );
    this.globalVars.setListsData(this.lists);
    removed.forEach(listToRemove => {
      this.globalVars.removetItemListData(listToRemove);
    });
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
