import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the DefaultIcons provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

// TODO: get data from firebase or local if not found

@Injectable()
export class DefaultIcons {
  icons: any = null;
  path = 'assets/json/defaultIcons.json';

  constructor(public http: Http) {}

  getIcons(): any {
    if (this.icons) {
      // already loaded data
      return Promise.resolve(this.icons);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get(this.path)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.icons = data;
          resolve(this.icons);
        });
    });
  }
}
