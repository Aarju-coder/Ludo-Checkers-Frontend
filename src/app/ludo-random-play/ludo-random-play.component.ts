import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from './item';
import { ITEMS } from './mock-data';
import { GlobalDetails } from '../globalVars';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
import { Client } from 'colyseus.js';
// //const ludoClient = new Client("wss://mojogos.ao/ludo");
// const ludoClient = new Client("ws://localhost:3003");
// //const client = new Client("ws://localhost:3003");
// //const checkersClient = new Client("ws://34.197.91.228:3002");
// const checkersClient = new Client('wss://mojogos.ao/checkers');
// // For sign in: ws://34.197.91.228:3001/
@Component({
  selector: 'app-ludo-random-play',
  templateUrl: './ludo-random-play.component.html',
  styleUrls: ['./ludo-random-play.component.css'],
})
export class LudoRandomPlayComponent implements OnInit {
  itemsList: Item[] = ITEMS;
  radioSel: any;
  radioSelected: string = '';
  radioSelectedString: string = '';
  gameType: string = '';

  indexOfEntry: number = 0;

  entryArray = [3.8, 4.8, 5.8, 6.8, 7.8];
  rewardsArray = [9.88, 12.48, 15.08, 17.68, 20.28];

  entry: number = this.entryArray[this.indexOfEntry];
  reward: number = this.rewardsArray[this.indexOfEntry];

  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent;
  constructor(private router: Router, public global: GlobalDetails, private soundService: SoundServiceService, public langModel: LanguageModel) {
    if (this.global.LudoGameType == 'PWF') {
      this.gameType = this.langModel.componentLang.pwfPage.heading[this.langModel.lang];
    } else if (this.global.LudoGameType == 'RP') {
      this.gameType = this.langModel.componentLang.randomplayPage.randomPlay[this.langModel.lang];
    }
    //  this.maxClients * this.betAmount - (this.maxClients * this.betAmount)*0.35


    if (this.global.gameName != 'Ludo') {
      this.entryArray = [1.9, 2.9, 3.9, 4.9, 5.9];
      this.rewardsArray = [2.74, 4.18, 5.62, 7.05, 8.49];
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      this.global.checkerEntryAmt = this.entry;
      this.global.checkerRewardAmt = this.reward;
    }
    console.log('player name.', this.global.userName);
    this.itemsList = ITEMS;
    this.radioSelected = 'item_1';
    this.getSelecteditem();
  }
  getSelecteditem() {
    this.radioSel = ITEMS.find((Item) => Item.value === this.radioSelected);
    this.radioSelectedString = JSON.stringify(this.radioSel);
    console.log('radio selected--->', this.radioSel.name);
    this.global.gottiId = parseInt(this.radioSel.name);
    if (this.radioSel.value == 'item_2') {
      // this.radioSelectedNumber = true;
      // this.radioSelectedEmail = false;
    } else if (this.radioSel.value == 'item_1') {
      // this.radioSelectedNumber = false;
      // this.radioSelectedEmail = true;
    }
    if (this.global.gameName == 'Ludo') this.setRewardAmt(this.radioSel.name);
  }
  setRewardAmt(playerNum: any) {
    this.entry = this.entryArray[this.indexOfEntry];
    for (var i = 0; i < this.entryArray.length; i++) {
      var rewardNum = (playerNum * this.entryArray[i] - (playerNum * this.entryArray[i]) * 0.35).toFixed(2);
      var finalAmt = (Number(rewardNum) - Number(rewardNum) * 0.10).toFixed(2);
      this.rewardsArray[i] = Number(finalAmt);
    }

    this.reward = this.rewardsArray[this.indexOfEntry];
    this.global.ludoEntryAmt = this.entry;
    this.global.ludoRewardAmt = this.reward;
    console.log(this.rewardsArray, this.entry, this.reward);

  }
  onItemChange(item: any) {
    this.getSelecteditem();
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    if (this.global.gameName == 'Ludo') {
      document.querySelector('.board1')!.classList.add('selected');
      this.global.boardType = "Board_1";
    }
  }
  // async checkLudoConnectionToServer(): Promise<boolean>{
  //   let bool = false
  //   await ludoClient.getAvailableRooms("ludo2PlayerLobbyRoom").then(rooms => {
  //     console.log("total rooms ludo 2 player lobby -> ",rooms.length);
  //     bool = true
  //   }).catch(e => {
  //     console.error(e);
  //     bool = false
  //   });
  //   console.log("bool", bool)
  //   return bool;
  // }
  // async checkCheckersConnectionToServer(): Promise<boolean>{
  //   let bool = false
  //   await checkersClient.getAvailableRooms("lobby").then(rooms => {
  //     console.log("total rooms checkers lobby -> ",rooms.length);
  //     bool = true
  //   }).catch(e => {
  //     console.error(e);
  //     bool = false
  //   });
  //   return bool;
  // }
  async start() {
    this.soundService.playAudio('click');
    if (this.global.gameName == 'Ludo') {
      // if(await this.checkLudoConnectionToServer()){
        console.log("entrtAmount -> ", this.global.ludoEntryAmt, " globalCoins ",this.global.coins)
      if (this.global.ludoEntryAmt <= this.global.coins)
        this.router.navigateByUrl('ludoGame');
      else {
        this.messagePopUp.isVisible = true;
        this.messagePopUp.popupMessage = this.langModel.componentLang.popups.lowBal[this.langModel.lang];
        this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        this.messagePopUp.type = 'option';
        this.messagePopUp.btnText = this.langModel.componentLang.popups.buy[this.langModel.lang];
      }
      // }else{
      //   this.messagePopUp.isVisible = true;
      //   this.messagePopUp.popupMessage = "Not Able To Establish Connection, Please check your internet connection!";
      //   this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      // }
      
    } else {
      // if(await this.checkCheckersConnectionToServer()){
        console.log("entrtAmountcheckers -> ", this.global.ludoEntryAmt, " globalCoins ",this.global.coins)
        if (this.global.checkerEntryAmt <= this.global.coins) {
          // this.global.checkersGameType = 'RP';
          this.router.navigateByUrl('checkers');
        }
        else {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.lowBal[this.langModel.lang];
          this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
          this.messagePopUp.type = 'option';
          this.messagePopUp.btnText = this.langModel.componentLang.popups.buy[this.langModel.lang];
        }
      // }else{
      //   this.messagePopUp.isVisible = true;
      //   this.messagePopUp.popupMessage = "Not Able To Establish Connection, Please check your internet connection!";
      //   this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
      // }
      
    }
  }
  onClaim(evt: any) {
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible = false;
    if (evt == 'close') {

    }
    else {
       this.router.navigateByUrl('store');
    }
  }
  gameCheck(type: any) {
    switch (type) {
      case 'bg':
        if (this.global.gameName == 'Ludo') {
          return {
            'background-image':
              'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)',
          };
        } else {
          return {
            'background-image':
              'url(../../assets/img1/Repeatable_Bg.png),url(./../../assets/BG_1px.png)',
          };
        }
        break;
      case 'back-header':
        if (this.global.gameName == 'Ludo') {
          return {
            background:
              'url(../../assets/img1/Header_Stretchable.png) 0/100% 100% no-repeat',
          };
        } else {
          return {
            background:
              'url(../../assets/Checkers_Home/header.png) 0/100% 100% no-repeat',
          };
        }
        break;
      case 'btn':
        if (this.global.gameName == 'Ludo') {
          return {
            background:
              'url(../../assets/img1/button_green_bg.png) 0/100% 100% no-repeat',
          };
        } else {
          return {
            background:
              'url(../../assets/Checkers_Home/button_red.png) 0/100% 100% no-repeat',
          };
        }
        break;
      case 'betBox':
        if (this.global.gameName == 'Ludo') {
          return {
            background:
              'url(../../assets/img1/randomPlay/textbox.png) 0/100% 100% no-repeat',
          };
        } else {
          return {
            background:
              'url(../../assets/Checkers_Home/textboxChecker.png) 0/100% 100% no-repeat',
          };
        }
        break;
      case 'bet':
        if (this.global.gameName == 'Ludo') {
          return { color: '#850808' };
        } else {
          return { color: '#18a504' };
        }
        break;
      default:
        return {
          'background-image':
            'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)',
        };
    }
  }
  chooseBoard(type: any) {
    this.soundService.playAudio('click');
    this.global.boardType = "Board_" + type;
    document.querySelector('.board1')!.classList.remove('selected');
    document.querySelector('.board2')!.classList.remove('selected');
    document.querySelector('.board3')!.classList.remove('selected');
    document.querySelector('.board' + type)!.classList.add('selected');
  }
  back() {
    this.soundService.playAudio('click');
    this.router.navigateByUrl('ludoLandingPage');
  }
  increaseAmount() {
    this.soundService.playAudio('click');
    if (this.indexOfEntry < this.entryArray.length - 1) {
      this.indexOfEntry = this.indexOfEntry + 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      if (this.global.gameName == 'Ludo') {
        this.global.ludoEntryAmt = this.entry;
        this.global.ludoRewardAmt = this.reward;
      }
      else {
        this.global.checkerEntryAmt = this.entry;
        this.global.checkerRewardAmt = this.reward;
      }
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }
  decreaseAmount() {
    this.soundService.playAudio('click');
    if (this.indexOfEntry > 0) {
      this.indexOfEntry = this.indexOfEntry - 1;
      this.entry = this.entryArray[this.indexOfEntry];
      this.reward = this.rewardsArray[this.indexOfEntry];
      if (this.global.gameName == 'Ludo') {
        this.global.ludoEntryAmt = this.entry;
        this.global.ludoRewardAmt = this.reward;
      }
      else {
        this.global.checkerEntryAmt = this.entry;
        this.global.checkerRewardAmt = this.reward;
      }
      console.log(this.entry, this.reward, this.indexOfEntry);
    }
  }
}
