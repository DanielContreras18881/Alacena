import { Http }       from "@angular/http";
import { Platform } from "ionic-angular";
import { Injectable } from "@angular/core";

import { CloudStorage } from "./cloudStorage";
import { LocalStorage } from "./localStorage";
import { Network } from "@ionic-native/network";

import 'rxjs/add/operator/map';

/*
  Generated class for the CategoriesData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

// TODO: get data from firebase or local if not found

@Injectable()
export class CategoriesData {
  categoriesData: any = null;
  path = "assets/json/categories.json";

  constructor(private localStorage: LocalStorage, public http: Http) {}

  setCategoriesData(data: any[]) {
    this.localStorage.setToLocal("categories", data);
  }

  getCategoriesData(): any {
    if (this.categoriesData) {
      // already loaded data
      return Promise.resolve(this.categoriesData);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get(this.path).map(res => res.json()).subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.categoriesData = data;
        resolve(this.categoriesData);
      });
    });
  }
}
