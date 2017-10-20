import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
/**
 * Bottom button component to use on App pages
 * 
 * @export
 * @class BottomButtonsComponent
 */
@Component({
  selector: 'bottom-buttons-component',
  templateUrl: 'bottom-buttons-component.html'
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
  @Output() finishedRemoved = new EventEmitter<any>();
  @Output() finishedAdd = new EventEmitter<any>();
  @Output() finishNotification = new EventEmitter<any>();

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}
  /**
	 * Method on response of notification button pushed
	 * 
	 * @memberof BottomButtonsComponent
	 */
  setNotification() {
    console.log('setNotification');
    this.finishNotification.emit();
  }
  /**
	 * Method on response of save or recover button pushed
	 * 
	 * @param {Event} event Event object associated
	 * @memberof BottomButtonsComponent
	 */
  saveRecoverList(event: Event) {
    console.log('saveRecoverList');
  }
  /**
	 * Method on response of remove button pushed
	 * 
	 * @param {Event} event Event object associated
	 * @memberof BottomButtonsComponent
	 */
  removeItems(event: Event) {
    let remove = this.alertCtrl.create();
    remove.setTitle('Remove');
    let existElements = false;
    this.object.forEach((item: any) => {
      let nombre =
        this.type === 'List'
          ? item.nombreLista
          : this.type === 'Categories'
            ? item.categoryName
            : item.nombreElemento;
      if (nombre !== 'LISTA_COMPRA') {
        existElements = true;
        remove.addInput({
          type: 'checkbox',
          label: nombre,
          value: nombre,
          checked: false
        });
      }
    });
    remove.addButton('Cancel');
    remove.addButton({
      text: 'OK',
      handler: data => {
        if (data.length === 0) {
          const toast = this.toastCtrl.create({
            message: 'Please select at least one ' + this.type + ' to remove!',
            duration: 1500,
            position: 'bottom'
          });
          toast.present();
          return;
        }
        this.finishedRemoved.emit(data);
        const toast = this.toastCtrl.create({
          message: data.length + ' ' + this.type + ' removed!',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
      }
    });
    if (existElements) remove.present();
  }
  /**
	 * Method on response of add button pushed
	 * 
	 * @param {Event} event Event object associated
	 * @memberof BottomButtonsComponent
	 */
  addItem(event: Event) {
    let type = this.type;
    if (type === 'List' || type === 'Item') {
      this.alertCtrl
        .create({
          title: 'Add New ' + type,
          inputs: [
            {
              name: 'name'
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Add',
              handler: data => {
                console.log(data);
                if (data.name.trim() == '' || data.name == null) {
                  const toast = this.toastCtrl.create({
                    message: 'Please enter a valid value!',
                    duration: 1500,
                    position: 'bottom'
                  });
                  toast.present();
                  return;
                }
                this.finishedAdd.emit(data.name);
              }
            }
          ]
        })
        .present();
    } else {
      this.finishedAdd.emit();
    }
  }
}
