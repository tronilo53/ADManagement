import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * *Propiedades
   */
  public configBehavior: BehaviorSubject<any>;
  private avatars: string[] = ['Batman-256.png', 'Capitan-America-256.png', 'Daredevil-256.png', 'Green-Lantern-256.png', 'Invisible-Woman-256.png', 'Mister-Fantastic-256.png', 'Namor-256.png', 'Silver-Surfer-256.png', 'Superman-256.png', 'the-Thing-256.png'];
  private themes: string[] = ['Sweet Honey', 'Healthy Sky', 'Tasty Licorice', 'Gray Storm'];

  constructor() {
    this.configBehavior = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('config')));
  }

  /**
   * *Function: Se establece la configuracion en el sessionStorage
   * @param data objeto pasado
   */
  public setConfig(data: any): void {
    //Se actualiza o se crea el sessionStotage
    sessionStorage.setItem('config', JSON.stringify(data));
    //Se modifica el BehaviorSubject con los nuevos datos
    this.configBehavior.next(data);
  }

  /**
   * *Funtion: Obtiene los datos recientes del BehaviorSubject
   * @returns Devuelve un objeto de tipo Config
   */
  public getConfig(): any {
    return this.configBehavior.getValue();
  }

  /**
   * !Función Valida para los cambios en el Navbar
   * *Function: Obtiene los datos recientes de BehaviorSubject
   * @returns Devuelve un Observable para subscribirse
   */
  public getConfigObservable(): Observable<any> {
    return this.configBehavior.asObservable();
  }

  /**
   * *Function: Obtiene los avatares
   * @returns Devuelve un array de tipo String
   */
  public getAvatars(): string[] { return this.avatars }

  /**
   * *Function: Obtiene los temas
   * @returns Devuelve un array de tipo String
   */
  public getThemes(): string[] { return this.themes }

  /**
   * *Function: Obtiene la/s clases css que se deben aplicar
   * @param type Tipo de elemento a aplicar la clase
   * @returns Devuelve la/s clases css en tipo String
   */
  public getThemeCss(type: string): string {
    //Se crea una variable vacia de tipo String
    let addClass: string = '';
    //Si el elemento recibido es un Botón Se aplica la clase correspondiente dependiendo del tema aplicado
    if(type === 'button') {
      switch(this.getConfig().theme) {
        case 'Sweet Honey': addClass = 'btn btn-warning'; break;
        case 'Healthy Sky': addClass = 'btn btn-primary'; break;
        case 'Tasty Licorice': addClass = 'btn btn-danger'; break;
        case 'Gray Storm': addClass = 'btn btn-secondary'; break;
      }
    //Si el elemento recibido es un Nav Se aplica la clase correspondiente dependiendo del tema aplicado
    }else if(type === 'nav') {
      switch(this.getConfig().theme) {
        case 'Sweet Honey': addClass = 'bg-warning'; break;
        case 'Healthy Sky': addClass = 'bg-primary'; break;
        case 'Tasty Licorice': addClass = 'bg-danger'; break;
        case 'Gray Storm': addClass = 'bg-secondary'; break;
      }
    }else if(type === 'alert') {
      switch(this.getConfig().theme) {
        case 'Sweet Honey': addClass = 'alert alert-warning'; break;
        case 'Healthy Sky': addClass = 'alert alert-primary'; break;
        case 'Tasty Licorice': addClass = 'alert alert-danger'; break;
        case 'Gray Storm': addClass = 'alert alert-secondary'; break;
      }
    }else if(type === 'badge') {
      switch(this.getConfig().theme) {
        case 'Sweet Honey': addClass = 'badge text-bg-warning'; break;
        case 'Healthy Sky': addClass = 'badge text-bg-primary'; break;
        case 'Tasty Licorice': addClass = 'badge text-bg-danger'; break;
        case 'Gray Storm': addClass = 'badge text-bg-secondary'; break;
      }
    }else if(type === 'text') {
      switch(this.getConfig().theme) {
        case 'Sweet Honey': addClass = 'text-warning'; break;
        case 'Healthy Sky': addClass = 'text-primary'; break;
        case 'Tasty Licorice': addClass = 'text-danger'; break;
        case 'Gray Storm': addClass = 'text-secondary'; break;
      }
    }else if(type === 'progress-bar') {
      switch(this.getConfig().theme) {
        case 'Sweet Honey': addClass = 'progress-bar bg-warning'; break;
        case 'Healthy Sky': addClass = 'progress-bar bg-primary'; break;
        case 'Tasty Licorice': addClass = 'progress-bar bg-danger'; break;
        case 'Gray Storm': addClass = 'progress-bar bg-secondary'; break;
      }
    }else if(type === 'swal') {
      switch(this.getConfig().theme) {
        case 'Sweet Honey': addClass = '#ffc107'; break;
        case 'Healthy Sky': addClass = '#0d6efd'; break;
        case 'Tasty Licorice': addClass = '#dc3545'; break;
        case 'Gray Storm': addClass = '#6c757d'; break;
      }
    }
    //Devuelve la/s clases css
    return addClass;
  }
}
