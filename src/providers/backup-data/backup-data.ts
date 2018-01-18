import { RemindersProvider } from '../reminders-provider';
import { GlobalVars } from '../global-vars/global-vars';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Log } from '../log/log';
import { File } from '@ionic-native/file';
import * as moment from 'moment';
import { Platform } from 'ionic-angular';

declare var cordova: any;
/**
 * Service to manage backup local data for the user
 *
 * @export
 * @class BackupData
 */
@Injectable()
export class BackupData {
  constructor(
    public http: Http,
    public log: Log,
    private file: File,
    public global: GlobalVars,
    public reminders: RemindersProvider,
    private plt: Platform
  ) {
    this.log.setLogger(this.constructor.name);
  }

  getBackupList() {
    this.log.logs[this.constructor.name].info('getBackupList');
    return new Promise(resolve => {
      this.plt.ready().then(() => {
        this.file
          .listDir(this.file.dataDirectory + '/', 'backups')
          .then(files => {
            resolve([{ name: 'uno' }]);
          });
      });
    });
  }

  removeBackup(backup: string) {
    this.log.logs[this.constructor.name].info('removeBackup:' + backup);
    return new Promise(resolve => {
      this.file
        .removeDir(this.file.dataDirectory + '/backups/', backup)
        .then(success =>
          this.log.logs[this.constructor.name].info('removeBackup:' + success)
        )
        .catch(err => {
          this.log.logs[this.constructor.name].error('removeBackup:' + err);
        });
    });
  }

  getBackup(backup: string) {
    this.log.logs[this.constructor.name].info('getBackup:' + backup);
    return new Promise(resolve => {
      this.file
        .listDir(this.file.dataDirectory + '/backups/', backup)
        .then(files => {
          files.forEach(file => {
            this.log.logs[this.constructor.name].info('name:' + file.name);
            this.log.logs[this.constructor.name].info(
              'path:' +
                this.file.dataDirectory +
                '/backups/' +
                backup +
                '/' +
                file.name
            );
            this.file
              .checkFile(
                this.file.dataDirectory + '/backups/' + backup + '/',
                file.name
              )
              .then(success => {
                this.file
                  .readAsText(
                    this.file.dataDirectory + '/backups/' + backup + '/',
                    file.name
                  )
                  .then(response => {
                    if (file.name == 'Elementos.json') {
                      this.global.setItemsData(JSON.parse(response));
                    } else if (file.name == 'categories.json') {
                      this.global.setCategoriesData(JSON.parse(response));
                    } else if (file.name == 'Configuracion.json') {
                      this.global.setConfigData(JSON.parse(response));
                    } else if (file.name == 'Listas.json') {
                      this.global.setListsData(JSON.parse(response));
                    } else if (file.name == 'Reminders.json') {
                      JSON.parse(response).forEach(reminder => {
                        this.reminders.setReminder(reminder);
                      });
                    } else {
                      this.global.setListData(
                        file.name.replace('.json', ''),
                        JSON.parse(response)
                      );
                    }
                  })
                  .catch(err => {
                    this.log.logs[this.constructor.name].error(
                      'readAsText:' + err
                    );
                  });
              })
              .catch(err => {
                this.log.logs[this.constructor.name].error('checkfile:' + err);
              });
          });
          resolve();
        })
        .catch(err => {
          this.log.logs[this.constructor.name].error('listDir:' + err);
          resolve();
        });
    });
  }

  private backup(day: string, dayFolder: string) {
    // TODO: Create backup from data on GlobalVars to json files on a folder called backup_dayFolder
  }

  makeBackup() {
    this.log.logs[this.constructor.name].info('getBackupList');
    const day = moment().format('YYYY-MM-DD HH:mm:ss');
    const dayFolder = moment().format('YYYY-MM-DD_HH-mm-ss');
    return new Promise(resolve => {
      this.file
        .checkDir(this.file.dataDirectory + '/', 'backups')
        .then(success => {
          this.file
            .checkDir(
              this.file.dataDirectory + '/backups/',
              'backup_' + dayFolder
            )
            .then(success => {
              this.backup(day, dayFolder);
              resolve();
            })
            .catch(err => {
              this.file
                .createDir(
                  this.file.dataDirectory + '/backups/',
                  'backup_' + dayFolder,
                  false
                )
                .then(success => {
                  this.backup(day, dayFolder);
                  resolve();
                })
                .catch(err => {
                  this.log.logs[this.constructor.name].error(
                    'createDir:' + err
                  );
                  resolve();
                });
            });
        })
        .catch(err => {
          this.log.logs[this.constructor.name].error('checkdir:' + err);
          resolve();
        });
    });
  }
}
