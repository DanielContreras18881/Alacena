import { Component } from '@angular/core';

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

  text: string;

  constructor() {
    console.log('Hello RemindersComponent Component');
    this.text = 'Hello World';
  }

}