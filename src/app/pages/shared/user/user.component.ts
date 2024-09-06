import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface UserCard { 
  Company: string | null; 
  Department: string | null; 
  DisplayName: string | null; 
  DistinguishedName: string; 
  Enabled: string; 
  LockedOut: string; 
  Office: string | null; 
  SamAccountName: string | null; 
  Title: string | null;
  UserPrincipalName: string | null;
  type: string; 
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  /**
   * *Propiedades
   */
  public user: UserCard;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    //Se obtienen los parámetros
    this.activatedRoute.queryParams.subscribe((params: UserCard) => {
      //Se guarda el usuario
      this.user = params
      if(this.user.DistinguishedName.indexOf('Local Admins') > -1 || this.user.DistinguishedName.indexOf('ADM Accounts') > -1) this.user = { ...this.user, type: 'adm' };
      else if(this.user.DistinguishedName.indexOf('Shared Mailboxes') > -1 || this.user.DistinguishedName.indexOf('Generic Accounts') > -1) this.user = { ...this.user, type: 'shared mailbox' };
      else this.user = { ...this.user, type: 'user' };
    });
    console.log(this.user);
  }
}
