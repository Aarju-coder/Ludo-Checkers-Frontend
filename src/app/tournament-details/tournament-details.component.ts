import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { MessagingService } from 'src/services/messaging.service';
import { PushNotificationService } from 'src/services/push-notification.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';
import { MessagepopupComponent } from '../messagepopup/messagepopup.component';
//import { Client } from 'colyseus.js';
//const client = new Client("ws://34.197.91.228:3003");
//const client = new Client("ws://localhost:3004");
@Component({
  selector: 'app-tournament-details',
  templateUrl: './tournament-details.component.html',
  styleUrls: ['./tournament-details.component.css'],
})
export class TournamentDetailsComponent implements OnInit {
  secStr: string = '00';
  minStr: string = '00';
  seconds = 0;
  minutes = 0;
  secondsP = 0;
  minutesP = 0;
  running = false;
  clockTime = '00:00';
  startClock = false;
  timerCount: any;
  tourStartTime: any;
  timeArray: any = [];
  Heading: string = '';

  @ViewChild(MessagepopupComponent)
  messagePopUp: MessagepopupComponent = new MessagepopupComponent();
  constructor(
    private messagingService: MessagingService,
    public pushNoti: PushNotificationService,
    private api: ApiServiceService,
    private router: Router,
    public global: GlobalDetails,
    private soundService: SoundServiceService,
    public langModel: LanguageModel
  ) {}

  ngOnInit(): void {
    this.Heading =
      this.langModel.componentLang.tourDetail.heading[this.langModel.lang];
    if (this.global.tournamentType == 'championship') {
      if (this.langModel.lang == 'en') this.Heading = 'Championship Details';
      else this.Heading = 'Detalhes do campeonato';
    }
    ///if user is registered
    this.getCheckerTourTime();
  }
  regOpenChecker:any =[];
  getCheckerTourTime(){
    this.global.tourDataArray =[];
    this.api.upcomingTournaments(this.global.tournamentType).subscribe((data: any) => {
      // this.global.tourDataArray=data;
      console.log(data, "data>>>>>");
      for (var i = 0; i < data.length; i++) {
        if (data[i].gameType == "CHECKER" || data[i].gameType == "checker") data[i].gameType = 'Checkers';
        if (data[i].gameType == "LUDO" || data[i].gameType == "ludo") data[i].gameType = 'Ludo';
        console.log(data[i].gameType, " abcd", this.global.gameName);
        if (data[i].gameType == this.global.gameName) {
          this.global.tourDataArray.push(data[i]);
         // this.global.tourDataArray[this.global.id] = data[this.global.id];
          console.log(this.global.tourDataArray, "chk123", this.global.tourDataArray.length);
        }
        else{
          this.timeArray[this.global.id] = ({ time: this.tourStartTime, clockStart: false });
        }
      }
      if(this.global.gameName == "Checkers") {
        var regOpen = new Date(this.global.tourDataArray[this.global.id].registrationOpens.slice(0, 19) + 'Z');
        var monthOpen = '' + (regOpen.getMonth() + 1),
        dayOpen = '' + regOpen.getDate(),
        yearOpen = regOpen.getFullYear();
    
        if (monthOpen.length < 2)
          monthOpen = '0' + monthOpen;
        if (dayOpen.length < 2)
          dayOpen = '0' + dayOpen;
    
        var finaldateOpen = [yearOpen, monthOpen, dayOpen].join('-');
        let finaltimeOpen = regOpen.toTimeString();
    
        console.log(finaldateOpen + 'T' + finaltimeOpen);
    
        this.regOpenChecker[this.global.id] = finaldateOpen + 'T' + finaltimeOpen;
        console.log("regopen", this.regOpenChecker[this.global.id]);
      }
      if(this.global.tourDataArray[this.global.id].startDate!=null  ){
        this.getTourTime(this.global.tourDataArray[this.global.id].startDate.slice(0, 19), this.global.tourDataArray[this.global.id].endDate
        .slice(0, 19),this.global.tourDataArray[this.global.id].registrationOpens
        .slice(0, 19),this.global.tourDataArray[this.global.id].registrationClose.slice(0, 19), this.global.id);
      }else{
        this.timeArray[this.global.id] = ({ time: this.tourStartTime, clockStart: false });
      }
    });
  }
  istConversion(upcomingDate:any, endDate:any, regOpen:any, regClose:any,index:any){
    var enddate = new Date(endDate + 'Z');
    var regopen = new Date(regOpen + 'Z');
    var regclose = new Date(regClose + 'Z');

    var month = '' + (upcomingDate.getMonth() + 1),
    day = '' + upcomingDate.getDate(),
    year = upcomingDate.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    var finaldate = [year, month, day].join('-');
    let finaltime = upcomingDate.toTimeString();

    console.log(finaldate + 'T' + finaltime);

    this.global.tourDataArray[index].startDate = finaldate + 'T' + finaltime;
/////////////////////////////////////
    var monthEnd = '' + (enddate.getMonth() + 1),
    dayEnd = '' + enddate.getDate(),
    yearEnd = enddate.getFullYear();

    if (monthEnd.length < 2)
      monthEnd = '0' + monthEnd;
    if (dayEnd.length < 2)
      dayEnd = '0' + dayEnd;

    var finaldateEnd = [yearEnd, monthEnd, dayEnd].join('-');
    let finaltimeEnd = enddate.toTimeString();

    console.log(finaldateEnd + 'T' + finaltimeEnd);

    this.global.tourDataArray[index].endDate = finaldateEnd + 'T' + finaltimeEnd;
///////////////////////////////
    var monthOpen = '' + (regopen.getMonth() + 1),
    dayOpen = '' + regopen.getDate(),
    yearOpen = regopen.getFullYear();

    if (monthOpen.length < 2)
      monthOpen = '0' + monthOpen;
    if (dayOpen.length < 2)
      dayOpen = '0' + dayOpen;

    var finaldateOpen = [yearOpen, monthOpen, dayOpen].join('-');
    let finaltimeOpen = regopen.toTimeString();

    console.log(finaldateOpen + 'T' + finaltimeOpen);

    this.global.tourDataArray[index].registrationOpens = finaldateOpen + 'T' + finaltimeOpen;
/////////////////
    var monthClose = '' + (regclose.getMonth() + 1),
    dayClose = '' + regclose.getDate(),
    yearClose = regclose.getFullYear();

    if (monthClose.length < 2)
      monthClose = '0' + monthClose;
    if (dayClose.length < 2)
      dayClose = '0' + dayClose;

    var finaldateClose = [yearClose, monthClose, dayClose].join('-');
    let finaltimeClose = regclose.toTimeString();

    console.log(finaldateClose + 'T' + finaltimeClose);

    this.global.tourDataArray[index].registrationClose = finaldateClose + 'T' + finaltimeClose;
  }
  getTourTime(startDate: any, endDate:any, regOpen:any, regClose:any, index: any) {
    if (this.global.tourDataArray[this.global.id].startDate != null) {
      var startDate = this.global.tourDataArray[this.global.id].startDate.slice(
        0,
        19
      );
      var upcomingDate = new Date(startDate + 'Z');
      var milliseconds1 = upcomingDate.getTime();
      this.istConversion(upcomingDate,endDate, regOpen, regClose, index);
      var datenow = new Date();
      console.log('upcomingDate', upcomingDate);
      var milliseconds2 = datenow.getTime();
      var milliseconds = milliseconds1 - milliseconds2;

      //var timeremain = this.timeRemaining(milliseconds);
      this.timeRemaining(milliseconds, milliseconds1);
    }
  }

  timeRemaining(milliseconds: any, milliseconds1: any) {
    console.log('time remain', milliseconds);
    // if (this.secondsP != 0 && this.minutesP != 0) {
    //   console.log("hereeeee", this.secondsP)
    //   seconds = this.secondsP;
    //   minutes = this.minutesP;
    // }
    // else {
    console.log('wwwwhereeeee', this.secondsP);
    var seconds = Math.floor((milliseconds / 1000) % 60);
    var minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    //}
    var hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    var days = Math.floor(milliseconds / 1000 / 60 / 60 / 24);
    console.log('time checkk', days, hours, minutes, seconds);

    if (milliseconds <= 0) {
      console.log('Check 1');
      if (this.langModel.lang == 'en') {
        if(this.global.tourDataArray[this.global.id].canJoin == false){
          this.tourStartTime = "Already Started!";
          this.clockTime = "Already Started!";
        }
        else{
          this.tourStartTime = "Start Now";
          this.clockTime = "Start Now";
        }
      }
      else {
        if(this.global.tourDataArray[this.global.id].canJoin == false){
          this.tourStartTime = "Já começou!";
          this.clockTime = "Já começou!";
        }
        else{
          this.tourStartTime = "Começar";
          this.clockTime = "Começar";
        }
       
      }
      this.isTimerOver = true;
      this.startClock = false;
    } else if (days == 1) {
      // console.log("Check 2")
      this.tourStartTime = days + ' day left';
      this.startClock = false;
    } else if (days > 1) {
      // console.log("Check 3")
      this.tourStartTime = days + ' days left';
      this.startClock = false;
    } else if (hours == 1) {
      // console.log("Check 4",hours)
      this.tourStartTime = hours + ' hour left';
      this.startClock = false;
    } else if (hours > 1) {
      // console.log("Check 4",hours)
      this.tourStartTime = hours + ' hours left';
      this.startClock = false;
    } else if (hours < 1) {
      //  console.log("Check 5")
      this.tourStartTime = 0;
      this.startClock = true;
      //console.log("Check 5")
      this.secondsP = seconds;
      this.minutesP = minutes;

      //this.start();
      this.running = true;
    }
    this.tourTimer(milliseconds1);
    var bool = this.startClock;

    this.timeArray[0] = { time: this.tourStartTime, clockStart: bool };
    console.log('this.global.tourDataArray', this.global.tourDataArray);
    this.tourStartTime = '';
    bool = false;
    //return this.tourStartTime;
  }
  isTimerOver = false;
  tourTimer(milliseconds1: any) {
    var self = this;
    if (this.isTimerOver == false) {
      self.clearTour = setTimeout(() => {
        clearTimeout(self.clearTour);
        var datenow = new Date();
        console.log('datenow', datenow);
        var milliseconds2 = datenow.getTime();
        var milliseconds = milliseconds1 - milliseconds2;
        self.timeRemaining(milliseconds, milliseconds1);
        if (self.running == true) self.updateTime();
      }, 1000);
    }
  }

  stop() {
    this.running = false;
    clearTimeout(this.clearTour);
  }

  clear() {
    this.secondsP = 0;
    this.minutesP = 0;
  }
  clearTour: any;

  updateTime() {
    this.secondsP--;
    //console.log("Check min and sec")
    if (this.secondsP < 0) {
      this.secondsP = 59;
      this.minutesP--;
    }
    if (this.minutesP <= 0) this.minutesP == 0;
    if (this.secondsP < 10) {
      this.secStr = '0' + this.secondsP;
    } else {
      this.secStr = this.secondsP.toString();
    }
    if (this.minutesP < 10) {
      this.minStr = '0' + this.minutesP;
    } else {
      this.minStr = this.minutesP.toString();
    }
    // console.log("PPPPPPPPPPPPP", this.minStr, this.secStr)

    if (this.langModel.lang == 'en')
      this.clockTime = 'Starts in ' + this.minStr + ':' + this.secStr;
    else this.clockTime = 'Começa em ' + this.minStr + ':' + this.secStr;

    // console.log("before start",this.minStr, this.secStr);
    if (Number(this.minStr) == 0 && Number(this.secStr) == 0) {
      console.log('before start 1123');
      this.isTimerOver = true;
      this.stop();

      if (this.langModel.lang == 'en') this.clockTime = 'Start Now';
      else this.clockTime = 'Começar';
    }
    //  console.log("clock ticking",this.clockTime);
  }

  onClaim(evt: any) {
    this.soundService.playAudio('click');
    this.messagePopUp.isVisible = false;
    if (evt == 'close') {
      // if(this.isFail == 'successfull') this.router.navigateByUrl('setProfile');
      // else if(this.isFail == 'error')this.router.navigateByUrl('register');
    }
  }

  onJoin(tournament_id: number) {
    this.soundService.playAudio('click');
    console.log('tournament_id -> ', tournament_id);

    this.api.registerToTournament(tournament_id).subscribe((data) => {
      console.log('response for registering -> ', data);
      if (data.status == false) {
        console.log('message>>>> ', data.msg);
        console.log("message>>>> ", data.msg);
        if (data.msg.startsWith("Player have insufficient balance")) {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.lowBal[this.langModel.lang];
          this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }
        else if (data.msg == "Registration date is close for the tournament") {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.regTimeup[this.langModel.lang];
          this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }
        else if (data.msg == "No more seats left for the tournament") {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.noMoreSeats[this.langModel.lang];
          this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }
        else if (data.msg == "Registration Not Opened yet.") {
          this.messagePopUp.isVisible = true;
          this.messagePopUp.popupMessage = this.langModel.componentLang.popups.regNotOpen[this.langModel.lang];
          this.messagePopUp.closetxt = this.langModel.componentLang.popups.close[this.langModel.lang];
        }
      } else {
        this.messagePopUp.isVisible = true;
        this.messagePopUp.popupMessage =
          this.langModel.componentLang.popups.isRegistered[this.langModel.lang];
        this.messagePopUp.closetxt =
          this.langModel.componentLang.popups.close[this.langModel.lang];
        this.global.coins = data.coins.toFixed(2);
        this.global.moneyAmt = (
          this.global.coins * this.global.moneyVal
        ).toFixed(2);
        //this.getTourTime();
        this.getCheckerTourTime();
        if(this.global.onMobile) this.pushNoti.subscribeTopic(tournament_id);
        else {
          if(this.global.notifyPermission == 'granted')this.checkToken(tournament_id);
        }
      
    }
    });
  }
  checkToken(tournament_id: number) {
    if (this.messagingService.token == undefined) {
      this.messagingService.requestPermission().subscribe((tokenBool) => {
        console.log(tokenBool, 'this.messagingService.token11111111');
        if (!tokenBool) {
          this.checkToken(tournament_id);
        }
      });
    } else {
        this.messagingService.subscribeTokenToTopic(tournament_id);
        this.messagingService.receiveMessage();
      
    }
  }
  gameStarted = false;
  enterGame(tournament_id: number, tournamentStartTime: any, t_name: string, entryFees:any, firstP:any, secondP:any, thirdP:any) {
    
    this.soundService.playAudio('click');
    console.log("enter game -> ", this.clockTime);
  if (this.clockTime == "Start Now" || this.clockTime == "Começar") {
  this.api.checkTournamentStatus(String(tournament_id)).subscribe((data)=>{
    console.log("tournament start data -> " + data);
    if(data){
      if (this.global.gameName == "Ludo") {
        this.global.LudoGameType = "Tourny";
        //this.global.ludoEntryAmt = entryFees;
        this.global.ludoRewardAmt = firstP;
        this.global.ludoSecRewardAmt = secondP;
        this.global.ludoThirdRewardAmt = thirdP;
        this.global.TournamentStartObject.tournament_id = tournament_id;
        this.global.TournamentStartObject.tournamentStartTime = tournamentStartTime;
        this.global.TournamentStartObject.t_name = t_name;
        this.global.TournamentStartObject.round = 1;
        this.gameStarted = true;
        this.router.navigateByUrl("ludoGame");
      } else {
        this.global.checkersGameType = "Tourny";
        //this.global.checkerEntryAmt = entryFees;
        this.global.checkerRewardAmt = firstP;
        this.global.checkerSecRewardAmt = secondP;
        this.global.TournamentStartObject.tournament_id = tournament_id;
        this.global.TournamentStartObject.tournamentStartTime = tournamentStartTime;
        this.global.TournamentStartObject.t_name = t_name;
        this.global.TournamentStartObject.round = 1;
        this.gameStarted = true;
        this.router.navigateByUrl("checkers");
      }
    }else{
      if(this.langModel.lang == "en"){
        this.clockTime = "Already Started!";
        this.timeArray[0].time = "Already Started!";
      }
      else{
        this.clockTime = "Já começou!";
        this.timeArray[0].time = "Já começou!";
      }
      
      this.messagePopUp.isVisible = true;
      this.messagePopUp.popupMessage = this.langModel.componentLang.popups.TournamentStatus[this.langModel.lang]
      
    }
  }, (e)=>{
    console.log("error getting tourny status : ", e.message);
  })
  }
  
  
}
  back() {
    this.soundService.playAudio('click');
    this.stop();
    this.router.navigateByUrl('tournaments');
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
      case 'redbox':
        if (this.global.gameName == 'Ludo') {
          return {
            background: '#660606',
            border: '2px solid #a42323',
          };
        } else {
          return {
            background: '#006200',
            border: '2px solid #3c9f21',
          };
        }
        break;
      case 'redBox-header':
        if (this.global.gameName == 'Ludo') {
          return { color: '#9a0e0e' };
        } else {
          return { color: '#006200' };
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

      case 'yellowbtn':
        if (this.global.gameName == 'Ludo') {
          return {
            background:
              'url(../../assets/img1/button_green_bg.png) 0/100% 100% no-repeat',
            color: '#fff',
          };
        } else {
          return {
            background:
              'url(../../assets/Checkers_Home/button_red.png) 0/100% 100% no-repeat',
            color: '#fff',
          };
        }
        break;
      case 'betbox':
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
      default:
        return {
          'background-image':
            'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)',
        };
    }
  }
}
