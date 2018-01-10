import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';

import { Log } from '../log/log';

declare var cordova: any;
/**
 * Provider to manage data on a local db
 *
 * @export
 * @class LocalStorage
 */
@Injectable()
export class LocalStorage {
  constructor(private http: Http, private storage: Storage, public log: Log) {
    this.log.setLogger(this.constructor.name);
  }
  /**
   * Get data from local db
   *
   * @param {string} name
   * @param {string} path
   * @returns
   * @memberof LocalStorage
   */
  getFromLocal(name: string, path: string) {
    this.log.logs[this.constructor.name].info('Get:' + name + ':' + path);
    return new Promise((resolve, reject) => {
      this.storage
        .get(name)
        .then(val => {
          if (val !== undefined && val !== null) {
            resolve(val);
          } else {
            let oldLocal = window.localStorage[name];
            if (!oldLocal || oldLocal === undefined || oldLocal === '') {
              this.http
                .get(path)
                .map(res => res.json())
                .subscribe(
                  data => {
                    this.storage.set(name, data);
                    resolve(data);
                  },
                  err => {
                    resolve(null);
                  }
                );
            } else {
              this.storage.set(name, JSON.parse(oldLocal));
              resolve(JSON.parse(oldLocal));
            }
          }
        })
        .catch(error => {
          resolve([]);
        });
    });
  }
  /**
   * Store data on local db
   *
   * @param {string} name
   * @param {*} data
   * @memberof LocalStorage
   */
  setToLocal(name: string, data: any) {
    this.log.logs[this.constructor.name].info('Add:' + name);
    this.storage.set(name, data);
  }
  /**
   * Remove data from local db
   *
   * @param {string} name
   * @memberof LocalStorage
   */
  removeFromLocal(name: string) {
    this.log.logs[this.constructor.name].info('Remove:' + name);
    this.storage.remove(name);
  }
}
