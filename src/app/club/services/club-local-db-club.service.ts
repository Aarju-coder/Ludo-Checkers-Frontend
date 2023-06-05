import { Injectable } from '@angular/core';
import { GlobalDetailsClub } from '../clubGlobalVars';

@Injectable({
  providedIn: 'root'
})
export class LocalDbClubService {

  constructor(private global: GlobalDetailsClub) { }
  public getAccessClubSessionData() {
    let arr = Array();
    var a: any = localStorage.getItem("accessClubSessionDb");
    let localStorageItem = JSON.parse(a);
    return localStorageItem == null ? arr : localStorageItem.id;
  }
  session_id ={};
  public setAccessClubSessionData() {
    this.session_id = this.getAccessClubSessionData();
    console.log(this.session_id,"this.session_id");
     
      //console.log(this.session_id,"this.session_id");
      this.session_id = {'authToken': this.global.authToken, 
      'userId': this.global.userId,
      'acessEmail': this.global.email,
      'role':this.global.role,
      'username':this.global.userName,
      'avatar':this.global.avatar,
      'coins' : this.global.coins,
      'moneyAmt': this.global.moneyAmt,
      'moneyVal': this.global.moneyVal
    };
    
      //this.session_id.push(this.model.userDataArr[this.model.userDataArr.length-1]);
    
    console.log(this.session_id,"this.session_idcccccccc");
    localStorage.setItem('accessClubSessionDb',JSON.stringify({id: this.session_id}));
  }
}
