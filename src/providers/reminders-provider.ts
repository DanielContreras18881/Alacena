import { LocalStorage } from './data/localStorage';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Reminder } from '../classes/reminder';
import 'rxjs/add/operator/map';
/**
 * Provider to manage reminders data
 * 
 * @export
 * @class RemindersProvider
 */
@Injectable()
export class RemindersProvider {
  constructor(public http: Http, private localStorage: LocalStorage) {}
  setReminder(reminder: Reminder): void {
    this.localStorage.getFromLocal('reminders', null).then(data => {
      if (data === undefined || data === null) {
        data = [];
      }
      (<Reminder[]>data).push(reminder);
      this.localStorage.setToLocal('reminders', data);
    });
  }
  removeReminder(reminder: Reminder): void {
    this.localStorage.getFromLocal('reminders', null).then(data => {
      if (data === undefined || data === null) {
        data = [];
      }
      data = (<Reminder[]>data).filter(
        item => item.message !== reminder.message || item.time !== reminder.time
      );
      this.localStorage.setToLocal('reminders', data);
    });
  }
  getReminders() {
    return new Promise(resolve => {
      this.localStorage.getFromLocal('reminders', null).then(data => {
        if (data === undefined || data === null) {
          data = [];
        }
        resolve(data);
      });
    });
  }
}
