import { Category } from '../../classes/category';
import { Injectable } from '@angular/core';
import { AlertController, ModalController } from 'ionic-angular';

import { ListIconsPage } from '../../components/icons/list-icons';
import { DefaultIcons } from '../../providers/default-icons/default-icons';
import { GlobalVars } from '../../providers/global-vars/global-vars';

import { Log } from '../log/log';

//import { Camera } from 'ionic-native';
//import { ImagePicker } from 'ionic-native';
/**
 * Service to manage categories
 *
 * @export
 * @class CategoriesService
 */
@Injectable()
export class CategoriesService {
  private icons: string[];

  constructor(
    public mod: ModalController,
    public alertCtrl: AlertController,
    private globalVars: GlobalVars,
    private iconsData: DefaultIcons,
    public log: Log
  ) {
    this.log.setLogger(this.constructor.name);
    this.iconsData.getIcons().then(data => {
      this.icons = <string[]>data;
    });
  }
  /**
   * Event to change the category of a item on a list or generic, showing a modal window
   *
   * @param {Category} currentCategory
   * @param {any} item
   * @returns
   * @memberof CategoriesService
   */
  changeCategory(currentCategory: Category, item) {
    this.log.logs[this.constructor.name].info(
      'changeCategory:' + currentCategory + ':' + item
    );
    return new Promise(resolve => {
      let change = this.alertCtrl.create();
      let currentCategoryName =
        currentCategory !== undefined ? currentCategory.categoryName : '';
      change.setTitle('Change category ' + currentCategoryName + ' by:');

      this.globalVars.getCategoriesData().then(data => {
        let listCategories = <Category[]>data;
        listCategories.forEach((category: Category) => {
          if (currentCategoryName !== category.categoryName) {
            change.addInput({
              type: 'radio',
              label: category.categoryName,
              value: <any>category,
              checked: false
            });
          }
        });

        change.addButton('Cancel');
        change.addButton({
          text: 'OK',
          handler: data => {
            item.category = data;
            resolve(item);
          }
        });
        change.present();
      });
    });
  }
  /**
   * Event to change the icon of a category, showing a modal window to select from gallery or taking a photo
   *
   * @param {Category} category
   * @param {Icon[]} icons
   * @memberof CategoriesService
   */
  changeCategoryIcon(category: Category, icons: string[]) {
    this.log.logs[this.constructor.name].info('changeCategoryIcon:' + category);
    let paramIcons = icons !== null ? icons : this.icons;
    let changeIconModal = this.mod.create(ListIconsPage, { icons: paramIcons });
    changeIconModal.onDidDismiss(icon => {
      // Save data to storage
      if (icon !== undefined) {
        category.icon = icon;
      } else {
        // TODO: check config for camera and gallery
        let confirm = this.alertCtrl.create({
          title: 'Select Category Image',
          message: 'What image do you want to use?',
          buttons: [
            {
              text: 'Camera',
              handler: () => {
                /*
                  Camera.getPicture({}).then(
                    imageData => {
                      this.log.logs[this.constructor.name].info(imageData);
                      category.icon = imageData;
                      // imageData is either a base64 encoded string or a file URI
                      // If it's base64:
                      // let base64Image = 'data:image/jpeg;base64,' + imageData;
                      // this.log.logs[this.constructor.name].info(base64Image);
                      // Save data to storage
                    },
                    err => {
                      this.log.logs[this.constructor.name].error('cameraError:' + err);
                    }
						);
						*/
              }
            },
            {
              text: 'Gallery',
              handler: () => {
                /*
                  ImagePicker.getPictures({}).then(
                    results => {
                      this.log.logs[this.constructor.name].info(results[0]);
                      category.icon = results[0];

                      for (var i = 0; i < results.length; i++) {
                        this.log.logs[this.constructor.name].info('Image URI: ' + results[i]);
                        // Save data to storage
                      }
                    },
                    err => {
                      this.log.logs[this.constructor.name].error('galleryError:' + err);
                    }
						);
						*/
              }
            }
          ]
        });
        confirm.present();
      }
    });
    changeIconModal.present();
  }
}
