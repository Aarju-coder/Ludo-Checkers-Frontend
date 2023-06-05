import { Injectable } from '@angular/core';
import { GlobalDetails } from 'src/app/globalVars';


@Injectable({
  providedIn: 'root'
})
export class LocalDbService {

  constructor(private global: GlobalDetails) { }
  public getGameSessionData() {
    let arr = Array();
    var a: any = localStorage.getItem("sessionDb");
    let localStorageItem = JSON.parse(a);
    return localStorageItem == null ? arr : localStorageItem.id;
  }
  session_id ={};
  public setGameSessionData() {
    this.session_id = this.getGameSessionData();
    console.log(this.session_id,"this.session_id");
     
      console.log(this.global.userName,"this.global.userNamethis.global.userName");
      this.session_id = {'authToken': this.global.authToken, 'userId': this.global.userId
    ,'userName':this.global.userName, 'avatar':this.global.avatar,
    'firstName' : this.global.firstName,
    'lastName': this.global.lastName,
    'dOb': this.global.dOb,
    'address': this.global.address,
    'gender' :this.global.gender,
    'accNum':this.global.accNum,
    'bankName':this.global.bankName,
    'expPhoneNumber':this.global.expPhoneNumber,
    'coins' : this.global.coins,
    'moneyAmt': this.global.moneyAmt,
    'moneyVal': this.global.moneyVal,
    'gameName': this.global.gameName,
    'myEmail':this.global.myEmail,
    'myphone': this.global.myphone};
      //this.session_id.push(this.model.userDataArr[this.model.userDataArr.length-1]);
    
    console.log(this.session_id,"this.session_idcccccccc");
    localStorage.setItem('sessionDb',JSON.stringify({id: this.session_id}));
  }

  public getSoundsDb() {
    let arr = Array();
    var a: any = localStorage.getItem("soundDb");
    let localStorageItem = JSON.parse(a);
    return localStorageItem == null ? arr : localStorageItem.id;
  }
  sounds_id ={};
  public setSoundsDb() {
    this.sounds_id = this.getSoundsDb();
    console.log(this.sounds_id,"this.sounds_id");
     
      //console.log(this.sounds_id,"this.sounds_id");
      this.sounds_id = {'musicBool': this.global.soundPlaying, 
      'soundBool': this.global.sound2Playing, "language": this.global.isPortuguese};
      
    console.log(this.sounds_id,"this.sounds_idcccccccc");
    localStorage.setItem('soundDb',JSON.stringify({id: this.sounds_id}));
  }
}
