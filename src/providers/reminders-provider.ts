import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/**
 * Provider to manage reminders data
 * 
 * @export
 * @class RemindersProvider
 */
@Injectable()
export class RemindersProvider {
  constructor(public http: Http) {
    console.log('Hello RemindersProvider Provider');
  }
}
