import { BackupData } from '../../providers/backup-data/backup-data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
      console.log(data);
    });
  }

  retrieveBackup(backup: string) {
    this.log.logs[this.constructor.name].info('retrieveBackup');
    this.backup.getBackup(backup).then(data => {
      console.log(data);
    });
  }

  removeBackup(backup: string) {
    this.log.logs[this.constructor.name].info('removeBackup');
    this.backup.removeBackup(backup).then(data => {
      console.log(data);
    });
  }
}
