import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import { CloudStorage } from './cloudStorage';
import { LocalStorage } from './localStorage';
import moment from 'moment';

declare var cordova: any;

/*
  Generated class for the ListData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

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
    this.localStorage
      .getFromLocal('cantidadElementosLista', null)
      .then(data => {
        if (data !== undefined && data !== null) {
          lists.forEach(list => {
            let listData = (<any[]>data).filter(
              item =>
                item.nombreLista
                  .toLowerCase()
                  .indexOf(list.nombreLista.toLowerCase()) > -1
            );
            listData.forEach(item => {
              item.category = {
                icon: 'images/icons/default.png',
                measurement: 'UNIDADES',
                categoryName: 'No Category',
                unitStep: 1
              };
              let fecha =
                item.fechaCaducidad !== null
                  ? item.fechaCaducidad
                  : '3000-01-01';
              item.fechaCaducidad = moment(fecha)
                .toDate()
                .toISOString();
            });
            this.localStorage.setToLocal(list.nombreLista, listData);
          });
        } else {
          lists.forEach(list => {
            this.localStorage.setToLocal(list.nombreLista, []);
          });
        }
      });
  }
}
