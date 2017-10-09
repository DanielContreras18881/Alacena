import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';

declare var cordova: any;

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocalStorage {
  constructor(private http: Http, private storage: Storage) {}

  getFromLocal(name: string, path: string) {
    return new Promise((resolve, reject) => {
      this.storage
        .get(name)
        .then(val => {
          console.log(val);
          if (val !== undefined && val !== null) {
            resolve(val);
          } else {
            this.http
              .get(path)
              .map(res => res.json())
              .subscribe(
                data => {
                  this.storage.set(name, data);
                  resolve(data);
                },
                err => {
                  this.storage.set(name, []);
                  resolve([]);
                }
              );
          }
        })
        .catch(error => {
          this.storage.set(name, []);
          resolve([]);
        });
    });
  }

  setToLocal(name: string, data: any) {
    this.storage.set(name, data);
  }

  removeFromLocal(name: string) {
    this.storage.remove(name);
  }
}
