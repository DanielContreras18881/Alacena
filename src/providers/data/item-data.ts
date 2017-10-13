import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

import { CloudStorage } from './cloudStorage';
import { LocalStorage } from './localStorage';
import { Network } from '@ionic-native/network';

declare var cordova: any;
/*
  Generated class for the ItemData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class ItemData {
  itemData: any = null;
  path = 'assets/json/Elementos.json';

  constructor(
    private cloudStorage: CloudStorage,
    private localStorage: LocalStorage,
    private network: Network,
    private plt: Platform
  ) {}

  setItemsData(items: any, userProfile: any): void {
    if (userProfile) {
      if (!this.plt.is('ios') && !this.plt.is('android')) {
        this.cloudStorage.uploadItemsData(items, userProfile.uid);
      } else {
        if (this.network.type === 'NONE') {
          this.localStorage.setToLocal('items', items);
        } else {
          this.cloudStorage.uploadItemsData(items, userProfile.uid);
        }
      }
    } else {
      this.localStorage.setToLocal('items', items);
    }
  }

  getItemsData(userProfile): any {
    return new Promise(resolve => {
      if (userProfile) {
        if (!this.plt.is('ios') && !this.plt.is('android')) {
          this.cloudStorage.loadItemsData(userProfile.uid).then(data => {
            //console.log("cloudStorage:" + JSON.stringify(data));
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocal('items', data);
              resolve(data);
            } else {
              this.localStorage.getFromLocal('items', null).then(data => {
                //console.log("getFromLocal:" + JSON.stringify(data));
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
            this.localStorage.getFromLocal('items', null).then(data => {
              //console.log("localStorage:" + JSON.stringify(data));
              if (data !== undefined && data !== null) {
                resolve(data);
              } else {
                resolve([]);
              }
            });
          } else {
            this.cloudStorage.loadItemsData(userProfile.uid).then(data => {
              //console.log("cloudStorage:" + JSON.stringify(data));
              if (data !== undefined && data !== null) {
                this.localStorage.setToLocal('items', data);
                resolve(data);
              } else {
                this.localStorage.getFromLocal('items', null).then(data => {
                  //console.log("getFromLocal:" + JSON.stringify(data));
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
        this.localStorage.getFromLocal('items', null).then(data => {
          //console.log("localStorage2:" + JSON.stringify(data));
          if (data !== undefined && data !== null) {
            resolve(data);
          } else {
            resolve([]);
          }
        });
      }
    });
  }
  getOldItems() {
    this.localStorage.getFromLocal('elementos', null).then(data => {
      if (data !== undefined && data !== null) {
        this.localStorage.getFromLocal('items', this.path).then(result => {
          if ((<any[]>data).length === 0) {
            data = result;
          } else {
            (<any[]>data).forEach(item => {
              item.category = {
                icon: 'images/icons/default.png',
                measurement: 'UNIDADES',
                categoryName: 'No Category',
                unitStep: 1
              };
            });
          }
          this.localStorage.setToLocal('items', data);
        });
      } else {
        this.localStorage.getFromLocal('items', this.path).then(result => {
          this.localStorage.setToLocal('items', result);
        });
      }
    });
  }
}
