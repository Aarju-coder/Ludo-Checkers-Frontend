import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popupsuccess',
  templateUrl: './popupsuccess.component.html',
  styleUrls: ['./popupsuccess.component.css']
})
export class PopupsuccessComponent implements OnInit {

  isVisible=false;
  constructor() { }

  ngOnInit(): void {
  }
  close(){
    this.isVisible=false;
  }

}
