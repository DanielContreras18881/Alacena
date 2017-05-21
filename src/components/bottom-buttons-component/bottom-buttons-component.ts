import { Component } from '@angular/core';

/**
 * Generated class for the BottomButtonsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'bottom-buttons-component',
  templateUrl: 'bottom-buttons-component.html'
})
export class BottomButtonsComponent {

  text: string;

  constructor() {
    console.log('Hello BottomButtonsComponent Component');
    this.text = 'Hello World';
  }

}
