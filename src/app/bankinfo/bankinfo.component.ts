import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-bankinfo',
  templateUrl: './bankinfo.component.html',
  styleUrls: ['./bankinfo.component.css']
})
export class BankinfoComponent implements OnInit {
  expPhoneNumber: Number = NaN;
  bankName: string| undefined="";
  accNum :string| undefined ="";
  error ="";

  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router :Router,  private localDb: LocalDbService, private api:ApiServiceService, public global:GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.accNum = this.global.accNum;
    this.bankName = this.global.bankName;
    this.expPhoneNumber = this.global.expPhoneNumber;
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('user-details');
  }
  nextClicked(){
    console.log(this.accNum,String(this.accNum).length);
    if(this.accNum == "" || String(this.accNum).length != 21) {
      console.log(this.accNum,String(this.accNum).length);
      this.error = this.langModel.componentLang.bankdetails.error[this.langModel.lang];
    }
    else{
      this.global.accNum = this.accNum;
      this.global.bankName = this.bankName;
      this.global.expPhoneNumber = this.expPhoneNumber;
      console.log(this.bankName,"this.bankName",this.global.accNum);
      this.soundService.playAudio('click');
      this.error = "";
      if(this.global.setProfile){
      this.api.createProfile().subscribe((data) => {
        var response = data;
        console.log("response---------->",response);
       
        this.localDb.setGameSessionData();
        this.router.navigateByUrl('setProfile');
        
      },(e: any) => {
        //alert(JSON.stringify(e.error.message));
         this.messagePopUp.isVisible= true;
        if(e.error.message!= null) {
          this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
          }else {
            this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
       this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          }
       // this.router.navigateByUrl('landingPage');
        });
      }
      else{
        this.router.navigateByUrl('setProfile');
      }
    }
    
  }
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    if(evt == 'close'){
      // if(this.isFail == 'successfull') this.router.navigateByUrl('setProfile');
      // else if(this.isFail == 'error')this.router.navigateByUrl('register');
   
    }
  }
  onSkip(){
    this.soundService.playAudio('click');
    if(this.global.setProfile){
    this.api.createProfile().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
     
      this.localDb.setGameSessionData();
      this.router.navigateByUrl('setProfile');
      
    },(e: any) => {
      //alert(JSON.stringify(e.error.message));
       this.messagePopUp.isVisible= true;
      if(e.error.message!= null) {
        this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
        }else {
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }
     // this.router.navigateByUrl('landingPage');
      });
    }
    else{
      this.router.navigateByUrl('setProfile');
    }
  }
}
