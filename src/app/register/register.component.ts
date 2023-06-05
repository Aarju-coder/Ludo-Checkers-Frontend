import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from './item';
import { ITEMS } from './mock-data';
import { GlobalDetails } from '../globalVars';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
import { ApiServiceService } from 'src/services/api-service.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LanguageModel } from '../language/langModel';
import { GlobalDetailsClub } from '../club/clubGlobalVars';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() normalPage = new EventEmitter<string>(); 
  errorCode: string = '';
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
  isFail: any;
  ageCheck: boolean = false;
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router: Router,private globalClub:GlobalDetailsClub, private global: GlobalDetails, private api: ApiServiceService,private soundService: SoundServiceService, public langModel: LanguageModel) {
    this.itemsList = ITEMS;
      this.radioSelected = "item_1";
      this.getSelecteditem();
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
   // this.ageCheck = this.global.isAgeCheck;
  }
  ngAfterViewInit() {
    // var checkBox: any = document.getElementById("myCheck");
    // checkBox.checked = this.global.isAgeCheck;
    
  }
  checkboxClicked() {
    var checkBox: any = document.getElementById("myCheck");
    if (checkBox.checked == true) {
      this.ageCheck = true;
    } else {
      this.ageCheck = false;
    }
    this.global.isAgeCheck = checkBox.checked;
  }
  validationCheck() {

    var validation: any;
    if(this.validationBool == 'Email is already taken') 
    {
      this.errorCode = 'Email is already taken!';
      validation = 'showValidation';
    }
    else if(this.validationBool == 'error occured please try again!') 
    {
      this.errorCode = 'wrong email please try again!';
      validation = 'showValidation';
    } 
    else 
    {
      validation = 'validation';      
    }
      return validation;
  }
  validateDetails(numberOrmail: any){
    this.soundService.playAudio('click');
    if (this.ageCheck) {
    this.invalidPhone = false;this.invalidEmail=false;
    console.log("i am validating data", this.email, " --------",this.phonenumber);
    if(numberOrmail == 0)
    {
      var emailValid = this.emailCheck(this.email);
      if(this.emailCheck(this.email) == false){ //emailValid==false
        this.invalidEmail=true;
        // alert("Enter Correct Email Address");
        this.messagePopUp.isVisible= true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.emailCorrct[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        this.isFail = 'error';
        console.log('invalidEmailornot--------->',this.emailCheck(this.email),"---------invalidEmail",this.invalidEmail);
      }
      else {
        this.global.myEmail = this.email;
        this.api.getOtpEmail().subscribe((data) => {
          var response = data;
          console.log("response---------->",response);
          if(response.success)this.router.navigateByUrl("emailOTP");
          // this.global.authToken = response.status;
          // this.global.userId = response.message;
          // //alert("You have registered successfully");
          // this.messagePopUp.isVisible= true;
          // this.messagePopUp.popupMessage = 'You have registered successfully.';
          // this.isFail = 'successfull';
          
          
        },(e: any) => {
          //alert(JSON.stringify(e.error.message));
          this.messagePopUp.isVisible= true;
          if(e.error.message!= null) {
            this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
            }else {
              this.messagePopUp.popupMessage = this.langModel.componentLang.popups.connectionErr[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
            }
          this.isFail = 'error';
         // this.router.navigateByUrl('landingPage');
          });
        console.log("globalEmail-------->",this.global.myEmail);
        //this.register();
      }

      if(this.invalidEmail == false){
        //this.router.navigateByUrl('setPassword');
        console.log('setPassword route');
      }
      console.log("check email",emailValid);
    }
    else if(numberOrmail == 1)
    {
      var phoneNo = this.phoneNoCheck(this.phonenumber);
      if(this.phoneNoCheck(this.phonenumber) == false){ //emailValid==false
      this.invalidPhone=true;
      this.invalidEmail=false;
      this.messagePopUp.isVisible= true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.phnCorrct[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      this.isFail = 'error';
      console.log('invalidNumberornot--------->',this.phoneNoCheck(this.phonenumber));
      }
      if(this.invalidPhone == false){
        this.global.myphone=this.phonenumber;
        console.log(this.global.myphone);
        this.phoneOtp();
      // this.router.navigateByUrl('otpPage');
      console.log('otpPage route');
      }
      console.log("check Phone", phoneNo);
    // if(fName && lName && emailValid && sName && passwordValid){
    //   console.log("Am ready to register");
    //   this.register();
    // }

    }
  }else {
    this.messagePopUp.isVisible = true;
    this.messagePopUp.popupMessage = this.langModel.componentLang.popups.ageWarning[this.langModel.lang];
    this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
  }
  }
  res:any
  phoneOtp(){
    this.api.phoneOtp().subscribe((data)=>{
      this.res=data;
      console.log( this.res," this.res this.res");
    });
    this.router.navigateByUrl('phonesignupOTP');
    
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
  phoneNoCheck(phoneNo: any){
    var re = /[0-9]{6,14}/;
    if (!(re.test(phoneNo))) {
      return false;
    }
    else{
      return true;
    }	
  }
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    if(evt == 'close' && this.isFail == 'successfull'){
      if(this.global.isClub == false) this.router.navigateByUrl('homePage');
        else{
          if(this.global.userId){
            this.router.navigateByUrl("createClub");
            }
            else{
              this.global.isCreateClub=true;
              this.router.navigateByUrl('landingPage');
            }
      }

     // else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
    this.isFail = '';
    }
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('landingPage');
  }
}
