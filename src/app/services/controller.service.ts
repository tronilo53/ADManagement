import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  private loading: any;

  constructor() { }

  /**
   * *Function: Crea una alerta
   * @param icon Tipo de alerta ('error' | 'info' | 'success' | 'warning')
   * @param text Mensaje de la Alerta
   */
  public createAlert(icon: any, text: string): void {
    Swal.fire({ icon, text, allowOutsideClick: false });
  }

  public createToast(position: any, icon: any, title: string): void {
    Swal.fire({ position, icon, title, showConfirmButton: false, timer: 1500 });
  }
}
