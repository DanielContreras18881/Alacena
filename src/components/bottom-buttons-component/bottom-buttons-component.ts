import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ToastController
} from 'ionic-angular';
import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ListItem } from '../../classes/listItem';
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
  @Output() finishedRemoved = new EventEmitter<any>();
  @Output() finishedAdd = new EventEmitter<any>();
  @Output() finishNotification = new EventEmitter<any>();
  @Output() finishFavorite = new EventEmitter<any>();

  right: boolean = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private globalVars: GlobalVars
  ) {
    globalVars.getConfigData().then(config => {
      this.right =
        (<any>config).rightHand !== undefined ? (<any>config).rightHand : true;
    });
  }
  /**
   * Method on response of notification button pushed
   *
   * @memberof BottomButtonsComponent
   */
  setNotification() {
    this.finishNotification.emit();
  }
  /**
   * Method on response of save or recover button pushed
   *
   * @param {Event} event Event object associated
   * @memberof BottomButtonsComponent
   */
  saveRecoverList(event: Event) {
    this.globalVars.getFavoritesListsData().then(listFavorites => {
      let askButtons: any = [];
      askButtons.push({
        text: 'Save',
        handler: () => {
          this.alertCtrl
            .create({
              title: 'Save as...',
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
                  text: 'Save',
                  handler: data => {
                    if (data.name.trim() == '' || data.name == null) {
                      const toast = this.toastCtrl.create({
                        message: 'Please enter a valid value!',
                        duration: 1500,
                        position: 'bottom'
                      });
                      toast.present();
                      return;
                    }
                    this.globalVars.setListData(data.name.trim(), this.object);
                    (<any[]>listFavorites).push(data.name.trim());
                    this.globalVars.setFavoritesListsData(listFavorites);
                  }
                }
              ]
            })
            .present();
        }
      });
      if ((<any[]>listFavorites).length > 0) {
        askButtons.push({
          text: 'Load',
          handler: () => {
            let buttons: any = [];
            (<any[]>listFavorites).forEach(favorite => {
              buttons.push({
                text: favorite,
                handler: () => {
                  this.globalVars.getListData(favorite).then(data => {
                    this.globalVars.setListData(
                      'LISTA_COMPRA',
                      <ListItem[]>data
                    );
                    this.finishFavorite.emit(<ListItem[]>data);
                  });
                }
              });
            });
            let actionSheet = this.actionSheetCtrl.create({
              title: 'Select list to Load',
              buttons: buttons
            });
            actionSheet.present();
          }
        });
        askButtons.push({
          text: 'Remove',
          handler: () => {
            let buttons: any = [];
            (<any[]>listFavorites).forEach(favorite => {
              buttons.push({
                text: favorite,
                handler: () => {
                  this.globalVars.removetItemListData(favorite);
                  listFavorites = (<any[]>listFavorites).filter(
                    list => list !== favorite
                  );
                  this.globalVars.setFavoritesListsData(listFavorites);
                }
              });
            });
            let actionSheet = this.actionSheetCtrl.create({
              title: 'Select list to Remove',
              buttons: buttons
            });
            actionSheet.present();
          }
        });
      }
      askButtons.push({ text: 'Cancel', role: 'cancel' });
      let askFavorite = this.alertCtrl.create({
        title: 'Save or Load ShoppingList',
        buttons: askButtons
      });

      askFavorite.present();
    });
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
