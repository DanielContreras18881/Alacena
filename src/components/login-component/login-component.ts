import { AuthService } from '../../providers/auth/auth.service';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

/**
 * Generated class for the LoginComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: "login-component",
  templateUrl: "login-component.html"
})
export class LoginComponent {
  constructor(
	  private navCtrl: NavController,
	  private viewCtrl: ViewController,
	  private authService: AuthService
	) {}

  goBack() {
    this.navCtrl.pop();
  }

  emailLogin() {
	  this.authService.emailLogin().then(data => {
      this.viewCtrl.dismiss(data);
    });
  }

  facebookLogin() {
	  this.authService.facebookLogin().then(data => {
      this.viewCtrl.dismiss(data);
    });
  }

  googleLogin() {
	  this.authService.googleAuth().then(data=>{
		  console.log(data)
		  this.viewCtrl.dismiss(data);
	  }
	  );
  }

  twitterLogin() {
	  this.authService.twitterLogin().then(data => {
      this.viewCtrl.dismiss(data);
    });
  }
}
