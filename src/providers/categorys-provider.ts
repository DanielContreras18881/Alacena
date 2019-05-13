import { Category } from '../classes/category';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import { CloudStorage } from './data/cloudStorage';
import { LocalStorage } from './data/localStorage';

declare var cordova: any;
/**
 * Provider to manage categories data
 *
 * @export
 * @class CategorysProvider
 */
@Injectable()
export class CategorysProvider {
  path = 'assets/json/Categories.json';

  constructor(
    private cloudStorage: CloudStorage,
    private localStorage: LocalStorage,
    private network: Network,
    private plt: Platform
  ) {}
  /**
   * Save categories data
   *
   * @param {Category[]} data
   * @param {*} userProfile
   * @memberof CategorysProvider
   */
  setCategoriesData(data: Category[], userProfile: any) {
    if (userProfile) {
      if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
        this.cloudStorage.uploadCategoriesData(data, userProfile.uid);
      } else {
        if (this.network.type === 'NONE') {
          this.localStorage.setToLocal('categories', data);
        } else {
          this.cloudStorage.uploadCategoriesData(data, userProfile.uid);
        }
      }
    } else {
      this.localStorage.setToLocal('categories', data);
    }
  }
  /**
   * Recover caegories data
   *
   * @param {*} userProfile
   * @returns {*}
   * @memberof CategorysProvider
   */
  getCategoriesData(userProfile: any): any {
    return new Promise(resolve => {
      if (userProfile) {
        if ((this.plt.is('android') || this.plt.is('ios')) && !this.plt.is('mobileweb')) {
          this.cloudStorage.loadCategoriesData(userProfile.uid).then(data => {
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocal('categories', data);
              resolve(data);
            } else {
              this.localStorage
                .getFromLocal('categories', this.path)
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
              .getFromLocal('categories', this.path)
              .then(data => {
                if (data !== undefined && data !== null) {
                  resolve(data);
                } else {
                  resolve([]);
                }
              });
          } else {
            this.cloudStorage.loadCategoriesData(userProfile.uid).then(data => {
              if (data !== undefined) {
                this.localStorage.setToLocal('categories', data || []);
                resolve(data || []);
              } else {
                this.localStorage
                  .getFromLocal('categories', this.path)
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
        this.localStorage.getFromLocal('categories', this.path).then(data => {
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
