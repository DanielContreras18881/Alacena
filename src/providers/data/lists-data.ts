import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {CloudStorage} from './cloudStorage';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ListsData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

// TODO: get data from firebase or local if not found

@Injectable()
export class ListsData {
  listsData: any = null;
  path = 'assets/json/Listas.json';

  constructor(private http: Http, private cloudStorage: CloudStorage, private storage: Storage) {}

  getListsData(userProfile:any): any {
    if (this.listsData) {
      // already loaded data
      return Promise.resolve(this.listsData);
    }
	 // don't have the data yet
    return new Promise(resolve => {
		 this.cloudStorage.loadListsData(userProfile.uid).then(data => {
			 if (data !== undefined && data !== null) {
				 this.listsData = data;
				 this.storage.set('lists', data);
				 resolve(this.listsData);
			 }else{
				 this.storage.get('lists').then((val) => {
					 if (val !== undefined && val !== null && val.length > 0) {
						 this.listsData = val;
						 resolve(this.listsData);
					 }else{
						 // We're using Angular Http provider to request the data,
						 // then on the response it'll map the JSON data to a parsed JS object.
						 // Next we process the data and resolve the promise with the new data.
						 this.http.get(this.path)
							 .map(res => res.json())
							 .subscribe(data => {
								 // we've got back the raw data, now generate the core schedule data
								 // and save the data for later reference
								 this.listsData = data;
								 this.storage.set('lists', data);
								 resolve(this.listsData);
							 });
					 }
				 });
			 }
		 });		 
    });
  }
}
