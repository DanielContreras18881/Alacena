import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/**
 * Provider to manage developer contact stuff
 * 
 * @export
 * @class DevContactProvider
 */
@Injectable()
export class DevContactProvider {
  constructor(public http: Http) {
    console.log('Hello DevContactProvider Provider');
  }
}
