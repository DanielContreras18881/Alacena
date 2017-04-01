import {Component} from '@angular/core';

import {ModalController, AlertController, ViewController, NavParams} from 'ionic-angular';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})

// TODO: check the need of this component

export class PopoverPage {
  list: any;
  selectedItem: string;
  globalVars: any;

  constructor(
              private navParams: NavParams,
              private mod: ModalController,
              public alertCtrl: AlertController,
              private viewCtrl: ViewController) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.list = this.navParams.data.list;
      this.selectedItem = this.navParams.data.selectedItem;
      this.globalVars = this.navParams.data.globalVars;
    }
  }

  optNotifications(event) {
    console.log('recordatorios');
  }

  optRecoverList(event) {
    console.log('recuperarLista');
  }

  optSaveList(event) {
    console.log('salvarLista');
  }

  optClean(event) {
    console.log('limpiar');
  }

  optCleanMarked(event) {
    console.log('limpiarMarcados');
  }
}
