import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Log } from '../log/log';
/**
 * Service to manage backup local data for the user
 *
 * @export
 * @class BackupData
 */
@Injectable()
export class BackupData {
  data: any = null;

  constructor(public http: Http, public log: Log) {
    this.log.setLogger(this.constructor.name);
  }
  // TODO: add backup functionality to local files
  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http
        .get('path/to/data.json')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }
}
