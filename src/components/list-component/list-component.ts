import { Component } from '@angular/core';

/**
 * Generated class for the ListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'list-component',
  templateUrl: 'list-component.html'
})
export class ListComponent {

  text: string;

  constructor() {
    console.log('Hello ListComponent Component');
    this.text = 'Hello World';
  }

}
