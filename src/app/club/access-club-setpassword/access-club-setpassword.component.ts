import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessagepopupComponent } from 'src/app/messagepopup/messagepopup.component';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { ClubApiServicesService } from '../services/club-api-services.service';
import { LocalDbClubService } from '../services/club-local-db-club.service';

@Component({
  selector: 'app-access-club-setpassword',
  templateUrl: './access-club-setpassword.component.html',
  styleUrls: ['./access-club-setpassword.component.css']
})
export class AccessClubSetpasswordComponent implements OnInit {

  password: string = "";
  confirmPassword: string = "";
  isFail: string = "";
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;

  constructor( private global: GlobalDetailsClub, private api: ClubApiServicesService, private router: Router
    , private localDb: LocalDbClubService) { }

  ngOnInit(): void {
  }
  validatepassword(){
   
    console.log("globalEmail in SetPasswordComponent------>",this.global.email);
    if(this.password.length > 6){
      this.error ="";
      if(this.password !== this.confirmPassword){
     // alert("Passwords Do not match");
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = 'Passwords do not match.';
      this.messagePopUp.closetxt = 'Close';

      }else if(this.password === this.confirmPassword){
      this.global.password = this.password;
      this.submitButtonClicked();      
      }
    }else{
      this.error ="Password length must be more than 6";
    }
  }
  error ="";
  submitButtonClicked() {
    this.error ="";
    
      if(this.global.phnum){
        this.api.phoneSignUp().subscribe((data) => {
          var response = data;
          console.log("response---------->",response);
          this.global.authToken = response.authToken;
          this.global.userId = response.userId;
          this.localDb.setAccessClubSessionData();
          //alert("You have registered successfully");
          this.messagePopUp.isVisible= true;
          this.messagePopUp.popupMessage = 'Password changed successfully.';
       
        this.messagePopUp.closetxt = 'Close';
          this.isFail = 'successfull';
          
          
        },(e: any) => {
          //alert(JSON.stringify(e.error.message));
          this.messagePopUp.isVisible= true;
          if(e.error.message!= null) {
            this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
            }else {
              this.messagePopUp.popupMessage = 'Connection error. Try Again.';
              this.messagePopUp.closetxt = 'Close';
            }
          this.isFail = 'error';
         // this.router.navigateByUrl('landingPage');
          });
      }
      else if(this.global.email){
        this.api.signUp().subscribe((data) => {
          var response = data;
          console.log("response---------->",response);
          this.global.authToken = response.authToken;
          this.global.userId = response.userId;
          this.localDb.setAccessClubSessionData();
          //alert("You have registered successfully");
          this.messagePopUp.isVisible= true;
         this.messagePopUp.popupMessage = 'Password changed successfully.';
          
          this.messagePopUp.closetxt = 'Close';
          this.isFail = 'successfull';
          
          
        },(e: any) => {
          //alert(JSON.stringify(e.error.message));
          this.messagePopUp.isVisible= true;
          if(e.error.message!= null) {
            this.messagePopUp.popupMessage = e.error.message;
            }else {
              this.messagePopUp.popupMessage = 'Connection error. Try Again.';
              this.messagePopUp.closetxt ='Close';
              this.isFail = 'error';
            }
         
         // this.router.navigateByUrl('landingPage');
          });
      }
      
     
  }

  onClaim(evt:any){
    this.messagePopUp.isVisible= false;
   
    if(evt == 'close'){
   
     this.router.navigateByUrl('accessClub');
      
    this.isFail = '';
    }
  }

}

