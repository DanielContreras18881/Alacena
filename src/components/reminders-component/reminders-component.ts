import { Component } from '@angular/core';
import moment from 'moment';

import { ViewController, NavParams } from 'ionic-angular';
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
  minDate: string = moment()
    .toDate()
    .toISOString();
  data: any = {
    notificationDate: moment()
      .toDate()
      .toISOString()
  };

  constructor(private view: ViewController) {
    console.log(this.minDate);
  }
  /**
	 * Close modal saving data
	 * 
	 * @memberof RemindersComponent
	 */
  save() {
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
