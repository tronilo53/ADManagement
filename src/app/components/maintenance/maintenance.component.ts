import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent {

  constructor(public storageService: StorageService) {}
}
