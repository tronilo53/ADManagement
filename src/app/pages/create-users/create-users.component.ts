import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';

import Swal from 'sweetalert2';
import { IpcService } from '../../services/ipc.service';

/**
 * *Declaración Global para manejar Bootstrap
 */
declare var bootstrap: any;

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrl: './create-users.component.css'
})
export class CreateUsersComponent implements OnInit, AfterViewInit {
  /**
   * * Expresiones regulares
   */
  private regExEmail: RegExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  private regExPassword: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>-])[A-Za-z\d!@#$%^&*(),.?":{}|<>-]{8,}$/;

  /**
   * *Propiedades
   */
  @ViewChild('loading') loading: ElementRef;
  @ViewChild('loadingOus') loadingOus: ElementRef;
  @ViewChild('modalOu') modalOu!: ElementRef;
  @ViewChild('nombre') nombre: ElementRef;
  @ViewChild('apellidos') apellidos: ElementRef;
  @ViewChild('oficina') oficina: ElementRef;
  @ViewChild('puestoTrabajo') puestoTrabajo: ElementRef;
  @ViewChild('departamento') departamento: ElementRef;
  @ViewChild('organizacion') organizacion: ElementRef;
  @ViewChild('manager') manager: ElementRef;
  @ViewChild('copia') copia: ElementRef;
  @ViewChild('upn') upn: ElementRef;
  @ViewChild('password') password: ElementRef;
  public data: any = {
    nombre: '',
    apellidos: '',
    oficina: '',
    puestoTrabajo: '',
    departamento: '',
    organizacion: '',
    manager: '',
    copia: '',
    upn: '???',
    password: '',
    ou: ''
  }
  public ous: TreeNode[] = [];
  public selectedOu: TreeNode | null = null;
  public selectedOuViewInit: TreeNode | null = null;
  public modalInstance: any;

  /**
   * *CONSTRUCTOR DE LA CLASE
   * @param renderer Manejo del DOM
   * @param ipcService Servicio para el proceso principal
   * @param cd Detector de cambios
   */
  constructor(
    private renderer: Renderer2,
    private ipcService: IpcService,
    private cd: ChangeDetectorRef
  ) {}

  /**
   * *Ciclo de Vida
   * ? Despues de que la vista se haya inicializado por completo
   */
  ngAfterViewInit(): void {
    //Si el modal está disponible se crea una instancia del modal
    if(this.modalOu) this.modalInstance = new bootstrap.Modal(this.modalOu.nativeElement);
    //Si el modal noi está disponible hace Debug en consola
    else console.log('El modal OU No está Inicializado');
  }

  /**
   * *Ciclo de vida
   * ? Una vez que haya inicializado todas las propiedades ligadas a datos del componente
   */
  ngOnInit(): void {}

  /**
   * *Function: ELimina el borde rojo de los campos
   * @param field Campo requerido
   */
  public deleteBorder(field: string): void {
    //Depende del campo pasado a la funcion elimnina el referente.
    if(field === 'nombre') this.renderer.removeClass(this.nombre.nativeElement, 'border__error');
    if(field === 'apellidos') this.renderer.removeClass(this.apellidos.nativeElement, 'border__error');
    if(field === 'oficina') this.renderer.removeClass(this.oficina.nativeElement, 'border__error');
    if(field === 'puestoTrabajo') this.renderer.removeClass(this.puestoTrabajo.nativeElement, 'border__error');
    if(field === 'departamento') this.renderer.removeClass(this.departamento.nativeElement, 'border__error');
    if(field === 'organizacion') this.renderer.removeClass(this.organizacion.nativeElement, 'border__error');
    if(field === 'manager') this.renderer.removeClass(this.manager.nativeElement, 'border__error');
    if(field === 'copia') this.renderer.removeClass(this.copia.nativeElement, 'border__error');
    if(field === 'upn') this.renderer.removeClass(this.upn.nativeElement, 'border__error');
    if(field === 'password') this.renderer.removeClass(this.password.nativeElement, 'border__error');
  }

  /**
   * *Function: Valida todos los campos del formulario
   */
  public validateData(): void {
    //Si alguno de los campos está vacio...
    if(this.data.nombre === '' || 
      this.data.apellidos === '' ||
      this.data.oficina === '' ||
      this.data.puestoTrabajo === '' ||
      this.data.departamento === '' ||
      this.data.organizacion === '' ||
      this.data.manager === '' ||
      this.data.copia === '' ||
      this.data.upn === '???' ||
      this.data.password === ''
    ) {
      //Se pone el borde rojo a los campos vacios
      if(this.data.nombre === '') this.renderer.addClass(this.nombre.nativeElement, 'border__error');
      if(this.data.apellidos === '') this.renderer.addClass(this.apellidos.nativeElement, 'border__error');
      if(this.data.oficina === '') this.renderer.addClass(this.oficina.nativeElement, 'border__error');
      if(this.data.puestoTrabajo === '') this.renderer.addClass(this.puestoTrabajo.nativeElement, 'border__error');
      if(this.data.departamento === '') this.renderer.addClass(this.departamento.nativeElement, 'border__error');
      if(this.data.organizacion === '') this.renderer.addClass(this.organizacion.nativeElement, 'border__error');
      if(this.data.manager === '') this.renderer.addClass(this.manager.nativeElement, 'border__error');
      if(this.data.copia === '') this.renderer.addClass(this.copia.nativeElement, 'border__error');
      if(this.data.upn === '???') this.renderer.addClass(this.upn.nativeElement, 'border__error');
      if(this.data.password === '') this.renderer.addClass(this.password.nativeElement, 'border__error');
      //Se muestra una alerta
      this.alert('Todos los campos son requeridos');
    //Si todos los campos están rellenos...
    }else {
      //Si el manager no es un formato válido...
      if(!this.regExEmail.test(this.data.manager)) {
        this.alert('El email introducido en "Manager" no es válido');
        this.renderer.addClass(this.manager.nativeElement, 'border__error');
      //Si CopiaDe no es un formato válido...
      }else if(!this.regExEmail.test(this.data.copia)) {
        this.alert('El email introducido en "Copia De" no es válido');
        this.renderer.addClass(this.copia.nativeElement, 'border__error');
      //Si la contraseña no es un formato válido...
      }else if(!this.regExPassword.test(this.data.password)) {
        this.alert('La contraseña no cumple con los requisitos comunes de Active Directory');
        this.renderer.addClass(this.password.nativeElement, 'border__error');
      //Si todo el formulario está ok...
      }else {
        //Si no se ha elegido una unidad organizativa...
        if(!this.selectedOu) this.alert('La Unidad Organizativa de destino es requerida');
        //Si se ha elegido una unidad Organizativa Se empiezan a tratar los datos.
        else this.processData();
      }
    }
  }

  /**
   * *Function: Cuando se selecciona una OU
   * @param event Evento del nodo seleccionado
   */
  public nodeSelect(event: any): void {
    //console.log('Nodo Seleccionado: ', event.node);
    //Se guarda el nodo seleccionado en la variable 'selectedOu'
    this.selectedOu = event.node;
  }

  /**
   * *Function: Cuando se deselecciona una OU
   * @param event Evento del nodo deseleccionado
   */
  public nodeUnselect(event: any): void {
    //console.log('Nodo Deseleccionado: ', event.node);
    //Si al deseleccionar ya habia un nodo seleccionado...
    if(this.selectedOuViewInit) {
      //El nodo actual será el que estaba seleccionado
      this.selectedOu = this.selectedOuViewInit;
      //Se detectan los cambios en la vista
      this.cd.detectChanges();
    }
    //Si al deseleccionar no habia un nodo seleccionado el nodo actual será nulo
    else this.selectedOu = null;
  }

  /**
   * *Function: Se abre la ventana modal
   */
  public openOus(): void {
    //Si alguno de los campos está vacio no deja abrir el modal y salta una alerta
    if(this.data.nombre === '' || 
      this.data.apellidos === '' ||
      this.data.oficina === '' ||
      this.data.puestoTrabajo === '' ||
      this.data.departamento === '' ||
      this.data.organizacion === '' ||
      this.data.manager === '' ||
      this.data.copia === '' ||
      this.data.upn === '???' ||
      this.data.password === ''
    ) this.alert('Antes de Seleccionar una Unidad Organizativa, tienes que rellenar los demás campos');
    //Si todos los campos están rellenos...
    else {
      //Se muestra el loading de OU
      this.renderer.removeClass(this.loadingOus.nativeElement, 'none');
      //ipc para obtener las Unidades Organizativas
      this.ipcService.send('getOus');
      this.ipcService.removeAllListeners('getOus');
      this.ipcService.on('getOus', (event, data) => {
        //Guarda las unidades Organizativas en la variable 'ous'
        this.ous = [...JSON.parse(data)];
        //Corrige defectos del JSON recibido
        this.modifyTreeNodes(this.ous);
        //Se oculta el loading de OU
        this.renderer.addClass(this.loadingOus.nativeElement, 'none');
        //Se muestra el modal.
        this.modalInstance.show();
        //Se detectan los cambios en la vista.
        this.cd.detectChanges();
      });
    }
  }

  /**
   * *Function: Al cerrar el modal
   */
  public closeModal(): void {
    //Si no habia un nodo seleccionado, el nodo actual será nulo
    if(!this.selectedOuViewInit) this.selectedOu = null;
    //Si ya habia un nodo seleccionado, el nodo actual será el nodo que habia seleccionado
    else this.selectedOu = this.selectedOuViewInit;
    //Se colapsan todas las OU's
    this.collapseNodes(this.ous);
    //Se cierra el modal
    this.modalInstance.hide();
  }

  /**
   * *Function: Boton del modal para confirmar la selección de la OU
   */
  public selectOu(): void {
    //Si no hay un nodo actual seleccionado se muestra una alerta
    if(this.selectedOu == null) this.alert('No se ha seleccionado ninguna OU');
    //Si hay un nodo actual seleccionado...
    else {
      //el nodo ya seleccionado(vista) será igual que el nodo actual seleccionado
      this.selectedOuViewInit = this.selectedOu;
      //Si el modal está disponible
      if(this.modalInstance) {
        //se cierra el modal
        this.modalInstance.hide();
        //Se colapsan todas las OU's
        this.collapseNodes(this.ous);
      }
      //Si el modal no está disponible se hace debug en consola
      else console.log('modalInstance no está inicializado');
    }
  }

  /**
   * *Function: Muestra una alerta
   * @param text Mensaje de la alerta
   */
  private alert(text: string): void {
    Swal.fire({
      icon: 'info',
      text,
      allowOutsideClick: false
    });
  }

  /**
   * *Function: Correción de JSON, Unidades organizativas
   * @param nodes Nodos a Corregir
   */
  private modifyTreeNodes(nodes: TreeNode[] | any[]): void {
    //Recorre el primer nivel de nodos
    for(let i = 0; i < nodes.length; i++) {
      //si el nodo 'children' es igual a "[]" se le cambia el valor por un array vacio
      if(nodes[i].children === "[]") nodes[i].children = [];
      /**
       * Si existe el nodo 'children' y ademas contiene subnodos llama de forma recursiva a la misma función
       * Para hacer lo mismo a los elementos del 'children'
       */
      if(nodes[i].children && nodes[i].children.length > 0) this.modifyTreeNodes(nodes[i].children);
    }
  }

  /**
   * *Function: Colapsa las OU's del arbol
   * @param nodes Nodos a colapsar
   */
  private collapseNodes(nodes: TreeNode[]): void {
    //Si existen nodos...
    if(nodes) {
      //Recorre el primer nivel de nodos
      for(let node of nodes) {
        //Colapsa los nodos
        node.expanded = false;
        //Si existe el nodo 'children' y ademas contiene subnodos...
        if(node.children && node.children.length) {
          //llama de forma recursiva a la misma función Para hacer lo mismo a los elementos del 'children'
          this.collapseNodes(node.children);
        }
      }
    }
  }

  /**
   * *Function: Trata los datos del formulario
   */
  private processData(): void {
    //Muestra el Loading
    this.renderer.removeClass(this.loading.nativeElement, 'none');
    //Guarda la OU elegida
    this.data.ou = this.selectedOu.data
    //Crea el objeto temporal con algunos datos
    let dataSend: any = {
      Name: `${this.data.apellidos}, ${this.data.nombre}`,
      DisplayName: `${this.data.apellidos}, ${this.data.nombre}`,
      GivenName: this.data.nombre,
      Surname: this.data.apellidos,
      Department: this.data.departamento,
      Title: this.data.puestoTrabajo,
      UserPrincipalName: `${this.data.nombre}.${this.data.apellidos}@${this.data.upn}`,
      SamAccountName: `${this.data.nombre}.${this.data.apellidos}`,
      Company: this.data.organizacion,
      Office: this.data.oficina,
      Path: this.data.ou,
      EmailAddress: `${this.data.nombre}.${this.data.apellidos}@${this.data.upn}`,
      Description: this.data.puestoTrabajo,
      AccountPassword: this.data.password
    };
    //ipc para obtener la OU del 'manager'
    this.ipcService.send('Get-ADUser', this.data.manager);
    this.ipcService.removeAllListeners('Get-ADUser');
    this.ipcService.on('Get-ADUser', (event, data) => {
      //Si la respuesta del 'manager' es satisfactoria...
      if(data.response === 'Success') {
        //Si se encuentra el manager...
        if(data.data.indexOf('DistinguishedName') > -1) {
          //Se modifica el objeto temporal añadiendo la OU del 'manager'
          dataSend = {...dataSend, Manager: JSON.parse(data.data).DistinguishedName};
          //ipc para obtener la OU de 'CopiaDe'
          this.ipcService.send('Get-ADUser', this.data.copia);
          this.ipcService.removeAllListeners('Get-ADUser');
          this.ipcService.on('Get-ADUser', (event, args) => {
            //Si la respuesta de 'CopiaDe' es satisfactoria...
            if(args.response === 'Success') {
              //Si se encuentra 'CopiaDe'...
              if(args.data.indexOf('DistinguishedName') > -1) {
                //Se modifica el objeto temporal añadiendo la OU de 'CopiaDe'
                dataSend = {...dataSend, CopiaDe: JSON.parse(args.data).DistinguishedName};

                console.log(dataSend);
                //Se resetean todos los campos
                this.data = {...this.data,nombre: '',apellidos: '',oficina: '',puestoTrabajo: '',departamento: '',organizacion: '',manager: '',copia: '',upn: '???',password: '',ou: ''};
                //Se resetea la selección actual de la OU
                this.selectedOu = null;
                //Se resetea la Seleccion(Vista) de la OU
                this.selectedOuViewInit = null;
                //Se detectan los cambios
                this.cd.detectChanges();
                //Se oculta el Loading
                this.renderer.addClass(this.loading.nativeElement, 'none');
              }else {
                this.renderer.addClass(this.loading.nativeElement, 'none');
                this.alert('Parece que el usuario que intentas copiar no existe en Active Directory');
                this.renderer.addClass(this.copia.nativeElement, 'border__error');
              }
            //Si la respuesta de 'CopiaDe' da error...
            }else {
              //Se ocuelta el Loading
              this.renderer.addClass(this.loading.nativeElement, 'none');
              //Se muestra una alerta
              this.alert('Ha habido un error al tratar de buscar al Copia De referenciado/a. Por favor, inténtalo de nuevo o contacta con Soporte');
              //Se pone el campo 'copia' en rojo
              this.renderer.addClass(this.copia.nativeElement, 'border__error');
            }
          });
        //Si el 'manager' no es encontrado...
        }else {
          //Se oculta el Loading
          this.renderer.addClass(this.loading.nativeElement, 'none');
          //Se muestra una alerta
          this.alert('Parece que el manager referenciado no existe en Active Directory');
          //Se pone el campo 'manager' en rojo
          this.renderer.addClass(this.manager.nativeElement, 'border__error');
        }
      //Si la respuesta del 'manager' da error...
      }else {
        //Se oculta el loading
        this.renderer.addClass(this.loading.nativeElement, 'none');
        //Se muestra una alerta
        this.alert('Ha habido un error al tratar de buscar al manager referenciado. Por favor, inténtalo de nuevo o contacta con Soporte');
        //Se pone el campo 'manager' en rojo
        this.renderer.addClass(this.manager.nativeElement, 'border__error');
      }
    });
  }
}
