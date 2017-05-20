import {Injectable} from '@angular/core';

import {ModalController, AlertController} from 'ionic-angular';

import {ListIconsPage} from '../../pages/categories/list-icons';

import {DefaultIcons} from '../../providers/default-icons/default-icons';
import {CategoriesData} from '../../providers/data/categories-data';

import { Camera } from 'ionic-native';
import { ImagePicker } from 'ionic-native';

@Injectable()

export class CategoriesService {

  private icons: any;

  constructor(
    public mod: ModalController,
    public alertCtrl: AlertController,
    private categories: CategoriesData,
    private iconsData: DefaultIcons) {
      this.iconsData.getIcons().then(data => {
        this.icons = data;
      });
  }

  changeCategory(currentCategory, item) {
    let change = this.alertCtrl.create();
    let currentCategoryName = currentCategory !== undefined ? currentCategory.categoryName : '';
    change.setTitle('Change category ' + currentCategoryName + ' by:');
    this.categories.getCategoriesData().then(data => {
      let listCategories = data;
      listCategories.forEach((category: any) => {
        if (currentCategoryName !== category.categoryName) {
          change.addInput({
            type: 'radio',
            label: category.categoryName,
            value: category,
            checked: false
          });
        }
      });

      change.addButton('Cancel');
      change.addButton({
        text: 'OK',
        handler: data => {
          item.category = data;
        }
      });
      change.present();
    });
  }

  changeCategoryIcon(category, icons) {
    let paramIcons = icons !== null ? icons : this.icons;
    let changeIconModal = this.mod.create(ListIconsPage, { icons : paramIcons });
    changeIconModal.onDidDismiss((icon) => {
      // Save data to storage
      if (icon !== undefined) {
        if (icon.src !== undefined && icon.src !== null) {
          category.icon = icon.src;
        } else {

// TODO: check config for camera and gallery
          let confirm = this.alertCtrl.create({
            title: 'Select Category Image',
            message: 'What image do you want to use?',
            buttons: [
              {
                text: 'Camera',
                handler: () => {
                  Camera.getPicture({}).then((imageData) => {
                    console.log(imageData);
                    category.icon = imageData;
                     // imageData is either a base64 encoded string or a file URI
                     // If it's base64:
                     // let base64Image = 'data:image/jpeg;base64,' + imageData;
                     // console.log(base64Image);
                     // Save data to storage
                  }, (err) => {
                   // Handle error
                  });
                }
              },
              {
                text: 'Gallery',
                handler: () => {
                  ImagePicker.getPictures({}).then((results) => {
                    console.log(results[0]);
                    category.icon = results[0];
                    /*
                    for (var i = 0; i < results.length; i++) {
                        console.log('Image URI: ' + results[i]);
                        // Save data to storage
                    }
                    */
                  }, (err) => { });
                }
              }
            ]
          });
          confirm.present();
        }
      }
    });
    changeIconModal.present();
  }
}
