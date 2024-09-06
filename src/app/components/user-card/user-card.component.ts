import { Component, Input } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { UserCard } from '../../pages/shared/user/user.component';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {

  /**
   * *Propiedades
   */
  @Input() user: UserCard;

  constructor(public storageService: StorageService) {}
}
