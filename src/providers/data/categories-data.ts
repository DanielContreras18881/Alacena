import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import { CloudStorage } from './cloudStorage';
import { LocalStorage } from './localStorage';

declare var cordova: any;
/*
  Generated class for the CategoriesData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class CategoriesData {
  categoriesData: any = null;
  path = 'assets/json/categories.json';

  constructor(
    private cloudStorage: CloudStorage,
    private localStorage: LocalStorage,
    private network: Network,
    private plt: Platform
  ) {}

  setCategoriesData(data: any, userProfile: any) {
    if (userProfile) {
      if (!this.plt.is('ios') && !this.plt.is('android')) {
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

  getCategoriesData(userProfile: any): any {
    return new Promise(resolve => {
      if (userProfile) {
        if (!this.plt.is('ios') && !this.plt.is('android')) {
          this.cloudStorage.loadCategoriesData(userProfile.uid).then(data => {
            //console.log("cloudStorage:" + JSON.stringify(data));
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocal('categories', data);
              resolve(data);
            } else {
              this.localStorage
                .getFromLocal('categories', this.path)
                .then(data => {
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
            this.localStorage
              .getFromLocal('categories', this.path)
              .then(data => {
                //console.log("localStorage:" + JSON.stringify(data));
                if (data !== undefined && data !== null) {
                  resolve(data);
                } else {
                  resolve([]);
                }
              });
          } else {
            this.cloudStorage.loadCategoriesData(userProfile.uid).then(data => {
              //console.log("cloudStorage:" + JSON.stringify(data));
              if (data !== undefined && data !== null) {
                this.localStorage.setToLocal('categories', data);
                resolve(data);
              } else {
                this.localStorage
                  .getFromLocal('categories', this.path)
                  .then(data => {
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
        this.localStorage.getFromLocal('categories', this.path).then(data => {
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
}
