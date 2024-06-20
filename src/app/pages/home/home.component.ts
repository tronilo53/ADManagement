import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit , AfterViewInit{

  constructor(private ipcService: IpcService) {}

  ngAfterViewInit(): void {
    this.ipcService.send('getOus');
    this.ipcService.removeAllListeners('getOus');
    this.ipcService.on('getOus', (event, data) => {
      console.log(JSON.parse(data));
    });
  }
  ngOnInit(): void {
    
  }
}
