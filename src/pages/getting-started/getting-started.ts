import { Component, NgZone } from "@angular/core";

import { GooglePlus } from "@ionic-native/google-plus";
//import * as Drive from "gapi.drive.realtime";
import firebase from "firebase";

import { NavController, Platform } from "ionic-angular";

import { ListPage } from "../list/list";

import { GlobalVars } from "../../providers/global-vars/global-vars";

declare var gapi: any;
declare var self: any;

@Component({
  templateUrl: "getting-started.html"
})
export class GettingStartedPage {
  private shoppingListPage = {
    title: "LISTA_COMPRA",
    component: ListPage,
    icon: "basket"
  };
  private userAccount: boolean = true;
  private expires: boolean = true;
  private reminders: boolean = true;

  userProfile: any = null;
  zone: NgZone;

  constructor(
    public plt: Platform,
    private googlePlus: GooglePlus,
    public navCtrl: NavController,
    private globalVars: GlobalVars
  ) {
    //var ref = new firebase.initializeApp("https://<YOUR-FIREBASE-APP>.firebaseio.com");
    //ref.onAuth(authDataCallback);

    this.zone = new NgZone({});
    self = this;
    firebase.auth().onAuthStateChanged(user => {
      this.zone.run(() => {
        if (user) {
          this.userProfile = user;
          self.globalVars.setUserProfile(user);
          //gapi.auth.setToken(this.userProfile.oauthAccessToken);
          //gapi.client.load('drive', 'v3', this.listFiles);
        } else {
          this.userProfile = null;
        }
      });

      globalVars.getListsData().then(data => {
        //console.log(data)
      });
      //globalVars.getListData().then(data => {});
    });
  }

  openInternalPage(page) {
    this.navCtrl.push(page.component, {
      list: page.title
    });
  }

  showItemsToShop() {
    // TODO: show alert with items to shop
    alert("Items a comprar");
  }

  showExpireItems() {
    // TODO: show alert with items to expire, expiry date and list
    alert("showExpireItems");
  }

  showReminders() {
    // TODO: show list of reminders,view, loaded from local
    alert("showReminders");
  }

  editReminder() {
    // TODO: view to edit a reminder
    alert("editReminder");
  }

  addRemoveUserAccount() {
    // TODO: login/logout from firebase
    //https://console.developers.google.com/apis/credentials?project=develop-apps-chony-alacena&authuser=1
    //https://console.firebase.google.com/u/1/project/alacena-58699/settings/general/
    var provider = new firebase.auth.GoogleAuthProvider();
    var res = null;
    if (this.plt.is("mobile")) {
      firebase.auth().signInWithPopup(provider).then(
        result => {
          console.log(result);
          this.userProfile = result.user;
          console.log(2);
          gapi.auth.setToken(this.userProfile.oauthAccessToken);
          gapi.client.load("drive", "v3", this.listFiles);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      firebase.auth().signInWithRedirect(provider).then(
        result => {
          console.log(result);
          this.userProfile = result.user;
          console.log(3);
          gapi.auth.setToken(this.userProfile.oauthAccessToken);
          gapi.client.load("drive", "v3", this.listFiles);
        },
        error => {
          console.log(error);
        }
      );
    }

    /*
      this.googlePlus.login({
        'webClientId': '1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then( success => {
            console.log("Firebase success: " + JSON.stringify(success));
          })
          .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => console.error("Error: ", err));
      */
  }

  listFiles() {
    /*	  
	  const storage = firebase.storage();
	  let fileName = 'prueba.json';
	  let fileRef = storage.ref('lists/' + fileName);
	  var uploadTask = fileRef.putString(`
	  [{
		  "categoryName": "fruta",
		  "icon": "assets/images/icons/102.png",
		  "measurement": "UNIDADES",
		  "unitStep": 1
	  }, {
		  "categoryName": "queso",
		  "icon": "assets/images/icons/104.png",
		  "measurement": "KG",
		  "unitStep": 0.5
	  }, {
		  "categoryName": "pollo",
		  "icon": "assets/images/icons/103.png",
		  "measurement": "UNIDADES",
		  "unitStep": 1
	  }, {
		  "categoryName": "verdura",
		  "icon": "assets/images/icons/79.png",
		  "measurement": "GRAMOS",
		  "unitStep": 100
	  }, {
			  "categoryName": "cerveza",
			  "icon": "assets/images/icons/101.png",
			  "measurement": "LITROS",
			  "unitStep": 0.5
		  }]  
	  `);

	  uploadTask.on('state_changed', (snapshot) => {
		  console.log('snapshot progess ' + snapshot);
	  }, (error) => {
		  console.log(error)
	  }, () => {
		  console.log(uploadTask.snapshot);
	  });	  
*/
    //gapi.auth.setToken(this.userProfile.oauthAccessToken);
    /*
    var request = gapi.client.request({
      //'path': 'https://content.googleapis.com/drive/v3/files?key=AIzaSyCYbNChWjDtLYXkm_ayPQeb4t4TjWDXWd0',
      'path': 'https://www.googleapis.com/drive/v2/files??key=AIzaSyCYbNChWjDtLYXkm_ayPQeb4t4TjWDXWd0',
    });
    console.log(request);
    request.execute(function(resp) {
      console.log(resp)
	 })
	 */
    /*
        gapi.client.people.people.get({
          'resourceName': 'people/me',
          'requestMask.includeField': 'person.names'
        }).then(function(response) {
          console.log('Hello, ' + response.result.names[0].givenName);
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        });
    */
    /*
var request = gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
          });

          request.execute(function(resp) {
        this.appendPre('Files:');
        var files = resp.files;
        if (files && files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            console.log(file.name + ' (' + file.id + ')');
          }
        } else {
          console.log('no')
        }
      });
*/
  }

  addItemsToShoppingList() {
    // TODO: add all items required to shop to the shopping list
    alert("addItemsToShoppinList");
  }
}
