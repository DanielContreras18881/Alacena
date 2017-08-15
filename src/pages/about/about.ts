import {Component} from '@angular/core';

import { NavController} from 'ionic-angular';

/*
  Generated class for the AboutPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

// TODO: get data from device and manage tutorials

@Component({
  templateUrl: 'about.html',
})
export class AboutPage {
  constructor(public nav: NavController) {}
}
