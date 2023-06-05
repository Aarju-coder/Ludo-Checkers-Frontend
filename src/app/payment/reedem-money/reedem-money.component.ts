import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageModel } from 'src/app/language/langModel';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';

@Component({
  selector: 'app-reedem-money',
  templateUrl: './reedem-money.component.html',
  styleUrls: ['./reedem-money.component.css']
})
export class ReedemMoneyComponent implements OnInit {

  constructor(private router: Router,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('wallet');
  }

}
