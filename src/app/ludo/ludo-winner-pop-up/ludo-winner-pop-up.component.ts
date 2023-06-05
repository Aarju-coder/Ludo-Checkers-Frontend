import { Component, OnInit, Output , EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { LanguageModel } from 'src/app/language/langModel';

@Component({
  selector: 'app-ludo-winner-pop-up',
  templateUrl: './ludo-winner-pop-up.component.html',
  styleUrls: ['./ludo-winner-pop-up.component.css']
})
export class LudoWinnerPopUpComponent implements OnInit {
  isVisible =false;
  winnerName: string | undefined = ""
  winnerAmt: string | undefined = "";
  secondAmt: string | undefined = "";
  thirdAmt: string | undefined = "";
  winnerAvatar = "../../../assets/img/profile/Avatar0.png";
  secondAvatar = "../../../assets/img/profile/Avatar0.png";
  thirdAvatar = "../../../assets/img/profile/Avatar0.png";
  secondRank: string | undefined ;
  thirdRank: string | undefined ;
  gameType = 'Ludo';
  // winnerAvatarimplement = this.winnerAvatar.src;
  type ='';
  typeclose='';
  heading = 'TOURNAMENT WINNER';
  popupMessage ='Connection error. Try Again.';
  btnText= '';
  closetxt= 'Close';
  langModel :any;
  isTourney = false;
  tourEnded = true;
  @Output() isClaimed1 = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
    console.log(this.gameType,"gametypeeee");
  }
  ngAfterViewInit(){
  }
  goToLobby(){
    //this.router.navigateByUrl("")
    console.log("going to lobby play again");
    this.isClaimed1.emit("goToLobby");
  }
  goToHome(){
    //this.router.navigateByUrl("")
    this.isClaimed1.emit("goToHome");
  }

}
