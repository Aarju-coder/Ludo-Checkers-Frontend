import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'colyseus.js';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';


//const client = new Client("ws://34.197.91.228:3002");
const client = new Client("wss://mojogos.ao/checkers");
@Component({
  selector: 'app-checkers-invite-friends',
  templateUrl: './checkers-invite-friends.component.html',
  styleUrls: ['./checkers-invite-friends.component.css']
})
export class CheckersInviteFriendsComponent implements OnInit {
  roomCode: string = "";
  inviteOrGameplay: boolean = false;
  indexOfEntry: number = 0;

  entryArray = [10, 20, 30, 40, 50, 60];
  rewardsArray = [100, 200, 300, 400, 500, 600];

  entry: number = this.entryArray[this.indexOfEntry];
  reward: number = this.rewardsArray[this.indexOfEntry];
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router: Router, private global: GlobalDetails,private soundService: SoundServiceService, public langModel: LanguageModel) {
   }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    
    // this.router.navigateByUrl('checkers')
  }
  increaseAmount(){
    this.soundService.playAudio('click');
    if(this.indexOfEntry < this.entryArray.length-1){
      this.indexOfEntry = this.indexOfEntry + 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }
  decreaseAmount(){
    this.soundService.playAudio('click');
    if(this.indexOfEntry > 0){
      this.indexOfEntry = this.indexOfEntry - 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }

}
