import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

import { CloudStorage } from './data/cloudStorage';
import { LocalStorage } from './data/localStorage';
import { Network } from '@ionic-native/network';

import { List } from '../classes/list';

import { Log } from './log/log';

declare var cordova: any;
/**
 * Provider to manage lists data
 *
 * @export
 * @class ListsProvider
 */
@Injectable()
export class ListsProvider {
  path = 'assets/json/Listas.json';
  colors = 'assets/json/Colors.json';

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
   * Get colors data from local file
   *
   * @param {*} userProfile
   * @returns {*}
   * @memberof ListsProvider
   */
  getColorsData(userProfile: any): any {
    return new Promise(resolve => {
      this.localStorage.getFromLocal('colors', this.colors).then(data => {
        if (data !== undefined && data !== null) {
          resolve(data);
        } else {
          resolve([]);
        }
      });
    });
  }
  /**
   * Save favorite lists data
   *
   * @param {*} lists
   * @param {*} userProfile
   * @memberof ListsProvider
   */
  setFavoriteListsData(lists: any, userProfile: any): void {
    if (userProfile) {
      if (!this.plt.is('ios') && !this.plt.is('android')) {
        this.cloudStorage.uploadFavoritesListsData(lists, userProfile.uid);
        this.localStorage.setToLocal('favorites', lists);
      } else {
        if (this.network.type === 'NONE') {
          this.localStorage.setToLocal('favorites', lists);
        } else {
          this.cloudStorage.uploadFavoritesListsData(lists, userProfile.uid);
          this.localStorage.setToLocal('favorites', lists);
        }
      }
    } else {
      this.localStorage.setToLocal('favorites', lists);
    }
  }
  /**
   * Save lists data
   *
   * @param {*} lists
   * @param {*} userProfile
   * @memberof ListsProvider
   */
  setListsData(lists: any, userProfile: any): void {
    if (userProfile) {
      if (!this.plt.is('ios') && !this.plt.is('android')) {
        this.cloudStorage.uploadListsData(lists, userProfile.uid);
        this.localStorage.setToLocal('lists', lists);
      } else {
        if (this.network.type === 'NONE') {
          this.localStorage.setToLocal('lists', lists);
        } else {
          this.cloudStorage.uploadListsData(lists, userProfile.uid);
          this.localStorage.setToLocal('lists', lists);
        }
      }
    } else {
      this.localStorage.setToLocal('lists', lists);
    }
  }
  /**
   * Recover favorites lists data
   *
   * @param {*} userProfile
   * @returns {*}
   * @memberof ListsProvider
   */
  getFavoritesListsData(userProfile: any): any {
    return new Promise(resolve => {
      if (userProfile) {
        if (!this.plt.is('ios') && !this.plt.is('android')) {
          this.cloudStorage
            .loadFavoritesListsData(userProfile.uid)
            .then(data => {
              if (data !== undefined && data !== null) {
                this.localStorage.setToLocal('favorites', data);
                resolve(data);
              } else {
                this.localStorage.getFromLocal('favorites', null).then(data => {
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
            this.localStorage.getFromLocal('favorites', null).then(data => {
              if (data !== undefined && data !== null) {
                resolve(data);
              } else {
                resolve([]);
              }
            });
          } else {
            this.cloudStorage
              .loadFavoritesListsData(userProfile.uid)
              .then(data => {
                if (data !== undefined && data !== null) {
                  this.localStorage.setToLocal('favorites', data);
                  resolve(data);
                } else {
                  this.localStorage
                    .getFromLocal('favorites', null)
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
        this.localStorage.getFromLocal('favorites', null).then(data => {
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
   * Recover lists data
   *
   * @param {*} userProfile
   * @returns {*}
   * @memberof ListsProvider
   */
  getListsData(userProfile: any): any {
    return new Promise(resolve => {
      if (userProfile) {
        if (!this.plt.is('ios') && !this.plt.is('android')) {
          this.cloudStorage.loadListsData(userProfile.uid).then(data => {
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocal('lists', data);
              resolve(data);
            } else {
              this.localStorage.getFromLocal('lists', null).then(data => {
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
            this.localStorage.getFromLocal('lists', null).then(data => {
              if (data !== undefined && data !== null) {
                resolve(data);
              } else {
                resolve([]);
              }
            });
          } else {
            this.cloudStorage.loadListsData(userProfile.uid).then(data => {
              if (data !== undefined && data !== null) {
                this.localStorage.setToLocal('lists', data);
                resolve(data);
              } else {
                this.localStorage.getFromLocal('lists', null).then(data => {
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
        this.localStorage.getFromLocal('lists', null).then(data => {
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
   * Recover old version app lists data
   *
   * @returns {*}
   * @memberof ListsProvider
   */
  getOldLists(): any {
    return new Promise(resolve => {
      this.localStorage.getFromLocal('listas', null).then(data => {
        this.log.logs[this.constructor.name].info(
          'OldData:' + JSON.stringify(data)
        );
        if (data !== undefined && data !== null) {
          this.localStorage.getFromLocal('lists', this.path).then(result => {
            if ((<List[]>data).length === 0) {
              data = result;
            } else {
              (<List[]>data).forEach(item => {
                switch (item.colorBotones) {
                  case 'button-dark':
                    item.colorLista = 'black-list';
                    item.colorBotones = 'white-buttons';
                    break;

                  case 'button-royal':
                    item.colorLista = 'purple-list';
                    item.colorBotones = 'black-buttons';
                    break;

                  case 'button-balanced':
                    item.colorLista = 'green-list';
                    item.colorBotones = 'black-buttons';
                    break;

                  case 'button-positive':
                    item.colorLista = 'grey-list';
                    item.colorBotones = 'black-buttons';
                    break;

                  case 'button-energized':
                    item.colorLista = 'yellow-list';
                    item.colorBotones = 'black-buttons';
                    break;

                  default:
                    item.colorLista = 'white-list';
                    item.colorBotones = 'black-buttons';
                    break;
                }
              });
            }
            this.localStorage.setToLocal('lists', data);
            resolve(data);
          });
        } else {
          this.localStorage.getFromLocal('lists', this.path).then(result => {
            this.localStorage.setToLocal('lists', result);
            resolve(result);
          });
        }
      });
    });
  }
}
