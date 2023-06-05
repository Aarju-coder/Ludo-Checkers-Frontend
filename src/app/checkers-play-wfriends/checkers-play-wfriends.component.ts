import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from '../globalVars';
import { Client } from 'colyseus.js';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LanguageModel } from '../language/langModel';
//const client = new Client("ws://34.197.91.228:3002");
const client = new Client("wss://mojogos.ao/checkers");
//const client = new Client("ws://localhost:3001");
@Component({
  selector: 'app-checkers-play-wfriends',
  templateUrl: './checkers-play-wfriends.component.html',
  styleUrls: ['./checkers-play-wfriends.component.css']
})
export class CheckersPlayWFriendsComponent implements OnInit {
  roomCode: string = "";
  roomExsitOrnot: boolean = false;
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router: Router, public global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) {
    this.global.roomCode = "";
   }

  ngOnInit(): void {
  }
  async checkersJoin(){
    this.soundService.playAudio('click');
    this.global.createOrJoin = "join";
    this.global.roomCode = this.roomCode;
    if(this.global.createOrJoin == "join"){
      await client.getAvailableRooms("playWithFriends").then(rooms => {
        rooms.forEach((room) => {
          if(String(this.global.roomCode) == String(room.roomId)){
            console.log("herererere");
            this.roomExsitOrnot = true;
          }
          console.log(room.roomId.length , this.global.roomCode?.length);
          console.log(room.clients);
          console.log(room.maxClients);
          console.log(room.metadata);
        });
      }).catch(e => {
        console.error(e);
      });
      console.log(this.roomExsitOrnot);
      if(this.roomExsitOrnot == false){
        this.messagePopUp.isVisible= true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.wrongCode[this.langModel.lang];
      this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      }else{
        this.global.checkersGameType = "PWF";
      this.router.navigateByUrl('checkers');
      }
    }
    
  }
  onClaim(type:any){
    this.soundService.playAudio('click');
      this.messagePopUp.isVisible= false;
    }
  checkers(){
    this.soundService.playAudio('click');
    this.global.createOrJoin = "create";
    this.global.checkersGameType = "PWF";
    console.log("checkers game type -> ", this.global.checkersGameType, " ", this.global.createOrJoin);
    this.router.navigateByUrl('ludoRandomPlay');
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('ludoLandingPage');
  }
}
