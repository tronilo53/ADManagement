import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { IpcService } from '../../../services/ipc.service';

export interface User { 
  Company: string | null; 
  Department: string | null; 
  DisplayName: string | null; 
  DistinguishedName: string | null; 
  Enabled: boolean | null; 
  LockedOut: boolean | null; 
  Office: string | null; 
  SamAccountName: string | null; 
  Title: string | null;
  UserPrincipalName: string | null; 
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  /**
   * *Propiedades
   */
  public content: string = '';
  public users: User[] = [];
  public filter: User[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public storageService: StorageService,
    private ipcService: IpcService
  ) { }

  ngOnInit(): void {
    //Se obtienen los parámetros
    this.activatedRoute.params.subscribe((params: Params) => {
      //Se guarda el parametro
      this.content = params['content'];
      //Se guardan todos los usuarios en json
      this.users = JSON.parse(sessionStorage.getItem('users'));
      //Filtra a los usuarios por el contenido de busqueda
      this.filter = this.users.filter((item) => {
        const searchText: string = this.content.toLowerCase();
        return Object.keys(item).some(key => item[key] && item[key].toString().toLowerCase().includes(searchText) );
      });
      //Recorre los usuarios filtrados
      for(let i = 0; i < this.filter.length; i++) {
        //Si faltan datos se elimina el usuario del array
        if(
          this.filter[i].Company == null && 
          this.filter[i].Department == null && 
          this.filter[i].DisplayName == null &&
          this.filter[i].Office == null &&
          this.filter[i].Title == null &&
          this.filter[i].UserPrincipalName == null
        ) this.filter.splice(i, 1);
      }
    });
  }
}
