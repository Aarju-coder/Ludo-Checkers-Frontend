import { Component, OnInit , AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-loadingpage',
  templateUrl: './loadingpage.component.html',
  styleUrls: ['./loadingpage.component.css']
})
export class LoadingpageComponent implements OnInit {
  width: number = 10;
  widthCount : any = JSON.stringify(this.width);
  constructor(private router: Router, public langModel: LanguageModel,public global: GlobalDetails) {
    
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
      if(self.global.onMobile == true)self.router.navigateByUrl('landingPage');
      else self.router.navigateByUrl('clubLandingPage');
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
