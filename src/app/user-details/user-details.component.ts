import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { Item } from '../ludo-random-play/item';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
import { GENDER, ITEMS } from '../register/mock-data';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  firstName: string | undefined = "";
  lastName: string | undefined = "";
  userName:string='';
  email:string | undefined='';
  phoneNumber:number | undefined=NaN;
  clubName:string='';
  NIF:string='';
  address: string | undefined = "";
  imgfile:any;
  imgUrl:any="";
  itemsList: Item[] = GENDER;
  radioSel:any;
  radioSelected:string | undefined = "";
  radioSelectedString:string = "";
  radioSelectedEmail: boolean = false;
  radioSelectedNumber: boolean = false;
  dob: string | undefined = "";
  error: string | undefined = "";
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router :Router, private api:ApiServiceService, public global:GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.itemsList = GENDER;
    this.radioSelected = this.global.gender;
    this.firstName = this.global.firstName;
    this.lastName = this.global.lastName;
    this.dob = this.global.dOb;
    this.address = this.global.address;
    this.email = this.global.myEmail;
    this.phoneNumber = this.global.myphone;
    this.getSelecteditem();
  }
  getSelecteditem(){
    this.radioSel = GENDER.find(Item => Item.value === this.radioSelected);
    this.radioSelectedString = JSON.stringify(this.radioSel);
    if(this.radioSel.value == 'Female'){
      this.radioSelectedNumber = true; 
      this.radioSelectedEmail = false;
    }else if(this.radioSel.value == 'Male'){
      this.radioSelectedNumber = false; 
      this.radioSelectedEmail = true;
    }
  }
  onItemChange(item:any){
    this.getSelecteditem();
  }
  back(){
    this.soundService.playAudio('click');
    if(this.global.setProfile == false)  this.router.navigateByUrl('profileLogout');
    else this.router.navigateByUrl('setPassword');
  }
  isFail: string = "";
  onClaim(evt:any){
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible= false;
    if(evt == 'close'){
      // if(this.isFail == 'successfull') this.router.navigateByUrl('setProfile');
      // else if(this.isFail == 'error')this.router.navigateByUrl('register');
    this.isFail = '';
    }
  }
   checkAge() {
    var dob:any = document.getElementById('datee');
    var today = new Date();
    var birthDate = new Date(dob.value);
    var y = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    var d = today.getDate() - birthDate.getDate();
    console.log(y, "years",m, d);
   
    // if(y >= 18 && m >=0){
    //   if(m == 0 && d >= 0 ) return true;
    //   else if( m > 0) return true;
    // }  
    if(y > 18){
       return true;
    } 
    else if(y == 18 && m >=0){
      if(m == 0 && d >= 0 ) return true;
        else if( m > 0) return true;
    } 
    else return false;
  }
  nextClicked(){
    this.soundService.playAudio('click');
    
    if(this.firstName == "" ||this.lastName == ""||this.dob == ""||this.address == "" || this.email == "" || this.phoneNumber == NaN){
      this.messagePopUp.isVisible= true;
     this.messagePopUp.popupMessage = this.langModel.componentLang.popups.fillFields[this.langModel.lang];
     this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
    }
    else{
      var bool = this.checkAge();
      if(bool){
        this.global.firstName = this.firstName;
        this.global.lastName = this.lastName;
        this.global.dOb = this.dob;
        this.global.address = this.address;
        this.global.myEmail = this.email;
        this.global.myphone = this.phoneNumber;
        this.global.gender = this.radioSelected;
        console.log(this.global.firstName,"this.global.firstName")
        this.router.navigateByUrl('bank-info');
       }
       else{
        this.messagePopUp.isVisible= true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.ageWarning[this.langModel.lang];
        this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
       }
    }
  }

  onFile(event:any){
    console.log(event);
    this.imgfile=event.target.files[0];
    console.log(this.imgfile);
    const reader = new FileReader();
    reader.onload = () => {
      this.imgUrl = reader.result as string;
    }
    reader.readAsDataURL(this.imgfile)

  }
}
