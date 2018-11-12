import { List } from '../classes/list';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import { CloudStorage } from './data/cloudStorage';
import { LocalStorage } from './data/localStorage';
import moment from 'moment';

import { Log } from './log/log';

declare var cordova: any;
/**
 * Provider to manage list data
 *
 * @export
 * @class ListProvider
 */
@Injectable()
export class ListProvider {
  listData: any = null;
  path = 'assets/json/lists/';

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
   * Save list data
   *
   * @param {string} name
   * @param {any[]} data
   * @param {*} userProfile
   * @memberof ListProvider
   */
  setListData(name: string, data: any[], userProfile: any): void {
    if (userProfile) {
      if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
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
  /**
   * Remove list data
   *
   * @param {string} name
   * @param {*} userProfile
   * @memberof ListProvider
   */
  removeListData(name: string, userProfile: any): void {
    if (userProfile) {
      if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
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
  /**
   * Recover list data
   *
   * @param {string} name
   * @param {*} userProfile
   * @returns
   * @memberof ListProvider
   */
  getListItemsData(name: string, userProfile: any) {
    return new Promise(resolve => {
      if (userProfile) {
        if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
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
  /**
   * Recover old version app list data
   *
   * @param {List[]} lists
   * @memberof ListProvider
   */
  getOldListItemsData(lists: List[]) {
    this.localStorage
      .getFromLocal('cantidadElementosLista', null)
      .then(data => {
        this.log.logs[this.constructor.name].info(
          'OldData:' + JSON.stringify(data)
        );
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
