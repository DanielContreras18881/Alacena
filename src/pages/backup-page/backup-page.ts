import { BackupData } from '../../providers/backup-data/backup-data';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from 'ionic-angular';

import { Log } from '../../providers/log/log';

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
  backupList: string[] = [];

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public log: Log,
    public backup: BackupData
  ) {
    this.log.setLogger(this.constructor.name);
  }

  ionViewDidLoad() {
    this.log.logs[this.constructor.name].info('ionViewDidLoad');
    this.backup.getBackupList().then(data => {
      (<any[]>data).forEach(element => {
        this.backupList.push(element.name);
      });
    });
  }

  makeBackup() {
    this.log.logs[this.constructor.name].info('makeBackup');
    this.backup.makeBackup().then(data => {
      this.log.logs[this.constructor.name].info(`Backup saved`);
    });
  }

  retrieveBackup(backup: string) {
    this.log.logs[this.constructor.name].info('retrieveBackup');
    let retrieve = this.alertCtrl.create();
    retrieve.setTitle('Retrieing ' + backup);
    retrieve.addButton('Discard');
    retrieve.addButton({
      text: 'Retrieve',
      handler: result => {
        this.backup.getBackup(backup).then(data => {
          this.log.logs[this.constructor.name].info(
            `Backup ${backup} retrieved`
          );
        });
      }
    });
    retrieve.present();
  }

  removeBackup(backup: string) {
    this.log.logs[this.constructor.name].info('removeBackup');
    let remove = this.alertCtrl.create();
    remove.setTitle('Removing ' + backup);
    remove.addButton('Discard');
    remove.addButton({
      text: 'Remove',
      handler: result => {
        this.backup.removeBackup(backup).then(data => {
          this.log.logs[this.constructor.name].info(`Backup ${backup} removed`);
        });
      }
    });
    remove.present();
  }
}
