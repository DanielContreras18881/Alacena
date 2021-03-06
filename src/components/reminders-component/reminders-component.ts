import { Component } from '@angular/core';
import moment from 'moment';

import { ViewController, NavParams } from 'ionic-angular';

import { Log } from '../../providers/log/log';
/**
 * Component to show and control reminders for a list, on a modal window
 *
 * @export
 * @class RemindersComponent
 */
@Component({
  selector: 'reminders-component',
  templateUrl: 'reminders-component.html'
})
export class RemindersComponent {
  editing: boolean;
  minDate: string = moment().seconds(0).milliseconds(0)
    .toDate()
    .toISOString();
  data: any = {};

  constructor(
    private view: ViewController,
    params: NavParams,
    public log: Log
  ) {
    this.log.setLogger(this.constructor.name);
    this.log.logs[this.constructor.name].info('constructor');
    this.data.notificationDate = params.data.time;
    this.data.message = params.data.message;
  }
  /**
   * Close modal saving data
   *
   * @memberof RemindersComponent
   */
  save() {
    this.log.logs[this.constructor.name].info('save');
    this.view.dismiss(this.data);
  }
  /**
   * Close modal discarding data
   *
   * @memberof RemindersComponent
   */
  close() {
    this.view.dismiss();
  }
}
