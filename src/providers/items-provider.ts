import { Category } from '../classes/category';
import { Item } from '../classes/item';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

import { CloudStorage } from './data/cloudStorage';
import { LocalStorage } from './data/localStorage';
import { Network } from '@ionic-native/network';

import { Log } from './log/log';

declare var cordova: any;
/**
 * Provider to manage items data
 *
 * @export
 * @class ItemsProvider
 */
@Injectable()
export class ItemsProvider {
  itemData: any = null;
  path = 'assets/json/Elementos.json';

  constructor(
    private cloudStorage: CloudStorage,
    private localStorage: LocalStorage,
    private network: Network,
    private plt: Platform,
    public log: Log
  ) {
    this.log.setLogger(this.constructor.name);
  }
  /**
   * Save items data
   *
   * @param {Item[]} items
   * @param {*} userProfile
   * @memberof ItemsProvider
   */
  setItemsData(items: Item[], userProfile: any): void {
    if (userProfile) {
      if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
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
  /**
   * Recover items data
   *
   * @param {any} userProfile
   * @returns {*}
   * @memberof ItemsProvider
   */
  getItemsData(userProfile): any {
    return new Promise(resolve => {
      if (userProfile) {
        if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
          this.cloudStorage.loadItemsData(userProfile.uid).then(data => {
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocal('items', data);
              resolve(data);
            } else {
              this.localStorage.getFromLocal('items', null).then(data => {
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
              if (data !== undefined && data !== null) {
                resolve(data);
              } else {
                resolve([]);
              }
            });
          } else {
            this.cloudStorage.loadItemsData(userProfile.uid).then(data => {
              if (data !== undefined) {
                this.localStorage.setToLocal('items', data || []);
                resolve(data || []);
              } else {
                this.localStorage.getFromLocal('items', null).then(data => {
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
          if (data !== undefined && data !== null) {
            resolve(data);
          } else {
            resolve([]);
          }
        });
      }
    });
  }
  /**
   * Recover old version app items
   *
   * @memberof ItemsProvider
   */
  getOldItems() {
    this.localStorage.getFromLocal('elementos', null).then(data => {
      this.log.logs[this.constructor.name].info(
        'OldData:' + JSON.stringify(data)
      );
      if (data !== undefined && data !== null) {
        this.localStorage.getFromLocal('items', this.path).then(result => {
          if ((<Item[]>data).length === 0) {
            data = result;
          } else {
            (<Item[]>data).forEach(item => {
              item.category = <Category>{
                icon:{src: 'assets/images/icons/default.png'},
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
