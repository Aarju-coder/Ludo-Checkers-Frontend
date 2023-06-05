import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from 'src/app/globalVars';
import { LanguageModel } from 'src/app/language/langModel';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(private router: Router,private soundService: SoundServiceService, public langModel: LanguageModel, public global:GlobalDetails) { }

  ngOnInit(): void {
  }
  redeem(){
    this.soundService.playAudio('click');
   // this.router.navigateByUrl('redeem');
  }
  history(){
    this.soundService.playAudio('click');
    this.global.isHistory = true;
    this.router.navigateByUrl('paymentHistory');
  }
  refList(){
    this.soundService.playAudio('click');
    this.global.isHistory = false;
    this.router.navigateByUrl('paymentHistory'); 
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('landingPage');
  }

}
