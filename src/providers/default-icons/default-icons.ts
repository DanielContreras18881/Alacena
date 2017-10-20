import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/**
 * Provider to get default icons data for use on the categories of the app
 * 
 * @export
 * @class DefaultIcons
 */
@Injectable()
export class DefaultIcons {
  icons: any = null;
  path = 'assets/json/defaultIcons.json';

  constructor(public http: Http) {}
  /**
	 * Get icons data from a local file
	 * 
	 * @returns {*} 
	 * @memberof DefaultIcons
	 */
  getIcons(): any {
    if (this.icons) {
      return Promise.resolve(this.icons);
    }
    return new Promise(resolve => {
      this.http
        .get(this.path)
        .map(res => res.json())
        .subscribe(data => {
          this.icons = data;
          resolve(this.icons);
        });
    });
  }
}
