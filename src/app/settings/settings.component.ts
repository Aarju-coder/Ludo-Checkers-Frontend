import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  musicBtn :any = true;
  soundBtn :any = true;
  
  portuguese: boolean = true;
  constructor(private router: Router,private soundService: SoundServiceService, public localDb:LocalDbService, public global:GlobalDetails, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.musicBtn = this.global.soundPlaying;
    this.soundBtn = this.global.sound2Playing;
    if(this.global.isPortuguese) 
    {
      var language: any = document.getElementById("radio-1");
      language.checked = true;
  }
  else{
    var language: any = document.getElementById("radio-2");
      language.checked = true;
  }
}
  languageClicked(){
    var language: any = document.getElementById("radio-1");
    if (language.checked == true) {
      this.portuguese = true;
    } else {
      this.portuguese = false;
    }
    console.log(this.portuguese)
    this.global.isPortuguese = this.portuguese;
    if(this.global.isPortuguese) this.langModel.lang = "pt";
    else this.langModel.lang = "en";

    this.localDb.setSoundsDb();
  }
  assignMusic(){
    console.log(this.musicBtn);
    if(this.musicBtn) {
      this.global.soundPlaying =false;
      this.soundService.stopMusic();
    }
    else {
      this.global.soundPlaying =true;
      // if(this.global.gameName =="Ludo"){
      //   this.soundService.soundName ="ludostart";
      //   this.soundService.startMusic();
      // }
        if(this.global.gameName =="Checkers" || this.global.gameName =="Ludo"){
        this.soundService.soundName ="Homepage";
        this.soundService.startMusic();

      }
    }
    this.localDb.setSoundsDb();
  }
  assignSound(){
    console.log(this.soundBtn);
    if(this.soundBtn) {
      this.global.sound2Playing =false;
      this.soundService.stopeGameSound();
    }
    else {
      this.global.sound2Playing =true;
    }
    this.localDb.setSoundsDb();
  }
  back(){
    this.soundService.playAudio('click');
    if(this.global.gameName =="Ludo" || this.global.gameName =="Checkers"){
      this.global.isPlaying =true;
      this.router.navigateByUrl('ludoLandingPage');
    } 
    else this.router.navigateByUrl('homePage');
    
  }
  onTnc(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('tnc');
  }
}
