import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigGuard implements CanActivateChild {

  constructor(private storageService: StorageService) { }

  canActivateChild(): Promise<boolean> {
    return new Promise((resolve) => { resolve(this.storageService.checkConfigAndOus()) });
  }
}
