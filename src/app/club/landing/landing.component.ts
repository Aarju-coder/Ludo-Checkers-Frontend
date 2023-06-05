import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from 'src/app/globalVars';
import { LanguageModel } from 'src/app/language/langModel';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router:Router ,public gameGlobal:GlobalDetails, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.gameGlobal.isforgotPwd =false;
    
    // if(this.global.userId){
    //   getUserDetails();
    // }
    
  }
  // getUserDetails(){
  //   this.api.getUserDetails().subscribe((data) => {
  //     var response = data;
  //     console.log("response---------->",response[0][0],response[0][0].userName);
  //     if(response[0][0].userName == null ) response[0][0].userName ='Genilson';
  //     this.global.userName = response[0][0].userName;
  //     if(response[0][0].avatarId == 0 ) response[0][0].avatarId =1;
  //     this.global.avatar = response[0][0].avatarId;
  //     
  //     this.messagePopUp.isVisible= true;
  //     this.messagePopUp.popupMessage = 'You have logged in successfully.';
  //     this.isFail = 'successfull';
  //   },(e: any) => {
  //     console.log("eee",JSON.stringify(e));
  //   //   this.messagePopUp.isVisible= true;
  //   //   if(e.error.message!= null) {
  //   //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
  //   //     }else {
  //   //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
  //   //     }
  //   //  this.router.navigateByUrl('landingPage');
  //     });
    
  // }
  playGame(){
    this.gameGlobal.isClub = false;
    this.gameGlobal.isAccessClub=false;
    this.gameGlobal.isCreateClub=false;
    console.log("playGameClicked");
    this.router.navigateByUrl('landingPage');
  }
  clubLanding(){
    console.log("clubManagementClicked");
    this.gameGlobal.isClub=true;
    this.langModel.lang = "en";
    this.router.navigateByUrl('clubLanding');
  }

}
