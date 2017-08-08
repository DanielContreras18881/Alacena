import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

import { Storage } from "@ionic/storage";

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocalStorage {
  constructor(private http: Http, private storage: Storage) {}

  getFromLocal(name: string, path: string) {
    return new Promise(resolve => {
      this.storage.get(name).then(val => {
        if (val !== undefined && val !== null && val.length > 0) {
          resolve(val);
        } else {
          this.http.get(path).map(res => res.json()).subscribe(data => {
            this.storage.set(name, data);
            resolve(data);
          });
        }
      });
    });
  }

  setToLocalStorage(name: string, data: any) {
    this.storage.set(name, data);
  }
}
