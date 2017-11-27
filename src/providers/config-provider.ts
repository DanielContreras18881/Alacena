import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

import { CloudStorage } from './data/cloudStorage';
import { LocalStorage } from './data/localStorage';
import { Network } from '@ionic-native/network';

declare var cordova: any;
/**
 * Provider to manage config data
 *
 * @export
 * @class ConfigProvider
 */
@Injectable()
export class ConfigProvider {
  configData: any = null;
  path = 'assets/json/Configuracion.json';

  constructor(
    private cloudStorage: CloudStorage,
    private localStorage: LocalStorage,
    private network: Network,
    private plt: Platform
  ) {}
  /**
   * Save config data
   *
   * @param {*} data
   * @param {*} userProfile
   * @memberof ConfigProvider
   */
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
  /**
   * Recover config data
   *
   * @param {*} userProfile
   * @returns {*}
   * @memberof ConfigProvider
   */
  getConfigData(userProfile: any): any {
    return new Promise(resolve => {
      if (userProfile) {
        if (!this.plt.is('ios') && !this.plt.is('android')) {
          this.cloudStorage.loadConfigData(userProfile.uid).then(data => {
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocal('config', data);
              resolve(data);
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
  /**
   * Recover old version app config data
   *
   * @returns {*}
   * @memberof ConfigProvider
   */
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
