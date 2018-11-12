import { Injectable } from "@angular/core";
import { AppRate } from "ionic-native";
import { Platform } from "ionic-angular";

@Injectable()
export class RateServiceProvider {
  appRate: any = AppRate;

  constructor(public platform: Platform) {
    this.platform.ready().then(
      () =>
        (this.appRate.preference = {
          storeAppURL: {
            ios: "1078098531",
            android: "market://details?id=developapps.chony.alacena"
          },
          promptAgainForEachNewVersion:true,
          usesUntilPrompt: 5,
          customLocale: {
            title: "Rate Us... Pretty Please?",
            message: "Without ratings we starve =(",
            cancelButtonLabel: "Pass",
            rateButtonLabel: "Rate it!",
            laterButtonLabel: "Ask Later"
          }
        })
    );
  }
}
