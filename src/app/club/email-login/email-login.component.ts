import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { MessagepopupComponent1 } from '../messagepopup/messagepopup.component';
import { ClubApiServicesService } from '../services/club-api-services.service';
import { LocalDbClubService } from '../services/club-local-db-club.service';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.css']
})
export class EmailLoginComponent implements OnInit {

  invalidEmail= false;
  email: string = "";
  password: string = "";
  isFail: string = "";
  @ViewChild(MessagepopupComponent1)
  messagePopUp: MessagepopupComponent1 = new MessagepopupComponent1;
  constructor(private global:GlobalDetailsClub ,private api:ClubApiServicesService ,private router:Router,private localDb:LocalDbClubService) { }

  ngOnInit(): void {
  }
  validateDetails(){
    var emailValid = this.emailCheck(this.email);
      if(this.emailCheck(this.email) == false){ //emailValid==false
        this.invalidEmail=true;
        //alert("Enter Correct Email Address");
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = 'Enter Correct Email Address';
      setTimeout(()=>{this.messagePopUp.isVisible=false},1500);
        console.log('invalidEmailornot--------->',this.emailCheck(this.email),"---------invalidEmail",this.invalidEmail);
      }
      else {
        this.global.email = this.email;
        this.global.password = this.password;
        console.log("globalEmail-------->",this.global.email);
        this.login();
      }

      // if(this.invalidEmail == false){
      //   this.router.navigateByUrl('setPassword');
      //   console.log('setPassword route');
      // }
      console.log("check email",emailValid);
  }
  emailCheck(email: any){
    var re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    if (!(re.test(email))) {
      return true;
    }
    else{
      return true;
    }	
  }
  login(){
    this.api.signIn().subscribe((data) => {
      var response = data;
      console.log("response---------->",response);
      // this.global.authToken = response.authToken;
      this.global.userId = response.userId;
      this.global.role=response.roles;
      this.global.authToken=response.authToken;
      
      this.getUserDetails();
      this.router.navigateByUrl('createClub');
      //alert("You have logged in successfully");
      //this.router.navigateByUrl('homePage');
      // this.messagePopUp.isVisible= true;
      // this.messagePopUp.popupMessage = 'You have logged in successfully.';
      // this.isFail = 'successfull';

    },(e: any) => {
      this.messagePopUp.isVisible= true;
      
      if(e.error.message!= null) {
      this.messagePopUp.popupMessage = "Invalid credentials";
      }else {
        this.messagePopUp.popupMessage = "Connection error. Try Again.";
      }
      this.isFail = 'error';
      setTimeout(()=>{this.messagePopUp.isVisible=false},1500);
      //alert(JSON.stringify(e.error.message));
      //if(JSON.stringify(e.error.message)=="")
      });
  }
  getUserDetails(){
    this.api.getUserDetails().subscribe((data) => {
      var response = data;
      console.log("response---------->",response[0][0],response[0][0].userName);
      if(response[0][0].userName == null ) response[0][0].userName ='Genilson';
      this.global.userName = response[0][0].userName;
      if(response[0][0].avatarId == 0 ) response[0][0].avatarId =1;
      this.global.avatar = response[0][0].avatarId;
      this.localDb.setAccessClubSessionData();
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = 'You have logged in successfully.';
      this.isFail = 'successfull';
      setTimeout(()=>{this.messagePopUp.isVisible=false},1500);
    },(e: any) => {
      console.log("eee",JSON.stringify(e));
    //   this.messagePopUp.isVisible= true;
    //   if(e.error.message!= null) {
    //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
    //     }else {
    //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
    //     }
    //  this.router.navigateByUrl('landingPage');
      });
    
  }
  onClaim(evt:any){
    this.messagePopUp.isVisible= false;
    
    // if(evt == 'close'){
    //   if(this.isFail == 'successfull') this.router.navigateByUrl('homePage');
    //  // else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
    // this.isFail = '';
    // }
  }
  back(){
    this.router.navigateByUrl('clubLanding');
  }

}
