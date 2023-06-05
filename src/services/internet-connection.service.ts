import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternetConnectionService {
 // public closeEvents: Subject<String>;

  constructor() {
    // this.closeEvents = new Subject<String>();
     this.checkConnectivity();
   }

  checkConnectivity(){
    if (window.navigator.onLine) {
     // this.closeEvents.next("onLine");
      console.log("Back online");
      alert("you are back online.");
    }
    else{
     // this.closeEvents.next("offline");
      console.log("Back offline");
      alert("Check your connection.");
    }
  }
}
