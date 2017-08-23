import { Platform } from "ionic-angular";
import { Injectable } from "@angular/core";

import { CloudStorage } from "./cloudStorage";
import { LocalStorage } from "./localStorage";
import { Network } from "@ionic-native/network";

/*
  Generated class for the ListData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

// TODO: get data from firebase or local if not found

@Injectable()
export class ListData {
  listData: any = null;
  path = "assets/json/lists/";

  constructor(
    private cloudStorage: CloudStorage,
    private localStorage: LocalStorage,
    private network: Network,
    private plt: Platform
  ) {}

  setListData(name: string, data: any[], userProfile: any): void {
    if (userProfile) {
      if (!this.plt.is("ios") && !this.plt.is("android")) {
        this.cloudStorage.uploadListData(name, data, userProfile.uid);
      } else {
        if (this.network.type === "NONE") {
          this.localStorage.setToLocalStorage(name, data);
        } else {
          this.cloudStorage.uploadListData(name, data, userProfile.uid);
        }
      }
    } else {
      this.localStorage.setToLocalStorage(name, data);
    }
  }

  removeListData(name: string, userProfile: any): void {
    this.cloudStorage.removeListData(name, userProfile.uid);
  }

  getListItemsData(name: string, userProfile: any) {
    return new Promise(resolve => {
      if (userProfile) {
        if (!this.plt.is("ios") && !this.plt.is("android")) {
          this.cloudStorage.loadListData(name, userProfile.uid).then(data => {
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocalStorage(name, data);
              resolve(data);
            } else {
              this.localStorage.getFromLocal(name, this.path + name + ".json").then(data => {
                if (data !== undefined && data !== null) {
                  resolve(data);
                } else {
                  resolve([]);
                }
              });
            }
          });
        } else {
          if (this.network.type === "NONE") {
            /*
let connectSubscription = this.network.onConnect().subscribe(() => {
  console.log('network connected!');
  // We just got a connection but we need to wait briefly
   // before we determine the connection type. Might need to wait.
  // prior to doing any api requests as well.
  setTimeout(() => {
    if (this.network.type === 'wifi') {
      console.log('we got a wifi connection, woohoo!');
    }
  }, 3000);
});

// stop connect watch
connectSubscription.unsubscribe();
			   */
            this.localStorage.getFromLocal(name, this.path + name + ".json").then(data => {
              if (data !== undefined && data !== null) {
                resolve(data);
              } else {
                resolve([]);
              }
            });
          } else {
            this.cloudStorage.loadListData(name, userProfile.uid).then(data => {
              if (data !== undefined && data !== null) {
                this.localStorage.setToLocalStorage(name, data);
                resolve(data);
              } else {
                this.localStorage.getFromLocal(name, this.path + name + ".json").then(data => {
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
        this.localStorage.getFromLocal(name, this.path + name + ".json").then(data => {
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
