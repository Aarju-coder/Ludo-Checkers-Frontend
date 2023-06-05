import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.css']
})
export class TncComponent implements OnInit {
  constructor(private router: Router, public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    
  }
  back() {
    this.soundService.playAudio('click');
    this.router.navigateByUrl('landingPage');
  }
 

}
