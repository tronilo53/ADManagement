import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StorageService } from '../../../services/storage.service';

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
  public users: any[] = [];
  public filter: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public storageService: StorageService
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
      console.log(this.filter);
    });
  }
}
