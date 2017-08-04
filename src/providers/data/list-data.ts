import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

import { CloudStorage } from "./cloudStorage";
import { Storage } from "@ionic/storage";

/*
  Generated class for the ListData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

// TODO: get data from firebase or local if not found

@Injectable()
export class ListData {
  listData: any = null;
  path = "assets/json/CantidadElementoLista.json";

  constructor(
    private http: Http,
    private cloudStorage: CloudStorage,
    private storage: Storage
  ) {}

  setListData(name: string, data: any[], userProfile: any): void {
    this.cloudStorage.uploadListData(name, data, userProfile.uid);
  }

  removeListData(name: string, userProfile: any): void {
    this.cloudStorage.removeListData(name, userProfile.uid);
  }

  getListItemsData(name: string, userProfile: any) {
    return new Promise(resolve => {
      this.cloudStorage.loadListData(name, userProfile.uid).then(data => {
        this.http
          .get(data.toString())
          .map(res => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            this.listData = data;
            resolve(this.listData);
          });
      });
    });
  }

  getListData(): any {
    if (this.listData) {
      // already loaded data
      return Promise.resolve(this.listData);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get(this.path).map(res => res.json()).subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.listData = data;
        resolve(this.listData);
      });
    });
  }
}
