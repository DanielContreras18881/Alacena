import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

// TODO: remove or redefine 

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Data {
  configData: any = null;
  elementData: any = null;
  listData: any = null;
  listsData: any = null;

  constructor(public http: Http) {}

  getConfigData(): any {
    let path = 'json/Configuracion.json';
    return this.http.get(path);
  }

  loadConfigData() {
    if (this.configData) {
      // already loaded configData
      return Promise.resolve(this.configData);
    }

    // don't have the configData yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the configData,
      // then on the response it'll map the JSON configData to a parsed JS object.
      // Next we process the configData and resolve the promise with the new configData.
      this.http.get('json/Configuracion.json')
        .map(res => res.json())
        .subscribe(configData => {
          // we've got back the raw configData, now generate the core schedule configData
          // and save the configData for later reference
          this.configData = configData;
          resolve(this.configData);
        });
    });
  }

  getItemsData(): any {
    let path = 'json/Elementos.json';
    return this.http.get(path);
  }

  getItemsWithListData(itemData): any {
    let amountPath = 'json/CantidadElementoLista.json';
    let amount: any = this.http.get(amountPath);
    console.log('AMOUNT:' + JSON.stringify(amount));
    return amount.filter(function (item) { return item.nombreElemento === itemData.nombreElemento; });
  }

  loadElementData() {
    if (this.elementData) {
      // already loaded elementData
      return Promise.resolve(this.elementData);
    }

    // don't have the elementData yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the elementData,
      // then on the response it'll map the JSON elementData to a parsed JS object.
      // Next we process the elementData and resolve the promise with the new elementData.
      this.http.get('json/Elementos.json')
        .map(res => res.json())
        .subscribe(elementData => {
          // we've got back the raw elementData, now generate the core schedule elementData
          // and save the elementData for later reference
          this.elementData = elementData;
          resolve(this.elementData);
        });
    });
  }

  getListData(): any {
    let path = 'json/CantidadElementoLista.json';
    return this.http.get(path);
  }

  loadListData() {
    if (this.listData) {
      // already loaded listData
      return Promise.resolve(this.listData);
    }

    // don't have the listData yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the listData,
      // then on the response it'll map the JSON listData to a parsed JS object.
      // Next we process the listData and resolve the promise with the new listData.
      this.http.get('json/CantidadElementoLista.json')
        .map(res => res.json())
        .subscribe(listData => {
          // we've got back the raw listData, now generate the core schedule listData
          // and save the listData for later reference
          this.listData = listData;
          resolve(this.listData);
        });
    });
  }

  getListsData(): any {
    let path = 'json/Listas.json';
    return this.http.get(path);
  }

  loadListsData() {
    if (this.listsData) {
      // already loaded listsData
      return Promise.resolve(this.listsData);
    }

    // don't have the listsData yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the listsData,
      // then on the response it'll map the JSON listsData to a parsed JS object.
      // Next we process the listsData and resolve the promise with the new listsData.
      this.http.get('json/Listas.json')
        .map(res => res.json())
        .subscribe(listsData => {
          // we've got back the raw listsData, now generate the core schedule listsData
          // and save the listsData for later reference
          this.listsData = listsData;
          resolve(this.listsData);
        });
    });
  }
}
