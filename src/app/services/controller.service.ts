import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(private router: Router) { }

  /**
   * *Function: Crea una alerta
   * @param icon Tipo de alerta ('error' | 'info' | 'success' | 'warning')
   * @param text Mensaje de la Alerta
   */
  public createAlert(icon: any, text: string): void { Swal.fire({ icon, text, allowOutsideClick: false }) }

  /**
   * *Function: Crea Un toast
   * @param position Posicion del Toast
   * @param icon Icono del Toast 
   * @param title Titulo del Toast
   */
  public createToast(position: any, icon: any, title: string): void { Swal.fire({ position, icon, title, showConfirmButton: false, timer: 1500 }) }

  /**
   * *Function: Crea un Mixin(Toast)
   * @param position Posicion del Mixin
   * @param icon Icono del Mixin
   * @param title Titulo del Mixin
   */
  public createMixin(position: any, icon: any, title: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({ icon, title });
  }

  /**
   * *Function: Crea un Loading
   */
  public createLoading(text: string = 'espere'): void {
    Swal.fire({text, allowOutsideClick: false});
    Swal.showLoading();
  }

  /**
   * *Function: Destruye el loading
   */
  public destroyLoading(): void { Swal.close() }

  /**
   * *Function: Alerta con redirección para Página de Init
   */
  public defaultDataError(): void {
    let timerInterval: any;
    Swal.fire({
      icon: 'info',
      title: "Configuración no guardada",
      html: "Error al guardar la configuración. Se guardá una por defecto.<br><strong>Redireccionando a la App en <b></b> segundos</strong>",
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          const secondsLeft = Math.ceil(Swal.getTimerLeft() / 1000);
          timer.textContent = `${secondsLeft}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        //Redirige al Dashboard
        this.router.navigate(['/Dashboard']);
      }
    });
  }
}
