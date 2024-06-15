import { Component, OnInit } from '@angular/core';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private ipcService: IpcService) {}

  ngOnInit(): void {
    
  }

  public test(): void { 
    this.ipcService.send('test');
    this.ipcService.on('test', (event, args) => {
      console.log(args);
    });
  }
}
