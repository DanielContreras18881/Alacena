import { Component } from "@angular/core";
import { ViewController } from "ionic-angular";

@Component({
  selector: "popover",
  template: `
    <ion-grid text-center>
      <ion-row>
        <ion-col>
          <button ion-button full outline small clear (click)="onAction('load')">Load List</button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button ion-button full outline small clear (click)="onAction('store')">Save List</button>  
        </ion-col>
      </ion-row>
    </ion-grid>
  `
})
export class PopoverPage {
  constructor(private viewCtrl: ViewController) {}

  onAction(action: string) {
    this.viewCtrl.dismiss({ action: action });
  }
}
