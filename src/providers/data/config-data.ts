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

// TODO: get data from firebase or local if not found

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
    console.log(userProfile);
    console.log(!this.plt.is('ios') && !this.plt.is('android'));
    console.log(this.network.type);
    if (userProfile) {
      if (!this.plt.is('ios') && !this.plt.is('android')) {
        this.cloudStorage.uploadConfigData(data, userProfile.uid);
      } else {
        if (this.network.type === 'NONE') {
          this.localStorage.setToLocal('config', data);
        } else {
          this.cloudStorage.uploadConfigData(data, userProfile.uid);
        }
      }
    } else {
      console.log(data);
      this.localStorage.setToLocal('config', data);
    }
  }

  getConfigData(userProfile: any): any {
    /*
    if (this.configData) {
      // already loaded data
      return Promise.resolve(this.configData);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http
        .get(this.path)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.configData = data;
          resolve(this.configData);
        });
	 });
	 */
    return new Promise(resolve => {
      if (userProfile) {
        if (!this.plt.is('ios') && !this.plt.is('android')) {
          this.cloudStorage.loadConfigData(userProfile.uid).then(data => {
            console.log('cloudStorage:' + JSON.stringify(data));
            if (data !== undefined && data !== null) {
              this.localStorage.setToLocal('config', data);
              resolve(data);
            } else {
              this.localStorage.getFromLocal('config', this.path).then(data => {
                console.log('getFromLocal:' + JSON.stringify(data));
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
            this.localStorage.getFromLocal('config', this.path).then(data => {
              console.log('localStorage:' + JSON.stringify(data));
              if (data !== undefined && data !== null) {
                resolve(data);
              } else {
                resolve([]);
              }
            });
          } else {
            this.cloudStorage.loadConfigData(userProfile.uid).then(data => {
              console.log('cloudStorage2:' + JSON.stringify(data));
              if (data !== undefined && data !== null) {
                this.localStorage.setToLocal('config', data);
                resolve(data);
              } else {
                this.localStorage
                  .getFromLocal('config', this.path)
                  .then(data => {
                    console.log('getFromLocal2:' + JSON.stringify(data));
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
        this.localStorage.getFromLocal('config', this.path).then(data => {
          console.log('localStorage2:' + JSON.stringify(data));
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
