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

  constructor() {
    this.configBehavior = new BehaviorSubject<string>(localStorage.getItem('config'));
  }
  public setAvatar(avatar: string): void {
    const currentConfig: Config = JSON.parse(this.configBehavior.getValue());
    const newConfig: Config = {...currentConfig, avatar: avatar};
    localStorage.setItem('config', JSON.stringify(newConfig));
    this.configBehavior.next(JSON.stringify(newConfig));
  } 

  public getConfig(): Config {
    return JSON.parse(this.configBehavior.getValue());
  }
  public getAvatars(): string[] {
    return this.avatars;
  }

  public getTheme(type: string): string {
    let addClass: string = '';
    const currentConfig: Config = JSON.parse(this.configBehavior.getValue());
    if(type === 'button') {
      switch(currentConfig.theme) {
        case 'Sweet Honey': addClass = 'btn btn-warning'; break;
        case 'Healthy Sky': addClass = 'btn btn-primary'; break;
        case 'Tasty Licorice': addClass = 'btn btn-danger'; break;
        case 'Gray Storm': addClass = 'btn btn-secondary'; break;
      }
    }else if(type === 'nav') {
      switch(currentConfig.theme) {
        case 'Sweet Honey': addClass = 'bg-warning'; break;
        case 'Healthy Sky': addClass = 'bg-primary'; break;
        case 'Tasty Licorice': addClass = 'bg-danger'; break;
        case 'Gray Storm': addClass = 'bg-secondary'; break;
      }
    }
    return addClass;
  }
}
