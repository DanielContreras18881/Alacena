import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Page to manage, create and remove local data backup
 * 
 * @export
 * @class BackupPage
 */
@IonicPage()
@Component({
  selector: 'page-backup-page',
  templateUrl: 'backup-page.html'
})
export class BackupPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {}
}
