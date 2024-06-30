import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrl: './init.component.css'
})
export class InitComponent implements OnInit {

  /**
   * *Propiedades
   */
  public items: string[] = ['Batman-256.png', 'Capitan-America-256.png', 'Daredevil-256.png', 'Green-Lantern-256.png', 'Invisible-Woman-256.png', 'Mister-Fantastic-256.png', 'Namor-256.png', 'Silver-Surfer-256.png', 'Superman-256.png', 'the-Thing-256.png'];
  public avatarSelect: string | null = null;
  public themeSelected: string = 'Sweet Honey';

  constructor() {}

  ngOnInit(): void {
    
  }

  /**
   * *Function: Selección de avatar
   * @param item Avatar elegido
   */
  public selectAvatar(item: string): void {
    //Si hay un avatar elegido...
    if(this.avatarSelect) {
      //Si el avatar elegido es igual al clickeado, el avatar elegido se resetea
      if(this.avatarSelect === item) this.avatarSelect = null;
      //Si el avatar elegido es distinto al clickeado, el avatar elegido será igual al clickeado.
      else this.avatarSelect = item;
    //Si no hay un avatar elegido, el avatar elegido será igual al clickeado.
    }else this.avatarSelect = item;
  }

  /**
   * *Function: Finalizar Init
   */
  public finished(): void {
    const data: any = {
      avatar: this.avatarSelect,
      theme: this.themeSelected
    };
    console.log(data);
  }

  /**
   * *Function: Elección del tema del nav
   * @returns Devuelve el tema del nav (String)
   */
  public getTypeNav(): string {
    if(this.themeSelected === 'Healthy Sky') return 'bg-primary';
    else if(this.themeSelected === 'Tasty Licorice') return 'bg-danger';
    else if(this.themeSelected === 'Gray Storm') return 'bg-secondary';
    else return 'bg-warning';
  }
}
