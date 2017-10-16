import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

import { CloudStorage } from './cloudStorage';
import { LocalStorage } from './localStorage';
import { Network } from '@ionic-native/network';

declare var cordova: any;

/*
  Generated class for the ConfigData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class ConfigData {
  configData: any = null;
  path = 'assets/json/Configuracion.json';

  constructor(
    private cloudStorage: CloudStorage,
    private localStorage: LocalStorage,
    private network: Network,
    private plt: Platform
  ) {}

  setConfigData(data: any, userProfile: any) {
    let arrData = [];
    arrData.push(data);
    if (userProfile) {
      if (!this.plt.is('ios') && !this.plt.is('android')) {
        this.cloudStorage.uploadConfigData(arrData, userProfile.uid);
      } else {
        if (this.network.type === 'NONE') {
          this.localStorage.setToLocal('config', data);
        } else {
          this.cloudStorage.uploadConfigData(arrData, userProfile.uid);
        }
      }
    } else {
      this.localStorage.setToLocal('config', data);
    }
  }

  getConfigData(userProfile: any): any {
    return new Promise(resolve => {
      if (userProfile) {
        if (!this.plt.is('ios') && !this.plt.is('android')) {
          this.cloudStorage.loadConfigData(userProfile.uid).then(data => {
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocal('config', data[0]);
              resolve(data[0]);
            } else {
              this.localStorage.getFromLocal('config', null).then(data => {
                if (data !== undefined && data !== null) {
                  resolve(data);
                } else {
                  resolve({});
                }
              });
            }
          });
        } else {
          if (this.network.type === 'NONE') {
            this.localStorage.getFromLocal('config', this.path).then(data => {
              if (data !== undefined && data !== null) {
                resolve(data);
              } else {
                resolve({});
              }
            });
          } else {
            this.cloudStorage.loadConfigData(userProfile.uid).then(data => {
              if (data !== undefined && data !== null) {
                this.localStorage.setToLocal('config', data[0]);
                resolve(data[0]);
              } else {
                this.localStorage.getFromLocal('config', null).then(data => {
                  if (data !== undefined && data !== null) {
                    resolve(data);
                  } else {
                    resolve({});
                  }
                });
              }
            });
          }
        }
      } else {
        this.localStorage.getFromLocal('config', null).then(data => {
          if (data !== undefined && data !== null) {
            resolve(data);
          } else {
            resolve({});
          }
        });
      }
    });
  }

  getOldConfigData(): any {
    return new Promise(resolve => {
      this.localStorage.getFromLocal('configData', null).then(data => {
        if (data !== undefined && data !== null) {
          if (!(<any>data).version) {
            this.localStorage.getFromLocal('config', this.path).then(result => {
              if ((<any[]>data).length === 0) {
                data = result;
              } else {
                (<any>data).version = true;
                (<any>data).categoryDefault = (<any>result).categoryDefault;
                (<any>data).unitDefault = (<any>result).unitDefault;
                (<any>data).stepDefault = (<any>result).stepDefault;
              }
              resolve(data);
            });
          } else {
            resolve(data);
          }
        } else {
          this.localStorage.getFromLocal('config', this.path).then(result => {
            resolve(result);
          });
        }
      });
    });
  }
}
