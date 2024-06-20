import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';

import Swal from 'sweetalert2';
import { IpcService } from '../../services/ipc.service';

declare var bootstrap: any;

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrl: './create-users.component.css'
})
export class CreateUsersComponent implements OnInit, AfterViewInit {

  private regExEmail: RegExp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  @ViewChild('loading') loading: ElementRef;
  @ViewChild('loadingOus') loadingOus: ElementRef;
  @ViewChild('modalOu') modalOu!: ElementRef;
  public modalInstance: any;

  @ViewChild('nombre') nombre: ElementRef;
  @ViewChild('apellidos') apellidos: ElementRef;
  @ViewChild('oficina') oficina: ElementRef;
  @ViewChild('puestoTrabajo') puestoTrabajo: ElementRef;
  @ViewChild('departamento') departamento: ElementRef;
  @ViewChild('organizacion') organizacion: ElementRef;
  @ViewChild('manager') manager: ElementRef;
  @ViewChild('copia') copia: ElementRef;

  public data: any = {
    nombre: '',
    apellidos: '',
    oficina: '',
    puestoTrabajo: '',
    departamento: '',
    organizacion: '',
    manager: '',
    copia: '',
    ou: ''
  }
  public ous: TreeNode[] = [];
  public selectedOu: TreeNode | null = null;
  public selectedOuViewInit: TreeNode | null = null;
  public selectedOuViewInitAnt: TreeNode | null = null;

  constructor(
    private renderer: Renderer2,
    private ipcService: IpcService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    if(this.modalOu) {
      this.modalInstance = new bootstrap.Modal(this.modalOu.nativeElement);
    }else console.log('El modal No está Inicializado');
  }
  ngOnInit(): void {}

  public deleteBorder(field: string): void {
    if(field === 'nombre') this.renderer.removeClass(this.nombre.nativeElement, 'border__error');
    if(field === 'apellidos') this.renderer.removeClass(this.apellidos.nativeElement, 'border__error');
    if(field === 'oficina') this.renderer.removeClass(this.oficina.nativeElement, 'border__error');
    if(field === 'puestoTrabajo') this.renderer.removeClass(this.puestoTrabajo.nativeElement, 'border__error');
    if(field === 'departamento') this.renderer.removeClass(this.departamento.nativeElement, 'border__error');
    if(field === 'organizacion') this.renderer.removeClass(this.organizacion.nativeElement, 'border__error');
    if(field === 'manager') this.renderer.removeClass(this.manager.nativeElement, 'border__error');
    if(field === 'copia') this.renderer.removeClass(this.copia.nativeElement, 'border__error');
  }
  public crearUsuario(): void {
    if(this.data.nombre === '' || 
      this.data.apellidos === '' ||
      this.data.oficina === '' ||
      this.data.puestoTrabajo === '' ||
      this.data.departamento === '' ||
      this.data.organizacion === '' ||
      this.data.manager === '' ||
      this.data.copia === ''
    ) {
      if(this.data.nombre === '') this.renderer.addClass(this.nombre.nativeElement, 'border__error');
      if(this.data.apellidos === '') this.renderer.addClass(this.apellidos.nativeElement, 'border__error');
      if(this.data.oficina === '') this.renderer.addClass(this.oficina.nativeElement, 'border__error');
      if(this.data.puestoTrabajo === '') this.renderer.addClass(this.puestoTrabajo.nativeElement, 'border__error');
      if(this.data.departamento === '') this.renderer.addClass(this.departamento.nativeElement, 'border__error');
      if(this.data.organizacion === '') this.renderer.addClass(this.organizacion.nativeElement, 'border__error');
      if(this.data.manager === '') this.renderer.addClass(this.manager.nativeElement, 'border__error');
      if(this.data.copia === '') this.renderer.addClass(this.copia.nativeElement, 'border__error');
      this.alert('Todos los campos son requeridos');
    }else {
      if(!this.regExEmail.test(this.data.manager)) {
        this.alert('El email introducido en "Manager" no es válido');
        this.renderer.addClass(this.manager.nativeElement, 'border__error');
      }else if(!this.regExEmail.test(this.data.copia)) {
        this.alert('El email introducido en "Copia De" no es válido');
        this.renderer.addClass(this.copia.nativeElement, 'border__error');
      }else {
        if(!this.selectedOu) this.alert('La Unidad Organizativa de destino es requerida');
        else {
          this.data.ou = this.selectedOu.data
          console.log(this.data);
          this.data = {...this.data,nombre: '',apellidos: '',oficina: '',puestoTrabajo: '',departamento: '',organizacion: '',manager: '',copia: '',ou: ''};
          this.selectedOu = null;
          this.selectedOuViewInit = null;
          this.selectedOuViewInitAnt = null;
        }
      }
    }
  }
  public nodeSelect(event: any): void {
    console.log('Nodo Seleccionado: ', event.node);
    this.selectedOu = event.node;
  }
  public nodeUnselect(event: any): void {
    console.log('Nodo Deseleccionado: ', event.node);
    if(this.selectedOuViewInit) {
      this.selectedOu = this.selectedOuViewInit;
    }
    else this.selectedOu = null;
  }
  public openOus(): void {
    if(this.data.nombre === '' || 
      this.data.apellidos === '' ||
      this.data.oficina === '' ||
      this.data.puestoTrabajo === '' ||
      this.data.departamento === '' ||
      this.data.organizacion === '' ||
      this.data.manager === '' ||
      this.data.copia === ''
    ) {
      this.alert('Antes de Seleccionar una Unidad Organizativa, tienes que rellenar los demás campos');
    }else {
      this.renderer.removeClass(this.loadingOus.nativeElement, 'none');
      this.ipcService.send('getOus');
      this.ipcService.removeAllListeners('getOus');
      this.ipcService.on('getOus', (event, data) => {
        this.ngZone.run(() => {
          this.ous = [...JSON.parse(data)];
          this.modifyTreeNodes(this.ous);
          console.log(this.ous);
          this.renderer.addClass(this.loadingOus.nativeElement, 'none');
          this.modalInstance.show();
        });
      });
    }
  }
  public closeModal(): void {
    if(!this.selectedOuViewInit) this.selectedOu = null;
    else this.selectedOu = this.selectedOuViewInit;
    this.collapseNodes(this.ous);
    this.modalInstance.hide();
  }
  public selectOu(): void {
    if(this.selectedOu == null) this.alert('No se ha seleccionado ninguna OU');
    else {
      this.selectedOuViewInit = this.selectedOu;
      this.selectedOuViewInitAnt = this.selectedOuViewInit;
      if(this.modalInstance) this.modalInstance.hide();
      else console.log('modalInstance no está inicializado');
    }
  }

  private alert(text: string): void {
    Swal.fire({
      icon: 'info',
      text,
      allowOutsideClick: false
    });
  }
  private modifyTreeNodes(nodes: TreeNode[] | any[]): void {
    for(let i = 0; i < nodes.length; i++) {
      if(nodes[i].children === "[]") nodes[i].children = [];
      if(nodes[i].children && nodes[i].children.length > 0) this.modifyTreeNodes(nodes[i].children);
    }
  }
  private collapseNodes(nodes: TreeNode[]): void {
    if(nodes) {
      for(let node of nodes) {
        node.expanded = false;
        if(node.children && node.children.length) {
          this.collapseNodes(node.children);
        }
      }
    }
  }
}
