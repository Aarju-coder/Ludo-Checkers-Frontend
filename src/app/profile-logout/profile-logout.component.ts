import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagingService } from 'src/services/messaging.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-profile-logout',
  templateUrl: './profile-logout.component.html',
  styleUrls: ['./profile-logout.component.css']
})
export class ProfileLogoutComponent implements OnInit {

  avatarimg: any;
  constructor(private messagingService: MessagingService,private router: Router, public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.avatarimg = "../../assets/img/profile/Avatar" + this.global.avatar + ".png";
  }
  logout() {
    this.soundService.playAudio('click');
    localStorage.clear();
    this.global.isforgotPwd = false;
    this.global.setProfile = true;
    this.global.avatar = 1;
    this.global.userName = 'Genilson';

    this.global.firstName = "";
    this.global.lastName = "";
    this.global.dOb = "";
    this.global.address = "";
    this.global.myEmail = "";
    this.global.gender = "Male";
    this.global.accNum = "";
    this.global.bankName = "";
    this.global.expPhoneNumber = NaN;
    this.global.phoneVerified = true;
    this.global.emailVerified = true;
    this.global.coins = 0;
    this.global.moneyAmt = 0;
    this.global.isAgeCheck = false;
    this.global.isPortuguese = true;
    this.global.soundPlaying = true;
    this.global.sound2Playing = true;
    this.langModel.lang = "pt";
    this.messagingService.deleteMessage();
    this.router.navigateByUrl('landingPage');
  }
  back() {
    this.soundService.playAudio('click');
    this.router.navigateByUrl('homePage');
  }
  editProfile() {
    this.soundService.playAudio('click');
    this.global.setProfile = false;
    this.router.navigateByUrl('user-details');
  }
}
