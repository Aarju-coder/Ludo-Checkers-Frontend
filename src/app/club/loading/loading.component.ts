import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  width: number = 10;
  widthCount : any = JSON.stringify(this.width);
  constructor(private router: Router) {
    
   }
  
  ngOnInit(): void {
  }
  ngAfterViewInit(): void{
    //var objDiv = document.getElementById("scoreList");
    var elem: any;
    var self = this;
    elem = document.getElementById("scoreList");   
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      self.router.navigateByUrl('clubLandingPage');
      clearInterval(id);
    } else {
      width++; 
      self.width = width;
      elem.style.width = width + '%'; 
      // elem.innerHTML = width * 1  + '%';
    }
  }
    // var objScrollHeight = objDiv.scrollHeight;
  //   if(objDiv!=null) {
  //     console.log( objScrollHeight, objDiv.scrollHeight,"objDiv.scrollWidth");
  
  //     objDiv.scrollTo(0, objScrollHeight);
    
  // }
    
  }

}
