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
      this.log.logs[this.constructor.name].warn(data);
    });
  }
}
