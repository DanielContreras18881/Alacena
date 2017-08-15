import { Component, ChangeDetectorRef, OnDestroy } from "@angular/core";

import {
  Modal,
  ModalController,
  AlertController,
  PopoverController,
  NavController,
  NavParams
} from "ionic-angular";

import { GlobalVars } from "../../providers/global-vars/global-vars";

import { ListPage } from "../list/list";

import { PopoverPage } from "../../components/popover/popover";

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
    private popoverCtrl: PopoverController,
    private globalVars: GlobalVars
  ) {
    globalVars.getListsData().then(data => {
		 console.log('lists:'+JSON.stringify(data))
      this.lists = data;
      this.reorderAllowed = false;
    });
  }
  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(
      PopoverPage,
      {},
      { cssClass: "popover", showBackdrop: true, enableBackdropDismiss: true }
    );
    popover.present({ ev: event });
    popover.onDidDismiss(data => {
      if (!data) {
        return;
      }
      console.log(data.action);
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
    let oldName = list.nombreLista;
    let edit = this.alertCtrl.create({
      title: "Edit List",
      inputs: [
        {
          name: "nombreLista",
          value: oldName,
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
            this.globalVars.getListData(oldName).then(listData => {
              list.nombreLista = data.nombreLista;
              this.globalVars.setListsData(this.lists);
              this.globalVars.setListData(data.nombreLista, <any[]>listData);
              this.globalVars.removetItemListData(oldName);
            });
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
    this.globalVars.setListData(newList, []);
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
