import {Component} from '@angular/core';

import { ViewController, NavController, NavParams} from 'ionic-angular';

/*
  Generated class for the ListIcons page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'list-icons.html',
})
export class ListIconsPage {
  icons: any;
  selectedIcon: any;
  constructor(public nav: NavController, private view: ViewController, public params: NavParams) {}

  ngOnInit() {
    this.icons = this.params.get('icons');
    this.selectedIcon = [];
  }

  selected(event, icon) {
    this.selectedIcon = icon;
    this.view.dismiss(this.selectedIcon);
  }

  close() {
      this.view.dismiss();
  }
}
