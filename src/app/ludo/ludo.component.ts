import { jsDocComment } from '@angular/compiler';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'colyseus.js';
import { LocalDbService } from 'src/services/local-db.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { LudoSettingBtnComponent } from '../ludo-setting-btn/ludo-setting-btn.component';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
import { ShareonmobileService } from '../shareonmobile.service';
import { LudoWinnerPopUpComponent } from './ludo-winner-pop-up/ludo-winner-pop-up.component';
import { consoleTestResultHandler } from 'tslint/lib/test';

// declare const clientDeclare: any;
const CONSTANTS = {
  defaultColors: ['red', 'green', 'yellow', 'blue'],
};

//red-yellow
//blue-red
//green-blue
//yellow-green
let GAMEDATA = {
  playerIds: [],
  playerIndex: '',
  movableGottis: [],
  currentPlayerColor: '',
};

var global: any = {
  user: [],
  myName: null,
  myId: null,
  opponentName: null,
  opponentName1: null,
  opponentName2: null,
  points: 1000,
  lobbyPlayers: [],
  players: [{}, {}],
  myself: {},
  gameCards: [],
  player1Id: null,
  player2ID: null,
  playercount: 0,
  mySessionID: null,
  myPiece: 0,
  otherPiece: 0,
  gameRoom: null,
  lobbyRoom: null,
};

@Component({
  selector: 'app-ludo',
  templateUrl: './ludo.component.html',
  styleUrls: ['./ludo.component.css'],
})
export class LudoComponent implements OnInit {
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    console.log('back button clicked');
    if (
      this.global1.LudoGameType == 'PWF' &&
      this.global1.createOrJoin == 'join'
    ) {
      console.log(global.lobbyRoom, 'lobbyroom');
      if (global.lobbyRoom) {
        global.lobbyRoom.leave();
      }
    }
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
  eventListenerdone: boolean = false;
  myName: string | undefined = '';
  oppOne: string | undefined = '';
  oppTwo: string | undefined = '';
  oppThree: string | undefined = '';
  PWFroomId: any;
  myTurn: boolean = false;
  message: any;
  myColor: string = '';
  tourWaitPlayers: string = '';
  sixArrayRecived: boolean = false;
  sixArray = [];
  allGottis = {};
  gottisInside = [];
  GottiMovementAmounts = {};
  isConnected = true;
  noInternetConnection: boolean = false;
  availablePlayers: any;
  TournamenentEnded = false;
  timeOutForReconnection: any;
  onlineEventBound: any;
  offlineEventBound: any;
  newRoundStart: boolean = false;
  upperPlayer: any = null;
  topPanelID: any = null;
  lowerPlayer: any = null;
  Canvas: any = null;
  client: Client;
  isRemoveCopyText = false;
  tournyOnePlayerWinner = false;
  firstTimePlay: boolean = true;
  gameDone: boolean = false;
  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent();
  @ViewChild(LudoWinnerPopUpComponent)
  LudoWinnerPopUp: LudoWinnerPopUpComponent = new LudoWinnerPopUpComponent();

  @ViewChild(LudoSettingBtnComponent)
  ludoSettingBtn: LudoSettingBtnComponent = new LudoSettingBtnComponent();

  constructor(
    public global1: GlobalDetails,
    private router: Router,
    private shareService: ShareonmobileService,
    private soundService: SoundServiceService,
    public langModel: LanguageModel,
    public localDb: LocalDbService
  ) {
    this.gameDone = false;
    this.client = new Client('wss://mojogos.ao/ludo');
    // new Client('ws://localhost:3003');
    GAMEDATA = {
      playerIds: [],
      playerIndex: '',
      movableGottis: [],
      currentPlayerColor: '',
    };
    global = {
      user: [],
      myName: null,
      myId: null,
      opponentName: null,
      opponentName1: null,
      opponentName2: null,
      points: 1000,
      lobbyPlayers: [],
      players: [{}, {}],
      myself: {},
      gameCards: [],
      player1Id: null,
      player2ID: null,
      playercount: 0,
      mySessionID: null,
      myPiece: 0,
      otherPiece: 0,
      gameRoom: null,
      lobbyRoom: null,
    };
    this.onlineEventBound = this.onlineEventBind.bind(this);
    this.offlineEventBound = this.offlineEventBind.bind(this);
    window.addEventListener('offline', this.offlineEventBound, false);

    window.addEventListener('online', this.onlineEventBound, false);

    console.log('player no.', this.global1.gottiId);
    this.myName = this.global1.userName;
    console.log('player name.', this.global1.userName);
    console.log(
      'gameType = >',
      this.global1.createOrJoin,
      ' ',
      this.global1.LudoGameType
    );
    try {
      if (this.global1.createOrJoin == 'join') {
        this.global1.roomCode;
      }
      this.joinLobby(this.global1.gottiId, this.client);
    } catch (e) {
      console.log(e);
    }
  }
  elem: any;
  fullscreenbool = true;
  /* View in fullscreen */
  isFullScreen = false;
  openFullscreen() {
    if (document.fullscreenElement) {
      // If the document is already in fullscreen mode, exit fullscreen
      document.exitFullscreen();
      this.isFullScreen = false;
    } else {
      // Otherwise, enter fullscreen mode
      document.documentElement.requestFullscreen();
      this.isFullScreen = true;
    }
  }

  ngOnInit(): void {
    // console.log(document.fullscreenElement)
    // if (document.fullscreenElement) {
    //   // If the document is already in fullscreen mode, exit fullscreen
    //   //document.exitFullscreen();
    //   this.isFullScreen =true;
    // } else {
    //   // Otherwise, enter fullscreen mode
    //   //document.documentElement.requestFullscreen();
    //   this.isFullScreen =false;
    // }
  }
  ngOnDestroy(): void {
    try {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      if (this.timeOutForReconnection) {
        console.log('inside clearTimeout if() ');
        clearTimeout(this.timeOutForReconnection);
      }
      console.log('ngOnDestroyLudo()');

      window.removeEventListener('online', this.onlineEventBound, false);
      window.removeEventListener('offline', this.offlineEventBound, false);
      this.removeHtmlGameEvents();
    } catch (e) {
      console.log('error in ngOnDestroy->\n', e);
    }
  }
  async onlineEventBind() {
    //alert('online');
    if (global.gameRoom != null) {
      console.log('inside the online event0');

      this.messagePopUp.isVisible = true;
      this.messagePopUp.popupMessage =
        this.langModel.componentLang.popups.backConnection[this.langModel.lang];
      this.messagePopUp.closetxt =
        this.langModel.componentLang.popups.close[this.langModel.lang];
      this.messagePopUp.type = 'doNotQuit';
      console.log('inside the online event1');

      await this.client.reconnect(global.gameRoom.id, global.myId).then(
        (roomObject) => {
          console.log('Reconnect successfull', roomObject);
          if (this.timeOutForReconnection) {
            console.log('inside clearTimeout if() ');
            clearTimeout(this.timeOutForReconnection);
          }

          var timeOut = setTimeout(() => {
            this.messagePopUp.isVisible = false;
            clearTimeout(timeOut);
          }, 1500);
          global.gameRoom = roomObject;
          this.onGameMessage(roomObject);
        },
        (error) => {
          if (this.timeOutForReconnection) {
            console.log('inside clearTimeout if() ');
            clearTimeout(this.timeOutForReconnection);
          }
          this.router.navigateByUrl('homePage');
          console.log(error);
        }
      );
    }
  }
  checkwidth() {
    if (window.innerWidth / window.innerHeight <= 0.65) {
      return { transform: 'translateY(0) scale(1)' };
    } else return { transform: 'translateY(-18%) scale(0.6)' };
  }
  offlineEventBind() {
    //alert('offline');onLea
    if (global.gameRoom != null) {
      // global.gameRoom.connection.close();
      console.log('inside the offline event0');
      this.messagePopUp.isVisible = true;
      this.messagePopUp.popupMessage =
        this.langModel.componentLang.popups.noConnection[this.langModel.lang];
      this.messagePopUp.closetxt =
        this.langModel.componentLang.popups.close[this.langModel.lang];
      this.messagePopUp.type = 'doNotQuit';
      console.log('inside the offline event1');
      this.timeOutForReconnection = setTimeout(() => {
        this.messagePopUp.isVisible = false;
        clearTimeout(this.timeOutForReconnection);
        this.router.navigateByUrl('homePage');
      }, 20000);
    }
  }
  ngAfterViewInit(): void {
    // document.querySelector('.current-numbers')!.classList.add('hidden');
    //will monitor internet connection.
    this.LudoWinnerPopUp.langModel = this.langModel;
    this.LudoWinnerPopUp.gameType = 'Ludo';
    if (
      this.global1.LudoGameType == 'PWF' &&
      this.global1.createOrJoin == 'create'
    ) {
      document
        .querySelector('.game-wrapInviteFriends')!
        .classList.remove('hidden');
      document.querySelector('.ludo-wrap')!.classList.add('hidden');
    } else if (
      this.global1.LudoGameType == 'PWF' &&
      this.global1.createOrJoin == 'join'
    ) {
      console.log('join Game');
      var myavatar = document.getElementById('myAvatar')! as HTMLImageElement;
      myavatar.src =
        '../../assets/img/profile/Avatar' + this.global1.avatar + '.png';
      document.querySelector('.oppOne')!.classList.add('hidden');
      document.querySelector('.oppThree')!.classList.add('hidden');
    } else {
      var myavatar = document.getElementById('myAvatar')! as HTMLImageElement;
      myavatar.src =
        '../../assets/img/profile/Avatar' + this.global1.avatar + '.png';
      if (this.global1.gottiId == 2) {
        document.querySelector('.oppTwo')!.classList.add('heartbeat');
        document.querySelector('.oppOne')!.classList.add('hidden');
        document.querySelector('.oppThree')!.classList.add('hidden');
      } else if (this.global1.gottiId == 3) {
        document.querySelector('.oppOne')!.classList.add('heartbeat');
        document.querySelector('.oppThree')!.classList.add('heartbeat');
        document.querySelector('.oppTwo')!.classList.add('hidden');
      } else if (this.global1.gottiId == 4) {
        document.querySelector('.oppTwo')!.classList.add('heartbeat');
        document.querySelector('.oppOne')!.classList.add('heartbeat');
        document.querySelector('.oppThree')!.classList.add('heartbeat');
      }
    }
  }
  settingsClick() {
    this.ludoSettingBtn.gameName = 'Ludo';
    this.ludoSettingBtn.isVisible = true;
    this.ludoSettingBtn.musicBtn = this.global1.soundPlaying;
    this.ludoSettingBtn.soundBtn = this.global1.sound2Playing;

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
        this.global1.soundPlaying = false;
        this.soundService.stopMusic();
      } else {
        this.global1.soundPlaying = true;
        this.soundService.soundName = 'Homepage';
        this.soundService.startMusic();
      }
    } else {
      if (this.ludoSettingBtn.soundBtn) {
        this.global1.sound2Playing = false;
        this.soundService.stopeGameSound();
      } else {
        this.global1.sound2Playing = true;
      }
    }
    this.localDb.setSoundsDb();
  }
  // bgmode(evt:any){
  //   // on background mode
  // }
  // bgmodeback(evt:any){
  //   this.messagePopUp.isVisible= true;
  //   this.messagePopUp.popupMessage = this.langModel.componentLang.popups.gameOver[this.langModel.lang];
  //   this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
  //   //this.router.navigateByUrl('homePage');
  //   // resume from bg mode
  // }
  // checkConnectivity(){
  //   if (window.navigator.onLine) {
  //     console.log("Back online");
  //   }
  //   else{
  //     alert("Check your connection.");
  //   }
  // }

  endGame1() {
    //this.router.navigateByUrl('ludoRandomPlay');
    this.messagePopUp.isVisible = true;
    this.messagePopUp.popupMessage =
      this.langModel.componentLang.popups.roomRemove[this.langModel.lang];
    this.messagePopUp.closetxt =
      this.langModel.componentLang.popups.no[this.langModel.lang];
    this.messagePopUp.btnText =
      this.langModel.componentLang.popups.yes[this.langModel.lang];
    this.messagePopUp.type = 'option';
    //this.leaveLobbyRoom();
  }
  onClaim1(type: any) {
    console.log('type onclaim 1 -> ' + type);
    if (type == 'goToLobby') {
      console.log('inside gotoLobby');
      this.soundService.playAudio('click');
      this.LudoWinnerPopUp.isVisible = false;
      //window.location.reload();
      if(this.global1.LudoGameType == 'AI'){
        this.router.navigateByUrl('landingPage');
      }else{
      // document.querySelector("#startGameDialogue")!.classList.remove("hidden");
      this.router.navigateByUrl('ludoRandomPlay');
      }
      console.log('inside gotoLobby1');
    } else if (type == 'goToHome') {
      console.log('inside goToHome');
      this.soundService.playAudio('click');
      this.LudoWinnerPopUp.isVisible = false;
      this.router.navigateByUrl('homePage');
    }
  }
  onClaim(type: any) {
    this.soundService.playAudio('click');
    console.log('Outsid doNotQuit ', type);
    if (type != 'doNotQuit') {
      console.log('Insid doNotQuit');
      if (type == 'yes') {
        if (global.gameRoom != null) {
          global.gameRoom.leave();
        }

        this.leaveLobbyRoom();
        // this.global1.coins = (
        //   this.global1.coins - this.global1.ludoEntryAmt
        // ).toFixed(2);
        this.router.navigateByUrl('ludoLandingPage');
      }

      if (type == 'close' && this.messagePopUp.type != 'option') {
        this.router.navigateByUrl('ludoLandingPage');
      }
      this.messagePopUp.isVisible = false;
    }
  }
  leaveLobbyRoom() {
    if (global.lobbyRoom != null) {
      console.log('leaving lobby room');
      global.lobbyRoom.leave();
      this.router.navigateByUrl('homePage');
    }
  }
  back(num: any) {
    if (num == 0) {
      this.messagePopUp.isVisible = true;
      this.messagePopUp.popupMessage =
        this.langModel.componentLang.popups.gameQuit[this.langModel.lang];
      this.messagePopUp.closetxt =
        this.langModel.componentLang.popups.no[this.langModel.lang];
      this.messagePopUp.btnText =
        this.langModel.componentLang.popups.yes[this.langModel.lang];
      this.messagePopUp.type = 'option';
      // this.router.navigateByUrl('ludoRandomPlay');
    } else if (num == 1) {
      this.router.navigateByUrl('ludoLandingPage');
    } else if (num == 2) {
      this.messagePopUp.isVisible = true;
      this.messagePopUp.popupMessage =
        this.langModel.componentLang.popups.gameQuit[this.langModel.lang];
      this.messagePopUp.closetxt =
        this.langModel.componentLang.popups.no[this.langModel.lang];
      this.messagePopUp.btnText =
        this.langModel.componentLang.popups.yes[this.langModel.lang];
      this.messagePopUp.type = 'option';
      // if (global.lobbyRoom != null) global.lobbyRoom.leave();
      // if (global.gameRoom != null) global.gameRoom.leave();
      // this.router.navigateByUrl('ludoLandingPage');
    }
  }
  // Gotticlicked(event: any) {
  //   console.log('event---------------->', event);
  //   //this.checkConnectivity();
  //   let gottiId = event.target.id;

  //   console.log(
  //     'gottiId',
  //     gottiId,
  //     ' sixArrayRecived-> ',
  //     this.sixArrayRecived
  //   );
  //   if (this.sixArrayRecived == false) {
  //     if (event.srcElement.className.includes('gotti')) {
  //       console.log('hereee ', this.eventListenerdone);
  //       if (this.eventListenerdone == true) {
  //         console.log('hereee2 ');
  //         this.eventListenerdone = false;
  //         global.gameRoom.send('gottiClicked', { id: gottiId });
  //       }
  //     }
  //   } else if (this.sixArrayRecived == true) {
  //     this.sixArrayRecived = false;
  //     console.log('six Array recived write the logic here ', gottiId);
  //     if (this.gottisInside.length >= 1) {
  //       this.gottisInside.forEach((id: string) => {
  //         console.log(id);
  //         if (this.eventListenerdone == true) {
  //           if (gottiId == id) {
  //             this.eventListenerdone = false;
  //             console.log('sending gotti to move');
  //             var divChild: HTMLElement;
  //             for (const [key1, value1] of Object.entries(
  //               this.GottiMovementAmounts
  //             )) {
  //               console.log(key1, value1);
  //               var postionforPopup: string;
  //               for (const [key, value] of Object.entries(this.allGottis)) {
  //                 console.log(key, value);
  //                 if (key1 == key) {
  //                   postionforPopup = String(value);
  //                   console.log('position for popup -> ', postionforPopup);
  //                   divChild = document.getElementById(postionforPopup)!
  //                     .children[1] as HTMLElement;
  //                   divChild.style.display = 'none';
  //                   console.log('divChild -> ', divChild);
  //                 }
  //               }
  //             }
  //             global.gameRoom.send('gottiClicked1', {
  //               id: gottiId,
  //               movementAmount: 6,
  //             });
  //           }
  //         }
  //       });
  //     }
  //     if (this.eventListenerdone == true) {
  //       this.eventListenerdone = false;

  //       console.log('Inside eventListenerDone:');
  //       if (
  //         gottiId == 'firstNumber' ||
  //         gottiId == 'secondNumber' ||
  //         gottiId == 'thirdNumber'
  //       ) {
  //         //|| event.target.firstChild.id == 'firstNumber'
  //         var movementAmount = parseInt(event.target.innerText);
  //         var gottiId1 = '';
  //         console.log('Inside first or second or third:');
  //         if (event.path[0].localName == 'span') {
  //           console.log('Inside span:');
  //           for (const [key, value] of Object.entries(this.allGottis)) {
  //             console.log(
  //               'key and event path: ',
  //               Number(value),
  //               Number(event.path[3].id)
  //             );
  //             if (Number(value) == Number(event.path[3].id)) {
  //               gottiId1 = key;
  //             }
  //           }
  //           //gottiId1 = event.target.parentElement.parentElement.parentElement.lastChild.id;
  //         } else if (event.path[0].localName == 'div') {
  //           //gottiId1 = event.target.parentElement.parentElement.lastChild.id;
  //           console.log('Inside div:');
  //           for (const [key, value] of Object.entries(this.allGottis)) {
  //             console.log(
  //               'key and event path: ',
  //               Number(value),
  //               Number(event.path[3].id)
  //             );
  //             if (Number(value) == Number(event.path[2].id)) {
  //               gottiId1 = key;
  //             }
  //           }
  //         }
  //         console.log(
  //           'gottiId => ',
  //           gottiId1,
  //           ' movementAmount => ',
  //           movementAmount
  //         );

  //         if (
  //           gottiId1.includes('yellow') ||
  //           gottiId1.includes('red') ||
  //           gottiId1.includes('green') ||
  //           gottiId1.includes('blue')
  //         ) {
  //           global.gameRoom.send('gottiClicked1', {
  //             id: gottiId1,
  //             movementAmount: movementAmount,
  //           });
  //         }
  //         var divChild: HTMLElement;
  //         for (const [key1, value1] of Object.entries(
  //           this.GottiMovementAmounts
  //         )) {
  //           console.log(key1, value1);
  //           var postionforPopup: string;
  //           for (const [key, value] of Object.entries(this.allGottis)) {
  //             console.log(key, value);
  //             if (key1 == key) {
  //               postionforPopup = String(value);
  //               console.log('position for popup -> ', postionforPopup);
  //               divChild = document.getElementById(postionforPopup)!
  //                 .children[1] as HTMLElement;
  //               divChild.style.display = 'none';
  //               console.log('divChild -> ', divChild);
  //             }
  //           }
  //         }
  //       } else {
  //         console.log('Inside else of firstNumber secondNumber thirdNumber:');
  //         this.eventListenerdone = true;
  //         this.sixArrayRecived = true;
  //       }
  //     }
  //   }
  // }
  Gotticlicked(event: any) {
    console.log('event---------------->', event);
    //this.checkConnectivity();
    let gottiId = event.target.id;

    console.log(
      'gottiId',
      gottiId,
      ' sixArrayRecived-> ',
      this.sixArrayRecived
    );
    if (this.sixArrayRecived == false) {
      if (event.srcElement.className.includes('gotti')) {
        console.log('hereee ', this.eventListenerdone);
        if (this.eventListenerdone == true) {
          console.log('hereee2 ');
          this.eventListenerdone = false;
          global.gameRoom.send('gottiClicked', { id: gottiId });
        }
      }
    } else if (this.sixArrayRecived == true) {
      this.sixArrayRecived = false;
      console.log('six Array recived write the logic here ', gottiId);
      if (this.gottisInside.length >= 1) {
        this.gottisInside.forEach((id: string) => {
          console.log(id);
          if (this.eventListenerdone == true) {
            if (gottiId == id) {
              this.eventListenerdone = false;
              console.log('sending gotti to move');
              var divChild: HTMLElement;
              for (const [key1, value1] of Object.entries(
                this.GottiMovementAmounts
              )) {
                console.log(key1, value1);
                var postionforPopup: string;
                for (const [key, value] of Object.entries(this.allGottis)) {
                  console.log(key, value);
                  if (key1 == key) {
                    postionforPopup = String(value);
                    console.log('position for popup -> ', postionforPopup);
                    divChild = document.getElementById(postionforPopup)!
                      .children[1] as HTMLElement;
                    divChild.style.display = 'none';
                    console.log('divChild -> ', divChild);
                  }
                }
              }
              global.gameRoom.send('gottiClicked1', {
                id: gottiId,
                movementAmount: 6,
              });
            }
          }
        });
      }
      if (this.eventListenerdone == true) {
        this.eventListenerdone = false;

        console.log('Inside eventListenerDone:');
        if (
          gottiId == 'firstNumber' ||
          gottiId == 'secondNumber' ||
          gottiId == 'thirdNumber'
        ) {
          //|| event.target.firstChild.id == 'firstNumber'
          var movementAmount = parseInt(event.target.innerText);
          var gottiId1 = '';
          console.log('Inside first or second or third:');
          if (event.path) {
            console.log('Inside path available');
            if (event.path[0].localName == 'span') {
              console.log('Inside span:');
              for (const [key, value] of Object.entries(this.allGottis)) {
                console.log(
                  'key and event path: ',
                  Number(value),
                  Number(event.path[3].id)
                );
                if (Number(value) == Number(event.path[3].id)) {
                  gottiId1 = key;
                }
              }
              //gottiId1 = event.target.parentElement.parentElement.parentElement.lastChild.id;
            } else if (event.path[0].localName == 'div') {
              //gottiId1 = event.target.parentElement.parentElement.lastChild.id;
              console.log('Inside div:');
              for (const [key, value] of Object.entries(this.allGottis)) {
                console.log(
                  'key and event path: ',
                  Number(value),
                  Number(event.path[3].id)
                );
                if (Number(value) == Number(event.path[2].id)) {
                  gottiId1 = key;
                }
              }
            }
          } else {
            console.log('Inside path not available', event.srcElement.id);
            // console.log(
            //   'hererererere ',
            //   document.getElementById(String(event.srcElement.id))
            //     ?.parentElement?.parentElement?.id
            // );
            if (event.srcElement.localName == 'span') {
              console.log('Inside span:');
              for (const [key, value] of Object.entries(this.allGottis)) {
                console.log(
                  'key and event path parent parent : ',
                  Number(value),
                  Number(
                    event.srcElement.parentElement.parentElement.parentElement
                      .id
                  )
                );
                if (
                  Number(value) ==
                  Number(
                    event.srcElement.parentElement.parentElement.parentElement
                      .id
                  )
                ) {
                  gottiId1 = key;
                }
              }
              //gottiId1 = event.target.parentElement.parentElement.parentElement.lastChild.id;
            } else if (event.srcElement.localName == 'div') {
              //gottiId1 = event.target.parentElement.parentElement.lastChild.id;
              console.log('Inside div:');
              for (const [key, value] of Object.entries(this.allGottis)) {
                console.log(
                  'key and event path: ',
                  Number(value),
                  Number(event.srcElement.parentElement.parentElement.id)
                );
                if (
                  Number(value) ==
                  Number(event.srcElement.parentElement.parentElement.id)
                ) {
                  gottiId1 = key;
                }
              }
            }
          }
          console.log(
            'gottiId => ',
            gottiId1,
            ' movementAmount => ',
            movementAmount
          );

          if (
            gottiId1.includes('yellow') ||
            gottiId1.includes('red') ||
            gottiId1.includes('green') ||
            gottiId1.includes('blue')
          ) {
            global.gameRoom.send('gottiClicked1', {
              id: gottiId1,
              movementAmount: movementAmount,
            });
          }
          var divChild: HTMLElement;
          for (const [key1, value1] of Object.entries(
            this.GottiMovementAmounts
          )) {
            console.log(key1, value1);
            var postionforPopup: string;
            for (const [key, value] of Object.entries(this.allGottis)) {
              console.log(key, value);
              if (key1 == key) {
                postionforPopup = String(value);
                console.log('position for popup -> ', postionforPopup);
                divChild = document.getElementById(postionforPopup)!
                  .children[1] as HTMLElement;
                divChild.style.display = 'none';
                console.log('divChild -> ', divChild);
              }
            }
          }
        } else {
          console.log('Inside else of firstNumber secondNumber thirdNumber:');
          this.eventListenerdone = true;
          this.sixArrayRecived = true;
        }
      }
    }
  }
  DiceClicked(e: any) {
    //this.checkConnectivity();
    //this.soundService.playAudio('Dicesound');

    if (
      e.target.className == 'roll1' ||
      e.target.className == 'roll2' ||
      e.target.className == 'roll3' ||
      e.target.className == 'roll4' ||
      e.target.className.includes('gif')
    ) {
      console.log('roll please');
      global.gameRoom.send('roll', 'hey');
    }
  }
  playAgain() {
    this.soundService.playAudio('click');
    document.querySelector('#endGameDialogue div')!.innerHTML = '';
    document.querySelector('#endGameDialogue')!.classList.add('hidden');
    if(this.global1.LudoGameType == 'AI'){
      this.router.navigateByUrl('landingPage');
    }else{
      
    // document.querySelector("#startGameDialogue")!.classList.remove("hidden");
    this.router.navigateByUrl('ludoRandomPlay');
    }
    
  }
  isRCodeCopied: boolean = false;
  shareCode() {
    if (this.PWFroomId != '') {
      if (this.global1.onMobile == true)
        this.shareService.openSharePvtRoom(this.PWFroomId);
      if (this.global1.onMobile == false) this.isRCodeCopied = true;
    }
  }
  startGamePWF() {
    global.lobbyRoom.send('startGame', 'Start');
  }
  async joinLobby(playerCount: any, client: Client) {
    //global.userName = prompt("Please enter your name:");
    global.userName = this.global1.userName;
    if (global.userName == null) {
      this.router.navigateByUrl('ludoRandomPlay');
      return;
    }
    global.dbId = this.getRndInteger(1000, 100000);
    global.lobbyRoom = null;

    if (this.global1.LudoGameType == 'RP') {
      try {
        if (playerCount == 2) {
          await client
            .joinOrCreate('ludo2PlayerLobbyRoom', {
              userName: global.userName,
              dbId: global.dbId,
              avatar: this.global1.avatar,
              playerCount: playerCount,
              coin: this.global1.ludoEntryAmt,
            })
            .then((room) => {
              console.log('here in lobby');
              global.lobbyRoom = room;
              room.onMessage('broadcasted', (message: any) => {
                console.log('broadcasted by different rooms');
              });
              room.onMessage('waitingForPlayers', (message) => {
                console.log(message.num);
                console.log('mySession Id', message.sessionId);
                global.myId = message.sessionId;
              });

              room.onMessage('ROOMCONNECT', (message) => {
                //gamePlay();
                document
                  .querySelector('.ludo-exit-btn-searchplayer')!
                  .classList.add('hidden');
                var roomid = message.roomId;
                console.log('room Id ------->', roomid);
                console.log('playerCount ------->', message.playerCount);

                if (message.playerCount == 2) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  this.oppTwo = oppopnentName;
                  var myavatar = document.getElementById(
                    'oppTwoAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  global.opponentName = oppopnentName;
                }
                var sessionId = message.oppSessionId;
                console.log('sessionId ------->', sessionId);
                global.lobbyRoom = null;
                this.joinGameRoom(message);
                room.leave();
              });
            })
            .catch((error) => {
              console.log('roor in 2 player lobby ', error);
            });
        } else if (playerCount == 3) {
          await client
            .joinOrCreate('ludo3PlayerLobbyRoom', {
              userName: global.userName,
              dbId: global.dbId,
              avatar: this.global1.avatar,
              playerCount: playerCount,
              coin: this.global1.ludoEntryAmt,
            })
            .then((room) => {
              console.log('here in lobby');
              global.lobbyRoom = room;
              room.onMessage('waitingForPlayers', (message) => {
                console.log(message.num);
                console.log('mySession Id', message.sessionId);
                global.myId = message.sessionId;
              });
              room.onMessage('broadcasted', (message) => {
                console.log('broadcasted by different rooms2');
              });
              room.onMessage('ROOMCONNECT', (message) => {
                //gamePlay();
                document
                  .querySelector('.ludo-exit-btn-searchplayer')!
                  .classList.add('hidden');
                var roomid = message.roomId;
                console.log('room Id ------->', roomid);
                console.log('playerCount ------->', message.playerCount);

                if (message.playerCount == 3) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  this.oppOne = oppopnentName;
                  this.oppThree = oppopnentName1;
                  var myavatar = document.getElementById(
                    'oppOneAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  var myavatar1 = document.getElementById(
                    'oppThreeAvatar'
                  )! as HTMLImageElement;
                  myavatar1.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar1 +
                    '.png';
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                }
                var sessionId = message.oppSessionId;
                console.log('sessionId ------->', sessionId);

                global.lobbyRoom = null;
                this.joinGameRoom(message);
                room.leave();
              });
            });
        } else if (playerCount == 4) {
          await client
            .joinOrCreate('ludo4PlayerLobbyRoom', {
              userName: global.userName,
              dbId: global.dbId,
              avatar: this.global1.avatar,
              playerCount: playerCount,
              coin: this.global1.ludoEntryAmt,
            })
            .then((room) => {
              console.log('here in lobby');
              global.lobbyRoom = room;
              room.onMessage('waitingForPlayers', (message) => {
                console.log(message.num);
                console.log('mySession Id', message.sessionId);
                global.myId = message.sessionId;
              });

              room.onMessage('ROOMCONNECT', (message) => {
                //gamePlay();
                var roomid = message.roomId;
                document
                  .querySelector('.ludo-exit-btn-searchplayer')!
                  .classList.add('hidden');
                console.log('room Id ------->', roomid);
                console.log('playerCount ------->', message.playerCount);

                if (message.playerCount == 4) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  var oppopnentName2 = message.oppName2;
                  console.log('oppopnentName ------->', oppopnentName2);
                  this.oppOne = oppopnentName;
                  this.oppTwo = oppopnentName1;
                  this.oppThree = oppopnentName2;
                  var myavatar = document.getElementById(
                    'oppOneAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  var myavatar1 = document.getElementById(
                    'oppTwoAvatar'
                  )! as HTMLImageElement;
                  myavatar1.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar1 +
                    '.png';
                  var myavatar2 = document.getElementById(
                    'oppThreeAvatar'
                  )! as HTMLImageElement;
                  myavatar2.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar2 +
                    '.png';
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                  global.opponentName2 = oppopnentName2;
                }
                var sessionId = message.oppSessionId;
                console.log('sessionId ------->', sessionId);
                global.lobbyRoom = null;
                this.joinGameRoom(message);
                room.leave();
              });
            });
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (this.global1.LudoGameType == 'PWF') {
      if (this.global1.createOrJoin == 'create') {
        try {
          console.log('create Room');
          await client
            .create('playWithFriends', {
              userName: global.userName,
              dbId: global.dbId,
              avatar: this.global1.avatar,
              playerCount: playerCount,
              coin: this.global1.ludoEntryAmt,
              entry: this.global1.ludoRewardAmt,
              reward: this.global1.ludoEntryAmt,
            })
            .then((room) => {
              console.log('here in crete lobby', room.id);
              this.PWFroomId = room.id;
              document.getElementById('roomCode')!.textContent = this.PWFroomId;
              global.lobbyRoom = room;
              global.lobbyRoom.onMessage('roomId', (message: any) => {
                console.log('pwf create room Id -> ', this.PWFroomId);

                console.log('Room Id -> ', this.PWFroomId);
              });
              room.onMessage('waitingForPlayers', (message) => {
                console.log(message.num);
                console.log('mySession Id', message.sessionId);
                global.myId = message.sessionId;
              });
              room.onMessage('allPlayerLeftPWF', () => {
                console.log('all player left in start');
                this.messagePopUp.isVisible = true;
                this.messagePopUp.popupMessage = ' All Player Left !';
                this.messagePopUp.closetxt =
                  this.langModel.componentLang.popups.close[
                    this.langModel.lang
                  ];
                if (global.gameRoom) {
                  global.gameRoom.leave();
                }
                if (global.lobbyRoom) {
                  global.lobbyRoom.leave();
                }
              });
              room.onMessage('ROOMCONNECT', (message) => {
                //gamePlay();
                this.message = message;
                // document.querySelector('.game-wrapInviteFriends')!.classList.add('hidden');
                // document.querySelector('.ludo-wrap')!.classList.remove('hidden');
                document
                  .querySelector('.startGamePWF')!
                  .classList.remove('hidden');
                this.isRemoveCopyText = true;

                var roomid = message.roomId;
                console.log('room Id ------->', roomid);
                console.log('playerCount ------->', message.playerCount);

                if (message.playerCount == 2) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  this.oppTwo = oppopnentName;
                  global.opponentName = oppopnentName;
                } else if (message.playerCount == 3) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  this.oppOne = oppopnentName;
                  this.oppThree = oppopnentName1;
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                } else if (message.playerCount == 4) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  var oppopnentName2 = message.oppName2;
                  console.log('oppopnentName ------->', oppopnentName2);
                  this.oppOne = oppopnentName;
                  this.oppTwo = oppopnentName1;
                  this.oppThree = oppopnentName2;
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                  global.opponentName2 = oppopnentName2;
                }
                var sessionId = message.oppSessionId;
                console.log('room connect ------->', message);
                // room.leave();
                // global.lobbyRoom = null;
                // this.joinGameRoom(message);
              });
              room.onMessage('startgame', () => {
                if (global.lobbyRoom != null) global.lobbyRoom.leave();
                global.lobbyRoom = null;

                console.log(this.message);
                this.joinGameRoom(this.message);
              });
            });
        } catch (e) {
          console.log(e);
        }
      } else if (this.global1.createOrJoin == 'join') {
        try {
          console.log('roomCodeonJoin', this.global1.roomCode);
          await client
            .joinById(String(this.global1.roomCode), {
              userName: global.userName,
              dbId: global.dbId,
              avatar: this.global1.avatar,
              playerCount: playerCount,
              coin: this.global1.coins,
            })
            .then((room) => {
              global.lobbyRoom = room;

              room.onMessage('lessAmount', () => {
                console.log('lessAmount');
                this.messagePopUp.isVisible = true;
                this.messagePopUp.popupMessage =
                  this.langModel.componentLang.popups.lowBal[
                    this.langModel.lang
                  ];
                this.messagePopUp.closetxt =
                  this.langModel.componentLang.popups.close[
                    this.langModel.lang
                  ];
                room.leave();
              });
              room.onMessage('roomId', (message) => {
                this.PWFroomId = JSON.stringify(message.roomCode);
                console.log('pwf join room Id -> ', this.PWFroomId);
                this.global1.ludoEntryAmt = message.rewards;
                this.global1.ludoRewardAmt = message.entry;
                // document.getElementById('waiting').textContent = "Room Code - " + PWFroomId;
                console.log('Room Id -> ', this.PWFroomId);
              });
              room.onMessage('playerJoined', (message) => {
                console.log('PlayerJoinedInLobby');

                if (message.playerCount == 2) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  this.oppTwo = oppopnentName;
                  global.opponentName = oppopnentName;
                  var myavatar = document.getElementById(
                    'oppTwoAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  document.querySelector('.oppOne')!.classList.add('hidden');
                  document.querySelector('.oppThree')!.classList.add('hidden');
                } else if (message.playerCount == 3) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  this.oppOne = oppopnentName;
                  this.oppThree = oppopnentName1;
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                  var myavatar = document.getElementById(
                    'oppOneAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  var myavatar1 = document.getElementById(
                    'oppThreeAvatar'
                  )! as HTMLImageElement;
                  myavatar1.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar1 +
                    '.png';
                  document.querySelector('.oppTwo')!.classList.add('hidden');
                  document.querySelector('.oppOne')!.classList.remove('hidden');
                  document
                    .querySelector('.oppThree')!
                    .classList.remove('hidden');
                } else if (message.playerCount == 4) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  var oppopnentName2 = message.oppName2;
                  console.log('oppopnentName ------->', oppopnentName2);
                  this.oppOne = oppopnentName;
                  this.oppTwo = oppopnentName1;
                  this.oppThree = oppopnentName2;
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                  global.opponentName2 = oppopnentName2;
                  var myavatar = document.getElementById(
                    'oppOneAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  var myavatar1 = document.getElementById(
                    'oppTwoAvatar'
                  )! as HTMLImageElement;
                  myavatar1.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar1 +
                    '.png';
                  var myavatar2 = document.getElementById(
                    'oppThreeAvatar'
                  )! as HTMLImageElement;
                  myavatar2.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar2 +
                    '.png';
                }
                document.querySelector('.oppTwo')!.classList.remove('hidden');
                document.querySelector('.oppOne')!.classList.remove('hidden');
                document.querySelector('.oppThree')!.classList.remove('hidden');
              });
              room.onMessage('waitingForPlayers', (message) => {
                console.log(message.num);
                console.log('mySession Id', message.sessionId);
                global.myId = message.sessionId;
              });
              room.onMessage('startgame', () => {
                room.leave();
                global.lobbyRoom = null;
                this.joinGameRoom(this.message);
              });
              room.onMessage('ROOMCONNECT', (message) => {
                //gamePlay();
                this.message = message;
                document
                  .querySelector('.ludo-exit-btn-searchplayer')!
                  .classList.add('hidden');
                document.querySelector(
                  '.waitingForCreaterTostart'
                )!.textContent = 'Waiting for Creater to start the game.';
                document
                  .querySelector('.waitingForCreaterTostart')!
                  .classList.remove('hidden');
                var roomid = message.roomId;
                console.log('room Connect  ------->', this.message);
                console.log('playerCount ------->', message.playerCount);

                if (message.playerCount == 2) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  this.oppTwo = oppopnentName;
                  global.opponentName = oppopnentName;
                  var myavatar = document.getElementById(
                    'oppTwoAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  document.querySelector('.oppOne')!.classList.add('hidden');
                  document.querySelector('.oppThree')!.classList.add('hidden');
                } else if (message.playerCount == 3) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  this.oppOne = oppopnentName;
                  this.oppThree = oppopnentName1;
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                  var myavatar = document.getElementById(
                    'oppOneAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  var myavatar1 = document.getElementById(
                    'oppThreeAvatar'
                  )! as HTMLImageElement;
                  myavatar1.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar1 +
                    '.png';
                  document.querySelector('.oppTwo')!.classList.add('hidden');
                } else if (message.playerCount == 4) {
                  var oppopnentName = message.oppName;
                  console.log('oppopnentName ------->', oppopnentName);
                  var oppopnentName1 = message.oppName1;
                  console.log('oppopnentName ------->', oppopnentName1);
                  var oppopnentName2 = message.oppName2;
                  console.log('oppopnentName ------->', oppopnentName2);
                  this.oppOne = oppopnentName;
                  this.oppTwo = oppopnentName1;
                  this.oppThree = oppopnentName2;
                  global.opponentName = oppopnentName;
                  global.opponentName1 = oppopnentName1;
                  global.opponentName2 = oppopnentName2;
                  var myavatar = document.getElementById(
                    'oppOneAvatar'
                  )! as HTMLImageElement;
                  myavatar.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar +
                    '.png';
                  var myavatar1 = document.getElementById(
                    'oppTwoAvatar'
                  )! as HTMLImageElement;
                  myavatar1.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar1 +
                    '.png';
                  var myavatar2 = document.getElementById(
                    'oppThreeAvatar'
                  )! as HTMLImageElement;
                  myavatar2.src =
                    '../../assets/img/profile/Avatar' +
                    message.oppAvatar2 +
                    '.png';
                }
                var sessionId = message.oppSessionId;
                console.log('sessionId ------->', sessionId);
              });
              room.onMessage('hostLeft', () => {
                room.leave();
                this.messagePopUp.isVisible = true;
                this.messagePopUp.popupMessage =
                  'Host has left the game, Game room is closed.';
                this.messagePopUp.closetxt = 'close';
              });
            });
        } catch (e) {
          console.log('error ', e);
        }
      }
    }
    if (this.global1.LudoGameType == 'AI') {
      this.joinGameRoom('AI');
    }
    if (
      this.global1.LudoGameType == 'Tourny' &&
      this.global1.tournamentType == 'tournament'
    ) {
      console.log(
        'enter tournament lobby ->',
        this.global1.TournamentStartObject.tournamentStartTime
      );
      //let t_id = String(this.global1.TournamentStartObject.tournament_id).replace(/\s+/g,'');
      let lobbyCreated: boolean = false;
      let roomIdIfExist: string = '';
      await client.getAvailableRooms('tournamentLobbyRoom').then((rooms) => {
        if (rooms.length) {
          rooms.forEach((room) => {
            if (
              room.roomId.startsWith(
                String(this.global1.TournamentStartObject.tournament_id)
              )
            ) {
              lobbyCreated = true;
              roomIdIfExist = room.roomId;
            }
          });
        }
      });
      console.log(
        'enter tournament lobby 1 ->',
        lobbyCreated,
        ' ',
        roomIdIfExist
      );
      if (lobbyCreated) {
        client
          .joinById(roomIdIfExist, {
            t_id: this.global1.TournamentStartObject.tournament_id,
            userID: this.global1.userId,
            t_name: this.global1.TournamentStartObject.t_name,
            tournamentStartTime:
              this.global1.TournamentStartObject.tournamentStartTime,
          })
          .then((room) => {
            global.lobbyRoom = room;
            var roomToJoin;
            room.onMessage('waitingForPlayers', (message) => {
              console.log('waitingfortournament , lobby sessionId: ', message);
              this.joinGameRoom(message);
              roomToJoin = message.roomId;
            });
            global.lobbyRoom.onMessage(
              'NotInTournamentOrRoundAllreadyStarted',
              () => {
                console.log('NotInTournamentOrRoundAllreadyStarted');
                this.messagePopUp.isVisible = true;
                this.messagePopUp.popupMessage =
                  this.langModel.componentLang.popups.tourStarted[
                    this.langModel.lang
                  ];
                this.messagePopUp.closetxt =
                  this.langModel.componentLang.popups.close[
                    this.langModel.lang
                  ];
              }
            );
          });
      } else {
        client
          .create('tournamentLobbyRoom', {
            t_id: this.global1.TournamentStartObject.tournament_id,
            userID: this.global1.userId,
            t_name: this.global1.TournamentStartObject.t_name,
            tournamentStartTime:
              this.global1.TournamentStartObject.tournamentStartTime,
          })
          .then((room) => {
            global.lobbyRoom = room;
            var roomToJoin;
            room.onMessage('waitingForPlayers', (message) => {
              console.log('waitingfortournament , lobby sessionId: ', message);
              this.joinGameRoom(message);
              roomToJoin = message.roomId;
            });
            global.lobbyRoom.onMessage(
              'NotInTournamentOrRoundAllreadyStarted',
              () => {
                console.log('NotInTournamentOrRoundAllreadyStarted');
                this.messagePopUp.isVisible = true;
                this.messagePopUp.popupMessage =
                  this.langModel.componentLang.popups.tourStarted[
                    this.langModel.lang
                  ];
                this.messagePopUp.closetxt =
                  this.langModel.componentLang.popups.close[
                    this.langModel.lang
                  ];
              }
            );
          });
      }
    }
    if (
      this.global1.LudoGameType == 'Tourny' &&
      this.global1.tournamentType == 'championship'
    ) {
      console.log(
        'enter champion lobby ->',
        this.global1.TournamentStartObject.tournamentStartTime
      );
      let lobbyCreated: boolean = false;
      let roomIdIfExist: string = '';
      await client.getAvailableRooms('championshipLobbyRoom').then((rooms) => {
        if (rooms.length) {
          rooms.forEach((room) => {
            if (
              room.roomId.startsWith(
                String(this.global1.TournamentStartObject.tournament_id)
              )
            ) {
              lobbyCreated = true;
              roomIdIfExist = room.roomId;
            }
          });
        }
      });
      console.log(
        'enter champion lobby 1 ->',
        lobbyCreated,
        ' ',
        roomIdIfExist
      );
      if (lobbyCreated) {
        client
          .joinById(roomIdIfExist, {
            t_id: this.global1.TournamentStartObject.tournament_id,
            userID: this.global1.userId,
            t_name: this.global1.TournamentStartObject.t_name,
            tournamentStartTime:
              this.global1.TournamentStartObject.tournamentStartTime,
          })
          .then((room) => {
            global.lobbyRoom = room;
            var roomToJoin;
            room.onMessage('waitingForPlayers', (message) => {
              console.log('waitingfortournament , lobby sessionId: ', message);
              this.joinGameRoom(message);
              roomToJoin = message.roomId;
            });
            global.lobbyRoom.onMessage(
              'NotInTournamentOrRoundAllreadyStarted',
              () => {
                console.log('NotInTournamentOrRoundAllreadyStarted');
                this.messagePopUp.isVisible = true;
                this.messagePopUp.popupMessage =
                  this.langModel.componentLang.popups.tourStarted[
                    this.langModel.lang
                  ];
                this.messagePopUp.closetxt =
                  this.langModel.componentLang.popups.close[
                    this.langModel.lang
                  ];
              }
            );
          });
      } else {
        client
          .create('championshipLobbyRoom', {
            t_id: this.global1.TournamentStartObject.tournament_id,
            userID: this.global1.userId,
            t_name: this.global1.TournamentStartObject.t_name,
            tournamentStartTime:
              this.global1.TournamentStartObject.tournamentStartTime,
          })
          .then((room) => {
            global.lobbyRoom = room;
            var roomToJoin;
            room.onMessage('waitingForPlayers', (message) => {
              console.log('waitingfortournament , lobby sessionId: ', message);
              this.joinGameRoom(message);
              roomToJoin = message.roomId;
            });
            global.lobbyRoom.onMessage(
              'NotInTournamentOrRoundAllreadyStarted',
              () => {
                console.log('NotInTournamentOrRoundAllreadyStarted');
                this.messagePopUp.isVisible = true;
                this.messagePopUp.popupMessage =
                  this.langModel.componentLang.popups.tourStarted[
                    this.langModel.lang
                  ];
                this.messagePopUp.closetxt =
                  this.langModel.componentLang.popups.close[
                    this.langModel.lang
                  ];
              }
            );
          });
      }
      //let t_id = String(this.global1.TournamentStartObject.tournament_id).replace(/\s+/g,'');
    }
  }
  getRndInteger(min: any, max: any) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  async joinGameRoom(message: any) {
    try {
      global.playercount += 1;
      global.gameRoom = null;
      // console.log('joining room', room);

      if (this.global1.LudoGameType == 'Tourny') {
        await this.client
          .joinById(String(message.roomId), {
            userName: this.global1.userName,
            dbId: this.global1.userId,
            avatar: this.global1.avatar,
          })
          .then((room) => {
            global.gameRoom = room;
            //global.lobbyRoom = null;
            this.onGameMessage(room);
            console.log('joined successfully', room);
          })
          .catch((err) => {
            console.log('error in joining tournament room ', err);
          });
      } else if (this.global1.LudoGameType == 'AI') {
        await this.client
          .create('AIGameRoom', {
            userName: this.global1.userName,
            dbId: this.global1.userId,
            avatar: this.global1.avatar,
          })
          .then((room) => {
            global.gameRoom = room;
            //global.lobbyRoom = null;
            this.onGameMessage(room);
            console.log('joined AI room successfully', room);
          })
          .catch((err) => {
            console.log('error in joining tournament room ', err);
          });
      } else {
        await this.client
          .joinById(message.roomId)
          .then((room) => {
            global.gameRoom = room;
            //global.lobbyRoom = null;
            this.onGameMessage(room);
            console.log('joined successfully', room);
          })
          .catch((err) => {
            console.log('error in joining room ', err);
          });
      }

      //this.setGameRoom(room);
      //   client.joinOrCreate("game", {
      //     dbid: global.dbid,
      //     userName: global.userName,
      //   }).then(room => {

      //   room.onStateChange((state) => {
      //     console.log(room.name, "has new state:", state);
      //   });

      //});

      // room.onStateChange((state: any) => {
      //   if (state.MyConnect != true) {
      //    // Do something ...
      //    console.log("inside onStateChange");
      //    //room.leave(false);
      //   }
      //       });
    } catch (e) {
      console.log('gameroom error', e);
      this.router.navigateByUrl('homePage');
    }
    //end of function
  }
  onGameMessage(room: any) {
    //powerUps, availablePlayers, gottisInside, playerIds, names
    //------- If Player missed his first turn --------

    room.onMessage('MissedOneTurn', (message: any) => {
      console.log('MissedOneTurn', message);
      this.messagePopUp.isVisible = true;
      this.messagePopUp.popupMessage =
        this.langModel.componentLang.popups.MissedOneTurn[this.langModel.lang];
      this.messagePopUp.closetxt =
        this.langModel.componentLang.popups.close[this.langModel.lang];

      this.messagePopUp.type = 'doNotQuit';
      setTimeout(() => {
        this.messagePopUp.isVisible = false;
      }, 3000);
    });

    room.onMessage('MisseTwoTurn', () => {
      console.log('MisseTwoTurn');
      global.gameRoom.leave(true);
      this.messagePopUp.isVisible = true;
      this.messagePopUp.popupMessage = 'You have missed two turns!'; //change text to angola
      this.messagePopUp.closetxt = 'Going Home...'; //change text to angola
      const timeOutForRouteToHome = setTimeout(() => {
        this.messagePopUp.isVisible = false;
        clearTimeout(timeOutForRouteToHome);
        this.router.navigateByUrl('homePage');
      }, 3000);
    });
    room.onMessage('yourId', (message: any) => {
      global.myId = message.id;
      console.log('this is my id', global.myId);
      //room.send("giveUserArray", {userName: global.userName});
    });

    room.onMessage('gameStartingIn', (message: any) => {
      // global.myId = message.id;
      var timer = new Date(message.timeRemaining);
      console.log('timer rem .....', timer, message);
    });
    //   room.onMessage("userArraysent",(message:any) => {

    //     console.log("userArraysent");

    // })
    // let ind = 0;

    room.onMessage('userColor', (message: any) => {
      this.myColor = message.playerColor;
      console.log('myColor - > ', this.myColor, ' ', this.firstTimePlay);
      if (this.firstTimePlay) {
        this.firstTimePlay = false;
        this.Canvas = document.getElementById('Canvas')!.cloneNode(true);
        this.upperPlayer = document
          .getElementById('upperPlayer')!
          .cloneNode(true);
        this.lowerPlayer = document
          .getElementById('lowerPlayer')!
          .cloneNode(true);
        this.topPanelID = document
          .getElementById('topPanelID')!
          .cloneNode(true);
        console.log(
          this.Canvas,
          this.upperPlayer,
          this.lowerPlayer,
          this.topPanelID
        );
      }

      // var parElement = document.getElementById('play3')!;
      //   var name = message.userName;
      //   var textToAdd = document.createTextNode(name);
      //   parElement.appendChild(textToAdd);

      // document.getElementById('player3')!.style.border = '3px solid #feff02';
      // var avatar = document.getElementById('player3')! as HTMLImageElement;
      // avatar.src =
      //   '../../assets/img/profile/Avatar' + message.avatar + '.png';
      var dice = document.getElementById('player3dice')! as HTMLImageElement;
      dice.src = '../../assets/images/initial.png';

      if (message.playerColor === 'blue') {
        document.getElementById('Canvas')!.style.transform = 'rotate(270deg)';
        document.querySelector('#Canvas')!.classList.add('rotateBoard270');
      } else if (message.playerColor === 'red') {
        document.getElementById('Canvas')!.style.transform = 'rotate(180deg)';
        document.querySelector('#Canvas')!.classList.add('rotateBoard180');
      } else if (message.playerColor === 'green') {
        document.getElementById('Canvas')!.style.transform = 'rotate(90deg)';
        document.querySelector('#Canvas')!.classList.add('rotateBoard90');
      }
    });
    let redDoneOrNot = false;
    let yellowDoneOrNot = false;
    let GreenDoneOrNot = false;
    let BlueDoneOrNot = false;
    room.onMessage('userarray', (message: any) => {
      console.log('userarray------->', message);
      // if(message.playerColor != 'green'){
      //   document.querySelector('.properties2')!.classList.add('hidden');
      // }
      // if(message.playerColor != 'blue'){
      //   document.querySelector('.properties3')!.classList.add('hidden');
      // }
      if (this.myColor == 'yellow') {
        console.log('my player color blue');
        if (yellowDoneOrNot == false && message.playerColor === 'yellow') {
          console.log('here in yellow');
          var parElement = document.getElementById('play4')!.textContent;
          document.getElementById('play4')!.innerHTML = message.userName;
          var name = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          yellowDoneOrNot = true;
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player4dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (redDoneOrNot == false && message.playerColor === 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play1')!.textContent;
          var name = message.userName;
          document.getElementById('play1')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;

          redDoneOrNot = true;
          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player1dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (GreenDoneOrNot == false && message.playerColor === 'green') {
          console.log('here in green');
          var parElement = document.getElementById('play2')!.textContent;
          var name = message.userName;
          document.getElementById('play2')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          GreenDoneOrNot = true;

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player2dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (BlueDoneOrNot == false && message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play3')!.textContent;
          var name = message.userName;
          document.getElementById('play3')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          BlueDoneOrNot = true;

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          //   var dice = document.getElementById('player3dice')! as HTMLImageElement;
          //   dice.src = '../../assets/images/initial.png';
        }
      } else if (this.myColor == 'green') {
        console.log('my player color yellow');
        if (yellowDoneOrNot == false && message.playerColor === 'yellow') {
          var parElement = document.getElementById('play3')!.textContent;
          var name = message.userName;
          document.getElementById('play3')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          yellowDoneOrNot = true;

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          // var dice = document.getElementById('player3dice')! as HTMLImageElement;
          // dice.src = '../../assets/images/initial.png';
          console.log('here in yellow');
        } else if (redDoneOrNot == false && message.playerColor === 'red') {
          var parElement = document.getElementById('play2')!.textContent;
          var name = message.userName;
          document.getElementById('play2')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          redDoneOrNot = true;

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player2dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in red');
        } else if (GreenDoneOrNot == false && message.playerColor === 'green') {
          var parElement = document.getElementById('play4')!.textContent;
          var name = message.userName;
          document.getElementById('play4')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          GreenDoneOrNot = true;
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player4dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in green');
        } else if (BlueDoneOrNot == false && message.playerColor === 'blue') {
          var parElement = document.getElementById('play1')!.textContent;
          var name = message.userName;
          document.getElementById('play1')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;

          BlueDoneOrNot = true;
          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player1dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in blue');
        }
      } else if (this.myColor == 'blue') {
        console.log('my player color red');
        if (yellowDoneOrNot == false && message.playerColor === 'yellow') {
          var parElement = document.getElementById('play2')!.textContent;
          var name = message.userName;
          document.getElementById('play2')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          yellowDoneOrNot = true;

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player2dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in yellow');
        } else if (redDoneOrNot == false && message.playerColor === 'red') {
          var parElement = document.getElementById('play3')!.textContent;
          var name = message.userName;
          document.getElementById('play3')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          redDoneOrNot = true;

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          //   var dice = document.getElementById('player3dice')! as HTMLImageElement;
          //   dice.src = '../../assets/images/initial.png';
          console.log('here in red');
        } else if (GreenDoneOrNot == false && message.playerColor === 'green') {
          var parElement = document.getElementById('play1')!.textContent;
          var name = message.userName;
          document.getElementById('play1')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;

          GreenDoneOrNot = true;
          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player1dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in green');
        } else if (BlueDoneOrNot == false && message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play4')!.textContent;
          var name = message.userName;
          document.getElementById('play4')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          BlueDoneOrNot = true;
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player4dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        }
      } else if (this.myColor == 'red') {
        console.log('my player color green');
        if (yellowDoneOrNot == false && message.playerColor == 'yellow') {
          var parElement = document.getElementById('play1')!.textContent;
          var name = message.userName;
          document.getElementById('play1')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;

          yellowDoneOrNot = true;
          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player1dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in yellow');
        } else if (redDoneOrNot == false && message.playerColor == 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play4')!.textContent;
          var name = message.userName;
          document.getElementById('play4')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          redDoneOrNot = true;
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player4dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (GreenDoneOrNot == false && message.playerColor == 'green') {
          var parElement = document.getElementById('play3')!.textContent;
          var name = message.userName;
          document.getElementById('play3')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          GreenDoneOrNot = true;

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          //   var dice = document.getElementById('player3dice')! as HTMLImageElement;
          //   dice.src = '../../assets/images/initial.png';
          console.log('here in green');
        } else if (BlueDoneOrNot == false && message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play2')!.textContent;
          var name = message.userName;
          document.getElementById('play2')!.innerHTML = message.userName;
          // var textToAdd = document.createTextNode(name);
          parElement = name;
          BlueDoneOrNot = true;

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          var dice = document.getElementById(
            'player2dice'
          )! as HTMLImageElement;
          dice.src = '../../assets/images/initial.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        }
      }
    });
    var ifOnMessageRunOnce = true;
    // room.onMessage("NotInTournamentOrRoundAllreadyStarted", (messsage) => {
    //   console.log("NotInTournamentOrRoundAllreadyStarted");
    // });
    room.onMessage('startGame', (message: any) => {
      // this.LudoWinnerPopUp.isVisible = true;
      //this.checkConnectivity();

      console.log('Start Game Recieved', message.player, message.names);
      room.send('giveUserArray', {
        userName: global.userName,
        avatar: this.global1.avatar,
        userId: this.global1.userId,
      });

      if (ifOnMessageRunOnce) {
        //document.querySelector("#startGameDialogue")!.classList.add("hidden");
        // document.querySelector(".waitingForPlayers")!.classList.add("hidden");
        //document.querySelector(".toppanel2")!.classList.add("hidden");
        document
          .querySelector('.game-wrap-search-player')!
          .classList.add('hidden');
        if (
          this.global1.LudoGameType == 'PWF' &&
          this.global1.createOrJoin == 'create'
        ) {
          document
            .querySelector('.game-wrapInviteFriends')!
            .classList.add('hidden');
          document.querySelector('.ludo-wrap')!.classList.remove('hidden');
        }
        GAMEDATA.playerIds = message.playerIds;
        document.querySelector('#Canvas')!.classList.remove('hidden');
        document.querySelector('.toppanel')!.classList.remove('hidden');
        document.querySelector('#upperPlayer')!.classList.remove('hidden');
        document.querySelector('#lowerPlayer')!.classList.remove('hidden');
        this.setHtmlEvents();

        // document.querySelector('.properties1')!.classList.remove('hidden');
        // document.querySelector('.properties2')!.classList.remove('hidden');
        // document.querySelector('.properties3')!.classList.remove('hidden');
        // document.querySelector('.properties4')!.classList.remove('hidden');
        var avatars = [];
        console.log('availablePlayers Length => ', message.availablePlayers);
        this.availablePlayers = message.availablePlayers.length;
        for (let i = 0; i <= message.availablePlayers.length; i++) {
          if (message.availablePlayers.includes(i)) {
            //adding profile pictures
            // let profilePic = document.createElement('img');
            // let name = document.createElement('h1');
            // name.innerText = message.names[i];
            // profilePic.src = '';
            // profilePic.classList.add('profilePic');
            // console.log(CONSTANTS.defaultColors[i]);
            // document
            //   .querySelector('.' + CONSTANTS.defaultColors[i] + '.home')!
            //   .appendChild(profilePic);
            // document
            //   .querySelector('.' + CONSTANTS.defaultColors[i] + '.home')!
            //   .appendChild(name);
            //placing gottis in positions

            for (let j = 0; j < 4; j++) {
              let gotti = document.createElement('img');
              // name.classList.add('name');
              gotti.classList.add('gotti');
              console.log('--', message.gottisInside[i][j], '--');
              gotti.id = message.gottisInside[i][j];
              let col = gotti.id.slice(0, gotti.id.length - 1);
              // document.getElementById('gottiImg')
              gotti.src = '../../assets/images/gottis/' + col + '.png ';
              let pnt = document.querySelectorAll(
                '.home_' + col + '.inner_space'
              );
              pnt[j].appendChild(gotti);
            }

            // for (let j = 0; j < 4; j++) {
            //   let gotti = document.getElementById('gottiImg')!;
            //  // name.classList.add('name');
            //   gotti.classList.add('gotti');
            //   console.log('--', message.gottisInside[i][j], '--');
            //   gotti.id = message.gottisInside[i][j];
            //   let col = gotti.id.slice(0, gotti.id.length - 1);
            //  // document.getElementById('gottiImg')
            //  // gotti.src = '../../assets/images/gottis/' + col + '.png ';
            //   let pnt = document.querySelectorAll(
            //     '.home_' + col + '.inner_space'
            //   );
            //   var pntsrc = pnt[j].children[0] as HTMLImageElement;
            //   pntsrc.src = '../../assets/images/gottis/' + col + '.png ';

            // }
          }
        }
      }
      ifOnMessageRunOnce = false;

      //placing powerUps in positions
      // for (var key in message.powerUps) {
      //   if (message.powerUps.hasOwnProperty(key)) {
      //     let location = document.getElementById(key);
      //     let powerup = new createPowerup(message.powerUps[key]);
      //     location!.appendChild(powerup.image);
      //   }
      // }
    });
    room.onMessage('removeShakeAnimation', (message: any) => {
      console.log('inside removeShakeAnimation ', message);
      this.removeShakeAnimation(message.gottisInside, message.gottisOutside);
    });

    room.onMessage('playerIndicator1', (message: any) => {
      console.log('inside playerIndicator1 ', message);
      var divChild: HTMLElement;
      for (const [key1, value1] of Object.entries(this.GottiMovementAmounts)) {
        console.log(key1, value1);
        var postionforPopup: string;
        for (const [key, value] of Object.entries(this.allGottis)) {
          console.log(key, value);
          if (key1 == key) {
            postionforPopup = String(value);
            console.log('position for popup -> ', postionforPopup);
            divChild = document.getElementById(postionforPopup)!
              .children[1] as HTMLElement;
            divChild.style.display = 'none';
            console.log('divChild -> ', divChild);
          }
        }
      }
      var playerTimer4 = document.getElementById(
        'playerTimer4'
      )! as HTMLImageElement;
      playerTimer4.src = '';
      document.getElementById('playerTimer4')!.style.display = 'none';
      var playerTimer3 = document.getElementById(
        'playerTimer3'
      )! as HTMLImageElement;
      playerTimer3.src = '';
      document.getElementById('playerTimer3')!.style.display = 'none';
      var playerTimer2 = document.getElementById(
        'playerTimer2'
      )! as HTMLImageElement;
      playerTimer2.src = '';
      document.getElementById('playerTimer2')!.style.display = 'none';
      var playerTimer1 = document.getElementById(
        'playerTimer1'
      )! as HTMLImageElement;
      playerTimer1.src = '';
      document.getElementById('playerTimer1')!.style.display = 'none';
      var image = new Image();
      image.src = '../../assets/images/Timer_15sec.gif' + '?a=' + Math.random();
      if (this.myColor == 'yellow') {
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties4')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          var playerTimer4 = document.getElementById(
            'playerTimer4'
          )! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties2')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer2 = document.getElementById(
            'playerTimer2'
          )! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document
            .querySelector('.properties1')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer1 = document.getElementById(
            'playerTimer1'
          )! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties3')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer3 = document.getElementById(
            'playerTimer3'
          )! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
        }
      } else if (this.myColor == 'green') {
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties3')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer3 = document.getElementById(
            'playerTimer3'
          )! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties4')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          var playerTimer4 = document.getElementById(
            'playerTimer4'
          )! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties2')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer2 = document.getElementById(
            'playerTimer2'
          )! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document
            .querySelector('.properties1')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer1 = document.getElementById(
            'playerTimer1'
          )! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
      } else if (this.myColor == 'red') {
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document
            .querySelector('.properties1')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer1 = document.getElementById(
            'playerTimer1'
          )! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties3')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer3 = document.getElementById(
            'playerTimer3'
          )! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties4')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          var playerTimer4 = document.getElementById(
            'playerTimer4'
          )! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties2')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer2 = document.getElementById(
            'playerTimer2'
          )! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
      } else if (this.myColor == 'blue') {
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties2')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer2 = document.getElementById(
            'playerTimer2'
          )! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document
            .querySelector('.properties1')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer1 = document.getElementById(
            'playerTimer1'
          )! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties3')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer3 = document.getElementById(
            'playerTimer3'
          )! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties4')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          var playerTimer4 = document.getElementById(
            'playerTimer4'
          )! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
      }
    });

    room.onMessage('playerIndicator', (message: any) => {
      this.sixArrayRecived = false;
      var divChild: HTMLElement;
      for (const [key1, value1] of Object.entries(this.GottiMovementAmounts)) {
        console.log(key1, value1);
        var postionforPopup: string;
        for (const [key, value] of Object.entries(this.allGottis)) {
          console.log(key, value);
          if (key1 == key) {
            postionforPopup = String(value);
            console.log('position for popup -> ', postionforPopup);
            divChild = document.getElementById(postionforPopup)!
              .children[1] as HTMLElement;
            divChild.style.display = 'none';
            console.log('divChild -> ', divChild);
          }
        }
      }
      var playerTimer4 = document.getElementById(
        'playerTimer4'
      )! as HTMLImageElement;
      playerTimer4.src = '';
      document.getElementById('playerTimer4')!.style.display = 'none';
      var playerTimer3 = document.getElementById(
        'playerTimer3'
      )! as HTMLImageElement;
      playerTimer3.src = '';
      document.getElementById('playerTimer3')!.style.display = 'none';
      var playerTimer2 = document.getElementById(
        'playerTimer2'
      )! as HTMLImageElement;
      playerTimer2.src = '';
      document.getElementById('playerTimer2')!.style.display = 'none';
      var playerTimer1 = document.getElementById(
        'playerTimer1'
      )! as HTMLImageElement;
      playerTimer1.src = '';
      document.getElementById('playerTimer1')!.style.display = 'none';
      redDoneOrNot = false;
      yellowDoneOrNot = false;
      GreenDoneOrNot = false;
      BlueDoneOrNot = false;
      var image = new Image();
      image.src = '../../assets/images/Timer_15sec.gif' + '?a=' + Math.random();
      console.log(
        'currentPlayerColor--->',
        message.currentPlayerColor,
        ' id-->',
        message.id,
        'clientId-->',
        global.myId
      );
      console.log('adding highlight');
      let all = document.querySelectorAll('.home .profilePic');
      for (let i = 0; i < all.length; i++) {
        if (all[i].className.includes('highLight')) {
          all[i].classList.remove('highLight');
          break;
        }
      }
      GAMEDATA.currentPlayerColor = message.currentPlayerColor;
      // let home = document.querySelector(
      //   '.' + message.currentPlayerColor + '.home .profilePic'
      // );
      // home!.classList.add('highLight');

      //this.myTurn = true;
      //alert("this is your turn to play");
      if (this.myColor == 'yellow') {
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties4')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          var playerTimer4 = document.getElementById(
            'playerTimer4'
          )! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties2')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer2 = document.getElementById(
            'playerTimer2'
          )! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document
            .querySelector('.properties1')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer1 = document.getElementById(
            'playerTimer1'
          )! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties3')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer3 = document.getElementById(
            'playerTimer3'
          )! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
        }
      } else if (this.myColor == 'green') {
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties3')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer3 = document.getElementById(
            'playerTimer3'
          )! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties4')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          var playerTimer4 = document.getElementById(
            'playerTimer4'
          )! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties2')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer2 = document.getElementById(
            'playerTimer2'
          )! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document
            .querySelector('.properties1')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer1 = document.getElementById(
            'playerTimer1'
          )! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
      } else if (this.myColor == 'red') {
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document
            .querySelector('.properties1')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer1 = document.getElementById(
            'playerTimer1'
          )! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties3')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer3 = document.getElementById(
            'playerTimer3'
          )! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties4')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          var playerTimer4 = document.getElementById(
            'playerTimer4'
          )! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties2')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer2 = document.getElementById(
            'playerTimer2'
          )! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
      } else if (this.myColor == 'blue') {
        if (message.currentPlayerColor == 'yellow') {
          document.querySelector('.gif2')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties2')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer2 = document.getElementById(
            'playerTimer2'
          )! as HTMLImageElement;
          playerTimer2.src = image.src;
          document.getElementById('playerTimer2')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'green') {
          document.querySelector('.gif1')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document
            .querySelector('.properties1')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer1 = document.getElementById(
            'playerTimer1'
          )! as HTMLImageElement;
          playerTimer1.src = image.src;
          document.getElementById('playerTimer1')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'red') {
          document.querySelector('.gif3')!.classList.add('heartBeat');
          document.querySelector('.gif4')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties3')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties4')!
            .classList.add('dice-visibility');
          var playerTimer3 = document.getElementById(
            'playerTimer3'
          )! as HTMLImageElement;
          playerTimer3.src = image.src;
          document.getElementById('playerTimer3')!.style.display = 'block';
        }
        if (message.currentPlayerColor == 'blue') {
          document.querySelector('.gif4')!.classList.add('heartBeat');
          document.querySelector('.gif3')!.classList.remove('heartBeat');
          document.querySelector('.gif2')!.classList.remove('heartBeat');
          document.querySelector('.gif1')!.classList.remove('heartBeat');
          document
            .querySelector('.properties4')!
            .classList.remove('dice-visibility');
          document
            .querySelector('.properties2')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties1')!
            .classList.add('dice-visibility');
          document
            .querySelector('.properties3')!
            .classList.add('dice-visibility');
          var playerTimer4 = document.getElementById(
            'playerTimer4'
          )! as HTMLImageElement;
          playerTimer4.src = image.src;
          document.getElementById('playerTimer4')!.style.display = 'block';
        }
      }
    });

    room.onMessage('rollTheDice', async (message: any) => {
      console.log('message in roll the dice', message);
      this.soundService.playAudio('Dicesound');
      var playerTimer4 = document.getElementById(
        'playerTimer4'
      )! as HTMLImageElement;
      playerTimer4.src = '';
      document.getElementById('playerTimer4')!.style.display = 'none';
      var playerTimer3 = document.getElementById(
        'playerTimer3'
      )! as HTMLImageElement;
      playerTimer3.src = '';
      document.getElementById('playerTimer3')!.style.display = 'none';
      var playerTimer2 = document.getElementById(
        'playerTimer2'
      )! as HTMLImageElement;
      playerTimer2.src = '';
      document.getElementById('playerTimer2')!.style.display = 'none';
      var playerTimer1 = document.getElementById(
        'playerTimer1'
      )! as HTMLImageElement;
      playerTimer1.src = '';
      document.getElementById('playerTimer1')!.style.display = 'none';
      if (this.myColor == 'yellow') {
        if (message.currentPlayerColor == 'yellow') {
          let gif: HTMLImageElement = document.querySelector('.gif4')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'red') {
          let gif: HTMLImageElement = document.querySelector('.gif1')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'green') {
          let gif: HTMLImageElement = document.querySelector('.gif2')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'blue') {
          let gif: HTMLImageElement = document.querySelector('.gif3')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        }
      }
      if (this.myColor == 'green') {
        if (message.currentPlayerColor == 'yellow') {
          let gif: HTMLImageElement = document.querySelector('.gif3')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'red') {
          let gif: HTMLImageElement = document.querySelector('.gif2')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'green') {
          let gif: HTMLImageElement = document.querySelector('.gif4')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'blue') {
          let gif: HTMLImageElement = document.querySelector('.gif1')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        }
      }
      if (this.myColor == 'red') {
        if (message.currentPlayerColor == 'yellow') {
          let gif: HTMLImageElement = document.querySelector('.gif1')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'red') {
          let gif: HTMLImageElement = document.querySelector('.gif4')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'green') {
          let gif: HTMLImageElement = document.querySelector('.gif3')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'blue') {
          let gif: HTMLImageElement = document.querySelector('.gif2')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        }
      }
      if (this.myColor == 'blue') {
        if (message.currentPlayerColor == 'yellow') {
          let gif: HTMLImageElement = document.querySelector('.gif2')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'red') {
          let gif: HTMLImageElement = document.querySelector('.gif3')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'green') {
          let gif: HTMLImageElement = document.querySelector('.gif1')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        } else if (message.currentPlayerColor == 'blue') {
          let gif: HTMLImageElement = document.querySelector('.gif4')!;
          gif.src =
            '../../assets/images/GIFS/' + message.movementAmount + '.gif';
        }
      }
      var diceValueSoundTime = setTimeout(() => {
        clearTimeout(diceValueSoundTime);
        if (message.movementAmount == 1) this.soundService.playAudio('Dice1');
        else if (message.movementAmount == 2)
          this.soundService.playAudio('Dice4');
        else if (message.movementAmount == 6)
          this.soundService.playAudio('Dice6');
      }, 1300);
      // let gif: HTMLImageElement = document.querySelector(".gif")!;
      // gif.src = '../../assets/images/GIFS/' + message.movementAmount + ".gif";
    });

    room.onMessage('moveGotti', async (message: any) => {
      console.log('inside moveGotti', message);

      GAMEDATA.playerIndex = message.playerIndex;
      this.removeShakeAnimation(message.gottisInside, message.gottisOutside);
      let g = document.getElementById(message.id);
      let fd;
      for (let i = 0; i < message.positions.length - 1; ) {
        fd = document.getElementById(message.positions[i]);
        //if two gottis incountered in the way removes the classes that makes them smaller
        let fdGottis = fd!.getElementsByClassName('gotti');
        if (fdGottis.length <= 2) {
          fd!.classList.remove('twoGotti');
        } else if (fdGottis.length == 3) {
          fd!.classList.remove('multipleGotti');
        }
        //if the gotti has reached the finish line
        i++;
        fd = document.getElementById(message.positions[i]);
        if (fd) {
          fdGottis = fd.getElementsByClassName('gotti');
          //checks the position for any opponents or powerups
          await new Promise((r) => setTimeout(r, 200));
          if (fdGottis.length === 2) fd.classList.add('twoGotti');
          else if (fdGottis.length > 2) fd.classList.add('multipleGotti');
          fd.appendChild(g!);
        }
        if (i == message.positions.length - 1) {
          if (
            Number(message.positions[i]) == 18 ||
            Number(message.positions[i]) == 1 ||
            Number(message.positions[i] == 35) ||
            Number(message.positions[i]) == 52 ||
            Number(message.positions[i]) == 14 ||
            Number(message.positions[i]) == 65 ||
            Number(message.positions[i]) == 48 ||
            Number(message.positions[i]) == 31
          )
            this.soundService.playAudio('F_square');
          if (message.result['killed'])
            this.killGotti(message.result['killed']);
          // if (result['powerUp']) addPowerUp(result['powerUp'])
          if (message.result['gottiHome'])
            this.gottiHome(message.result['gottiHome']);
          if (message.result['gameFinished'])
            this.gottiHome(message.result['gottiHome']);
        }
      }
      console.log(
        'GAME--------> ',
        global.myId,
        ' --------client.id------- ',
        message.currentPlayerId
      );
      if (this.global1.LudoGameType == 'AI') {
        if (message.sixOrnot == 1) {
          room.send('finishedmovingOnechance', { result: message.result });
        }
        if (message.sixOrnot == 0) {
          room.send('finishedMoving', { result: message.result });
        }
      } else {
        if (global.myId == message.currentPlayerId && message.sixOrnot == 1) {
          room.send('finishedmovingOnechance', { result: message.result });
        }
        if (global.myId == message.currentPlayerId && message.sixOrnot == 0) {
          room.send('finishedMoving', { result: message.result });
        }
      }

      //this.eventListenerdone = true;
    });

    room.onMessage('getGottiOut', (message: any) => {
      console.log('inside getGottiOut');

      this.soundService.playAudio('F_square');
      this.removeShakeAnimation(message.gottisInside, message.gottisOutside);
      let fd = document.getElementById(message.position)!;
      let g = document.getElementById(message.id)!;
      fd.appendChild(g);
      //nikalda kheri position ma multiple gotti check
      let fdLen = fd.getElementsByClassName('gotti');
      if (fdLen.length == 2) {
        fd.classList.add('twoGotti');
      } else if (fdLen.length > 2) {
        fd.classList.add('multipleGotti');
      }
      if (this.global1.LudoGameType == 'AI') {
        if (message.sixOrnot == 1) {
          room.send('finishedmovingOnechance', { result: message.result });
        }
        if (message.sixOrnot == 0) {
          room.send('finishedMoving', { result: message.result });
        }
      } else {
        if (global.myId == message.currentPlayerId && message.sixOrnot == 1) {
          room.send('finishedmovingOnechance', { result: message.result });
        }
        if (global.myId == message.currentPlayerId && message.sixOrnot == 0) {
          room.send('finishedMoving', { result: null });
        }
      }
      //this.eventListenerdone = true;
    });
    room.onMessage('moveAgain', () => {
      this.eventListenerdone = true;
    });
    room.onMessage('updateLudoPiecesAfterReconnection', (message: any) => {
      console.log(
        'I have reconnected back , new location for pieces is here -> ',
        message.allGottis
      );
    });
    room.onMessage('removePowerUp', (message: any) => {
      let pp = document.querySelector('.powerUps');
      pp!.classList.remove('timer');
      let p = document.querySelector('.powerUps');
      let c = p!.querySelector('.' + message.type);
      p!.removeChild(c!);
    });

    room.onMessage('addShakeAnimation', (message: any) => {
      this.eventListenerdone = true;
      console.log('inside addShakeAnimation', message);
      message.movableGottis.forEach((element: any) => {
        console.log('element---', element);
        var d = document.getElementById(element);
        console.log(d);
        d!.classList.add('useMe');
        //d.className += " useMe";
        console.log(d);
      });
    });
    //remove dice shake animation
    room.onMessage('removeGottiShake', () => {
      this.eventListenerdone = false;
      console.log('removeGottiShake--------');
      if (document.querySelector('.gif1')!.className.includes('heartBeat')) {
        document.querySelector('.gif1')!.classList.remove('heartBeat');
      } else if (
        document.querySelector('.gif2')!.className.includes('heartBeat')
      ) {
        document.querySelector('.gif2')!.classList.remove('heartBeat');
      } else if (
        document.querySelector('.gif3')!.className.includes('heartBeat')
      ) {
        document.querySelector('.gif3')!.classList.remove('heartBeat');
      } else if (
        document.querySelector('.gif4')!.className.includes('heartBeat')
      ) {
        document.querySelector('.gif4')!.classList.remove('heartBeat');
      }
    });

    if (this.global1.LudoGameType == 'Tourny') {
      room.onMessage('allPlayerLeft', (message: any) => {
        console.log('Game has ended. All Player Left', this.gameDone, message);
        if (!message.gameStarted) this.tournyOnePlayerWinner = true;
        else this.tournyOnePlayerWinner = false;
        // console.log("Game has ended. rank 1 Avvatar => ", message.rank1Avatar);
        // console.log("Game has ended. rank 2 => ", message.rank2);
        // console.log("Game has ended. rank 3 => ", message.rank3);
        if (!this.gameDone) {
          this.messagePopUp.isVisible = false;
          this.LudoWinnerPopUp.isVisible = true;
          if (this.global1.LudoGameType == 'Tourny') {
            this.LudoWinnerPopUp.isTourney = true;
            this.LudoWinnerPopUp.tourEnded = false;
            if (this.global1.tournamentType != 'championship')
              this.LudoWinnerPopUp.heading =
                this.langModel.componentLang.ingame.tourwinner[
                  this.langModel.lang
                ];
            else
              this.LudoWinnerPopUp.heading =
                this.langModel.componentLang.ingame.champwinner[
                  this.langModel.lang
                ];
          }
          this.LudoWinnerPopUp.winnerName = this.global1.userName;
          this.LudoWinnerPopUp.winnerAmt = this.global1.ludoRewardAmt;
          var avtarPic = setTimeout(() => {
            clearTimeout(avtarPic);
            // this.LudoWinnerPopUp.winnerAvatar = document.getElementById(
            //   'winnerPopupAvatar'
            // )! as HTMLImageElement;
            this.LudoWinnerPopUp.winnerAvatar =
              '../../assets/img/profile/Avatar' + this.global1.avatar + '.png';
          }, 100);
          //this.LudoWinnerPopUp.image = '../../assets/img1/Winner_Screen/Avatar'+ this.global1.avatar + '.png';
          //console.log("winnerPopupAvatar-> ", this.LudoWinnerPopUp.winnerAvatar);
          //this.image
          //var winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
          //this.LudoWinnerPopUp.winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
          //this.LudoWinnerPopUp.winnerAvatar.src = '../../assets/img1/Winner_Screen/Avatar'+ this.global1.avatar + '.png';
          room.leave();
          this.soundService.playAudio('winner');
        }

        //   room.leave();
        //   this.messagePopUp.isVisible= true;
        //   this.messagePopUp.popupMessage = this.langModel.componentLang.popups.gameOver[this.langModel.lang];
        //  this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      });
      room.onMessage('onePlayerWinner', (message: any) => {
        this.tournyOnePlayerWinner = true;
        console.log('onePlayerWinner >>> ', message);
        this.messagePopUp.isVisible = false;
        this.LudoWinnerPopUp.isVisible = true;
        if (this.global1.LudoGameType == 'Tourny') {
          this.LudoWinnerPopUp.isTourney = true;
          this.LudoWinnerPopUp.tourEnded = false;
          if (this.global1.tournamentType != 'championship')
            this.LudoWinnerPopUp.heading =
              this.langModel.componentLang.ingame.tourwinner[
                this.langModel.lang
              ];
          else
            this.LudoWinnerPopUp.heading =
              this.langModel.componentLang.ingame.champwinner[
                this.langModel.lang
              ];
        }
        this.LudoWinnerPopUp.winnerName = this.global1.userName;
        this.LudoWinnerPopUp.winnerAmt = this.global1.ludoRewardAmt;
        var avtarPic = setTimeout(() => {
          clearTimeout(avtarPic);
          // this.LudoWinnerPopUp.winnerAvatar = document.getElementById(
          //   'winnerPopupAvatar'
          // )! as HTMLImageElement;
          this.LudoWinnerPopUp.winnerAvatar =
            '../../assets/img/profile/Avatar' + this.global1.avatar + '.png';
        }, 100);
        //this.LudoWinnerPopUp.image = '../../assets/img1/Winner_Screen/Avatar'+ this.global1.avatar + '.png';
        //console.log("winnerPopupAvatar-> ", this.LudoWinnerPopUp.winnerAvatar);
        //this.image
        //var winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
        //this.LudoWinnerPopUp.winnerAvatar = document.getElementById('winnerPopupAvatar')! as HTMLImageElement;
        //this.LudoWinnerPopUp.winnerAvatar.src = '../../assets/img1/Winner_Screen/Avatar'+ this.global1.avatar + '.png';
        room.leave();
        this.soundService.playAudio('winner');
      });
      global.lobbyRoom.onMessage('newRoundStart', (message: any) => {
        console.log('newRoundStart >>> ', message.rooms);
        this.gameDone = false;
        //userid

        ///popup
        var newroomIdObj = { roomId: null };

        for (let rooms of message.rooms) {
          console.log(rooms.userID + ' = ', this.global1.userId, rooms);
          if (rooms.userID == this.global1.userId) {
            console.log('room found');
            newroomIdObj.roomId = rooms.roomID;
          }
        }
        if (!this.tournyOnePlayerWinner) {
          const parent = document.getElementById('innerGameWrap')!;
          parent.appendChild(this.topPanelID);
          parent.appendChild(this.upperPlayer);
          parent.appendChild(this.Canvas);
          parent.appendChild(this.lowerPlayer);
        } else {
          this.tournyOnePlayerWinner = false;
        }

        //console.log(this.Canvas, this.upperPlayer, this.lowerPlayer, this.topPanelID)
        if (newroomIdObj.roomId != null) this.joinGameRoom(newroomIdObj);
      });

      global.lobbyRoom.onMessage('waitForNewRoundToStart', (message: any) => {
        console.log('waitForNewRoundToStart >>> ', message.winnersLeft);

        var timeOut = setTimeout(() => {
          this.newRoundStart = true;
          clearTimeout(timeOut);
          if (
            this.global1.userId == Number(message.winner.userId) &&
            this.TournamenentEnded == false
          ) {
            this.LudoWinnerPopUp.isVisible = false;
            if (!this.tournyOnePlayerWinner) {
              const parent = document.getElementById('innerGameWrap')!;
              var child = document.getElementById('Canvas')!;
              parent.removeChild(child);
              child = document.getElementById('topPanelID')!;
              parent.removeChild(child);
              child = document.getElementById('upperPlayer')!;
              parent.removeChild(child);
              child = document.getElementById('lowerPlayer')!;
              parent.removeChild(child);

              // document.querySelector('#Canvas')!.classList.add('hidden');
              // document.querySelector('.toppanel')!.classList.add('hidden');
              // document.querySelector('#upperPlayer')!.classList.add('hidden');
              // document.querySelector('#lowerPlayer')!.classList.add('hidden');
              document
                .querySelector('.game-wrap-search-player')!
                .classList.remove('hidden');
              document
                .querySelector('.back-header-search-player')!
                .classList.remove('hidden');
              // document
              //   .querySelector('.bet-box-search-player')!
              //   .classList.remove('hidden');
              //console.log(this.Canvas, this.upperPlayer, this.lowerPlayer, this.topPanelID)

              let gottiClr = ['red', 'blue', 'yellow', 'green'];
              gottiClr.forEach((item) => {
                const nodeList = document.querySelectorAll(
                  '.home_' + item + '.inner_space'
                );
                for (let i = 0; i < nodeList.length; i++) {
                  nodeList[i].innerHTML = '';
                }
              });
            }
            var winnerLeft: string = String(message.winnersLeft);
            if (message.winnersLeft == 0) winnerLeft = 'Last';
            if (this.langModel.lang == 'en')
              this.tourWaitPlayers =
                winnerLeft + ' game is still remaining in this round.';
            else
              this.tourWaitPlayers =
                winnerLeft + ' ainda faltam jogos nesta rodada.';
          }
        }, 3000);
      });

      room.onMessage('tournamentEnded', (message: any) => {
        console.log('tournamentEnded >>> ', message);
        //winner
        var playerTimer4 = document.getElementById(
          'playerTimer4'
        )! as HTMLImageElement;
        playerTimer4.src = '';
        document.getElementById('playerTimer4')!.style.display = 'none';
        var playerTimer3 = document.getElementById(
          'playerTimer3'
        )! as HTMLImageElement;
        playerTimer3.src = '';
        document.getElementById('playerTimer3')!.style.display = 'none';
        var playerTimer2 = document.getElementById(
          'playerTimer2'
        )! as HTMLImageElement;
        playerTimer2.src = '';
        document.getElementById('playerTimer2')!.style.display = 'none';
        var playerTimer1 = document.getElementById(
          'playerTimer1'
        )! as HTMLImageElement;
        playerTimer1.src = '';
        document.getElementById('playerTimer1')!.style.display = 'none';
        if (this.global1.LudoGameType == 'Tourny') {
          this.LudoWinnerPopUp.isTourney = true;
          this.LudoWinnerPopUp.tourEnded = true;
          this.TournamenentEnded = true;
          if (this.global1.tournamentType != 'championship')
            this.LudoWinnerPopUp.heading =
              this.langModel.componentLang.ingame.tourwinner[
                this.langModel.lang
              ];
          else
            this.LudoWinnerPopUp.heading =
              this.langModel.componentLang.ingame.champwinner[
                this.langModel.lang
              ];
        }
        this.messagePopUp.isVisible = false;
        this.LudoWinnerPopUp.isVisible = true;
        this.LudoWinnerPopUp.winnerName = message.rank1;
        this.LudoWinnerPopUp.secondRank = message.rank2;
        this.LudoWinnerPopUp.thirdRank = message.rank3;
        this.LudoWinnerPopUp.winnerAmt = this.global1.ludoRewardAmt;
        this.LudoWinnerPopUp.secondAmt = this.global1.ludoSecRewardAmt;
        this.LudoWinnerPopUp.thirdAmt = this.global1.ludoThirdRewardAmt;
        this.LudoWinnerPopUp.winnerAvatar =
          '../../assets/img/profile/Avatar' + message.rank1Avatar + '.png';
        if (message.rank2Avatar)
          this.LudoWinnerPopUp.secondAvatar =
            '../../assets/img/profile/Avatar' + message.rank2Avatar + '.png';
        if (message.rank3Avatar)
          this.LudoWinnerPopUp.thirdAvatar =
            '../../assets/img/profile/Avatar' + message.rank3Avatar + '.png';

        room.leave();
        if (String(message.rank1) == String(this.global1.userName))
          this.soundService.playAudio('winner');
        else this.soundService.playAudio('Loose');

        try {
          //remove HtmlGame Events
          this.removeHtmlGameEvents();
        } catch (e) {
          console.log('error in ngOnDestroy->\n', e);
        }
      });
      global.lobbyRoom.onMessage(
        'tournamentEndedOnePlayerJoin',
        (message: any) => {
          console.log('tournamentEnded >>> ', message);
          //winner
          var playerTimer4 = document.getElementById(
            'playerTimer4'
          )! as HTMLImageElement;
          playerTimer4.src = '';
          document.getElementById('playerTimer4')!.style.display = 'none';
          var playerTimer3 = document.getElementById(
            'playerTimer3'
          )! as HTMLImageElement;
          playerTimer3.src = '';
          document.getElementById('playerTimer3')!.style.display = 'none';
          var playerTimer2 = document.getElementById(
            'playerTimer2'
          )! as HTMLImageElement;
          playerTimer2.src = '';
          document.getElementById('playerTimer2')!.style.display = 'none';
          var playerTimer1 = document.getElementById(
            'playerTimer1'
          )! as HTMLImageElement;
          playerTimer1.src = '';
          document.getElementById('playerTimer1')!.style.display = 'none';
          if (this.global1.LudoGameType == 'Tourny') {
            this.LudoWinnerPopUp.isTourney = true;
            this.LudoWinnerPopUp.tourEnded = true;
            this.TournamenentEnded = true;
            if (this.global1.tournamentType != 'championship')
              this.LudoWinnerPopUp.heading =
                this.langModel.componentLang.ingame.tourwinner[
                  this.langModel.lang
                ];
            else
              this.LudoWinnerPopUp.heading =
                this.langModel.componentLang.ingame.champwinner[
                  this.langModel.lang
                ];
          }
          this.messagePopUp.isVisible = false;
          this.LudoWinnerPopUp.isVisible = true;
          this.LudoWinnerPopUp.winnerName = message.rank1;
          this.LudoWinnerPopUp.secondRank = '';
          this.LudoWinnerPopUp.thirdRank = '';
          this.LudoWinnerPopUp.winnerAmt = this.global1.ludoRewardAmt;
          this.LudoWinnerPopUp.secondAmt = this.global1.ludoSecRewardAmt;
          this.LudoWinnerPopUp.thirdAmt = this.global1.ludoThirdRewardAmt;
          this.LudoWinnerPopUp.winnerAvatar =
            '../../assets/img/profile/Avatar' + message.rank1Avatar + '.png';
          if (message.rank2Avatar)
            this.LudoWinnerPopUp.secondAvatar =
              '../../assets/img/profile/Avatar' + '0' + '.png';
          if (message.rank3Avatar)
            this.LudoWinnerPopUp.thirdAvatar =
              '../../assets/img/profile/Avatar' + '0' + '.png';

          room.leave();
          if (String(message.rank1) == String(this.global1.userName))
            this.soundService.playAudio('winner');
          else this.soundService.playAudio('Loose');

          try {
            //remove HtmlGame Events
            this.removeHtmlGameEvents();
          } catch (e) {
            console.log('error in ngOnDestroy->\n', e);
          }
        }
      );
    }
    room.onMessage('RankingOnFinish', (message: any) => {
      console.log('ranking on game finish of a player ', message);
      if (message.ranking[message.ranking.length - 1] == this.myColor) {
        this.messagePopUp.isVisible = true;
        this.messagePopUp.popupMessage =
          this.langModel.componentLang.popups.spectator[this.langModel.lang];
        this.messagePopUp.closetxt =
          this.langModel.componentLang.popups.no[this.langModel.lang];
        this.messagePopUp.btnText =
          this.langModel.componentLang.popups.yes[this.langModel.lang];
        this.messagePopUp.type = 'option';
        // setTimeout(() => {
        //   this.messagePopUp.isVisible = false;
        // }, 3000);
      }
      //red-yellow
      //blue-red
      //green-blue
      //yellow-green
      if (this.myColor == 'yellow') {
        if (message.ranking[message.ranking.length - 1] == 'red') {
          document.getElementById('play1')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'green') {
          document.getElementById('play2')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'blue') {
          document.getElementById('play3')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'yellow') {
          document.getElementById('play4')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        }
      } else if (this.myColor == 'green') {
        if (message.ranking[message.ranking.length - 1] == 'red') {
          document.getElementById('play2')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'blue') {
          document.getElementById('play1')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'green') {
          document.getElementById('play4')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'yellow') {
          document.getElementById('play3')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        }
      } else if (this.myColor == 'blue') {
        if (message.ranking[message.ranking.length - 1] == 'red') {
          document.getElementById('play3')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'blue') {
          document.getElementById('play4')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'green') {
          document.getElementById('play1')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'yellow') {
          document.getElementById('play2')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        }
      } else if (this.myColor == 'red') {
        if (message.ranking[message.ranking.length - 1] == 'red') {
          document.getElementById('play4')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'blue') {
          document.getElementById('play2')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'green') {
          document.getElementById('play3')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        } else if (message.ranking[message.ranking.length - 1] == 'yellow') {
          document.getElementById('play1')!.innerHTML = `${
            this.langModel.componentLang.ingame.winner[this.langModel.lang]
          } - ${message.ranking.length}`;
        }
      }
    });
    room.onMessage('gameOver', (message: any) => {
      console.log('Game has ended. => ', message);

      // console.log("Game has ended. rank 2 => ", message.rank2);
      // console.log("Game has ended. rank 3 => ", message.rank3);
      var playerTimer4 = document.getElementById(
        'playerTimer4'
      )! as HTMLImageElement;
      playerTimer4.src = '';
      document.getElementById('playerTimer4')!.style.display = 'none';
      var playerTimer3 = document.getElementById(
        'playerTimer3'
      )! as HTMLImageElement;
      playerTimer3.src = '';
      document.getElementById('playerTimer3')!.style.display = 'none';
      var playerTimer2 = document.getElementById(
        'playerTimer2'
      )! as HTMLImageElement;
      playerTimer2.src = '';
      document.getElementById('playerTimer2')!.style.display = 'none';
      var playerTimer1 = document.getElementById(
        'playerTimer1'
      )! as HTMLImageElement;
      playerTimer1.src = '';
      document.getElementById('playerTimer1')!.style.display = 'none';
      this.messagePopUp.isVisible = false;
      this.LudoWinnerPopUp.isVisible = true;
      this.LudoWinnerPopUp.winnerName = message.rank1;
      this.LudoWinnerPopUp.secondRank = message.rank2;
      this.LudoWinnerPopUp.thirdRank = message.rank3;
      if (this.global1.LudoGameType == 'AI')
        this.LudoWinnerPopUp.winnerAmt = '0';
      else {
        this.LudoWinnerPopUp.winnerAmt = this.global1.ludoRewardAmt;
      }

      this.LudoWinnerPopUp.winnerAvatar =
        '../../assets/img/profile/Avatar' + message.rank1Avatar + '.png';
      if (message.rank2Avatar)
        this.LudoWinnerPopUp.secondAvatar =
          '../../assets/img/profile/Avatar' + message.rank2Avatar + '.png';
      if (message.rank3Avatar)
        this.LudoWinnerPopUp.thirdAvatar =
          '../../assets/img/profile/Avatar' + message.rank3Avatar + '.png';
      if (this.global1.LudoGameType == 'Tourny') {
        this.gameDone = true;
        this.LudoWinnerPopUp.isTourney = true;
        this.LudoWinnerPopUp.tourEnded = false;
        if (this.global1.tournamentType != 'championship')
          this.LudoWinnerPopUp.heading =
            this.langModel.componentLang.ingame.tourwinner[this.langModel.lang];
        else
          this.LudoWinnerPopUp.heading =
            this.langModel.componentLang.ingame.champwinner[
              this.langModel.lang
            ];
      }
      room.leave();
      if (String(message.rank1) == String(this.global1.userName))
        this.soundService.playAudio('winner');
      else this.soundService.playAudio('Loose');

      try {
        //remove HtmlGame Events
        this.removeHtmlGameEvents();
      } catch (e) {
        console.log('error in ngOnDestroy->\n', e);
      }
      // document.querySelector('#Canvas')!.classList.add('hidden');
      // document.querySelector('.toppanel')!.classList.add('hidden');
      // document.querySelector('#upperPlayer')!.classList.add('hidden');
      // document.querySelector('#lowerPlayer')!.classList.add('hidden');
      // document.querySelector('.properties')!.classList.add('hidden');
      //document.querySelector('#endGameDialogue')!.classList.remove('hidden');
      //document.querySelector("#toppanel1")!.classList.remove("hidden");
      // message.winner.forEach((element: any, index: any) => {
      //   let e = document.createElement('button');
      //   e.innerText = index + 1 + '.  ' + element;
      //   document.querySelector('#endGameDialogue div')!.appendChild(e);
      // });
    });

    room.onMessage('killGotti', (message: any) => {
      this.killGotti(message);
    });
    room.onMessage('playerLeft', (message: any) => {
      for (var i = 4; i >= 1; i--) {
        console.log('inside playerLeft = ', message.playerColor + String(i));
        document.getElementById(
          message.playerColor + String(i)
        )!.style.display = 'none';
      }
      if (this.myColor == 'yellow') {
        //console.log("my player color blue");
        if (message.playerColor === 'yellow') {
          console.log('here in yellow');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (message.playerColor === 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
        } else if (message.playerColor === 'green') {
          console.log('here in green');
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = 'Player Left ...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          BlueDoneOrNot = true;

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
        }
      } else if (this.myColor == 'green') {
        console.log('my player color yellow');
        if (message.playerColor === 'yellow') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('here in yellow');
        } else if (message.playerColor === 'red') {
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in red');
        } else if (message.playerColor === 'green') {
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in blue');
        }
      } else if (this.myColor == 'blue') {
        console.log('my player color red');
        if (message.playerColor === 'yellow') {
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in yellow');
        } else if (message.playerColor === 'red') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('here in red');
        } else if (message.playerColor === 'green') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        }
      } else if (this.myColor == 'red') {
        console.log('my player color green');
        if (message.playerColor == 'yellow') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in yellow');
        } else if (message.playerColor == 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (message.playerColor == 'green') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';

          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = 'Player Left...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        }
      }
      //alert('One of Players has Left the game!');
    });

    room.onMessage('playerRejoined', (message: any) => {
      console.log('inside player Rejoin -> ', JSON.stringify(message));
      var image = new Image();
      if (this.messagePopUp.isVisible) {
        this.messagePopUp.isVisible = false;
      }
      image.src = '../../assets/images/Timer_15sec.gif' + '?a=' + Math.random();
      if (this.myColor == 'yellow') {
        //console.log("my player color blue");
        if (message.playerColor === 'yellow') {
          console.log('here in yellow');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (message.playerColor === 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
        } else if (message.playerColor === 'green') {
          console.log('here in green');
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          BlueDoneOrNot = true;

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
        }
      } else if (this.myColor == 'green') {
        console.log('my player color yellow');
        if (message.playerColor === 'yellow') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('here in yellow');
        } else if (message.playerColor === 'red') {
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in red');
        } else if (message.playerColor === 'green') {
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in blue');
        }
      } else if (this.myColor == 'blue') {
        console.log('my player color red');
        if (message.playerColor === 'yellow') {
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in yellow');
        } else if (message.playerColor === 'red') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('here in red');
        } else if (message.playerColor === 'green') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        }
      } else if (this.myColor == 'red') {
        console.log('my player color green');
        if (message.playerColor == 'yellow') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in yellow');
        } else if (message.playerColor == 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (message.playerColor == 'green') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';

          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = message.userName;
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        }
      }
    });

    room.onMessage('waitingForRejoin', (message: any) => {
      var playerTimer4 = document.getElementById(
        'playerTimer4'
      )! as HTMLImageElement;
      playerTimer4.src = '';
      document.getElementById('playerTimer4')!.style.display = 'none';
      var playerTimer3 = document.getElementById(
        'playerTimer3'
      )! as HTMLImageElement;
      playerTimer3.src = '';
      document.getElementById('playerTimer3')!.style.display = 'none';
      var playerTimer2 = document.getElementById(
        'playerTimer2'
      )! as HTMLImageElement;
      playerTimer2.src = '';
      document.getElementById('playerTimer2')!.style.display = 'none';
      var playerTimer1 = document.getElementById(
        'playerTimer1'
      )! as HTMLImageElement;
      playerTimer1.src = '';
      document.getElementById('playerTimer1')!.style.display = 'none';
      console.log(
        'player Remaining currently in game -> ',
        message.playerLeftInGame
      );
      if (message.playerLeftInGame == 1) {
        this.messagePopUp.isVisible = true;
        this.messagePopUp.popupMessage =
          this.langModel.componentLang.popups.LastPlayerLeft[
            this.langModel.lang
          ]; //string change to portugese
        this.messagePopUp.closetxt =
          this.langModel.componentLang.popups.close[this.langModel.lang];
        this.messagePopUp.type = 'doNotQuit';
      }
      if (this.myColor == 'yellow') {
        //console.log("my player color blue");
        if (message.playerColor === 'yellow') {
          console.log('here in yellow');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (message.playerColor === 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
        } else if (message.playerColor === 'green') {
          console.log('here in green');
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting ...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src =
            '../../assets/img/profile/Avatar' + message.avatar + '.png';
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          BlueDoneOrNot = true;

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
        }
      } else if (this.myColor == 'green') {
        console.log('my player color yellow');
        if (message.playerColor === 'yellow') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('here in yellow');
        } else if (message.playerColor === 'red') {
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in red');
        } else if (message.playerColor === 'green') {
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in blue');
        }
      } else if (this.myColor == 'blue') {
        console.log('my player color red');
        if (message.playerColor === 'yellow') {
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in yellow');
        } else if (message.playerColor === 'red') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('here in red');
        } else if (message.playerColor === 'green') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);
          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        }
      } else if (this.myColor == 'red') {
        console.log('my player color green');
        if (message.playerColor == 'yellow') {
          var parElement = document.getElementById('play1')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player1')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player1')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
          console.log('here in yellow');
        } else if (message.playerColor == 'red') {
          console.log('here in red');
          var parElement = document.getElementById('play4')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player4')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player4')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        } else if (message.playerColor == 'green') {
          var parElement = document.getElementById('play3')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player3')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player3')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';

          console.log('here in green');
        } else if (message.playerColor === 'blue') {
          console.log('here in blue');
          var parElement = document.getElementById('play2')!;
          parElement.textContent = '';
          var name1: string = 'Reconnecting...';
          var textToAdd = document.createTextNode(name1);
          parElement.appendChild(textToAdd);

          document.getElementById('player2')!.style.border =
            '3px solid #feff02';
          var avatar = document.getElementById('player2')! as HTMLImageElement;
          avatar.src = '../../assets/img/profile/Avatar' + '1' + '.png';
          console.log('myUsername -> ', global.myId, ' ', message.id);
        }
      }
    });
    room.onMessage('sixArray', (message: any) => {
      console.log(
        'sixArray reciceved gotti movement Amount-> ',
        message.GottiMovementAmounts
      );
      console.log('sixArray reciceved allGottis-> ', message.allGottis);
      // [yellow1: 62,
      //
      this.eventListenerdone = true;
      this.sixArrayRecived = true;
      this.sixArray = message.sixArray;
      this.GottiMovementAmounts = message.GottiMovementAmounts;
      this.allGottis = message.allGottis;
      this.gottisInside = message.gottisInside;

      var divChild: HTMLElement;
      for (const [key1, value1] of Object.entries(
        message.GottiMovementAmounts
      )) {
        console.log(key1, value1);
        var postionforPopup: string;
        for (const [key, value] of Object.entries(message.allGottis)) {
          console.log(key, value);
          // for(const [keysobject, valueObject] of Object.keys(message.GottiMovementAmounts[key1])){
          //   console.log(keysobject, valueObject);
          // }
          console.log(
            'value in GottiMovementAmounts -> ',
            Object.keys(message.GottiMovementAmounts[key1]).length
          );
          if (Object.keys(message.GottiMovementAmounts[key1]).length > 0) {
            if (key1 == key) {
              postionforPopup = String(value);
              console.log('position for popup -> ', postionforPopup);
              divChild = document.getElementById(postionforPopup)!
                .children[1] as HTMLElement;
              divChild.style.display = 'flex';
              console.log('divChild -> ', divChild);
            }
          }
          // if(value1 != null){

          // }
        }
        if (Object.keys(message.GottiMovementAmounts[key1]).length > 0) {
          var current_number_child0: HTMLElement = divChild!
            .children[0] as HTMLElement;
          if (current_number_child0 != null)
            current_number_child0.style.display = 'none';
          var current_number_child1: HTMLElement = divChild!
            .children[1] as HTMLElement;
          if (current_number_child1 != null)
            current_number_child1.style.display = 'none';
          var current_number_child2: HTMLElement = divChild!
            .children[2] as HTMLElement;
          if (current_number_child2 != null)
            current_number_child2.style.display = 'none';
          console.log(
            'value in GottiMovementAmounts -> ',
            Object.keys(message.GottiMovementAmounts[key1]).length
          );
          var current_number_child: HTMLElement;
          var current_number_spanChild: HTMLElement;

          for (const [keysobject, valueObject] of Object.keys(
            message.GottiMovementAmounts[key1]
          )) {
            var i = parseInt(keysobject);
            current_number_child = divChild!.children[i] as HTMLElement;
            current_number_spanChild = current_number_child!
              .children[0] as HTMLElement;

            var current_number_child0: HTMLElement = divChild!.children[
              i
            ] as HTMLElement;
            if (current_number_child0 != null)
              current_number_child0.style.display = 'block';
            console.log('current_number_child -> ', current_number_child);
            console.log(
              'current_number_spanChild -> ',
              current_number_spanChild
            );
            current_number_spanChild.innerHTML =
              message.GottiMovementAmounts[key1][i];
          }
        }
      }

      // console.log("sixArray reciceved allGottis1-> ", idPossition);
      // message.GottiMovementAmounts.forEach((idMovementAmount: any) => {
      //   console.log("sixArray reciceved gotti movement Amount1-> ", idMovementAmount);
      //   // if(idMovementAmount == idPossition){
      //   //   document.getElementById()
      //   // }
      // });

      // if(message.sixArray.length != 0){

      // for(let index = 0; index < message.sixArray.length; index++){
      message.gottisInside.forEach((element: any) => {
        // console.log('element---', element);
        var d = document.getElementById(element);
        console.log(d);
        d!.classList.add('useMe');
        //d.className += " useMe";
        console.log(d);
      });
      // message.gottisOutside.forEach((element: any) => {
      //   // console.log('element---', element);
      //   var d = document.getElementById(element);
      //   console.log(d);
      //   d!.classList.add('useMe');
      //   //d.className += " useMe";
      //   // console.log(d);
      // });
      // }
      //}
    });
  }
  removeShakeAnimation(gottisInside: any, gottisOutside: any) {
    for (let i = 0; i < gottisOutside.length; i++) {
      for (let j = 0; j < gottisOutside[i].length; j++) {
        let gotti = document.querySelector('#' + gottisOutside[i][j]);
        if (gotti) gotti.classList.remove('useMe');
      }
    }
    for (let i = 0; i < gottisInside.length; i++) {
      for (let j = 0; j < gottisInside[i].length; j++) {
        let gotti = document.querySelector('#' + gottisInside[i][j]);
        if (gotti) gotti.classList.remove('useMe');
      }
    }
  }
  killGotti(killed: any) {
    this.soundService.playAudio('Killed');
    let color = killed.substr(0, killed.length - 1);
    let spots = document.getElementsByClassName('home_' + color);
    for (let j = 0; j < spots.length; j++) {
      if (spots[j].children.length == 0) {
        spots[j].appendChild(document.querySelector('#' + killed)!);
        break;
      }
    }
  }
  setHtmlEvents() {
    console.log('setHtmlEvents');
    for (let i = 1; i <= 136; i++) {
      console.log('setting HTML Events count => ', i);
      if (
        (i < 69 || i > 99) &&
        (i < 107 || i > 109) &&
        (i < 117 || (i > 119 && (i < 127 || i > 129)))
      ) {
        document
          .getElementById(i.toString())!
          .addEventListener('click', ($event) => this.Gotticlicked($event));
      }
    }
    document
      .getElementById('ludo_screen_back_button')!
      .addEventListener('click', () => this.back(0));
    document
      .getElementById('ludo_screen_setting_button')!
      .addEventListener('click', () => this.settingsClick());
    document
      .getElementById('roll1')!
      .addEventListener('click', (event) => this.DiceClicked(event));
    document
      .getElementById('roll2')!
      .addEventListener('click', (event) => this.DiceClicked(event));
    document
      .getElementById('roll3')!
      .addEventListener('click', (event) => this.DiceClicked(event));
    document
      .getElementById('roll4')!
      .addEventListener('click', (event) => this.DiceClicked(event));

    document
      .getElementById('home_red_left')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_red_right')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_red_bottom_left')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_red_bottom_right')!
      .addEventListener('click', (event) => this.Gotticlicked(event));

    document
      .getElementById('home_green_left')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_green_right')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_green_bottom_left')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_green_bottom_right')!
      .addEventListener('click', (event) => this.Gotticlicked(event));

    document
      .getElementById('home_blue_left')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_blue_right')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_blue_bottom_left')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_blue_bottom_right')!
      .addEventListener('click', (event) => this.Gotticlicked(event));

    document
      .getElementById('home_yellow_left')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_yellow_right')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_yellow_bottom_left')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_yellow_bottom_right')!
      .addEventListener('click', (event) => this.Gotticlicked(event));
  }
  removeHtmlGameEvents() {
    console.log('setHtmlEvents');
    for (let i = 1; i <= 136; i++) {
      console.log('setting HTML Events count => ', i);
      if (
        (i < 69 || i > 99) &&
        (i < 107 || i > 109) &&
        (i < 117 || (i > 119 && (i < 127 || i > 129)))
      ) {
        document
          .getElementById(i.toString())!
          .removeEventListener('click', (event) => this.Gotticlicked(event));
      }
    }
    document
      .getElementById('ludo_screen_back_button')!
      .removeEventListener('click', () => this.back(0));
    document
      .getElementById('ludo_screen_setting_button')!
      .removeEventListener('click', () => this.settingsClick());
    document
      .getElementById('roll1')!
      .removeEventListener('click', (event) => this.DiceClicked(event));
    document
      .getElementById('roll2')!
      .removeEventListener('click', (event) => this.DiceClicked(event));
    document
      .getElementById('roll3')!
      .removeEventListener('click', (event) => this.DiceClicked(event));
    document
      .getElementById('roll4')!
      .removeEventListener('click', (event) => this.DiceClicked(event));

    document
      .getElementById('home_red_left')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_red_right')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_red_bottom_left')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_red_bottom_right')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));

    document
      .getElementById('home_green_left')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_green_right')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_green_bottom_left')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_green_bottom_right')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));

    document
      .getElementById('home_blue_left')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_blue_right')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_blue_bottom_left')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_blue_bottom_right')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));

    document
      .getElementById('home_yellow_left')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_yellow_right')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_yellow_bottom_left')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
    document
      .getElementById('home_yellow_bottom_right')!
      .removeEventListener('click', (event) => this.Gotticlicked(event));
  }
  gottiHome(id: any) {
    let col = id.replace(/[0-9]/g, '');
    let gotti = document.querySelector('#' + id)!;
    console.log('Gotti reached home -> ', gotti.id);
    if (id.includes('yellow')) {
      document.querySelector('.finished_blue')!.appendChild(gotti);
      console.log(document.querySelector('.finished_blue'));
    } else if (id.includes('red')) {
      document.querySelector('.finished_green')!.appendChild(gotti);
      console.log(document.querySelector('.finished_green'));
    } else if (id.includes('green')) {
      document.querySelector('.finished_yellow')!.appendChild(gotti);
      console.log(document.querySelector('.finished_yellow'));
    } else if (id.includes('blue')) {
      document.querySelector('.finished_red')!.appendChild(gotti);
      console.log(document.querySelector('.finished_red'));
    }

    console.log(gotti);
  }

  boardColour(type: any) {
    switch (type) {
      case 'red':
        if (this.global1.boardType == 'Board_1') {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/Pin_placeholder.png) 0/100% 100% no-repeat #1293eb',
          };
        } else if (this.global1.boardType == 'Board_2') {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/Pin_placeholder.png) 0/100% 100% no-repeat #1293eb',
          };
        } else {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/Pin_placeholder.png) 0/100% 100% no-repeat #000000',
          };
        }
        break;

      case 'blue':
        if (this.global1.boardType == 'Board_1') {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/green.png) 0/100% 100% no-repeat #00d806',
          };
        } else if (this.global1.boardType == 'Board_2') {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/green.png) 0/100% 100% no-repeat #00d806',
          };
        } else {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/green.png) 0/100% 100% no-repeat #000000',
          };
        }
        break;
      case 'green':
        if (this.global1.boardType == 'Board_1') {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/yellow.png) 0/100% 100% no-repeat #ffb000',
          };
        } else if (this.global1.boardType == 'Board_2') {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/yellow.png) 0/100% 100% no-repeat #ffb000',
          };
        } else {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/yellow.png) 0/100% 100% no-repeat #000000',
          };
        }
        break;
      case 'yellow':
        if (this.global1.boardType == 'Board_1') {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/red.png) 0/100% 100% no-repeat #fa1501',
          };
        } else if (this.global1.boardType == 'Board_2') {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/red.png) 0/100% 100% no-repeat #fa1501',
          };
        } else {
          return {
            background:
              'url(../../assets/images/Ludo_Gameplay_Assets/red.png) 0/100% 100% no-repeat #000000',
          };
        }
        break;
      default:
        return {
          background:
            'url(../../assets/images/Ludo_Gameplay_Assets/House_image_Red.png)',
        };
    }
  }
  boardCheck(type: any) {
    switch (type) {
      case 'red':
        if (this.global1.boardType == 'Board_1') {
          return {
            border: '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/House_Image_Blue.png)',
          };
        } else if (this.global1.boardType == 'Board_2') {
          return {
            border: '1.5px white solid',
            'background-image': 'url(' + this.global1.adimg1 + ')',
            // 'url(../../assets/images/Ludo_Gameplay_Assets/Brand1.png)',
          };
        } else {
          return {
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/BlueHouse.png)',
          };
        }
        break;

      case 'blue':
        if (this.global1.boardType == 'Board_1') {
          return {
            border: '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/House_Image_Green.png)',
          };
        } else if (this.global1.boardType == 'Board_2') {
          return {
            border: '1.5px white solid',
            'background-image': 'url(' + this.global1.adimg3 + ')',
            //'url(../../assets/images/Ludo_Gameplay_Assets/Brand3.png)',
          };
        } else {
          return {
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/GreenHouse.png)',
          };
        }
        break;
      case 'green':
        if (this.global1.boardType == 'Board_1') {
          return {
            border: '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/House_image_Yellow.png)',
          };
        } else if (this.global1.boardType == 'Board_2') {
          return {
            border: '1.5px white solid',
            'background-image': 'url(' + this.global1.adimg2 + ')',
            //'url(../../assets/images/Ludo_Gameplay_Assets/Brand2.png)',
          };
        } else {
          return {
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/YellowHouse.png)',
          };
        }
        break;
      case 'yellow':
        if (this.global1.boardType == 'Board_1') {
          return {
            border: '1.5px white solid',
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/House_image_Red.png)',
          };
        } else if (this.global1.boardType == 'Board_2') {
          return {
            border: '1.5px white solid',
            'background-image': 'url(' + this.global1.adimg4 + ')',
            //'url(../../assets/images/Ludo_Gameplay_Assets/Brand4.png)',
          };
        } else {
          return {
            'background-image':
              'url(../../assets/images/Ludo_Gameplay_Assets/RedHouse.png)',
          };
        }
        break;
      default:
        return {
          'background-image':
            'url(../../assets/images/Ludo_Gameplay_Assets/House_image_Red.png)',
        };
    }
  }
}

// server = client
// starting gotti
// yellow = red;
// green = yellow;
// red = blue;
// blue = green;
// at home
// yellow- blue
// red- green
// blue-red
// green- yellow
