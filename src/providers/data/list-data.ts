import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import { CloudStorage } from './cloudStorage';
import { LocalStorage } from './localStorage';

declare var cordova: any;

/*
  Generated class for the ListData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

// TODO: get data from firebase or local if not found

@Injectable()
export class ListData {
  listData: any = null;
  path = 'assets/json/lists/';

  constructor(
    private cloudStorage: CloudStorage,
    private localStorage: LocalStorage,
    private network: Network,
    private plt: Platform
  ) {}

  setListData(name: string, data: any[], userProfile: any): void {
    if (userProfile) {
      if (!this.plt.is('ios') && !this.plt.is('android')) {
        this.cloudStorage.uploadListData(name, data, userProfile.uid);
      } else {
        if (this.network.type === 'NONE') {
          this.localStorage.setToLocal(name, data);
        } else {
          this.cloudStorage.uploadListData(name, data, userProfile.uid);
        }
      }
    } else {
      this.localStorage.setToLocal(name, data);
    }
  }

  removeListData(name: string, userProfile: any): void {
    if (userProfile) {
      if (!this.plt.is('ios') && !this.plt.is('android')) {
        this.cloudStorage.removeListData(name, userProfile.uid);
        this.localStorage.removeFromLocal(name);
      } else {
        if (this.network.type === 'NONE') {
          this.localStorage.removeFromLocal(name);
        } else {
          this.cloudStorage.removeListData(name, userProfile.uid);
          this.localStorage.removeFromLocal(name);
        }
      }
    } else {
      this.localStorage.removeFromLocal(name);
    }
  }

  getListItemsData(name: string, userProfile: any) {
    return new Promise(resolve => {
      if (userProfile) {
        if (!this.plt.is('ios') && !this.plt.is('android')) {
          this.cloudStorage.loadListData(name, userProfile.uid).then(data => {
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocal(name, data);
              resolve(data);
            } else {
              this.localStorage
                .getFromLocal(name, this.path + name + '.json')
                .then(data => {
                  if (data !== undefined && data !== null) {
                    resolve(data);
                  } else {
                    resolve([]);
                  }
                });
            }
          });
        } else {
          if (this.network.type === 'NONE') {
            this.localStorage
              .getFromLocal(name, this.path + name + '.json')
              .then(data => {
                if (data !== undefined && data !== null) {
                  resolve(data);
                } else {
                  resolve([]);
                }
              });
          } else {
            this.cloudStorage.loadListData(name, userProfile.uid).then(data => {
              if (data !== undefined && data !== null) {
                this.localStorage.setToLocal(name, data);
                resolve(data);
              } else {
                this.localStorage
                  .getFromLocal(name, this.path + name + '.json')
                  .then(data => {
                    if (data !== undefined && data !== null) {
                      resolve(data);
                    } else {
                      resolve([]);
                    }
                  });
              }
            });
          }
        }
      } else {
        this.localStorage
          .getFromLocal(name, this.path + name + '.json')
          .then(data => {
            if (data !== undefined && data !== null) {
              resolve(data);
            } else {
              resolve([]);
            }
          });
      }
    });
  }

  getOldListItemsData(lists: any[]) {
    //  TODO : Search old lists items
    console.log(lists);
    this.localStorage
      .getFromLocal('cantidadElementosLista', null)
      .then(data => {
        if (data !== undefined && data !== null) {
        } else {
          /*
          this.localStorage
            .getFromLocal('lists', this.path)
            .then(result => {
              this.localStorage.setToLocal('lists', result);
				});
				*/
        }
      });
  }
}
