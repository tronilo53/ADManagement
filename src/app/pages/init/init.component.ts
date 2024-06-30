import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrl: './init.component.css'
})
export class InitComponent implements OnInit {

  public items: string[] = ['Batman-256.png', 'Capitan-America-256.png', 'Daredevil-256.png', 'Green-Lantern-256.png', 'Invisible-Woman-256.png', 'Mister-Fantastic-256.png', 'Namor-256.png', 'Silver-Surfer-256.png', 'Superman-256.png', 'the-Thing-256.png'];
  public avatarSelect: string | null = null;
  public themeSelected: string = 'Sweet Honey';

  constructor() {}

  ngOnInit(): void {
    
  }
  public selectAvatar(item: string): void {
    if(this.avatarSelect) {
      if(this.avatarSelect === item) this.avatarSelect = null;
      else this.avatarSelect = item;
    }else {
      this.avatarSelect = item;
    }
  }
  public finished(): void {
    
  }
  public getTypeNav(): string {
    if(this.themeSelected === 'Healthy Sky') return 'bg-primary';
    else if(this.themeSelected === 'Tasty Licorice') return 'bg-danger';
    else if(this.themeSelected === 'Gray Storm') return 'bg-secondary';
    else return 'bg-warning';
  }
}
