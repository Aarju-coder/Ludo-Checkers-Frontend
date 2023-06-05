import {
  Component,
  ViewChild,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
// import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { Client } from 'colyseus.js';
import 'jquery';
import { Router } from '@angular/router';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
import { GlobalDetails } from '../globalVars';
import { ShareonmobileService } from 'src/app/shareonmobile.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LudoWinnerPopUpComponent } from '../ludo/ludo-winner-pop-up/ludo-winner-pop-up.component';
import { LanguageModel } from '../language/langModel';
import { LudoSettingBtnComponent } from '../ludo-setting-btn/ludo-setting-btn.component';
import { LocalDbService } from 'src/services/local-db.service';
// import {leaveGameRoom, leaveLobbyRoom, joinLobby} from 'src/app/checkers/checkers_frontend/server/server.js'

//import * as $ from "jquery";
//import { jQuery } from "jquery";

declare var popupFail: any;
declare function joinLobby(
  jquery: JQueryStatic,
  client: Client,
  router: Router,
  popup1: MessagepopupComponent,
  userName: any,
  gameType: any,
  roomCodeonJoin: any,
  createOrJoin: any,
  myAvatar: any,
  userId: any,
  soundService: any,
  ludoWinnerPopup: any,
  langModel1: any,
  entryAmt: any,
  rewardAmt: any,
  tournamentData: any,
  globalDetail: any
): any;
declare function leaveLobbyRoom(): any;
declare function leaveGameRoom(): any;
declare var $: JQueryStatic;
declare var global: any;
declare function onGameMessage(): any;
// declare var Client: Client;
declare var jQuery: any;
declare var PWFroomId: any;
//const client = new Client('ws://localhost:3002');
//const client = new Client("ws://34.197.91.228:3002");
const client = new Client('wss://mojogos.ao/checkers');
// For sign in: ws://34.197.91.228:3001/
@Component({
  selector: 'app-root',
  templateUrl: './checkers.component.html',
  styleUrls: ['./checkers.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckersComponent {
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    console.log('back button clicked');
    // if (
    //   this.global1.LudoGameType == 'PWF' &&
    //   this.global1.createOrJoin == 'join'
    // ) {
    //   console.log(global.lobbyRoom, 'lobbyroom');
    //   if (global.lobbyRoom) {
    //     global.lobbyRoom.leave();
    //   }
    // }
    // confirm("Changes you made may not be saved.");
    setTimeout(() => {
      console.log(global.gameRoom, 'room');
      if (global.gameRoom) {
        global.gameRoom.leave();
      }
      if (global.lobbyRoom) {
        global.lobbyRoom.leave();
      }
    }, 5000);
  }
  //@ViewChild('elements') element: ElementRef | undefined;
  name = 'Angular';
  isFail: any;
  images: Array<{}> = [];
  inviteScreen: any = true;
  gameType: string | undefined = '';
  createOrJoin: string | undefined = '';
  roomCode: string = '';
  PWFCreateorJoin: boolean = false;
  myName: string | undefined = '';
  indexOfEntry: number = 0;
  entryArray = [1.9, 2.9, 3.9, 4.9, 5.9];
  rewardsArray = [3.04, 4.64, 6.24, 7.84, 9.44];
  isRCodeCopied: boolean = false;
  onlineEventBound: any;
  offlineEventBound: any;
  offlinetimeOut: any;
  entry: number = this.entryArray[this.indexOfEntry];
  reward: number = this.rewardsArray[this.indexOfEntry];
  @ViewChild(LudoWinnerPopUpComponent)
  LudoWinnerPopUp: LudoWinnerPopUpComponent = new LudoWinnerPopUpComponent();
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent();
  @ViewChild(LudoSettingBtnComponent)
  ludoSettingBtn: LudoSettingBtnComponent = new LudoSettingBtnComponent();
  constructor(
    private meta: Meta,
    private router: Router,
    public global: GlobalDetails,
    private shareService: ShareonmobileService,
    private soundService: SoundServiceService,
    public langModel: LanguageModel,
    public localDb: LocalDbService
  ) {
    this.gameType = this.global.checkersGameType;
    this.createOrJoin = this.global.createOrJoin;
    this.myName = this.global.userName;
    this.onlineEventBound = this.onlineEventBind.bind(this);
    this.offlineEventBound = this.offlineEventBind.bind(this);
    //console.log(this.global.adimg1,"this.global.adimg1");
    // this.images = [
    //   { path: this.global.adimg1 },
    //   { path: this.global.adimg2 },
    //   { path: this.global.adimg3 },
    //   { path: this.global.adimg4 },
    // ];
    this.images = [
      // {path: './../../assets/slider/slider1.jpg'},
      { path: './../../assets/slider/slider2.jpg' },
      { path: './../../assets/slider/slider3.jpg' },
      { path: './../../assets/slider/slider4.jpg' },
      // {path: './../../assets/slider/slider5.jpg'},
      { path: './../../assets/slider/slider6.jpg' },
      { path: './../../assets/slider/slider7.jpg' },
      { path: './../../assets/slider/slider8.jpg' },
      { path: './../../assets/slider/slider9.jpg' },
      { path: './../../assets/slider/slider10.jpg' },
    ];
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    if (this.offlinetimeOut) {
      clearTimeout(this.offlinetimeOut);
    }
    //Add 'implements OnDestroy' to the class.
    console.log('ngOnDestroycheckers()');
    window.removeEventListener('online', this.onlineEventBound, false);
    window.removeEventListener('offline', this.offlineEventBound, false);
  }
  /* View in fullscreen */
  // isFullScreen = false;
  // openFullscreen(){
  //   if (document.fullscreenElement) {
  //     // If the document is already in fullscreen mode, exit fullscreen
  //     document.exitFullscreen();
  //     this.isFullScreen =false;
  //   } else {
  //     // Otherwise, enter fullscreen mode
  //     document.documentElement.requestFullscreen();
  //     this.isFullScreen =true;
  //   }
  // }

  // ngOnInit(): void {
  //   console.log(document.fullscreenElement)
  //   if (document.fullscreenElement) {
  //     // If the document is already in fullscreen mode, exit fullscreen
  //     //document.exitFullscreen();
  //     this.isFullScreen =true;
  //   } else {
  //     // Otherwise, enter fullscreen mode
  //     //document.documentElement.requestFullscreen();
  //     this.isFullScreen =false;
  //   }
  // }
  ngAfterViewInit() {
    this.LudoWinnerPopUp.gameType = 'Checkers';
    console.log('gameType', this.global.checkersGameType);
    if (this.gameType == 'PWF' && this.createOrJoin == 'create') {
      console.log('gameType : ', this.gameType, ' create');
      var myavatar = document.getElementById('myAvatar')! as HTMLImageElement;
      myavatar.src =
        '../../assets/img/profile/Avatar' + this.global.avatar + '.png';
      document.getElementById('PWFcreate')!.style.display = 'block';
      document.getElementById('gameScreen')!.style.display = 'none';
    } else if (
      (this.gameType == 'PWF' && this.createOrJoin == 'join') ||
      this.gameType == 'RP' ||
      this.gameType == 'Tourny'
    ) {
      console.log('gameType : ', this.gameType, ' join');
      var myavatar = document.getElementById('myAvatar')! as HTMLImageElement;
      myavatar.src =
        '../../assets/img/profile/Avatar' + this.global.avatar + '.png';
      document.getElementById('searchingPlayers')!.style.display = 'block';
      document.getElementById('gameScreen')!.style.display = 'none';
      document.getElementById('PWFcreate')!.style.display = 'none';
    } else if (this.gameType == 'AI') {
      document.getElementById('searchingPlayers')!.style.display = 'none';
      document.getElementById('gameScreen')!.style.display = 'block';
      document.getElementById('PWFcreate')!.style.display = 'none';
    }
    var userName = this.global.userName;
    if (userName === null) {
      console.log('userName is null');
      return;
    } else {
      this.internetConnection();
      if (this.global.checkersGameType == 'Tourny') {
        joinLobby(
          $,
          client,
          this.router,
          this.messagePopUp,
          userName,
          this.global.checkersGameType,
          this.global.roomCode,
          this.global.createOrJoin,
          this.global.avatar,
          this.global.userId,
          this.soundService,
          this.LudoWinnerPopUp,
          this.langModel,
          this.global.checkerEntryAmt,
          this.global.checkerRewardAmt,
          [
            this.global.TournamentStartObject.tournamentStartTime,
            this.global.TournamentStartObject.t_name,
            this.global.TournamentStartObject.tournament_id,
          ],
          this.global
        );
      } else {
        joinLobby(
          $,
          client,
          this.router,
          this.messagePopUp,
          userName,
          this.global.checkersGameType,
          this.global.roomCode,
          this.global.createOrJoin,
          this.global.avatar,
          this.global.userId,
          this.soundService,
          this.LudoWinnerPopUp,
          this.langModel,
          this.global.checkerEntryAmt,
          this.global.checkerRewardAmt,
          [],
          this.global
        );
      }
    }
  }
  settingsClick() {
    this.ludoSettingBtn.gameName = 'Checkers';
    this.ludoSettingBtn.isVisible = true;
    this.ludoSettingBtn.musicBtn = this.global.soundPlaying;
    this.ludoSettingBtn.soundBtn = this.global.sound2Playing;

    this.ludoSettingBtn.heading =
      this.langModel.componentLang.settingComp.title[this.langModel.lang];
    this.ludoSettingBtn.musicText =
      this.langModel.componentLang.settingComp.music[this.langModel.lang];
    this.ludoSettingBtn.soundText =
      this.langModel.componentLang.settingComp.sound[this.langModel.lang];
  }
  onSoundAssign(evt: any) {
    if (evt == 'music') {
      if (this.ludoSettingBtn.musicBtn) {
        this.global.soundPlaying = false;
        this.soundService.stopMusic();
      } else {
        this.global.soundPlaying = true;
        this.soundService.soundName = 'Homepage';
        this.soundService.startMusic();
      }
    } else {
      if (this.ludoSettingBtn.soundBtn) {
        this.global.sound2Playing = false;
        this.soundService.stopeGameSound();
      } else {
        this.global.sound2Playing = true;
      }
    }
    this.localDb.setSoundsDb();
  }
  increaseAmount() {
    this.soundService.playAudio('click');
    if (this.indexOfEntry < this.entryArray.length - 1) {
      this.indexOfEntry = this.indexOfEntry + 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      this.global.checkerEntryAmt = this.entry;
      this.global.checkerRewardAmt = this.reward;
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }
  decreaseAmount() {
    this.soundService.playAudio('click');
    if (this.indexOfEntry > 0) {
      this.indexOfEntry = this.indexOfEntry - 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      this.global.checkerEntryAmt = this.entry;
      this.global.checkerRewardAmt = this.reward;
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }
  onclick() {
    //var userName = prompt("Please enter your name:");
  }
  endGame() {
    // alert("You have quit the game");
    this.messagePopUp.isVisible = true;
    this.messagePopUp.type = 'option';
    this.messagePopUp.popupMessage =
      this.langModel.componentLang.popups.gameQuit[this.langModel.lang];
    this.messagePopUp.closetxt =
      this.langModel.componentLang.popups.no[this.langModel.lang];
    this.messagePopUp.btnText =
      this.langModel.componentLang.popups.yes[this.langModel.lang];
  }
  onClaim(type: any) {
    console.log("onclaim() -> ", type);
    this.soundService.playAudio('click');
    if (type != 'doNotQuit') {
      if (type == 'yes') {
        leaveLobbyRoom();
        leaveGameRoom();
        // this.global.coins = (
        //   this.global.coins - this.global.checkerEntryAmt
        // ).toFixed(2);
        this.router.navigateByUrl('ludoLandingPage');
      }
      // else{
      //   }
      this.messagePopUp.isVisible = false;
      if (type == 'close') {
        console.log("popupFail ", popupFail);
        if (popupFail == 1) {
          this.router.navigateByUrl('ludoLandingPage');
          popupFail = null;
        } else if (popupFail == 2) {
          this.router.navigateByUrl('ludoLandingPage');
          popupFail = null;
        }else{
          this.router.navigateByUrl('landingPage');
        }
        // if(this.isFail == 'successfull') this.router.navigateByUrl('homePage');
        // else if(this.isFail == 'error')this.router.navigateByUrl('landingPage');
        this.isFail = '';
      }
    }
  }
  onClaim1(type: any) {
    if (type == 'goToLobby') {
      this.soundService.playAudio('click');
      this.LudoWinnerPopUp.isVisible = false;
      this.router.navigateByUrl('ludoLandingPage');
    } else if (type == 'goToHome') {
      leaveGameRoom();
      leaveLobbyRoom();
      this.soundService.playAudio('click');
      this.LudoWinnerPopUp.isVisible = false;

      this.router.navigateByUrl('homePage');
    }
  }
  endGame1() {
    //this.router.navigateByUrl('ludoRandomPlay');
    this.messagePopUp.isVisible = true;
    this.messagePopUp.type = 'option';
    this.messagePopUp.popupMessage =
      this.langModel.componentLang.popups.roomRemove[this.langModel.lang];
    this.messagePopUp.closetxt =
      this.langModel.componentLang.popups.no[this.langModel.lang];
    this.messagePopUp.btnText =
      this.langModel.componentLang.popups.yes[this.langModel.lang];
  }
  shareCode() {
    this.soundService.playAudio('click');
    if (PWFroomId != '') {
      if (this.global.onMobile == true)
        this.shareService.openSharePvtRoom(PWFroomId);
      if (this.global.onMobile == false) this.isRCodeCopied = true;
    }
  }
  elem: any;

  internetConnection() {
    window.addEventListener('offline', this.offlineEventBound, false);

    window.addEventListener('online', this.onlineEventBound, false);
  }
  async onlineEventBind() {
    //alert('online');
    if (global.gameRoom != null) {
      this.messagePopUp.isVisible = true;
      this.messagePopUp.type = 'doNotQuit';
      this.messagePopUp.popupMessage =
        this.langModel.componentLang.popups.backConnection[this.langModel.lang];
      this.messagePopUp.closetxt =
        this.langModel.componentLang.popups.close[this.langModel.lang];
      await client.reconnect(global.roomID, global.mySessionID).then(
        (roomObject) => {
          if (this.offlinetimeOut) {
            clearTimeout(this.offlinetimeOut);
          }
          global.gameRoom = roomObject;
          console.log('Reconnect successfull', roomObject.id);
          onGameMessage();
        },
        (error) => {
          if (this.offlinetimeOut) {
            clearTimeout(this.offlinetimeOut);
          }
          this.router.navigateByUrl('homePage');
          console.log('/reconnect error', error);
        }
      );
    }
  }
  offlineEventBind() {
    //alert('offline');
    console.log('global values -> ', global, '\n', global.gameRoom);
    if (global.gameRoom != null) {
      this.messagePopUp.isVisible = true;
      this.messagePopUp.type = 'doNotQuit';
      this.messagePopUp.popupMessage =
        this.langModel.componentLang.popups.noConnection[this.langModel.lang];
      this.messagePopUp.closetxt =
        this.langModel.componentLang.popups.close[this.langModel.lang];
      this.offlinetimeOut = setTimeout(() => {
        clearTimeout(this.offlinetimeOut);
        this.router.navigateByUrl('homePage');
      }, 15000);
    }
  }

  // checkersPopup(message: any){
  //   this.messagePopUp.isVisible= true;
  //   this.messagePopUp.popupMessage = JSON.stringify(message);
  // }
}
