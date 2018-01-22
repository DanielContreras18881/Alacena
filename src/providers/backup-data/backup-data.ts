import { RemindersProvider } from '../reminders-provider';
import { GlobalVars } from '../global-vars/global-vars';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Log } from '../log/log';
import { File } from '@ionic-native/file';
import * as moment from 'moment';
import { Platform } from 'ionic-angular';
import { LocalStorage } from '../data/localStorage';

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
    public local: LocalStorage,
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
                    } else if (file.name == 'Categories.json') {
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
    this.local
      .getFromLocal('lists', null)
      .then(lists => {
        this.file
          .createFile(
            this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
            'Lists.json',
            true
          )
          .then(success => {
            this.file
              .writeFile(
                this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
                'Lists.json',
                JSON.stringify(lists)
              )
              .then(written => {
                this.log.logs[this.constructor.name].info(`File Lists written`);
              })
              .catch(err => {
                this.log.logs[this.constructor.name].error(
                  'backup:writeFile:' + err
                );
              });
          })
          .catch(err => {
            this.log.logs[this.constructor.name].error(
              'backup:createFile:' + err
            );
          });
        (<any[]>lists).forEach(list => {
          this.local
            .getFromLocal(list.nombreLista, null)
            .then(itemsOnList => {
              this.file
                .createFile(
                  this.file.dataDirectory +
                    '/backups/backup_' +
                    dayFolder +
                    '/',
                  list.nombreLista + '.json',
                  true
                )
                .then(success => {
                  this.file
                    .writeFile(
                      this.file.dataDirectory +
                        '/backups/backup_' +
                        dayFolder +
                        '/',
                      list.nombreLista + '.json',
                      JSON.stringify(itemsOnList)
                    )
                    .then(written => {
                      this.log.logs[this.constructor.name].info(
                        `File ${list.nombreLista} written`
                      );
                    })
                    .catch(err => {
                      this.log.logs[this.constructor.name].error(
                        'backup:writeFile:' + err
                      );
                    });
                })
                .catch(err => {
                  this.log.logs[this.constructor.name].error(
                    'backup:createFile:' + err
                  );
                });
            })
            .catch(err => {
              this.log.logs[this.constructor.name].error(
                'backup:getFromLocal:' + err
              );
            });
        });
      })
      .catch(err => {
        this.log.logs[this.constructor.name].error(
          'backup:getFromLocal:lists:' + err
        );
      });

    this.local
      .getFromLocal('items', null)
      .then(itemsOnItems => {
        this.file
          .createFile(
            this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
            'Elementos.json',
            true
          )
          .then(success => {
            this.file
              .writeFile(
                this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
                'Elementos.json',
                JSON.stringify(itemsOnItems)
              )
              .then(written => {
                this.log.logs[this.constructor.name].info(
                  `File Elementos written`
                );
              })
              .catch(err => {
                this.log.logs[this.constructor.name].error(
                  'backup:writeFile:' + err
                );
              });
          })
          .catch(err => {
            this.log.logs[this.constructor.name].error(
              'backup:createFile:' + err
            );
          });
      })
      .catch(err => {
        this.log.logs[this.constructor.name].error(
          'backup:getFromLocal:items:' + err
        );
      });
    this.local
      .getFromLocal('favorites', null)
      .then(favorites => {
        this.file
          .createFile(
            this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
            'Favoritos.json',
            true
          )
          .then(success => {
            this.file
              .writeFile(
                this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
                'Favoritos.json',
                JSON.stringify(favorites)
              )
              .then(written => {
                this.log.logs[this.constructor.name].info(
                  `File Favoritos written`
                );
              })
              .catch(err => {
                this.log.logs[this.constructor.name].error(
                  'backup:writeFile:' + err
                );
              });
          })
          .catch(err => {
            this.log.logs[this.constructor.name].error(
              'backup:createFile:' + err
            );
          });
      })
      .catch(err => {
        this.log.logs[this.constructor.name].error(
          'backup:getFromLocal:favorites:' + err
        );
      });
    this.local
      .getFromLocal('config', null)
      .then(configData => {
        this.file
          .createFile(
            this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
            'Configuracion.json',
            true
          )
          .then(success => {
            this.file
              .writeFile(
                this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
                'Configuracion.json',
                JSON.stringify(configData)
              )
              .then(written => {
                this.log.logs[this.constructor.name].info(
                  `File Configuracion written`
                );
              })
              .catch(err => {
                this.log.logs[this.constructor.name].error(
                  'backup:writeFile:' + err
                );
              });
          })
          .catch(err => {
            this.log.logs[this.constructor.name].error(
              'backup:createFile:' + err
            );
          });
      })
      .catch(err => {
        this.log.logs[this.constructor.name].error(
          'backup:getFromLocal:config:' + err
        );
      });
    this.local
      .getFromLocal('categories', null)
      .then(categories => {
        this.file
          .createFile(
            this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
            'Categories.json',
            true
          )
          .then(success => {
            this.file
              .writeFile(
                this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
                'Categories.json',
                JSON.stringify(categories)
              )
              .then(written => {
                this.log.logs[this.constructor.name].info(
                  `File Categories written`
                );
              })
              .catch(err => {
                this.log.logs[this.constructor.name].error(
                  'backup:writeFile:' + err
                );
              });
          })
          .catch(err => {
            this.log.logs[this.constructor.name].error(
              'backup:createFile:' + err
            );
          });
      })
      .catch(err => {
        this.log.logs[this.constructor.name].error(
          'backup:getFromLocal:categories:' + err
        );
      });
    this.local
      .getFromLocal('reminders', null)
      .then(reminders => {
        this.file
          .createFile(
            this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
            'Reminders.json',
            true
          )
          .then(success => {
            this.file
              .writeFile(
                this.file.dataDirectory + '/backups/backup_' + dayFolder + '/',
                'Reminders.json',
                JSON.stringify(reminders)
              )
              .then(written => {
                this.log.logs[this.constructor.name].info(
                  `File Reminders written`
                );
              })
              .catch(err => {
                this.log.logs[this.constructor.name].error(
                  'backup:writeFile:' + err
                );
              });
          })
          .catch(err => {
            this.log.logs[this.constructor.name].error(
              'backup:createFile:' + err
            );
          });
      })
      .catch(err => {
        this.log.logs[this.constructor.name].error(
          'backup:getFromLocal:reminders:' + err
        );
      });
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
