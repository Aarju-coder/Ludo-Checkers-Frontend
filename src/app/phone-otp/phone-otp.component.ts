import { computeDecimalDigest } from '@angular/compiler/src/i18n/digest';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';

@Component({
  selector: 'app-phone-otp',
  templateUrl: './phone-otp.component.html',
  styleUrls: ['./phone-otp.component.css']
})
export class PhoneOtpComponent implements OnInit {

  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router:Router,private global: GlobalDetails, private api: ApiServiceService,
    private localDb: LocalDbService,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
  }
  // phone:any=this.global.myEmail
  code:any=this.global.countryCode
  phone:any=this.global.myphone
  phNumber:any= this.code +' '+this.phone
  otp:any;

  checkOtp(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl("resetPassword")
  }
  resend(){

  }

  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl("phoneforgotPassword")
  }

}
