import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from 'src/app/globalVars';
import { MessagepopupComponent } from 'src/app/messagepopup/messagepopup.component';
import { Item } from 'src/app/register/item';
import { ITEMS } from 'src/app/register/mock-data';
import { ApiServiceService } from 'src/services/api-service.service';

import { GlobalDetailsClub } from '../clubGlobalVars';
import { ClubApiServicesService } from '../services/club-api-services.service';

@Component({
  selector: 'app-accessclub-forgot-password',
  templateUrl: './accessclub-forgot-password.component.html',
  styleUrls: ['./accessclub-forgot-password.component.css']
})
export class AccessclubForgotPasswordComponent implements OnInit {

  phnerrorCode: string = '';
  emailerrorCode : string = '';
  validationBool: string = "";
  radioSel:any;
  radioSelected:string = "";
  radioSelectedString:string = "";
  itemsList: Item[] = ITEMS;
  radioSelectedEmail: boolean = false;
  radioSelectedNumber: boolean = false;
  invalidPhone = false;
  invalidEmail= false;
  phonenumber: number  = NaN;
  email: string = "";
  invalidphone:boolean=false;
  isFail: any;
  ageCheck: boolean = false;
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;

  constructor(private router: Router,private global:GlobalDetailsClub, private api: ClubApiServicesService) {
    this.itemsList = ITEMS;
      this.radioSelected = "item_1";
      this.getSelecteditem();
      this.emailerrorCode ="";
      this.phnerrorCode= "";
   }
  getSelecteditem(){
    this.radioSel = ITEMS.find(Item => Item.value === this.radioSelected);
   // console.log(ITEMS[0].name,this.langModel.componentLang.createAcc[ITEMS[0].name[this.langModel.lang]]);
    this.radioSelectedString = JSON.stringify(this.radioSel);
    if(this.radioSel.value == 'item_2'){
      this.radioSelectedNumber = true; 
      this.radioSelectedEmail = false;
    }else if(this.radioSel.value == 'item_1'){
      this.radioSelectedNumber = false; 
      this.radioSelectedEmail = true;
    }
  }
  onItemChange(item:any){
    this.getSelecteditem();
  }
  ngOnInit(): void {
  }

  onClaim(evt:any){
    this.messagePopUp.isVisible= false;
    
  }
  back(){
    this.router.navigateByUrl("accessClub");
    }
    
  validateDetails(numberOrmail:any){
    this.emailerrorCode ="";
    this.phnerrorCode= "";
    this.global.email ="";
    this.global.phnum ="";
    if(numberOrmail == 0){
      var emailValid = this.emailCheck(this.email);
      if(this.emailCheck(this.email) == false){ //emailValid==false
        this.invalidEmail=true;
        //alert("Enter Correct Email Address");
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = "Enter Correct Email Address";
      this.messagePopUp.closetxt = "Close";
        console.log('invalidEmailornot--------->',this.emailCheck(this.email),"---------invalidEmail",this.invalidEmail);
      }
      else {
        this.global.email = this.email;
        this.global.isforgotPwd = true;
        this.api.getOtpEmail().subscribe((data) => {
          var response = data;
          console.log("response---------->",response);
         // this.global.isforgotPwd = false;
         
         if(response.message == "Email is not associated with any account.")
           {
            this.emailerrorCode ="*Email is not associated with any account.";
           } 
            if(response.success)this.router.navigateByUrl("emailOTP");
          
          
        },(e: any) => {
          //alert(JSON.stringify(e.error.message));
          this.messagePopUp.isVisible= true;
          if(e.error.message!= null) {
            this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
            }else {
              this.messagePopUp.popupMessage = 'Connection error. Try Again. ';
      this.messagePopUp.closetxt =  "Close";
            }
         // this.isFail = 'error';
         // this.router.navigateByUrl('landingPage');
          });
        
        console.log("globalEmail-------->",this.global.email);
        
        }
      }
      else if(numberOrmail == 1){
        var emailValid = this.phoneCheck(this.phonenumber);
        if(this.phoneCheck(this.phonenumber) == false){ //phoneValid==false
          this.invalidphone=true;
          //alert("Enter Correct phone Address");
        this.messagePopUp.isVisible= true;
        this.messagePopUp.popupMessage = 'Enter Correct Phone Number.';
       this.messagePopUp.closetxt = 'Close';
          console.log('invalidphoneornot--------->',this.phoneCheck(this.phonenumber),"---------invalidphone",this.invalidphone);
        }
        else {
          // this.global.myEmail = this.code+" "+ this.phone;
  
          this.global.phnum=this.phonenumber;
          //this.global.countryCode=this.code;
          this.global.isforgotPwd = true;
          this.api.phoneOtpResend().subscribe((data)=>{
            console.log( data," this.res this.res");
            if(data.message == "User with this phone number does not exists"){
              this.phnerrorCode ="*User with this phone number does not exists";
            }
            if(data.success) this.router.navigateByUrl('phonesignupOTP');
          
          });
          
          
          console.log("globalPhoneNumber-------->",this.global.countryCode ,this.global.phnum);
          
          // this.login();
        }
      }
      else{
        console.log("hiiii");
      }
  }
  emailCheck(email: any){
    var re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    if (!(re.test(email))) {
      return false;
    }
    else{
      return true;
    }	
  }
  
  phoneCheck(email: any){
    var re = /[0-9]/;
    if (!(re.test(email))) {
      return false;
    }
    else{
      return true;
    }	
  }

  
}
