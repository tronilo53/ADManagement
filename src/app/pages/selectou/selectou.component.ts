import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-selectou',
  templateUrl: './selectou.component.html',
  styleUrl: './selectou.component.css'
})
export class SelectouComponent implements OnInit {

  @ViewChild('loading') loading: ElementRef;

  public ous: any[] = [];
  public options: any;

  constructor(
    private renderer: Renderer2,
    private ipcService: IpcService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.renderer.removeClass(this.loading.nativeElement, 'none');
    this.options = {
      allowDrag: true,
      allowDrop: true
    }
    this.ipcService.send('getOus');
    this.ipcService.removeAllListeners('getOus');
    this.ipcService.on('getOus', (event, args) => {
      this.ngZone.run(() => {
        this.ous = [...JSON.parse(args)];
        console.log(this.ous);
        this.renderer.addClass(this.loading.nativeElement, 'none');
      });
    });
  }
}
