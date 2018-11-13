import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ToastController
} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { GlobalVars } from '../../providers/global-vars/global-vars';
import { ListItem } from '../../classes/listItem';
import { database } from 'firebase';
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
    private globalVars: GlobalVars,
    public translate: TranslateService
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
        text: this.translate.instant('Guardar'),
        handler: () => {
          this.alertCtrl
            .create({
              title: this.translate.instant('GuardarComo'),
              inputs: [
                {
                  name: 'name'
                }
              ],
              buttons: [
                {
                  text: this.translate.instant('Cancelar'),
                  role: 'cancel'
                },
                {
                  text: this.translate.instant('Guardar'),
                  handler: data => {
                    if (data.name.trim() == '' || data.name == null) {
                      const toast = this.toastCtrl.create({
                        message: this.translate.instant('ValorValido'),
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
          text: this.translate.instant('Cargar'),
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
              title: this.translate.instant('ListaCargar'),
              buttons: buttons
            });
            actionSheet.present();
          }
        });
        askButtons.push({
          text: this.translate.instant('Borrar'),
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
              title: this.translate.instant('ListaBorrar'),
              buttons: buttons
            });
            actionSheet.present();
          }
        });
      }
      askButtons.push({ text: this.translate.instant('Cancelar'), role: 'cancel' });
      let askFavorite = this.alertCtrl.create({
        title: this.translate.instant('GuardarListaCompra'),
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
    remove.setTitle(this.translate.instant('Borrar'));
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
    remove.addButton(this.translate.instant('Cancelar'));
    remove.addButton({
      text: this.translate.instant('OK'),
      handler: data => {
        if (data.length === 0) {
          const toast = this.toastCtrl.create({
            message: this.translate.instant('SeleccionaParaBorrar',{value:this.type}),
            duration: 1500,
            position: 'bottom'
          });
          toast.present();
          return;
        }
        this.finishedRemoved.emit(data);
        const toast = this.toastCtrl.create({
          message: this.translate.instant('Borrados',{cuantos:database.length,tipo:this.type}),
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
                    message: this.translate.instant('ValorValido'),
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
