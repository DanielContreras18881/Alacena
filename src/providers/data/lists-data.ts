import { Injectable } from "@angular/core";

import { CloudStorage } from "./cloudStorage";
import { LocalStorage } from "./localStorage";
import { Network } from "@ionic-native/network";

/*
  Generated class for the ListsData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class ListsData {
  path = "assets/json/Listas.json";

  constructor(
    private cloudStorage: CloudStorage,
    private localStorage: LocalStorage,
    private network: Network
  ) {}

  setListsData(lists: any, userProfile: any): void {
    if (userProfile) {
      if (
        this.network.type === "NONE"
		) {
        this.cloudStorage.uploadListsData(lists, userProfile.uid);
      } else {
        this.localStorage.setToLocalStorage("lists", lists);
      }
    } else {
      this.localStorage.setToLocalStorage("lists", lists);
    }
  }

  getListsData(userProfile: any): any {
    return new Promise(resolve => {

      if (userProfile) {
        if (
          this.network.type === "NONE"
        ) {
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
          this.localStorage.getFromLocal("lists", this.path).then(data => {
				 //console.log("localStorage:" + JSON.stringify(data));
            if (data !== undefined && data !== null) {
              resolve(data);
            } else {
              resolve([]);
            }
          });
        } else {
          this.cloudStorage.loadListsData(userProfile.uid).then(data => {
				 //console.log("cloudStorage:" + JSON.stringify(data));
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocalStorage("lists", data);
              resolve(data);
            } else {
              this.localStorage.getFromLocal("lists", this.path).then(data => {
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
      } else {
        this.localStorage.getFromLocal("lists", this.path).then(data => {
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
