import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';

import { IpcService } from '../../services/ipc.service';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-selectou',
  templateUrl: './selectou.component.html',
  styleUrl: './selectou.component.css'
})
export class SelectouComponent implements OnInit, AfterViewInit {

  @ViewChild('loading') loading: ElementRef;

  public ous: TreeNode[] = [];
  public selectedFile: TreeNode | null = null;

  constructor(
    private renderer: Renderer2,
    private ipcService: IpcService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.renderer.removeClass(this.loading.nativeElement, 'none');
    this.ipcService.send('getOus');
    this.ipcService.removeAllListeners('getOus');
    this.ipcService.on('getOus', (event, args) => {
      this.ngZone.run(() => {
        this.ous = [...JSON.parse(args)];
        this.modifyTreeNodes(this.ous);
        console.log(this.ous);
        this.renderer.addClass(this.loading.nativeElement, 'none');
      });
    });
  }
  ngOnInit(): void { }

  public nodeSelect(event: any): void {
    console.log('Nodo Seleccionado: ', event.node);
    this.selectedFile = event.node;
  }
  public nodeUnselect(event: any): void {
    console.log('Nodo Deseleccionado: ', event.node);
    this.selectedFile = null;
  }

  private modifyTreeNodes(nodes: TreeNode[] | any[]): void {
    for(let i = 0; i < nodes.length; i++) {
      if(nodes[i].children === "[]") nodes[i].children = [];
      if(nodes[i].children && nodes[i].children.length > 0) this.modifyTreeNodes(nodes[i].children);
    }
  }
}
