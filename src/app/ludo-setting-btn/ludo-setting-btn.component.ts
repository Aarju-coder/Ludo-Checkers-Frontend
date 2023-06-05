import { Component, OnInit, EventEmitter,Output } from '@angular/core';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-ludo-setting-btn',
  templateUrl: './ludo-setting-btn.component.html',
  styleUrls: ['./ludo-setting-btn.component.css']
})
export class LudoSettingBtnComponent implements OnInit {

  isVisible = false;
  musicBtn :any = true;
  soundBtn :any = true;
  heading ="Settings";
  musicText ="Music";
  soundText= "Sound";
  gameName: string| undefined  = "Ludo";
  @Output() soundAssign = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  close(){
    this.isVisible = false;
  }
  assignMusic(){
    console.log(this.musicBtn);
    this.soundAssign.emit("music");
  }
  assignSound(){
    console.log(this.soundBtn);
    this.soundAssign.emit("sound");
  }
  
  gameCheck(type:any){
    switch(type){
      case 'container':
        if(this.gameName =="Ludo")
        {
           return {'background-color':'#c41616'};
        }
        else{
           return { 'background-color':'#006200'};
        }
        break;
        case 'settings-header':
          if(this.gameName =="Ludo")
          {
             return {'color':'#9a0e0e'};
          }
          else{
             return { 'color':'#006200'};
          }
          break;
      default:
        return { 'color':'#9a0e0e'};
    }
  }

}
