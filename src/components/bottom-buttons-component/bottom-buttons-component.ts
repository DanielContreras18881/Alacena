import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AlertController, ToastController } from "ionic-angular";

/**
 * Generated class for the BottomButtonsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: "bottom-buttons-component",
  templateUrl: "bottom-buttons-component.html"
})
export class BottomButtonsComponent {
  @Input() notifications: boolean;
  @Input() favorites: boolean;
  @Input() remove: boolean;
  @Input() add: boolean;

  @Input() object: any;
  @Input() type: string;

  @Output() finishedNotifications = new EventEmitter<any>();
  @Output() finishedFavorites = new EventEmitter<any>();
  @Output() finishedRemove = new EventEmitter<any>();
  @Output() finishedAdd = new EventEmitter<any>();

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  setNotification(event: Event) {
    console.log("setNotification");
  }

  saveRecoverList(event: Event) {
    console.log("saveRecoverList");
  }

  removeItems(event: Event) {
    console.log("removeItems");
  }

  addItem(event: Event) {
    let type = this.type;
    this.alertCtrl
      .create({
        title: "Add New " + type,
        inputs: [
          {
            name: "name"
          }
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel"
          },
          {
            text: "Add",
            handler: data => {
              if (data.name.trim() == "" || data.name == null) {
                const toast = this.toastCtrl.create({
                  message: "Please enter a valid value!",
                  duration: 1500,
                  position: "bottom"
                });
                toast.present();
                return;
              }
              this.finishedAdd.emit(data.name);
              const toast = this.toastCtrl.create({
                message: this.type + " " + data.name + " added!",
                duration: 1500,
                position: "bottom"
              });
              toast.present();
            }
          }
        ]
      })
      .present();
  }
}
