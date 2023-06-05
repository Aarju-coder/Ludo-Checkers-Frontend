import { Injectable } from '@angular/core';
import { GlobalDetails } from 'src/app/globalVars';

@Injectable()
export class SoundServiceService {
  audio = new Audio();
  public music = new Audio();
  public soundName = "Homepage";
  constructor(private model: GlobalDetails) {
    // var path = this.getPath(this.soundName)
    // this.music.src = path;
    // this.music.load();
   }
   startMusic() {
    console.log("hell");
    if (this.model.soundPlaying == true ){
    var path = this.getPath(this.soundName)
    this.music.src = path;
    this.music.load();
    this.music.play();
   // this.music.loop = true;
    //if(this.soundName == "Homepage" || this.soundName == "ludostart" ||this.soundName == "Championship") 
    this.music.volume = 0.1;
    
      if (this.music.paused) {
        this.music.play();
        this.music.loop = true;
        let self = this;
        this.music.onplaying = function() {
        //  if(self.model.appInBg)
           {
            self.music.pause();
          }
        };
        // this.music.disableRemotePlayback = false;
        // alert("music play")
      }
  }
  }
  stopMusic() {
   
      console.log("music pause")
      this.music.pause();
      
  }
  playAudio(name:any) {
    if(this.model.sound2Playing){
    var path = this.getPath(name)
    this.audio.src = path;
    this.audio.load();
    this.audio.play();
    } 
  }

  getPath(name:any) {
    
    var path: any;
    for(var i in this.model.soundJson) {
      if(name == this.model.soundJson[i].code) {
        path = this.model.soundJson[i].path;
        // alert(path+ ' ' +this.model.soundJson[i].code);
      } else {
        // alert("path"+ ' ' +this.model.soundJson[i].code);
      }
    }
    return path;
  }

  public stopeGameSound(){
    console.log("music stop")
    // if(this.id != null){
    //   this.musicObject.stop(this.id);
    // }
    this.audio.pause();
    //this.model.soundPlaying = false;
  }

  pauseMusic(name:any){
    // if(this.id != null){
    //   this.musicObject.pause(this.id);
    // }
   // this.model.soundPlaying = false;
  }
  
  playMusic(name:any) {
    // if(this.id != null){
    //   this.musicObject.stop(this.id);
    // }
    // for(var obj of this.loadedMusic){
    //   if(obj.code == name) {
    //     this.musicObject = obj.audio;
    //    if(name == "pokerbg") this.musicObject.volume(0.2);
    //     this.id = this.musicObject.play();
    //     break;
    //   } else {
    //     console.log('big picture '+obj.name);
    //   }
    // }
    this.model.soundPlaying =true;
  }
}
