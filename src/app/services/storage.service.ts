import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Config {
  avatar: string;
  theme: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * *Propiedades
   */
  private configBehavior: BehaviorSubject<string>;
  private avatars: string[] = ['Batman-256.png', 'Capitan-America-256.png', 'Daredevil-256.png', 'Green-Lantern-256.png', 'Invisible-Woman-256.png', 'Mister-Fantastic-256.png', 'Namor-256.png', 'Silver-Surfer-256.png', 'Superman-256.png', 'the-Thing-256.png'];
  private themes: string[] = ['Sweet Honey', 'Healthy Sky', 'Tasty Licorice', 'Gray Storm'];

  constructor() {
    //Se instancia el BehaviorSubject con los datos del localStorage
    this.configBehavior = new BehaviorSubject<string>(localStorage.getItem('config'));
  }

  /**
   * *Function: Se establece el avatar
   * @param typeData Tipo de dato a modificar
   * @param data Dato modificable
   */
  public setConfig(typeData: string, data: string): void {
    //Se obtiene el valor del BehaviorSubject y se transforma a JSON con tipo Config
    const currentConfig: Config = JSON.parse(this.configBehavior.getValue());
    //Se crea una configuracion vacia
    let newConfig: Config = {theme: '', avatar: ''};
    //Se crea un nuevo objeto de tipo Config solo modificando el avatar o el tema
    if(typeData === 'avatar') newConfig = {...currentConfig, avatar: data};
    else newConfig = {...currentConfig, theme: data};
    //Se guardan los nuevos datos en el localStorage
    localStorage.setItem('config', JSON.stringify(newConfig));
    //Se modifica el BehaviorSubject con los nuevos datos
    this.configBehavior.next(JSON.stringify(newConfig));
  } 

  /**
   * *Funtion: Obtiene los datos recientes del BehaviorSubject
   * @returns Devuelve un objeto de tipo Config
   */
  public getConfig(): Config { return JSON.parse(this.configBehavior.getValue()) }

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
  public getTheme(type: string): string {
    //Se crea una variable vacia de tipo String
    let addClass: string = '';
    //Se obtienen los datos actuales del BehaviorSubject en tipo Config
    const currentConfig: Config = JSON.parse(this.configBehavior.getValue());
    //Si el elemento recibido es un Botón Se aplica la clase correspondiente dependiendo del tema aplicado
    if(type === 'button') {
      switch(currentConfig.theme) {
        case 'Sweet Honey': addClass = 'btn btn-warning'; break;
        case 'Healthy Sky': addClass = 'btn btn-primary'; break;
        case 'Tasty Licorice': addClass = 'btn btn-danger'; break;
        case 'Gray Storm': addClass = 'btn btn-secondary'; break;
      }
    //Si el elemento recibido es un Nav Se aplica la clase correspondiente dependiendo del tema aplicado
    }else if(type === 'nav') {
      switch(currentConfig.theme) {
        case 'Sweet Honey': addClass = 'bg-warning'; break;
        case 'Healthy Sky': addClass = 'bg-primary'; break;
        case 'Tasty Licorice': addClass = 'bg-danger'; break;
        case 'Gray Storm': addClass = 'bg-secondary'; break;
      }
    }
    //Devuelve la/s clases css
    return addClass;
  }
}
