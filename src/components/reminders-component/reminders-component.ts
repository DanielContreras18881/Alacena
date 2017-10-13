import { Component } from '@angular/core';
import moment from 'moment';

import { ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RemindersComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
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

  save() {
    this.view.dismiss(this.data);
  }

  close() {
    this.view.dismiss();
  }
}
