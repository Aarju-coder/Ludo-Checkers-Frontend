import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from 'src/app/globalVars';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { MessagepopupComponent1 } from '../messagepopup/messagepopup.component';
import { ClubApiServicesService } from '../services/club-api-services.service';
import { LocalDbClubService } from '../services/club-local-db-club.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class ClubLoginPageComponent implements OnInit {

  username: string = "";
  password: string = "";
  isOwner: string = '';

  @ViewChild(MessagepopupComponent1)
  messagepopup: MessagepopupComponent1 = new MessagepopupComponent1;
  constructor(private global: GlobalDetailsClub, private router: Router, private api: ClubApiServicesService, private localdb: LocalDbClubService,private gameGlobal:GlobalDetails) { }

  ngOnInit(): void {
    if (this.global.role && !this.global.isforgotPwd) {
      if (this.global.role.includes('CLUB_OWNER')) {
       // this.localdb.setAccessClubSessionData();
        this.router.navigateByUrl('ownerDashboard');
      }
      else if (this.global.role.includes('AGENT')) {
        //this.localdb.setAccessClubSessionData();
        this.router.navigateByUrl('agentDashboard');
      }
    }
    
  }
  back() {
    this.global.isforgotPwd =false;
    this.router.navigateByUrl('clubLanding')
  }
   submitButtonClicked() {
    this.global.isforgotPwd =false;
    if (this.password.length > 6 && this.username != '') {
      let isnum = /^\d+$/.test(this.username);
      if(isnum){
        this.global.phnum = this.username;
      }
      else{
        this.global.email = this.username;
      }
      console.log(isnum,"isnumisnum")
      
      this.global.password = this.password;
      
       this.api.signIn().subscribe((result) => {
        let response = result;

        console.log("respose---->", response);
        this.global.userId = response.userId;
        this.global.authToken = response.authToken;
        //this.getUserDetails();
        if (response.roles.includes('CLUB_OWNER')) {
          this.isClubApproved(response);
        }
        else if (response.roles.includes('AGENT')) {
          this.global.role = response.roles;
          this.localdb.setAccessClubSessionData();
          this.router.navigateByUrl('agentDashboard');
        }
        else{
          this.isClubApproved(response);
        }

      },(e: any) => {
        this.messagepopup.isVisible= true;
        if(e.error.message!= null) {
        this.messagepopup.popupMessage = "Invalid credentials";
        }else {
          this.messagepopup.popupMessage = "Connection error. Try Again.";
        }
        var timer = setTimeout(()=>{
          this.messagepopup.isVisible=false;
          this.username='';
          this.password='';
          clearTimeout(timer);
        },2000);
        //alert(JSON.stringify(e.error.message));
        //if(JSON.stringify(e.error.message)=="")
        });


    }else{
      this.messagepopup.isVisible= true;
      this.messagepopup.popupMessage = "Incorrect Password";
      
      var timer = setTimeout(()=>{
        this.messagepopup.isVisible=false;
        this.username='';
        this.password='';
        clearTimeout(timer);
      },2000);
    }


    // if (this.isOwner == 'owner') {
    //   this.router.navigateByUrl('ownerDashboard');
    // }
    // else if (this.isOwner == 'agent') {
    //   this.router.navigateByUrl('agentDashboard');
    // }

  }
  isClubApproved(response:any){
    this.api.checkIfClubApproved().subscribe((data) => {
      console.log("club is approved", data);
      if(data.message == "Club approved"){
        if (response.roles.includes('CLUB_OWNER')) {
          this.global.role = response.roles;
          this.localdb.setAccessClubSessionData();
          this.router.navigateByUrl('ownerDashboard');
        }
        else {
          this.messagepopup.isVisible = true;
          this.messagepopup.popupMessage = "Check Your Email and Password."
         
          var timer = setTimeout(()=>{
            this.messagepopup.isVisible=false;
            clearTimeout(timer);
          },1500);
        }
      }
      else if(data.message == "Club not approved yet"){
        this.messagepopup.isVisible= true;
        this.messagepopup.popupMessage = "Club not approved yet";
      }
      else if(data.message == "Club disapproved"){
        this.messagepopup.isVisible= true;
        this.messagepopup.popupMessage = "Club disapproved";
      }
      else{
        this.messagepopup.isVisible= true;
        this.messagepopup.popupMessage = "Something went wrong. Try again.";
      }
      var timer = setTimeout(()=>{
        this.messagepopup.isVisible=false;
        clearTimeout(timer);
      },2000);
      
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
  getUserDetails(){
    this.api.getUserDetails().subscribe((data) => {
      var response = data;
      console.log("response---------->",response,response.userName);
      if(response.userName == null ) {
        console.log("response.userName",response.userName);
        response.userName ='Genilson';
      }
      this.global.userName = response.userName;
      if(response.avatarId == 0 ) response.avatarId =1;
      this.global.avatar = response.avatarId;

      this.global.email=response.email;
      console.log("response.userName2222",response.userName, this.global.userName);
      this.localdb.setAccessClubSessionData();
      
      // this.messagePopUp.isVisible= true;
      // this.messagePopUp.popupMessage = 'You have logged in successfully.';
      // this.isFail = 'successfull';
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
  forgetPass(){
    this.gameGlobal.isAccessClub=true;
    this.router.navigateByUrl('forgotpwdaccessclub');
  }

}
