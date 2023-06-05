/***
Install plugin cordova-plugin-firebase from https://www.npmjs.com/package/cordova-plugin-firebase 
to use this service. It supports all the three mobile platforms. 
.........
In this plugin I have tried to navigate on specific page after 
user tap on notification and receives the info, also i check if
the user is already logged in or not before navigating the user.
***/

import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { LocalDbService } from './local-db.service';

declare var device: any;
declare let window :any;
@Injectable()
export class PushNotificationService {

  deviceType: any;
  deviceToken: any;
  notificationToken: any;
  routeName: any;
 // public onNotificationClick: Subject<any>;
//  public onTokenRecieved: ReplaySubject<any>;
  constructor(private zone: NgZone, private router: Router, public localDb: LocalDbService) {
   // alert('pushnotificationservice'+window.cordova);
  // this.onNotificationClick=new Subject<any>();
  // this.onTokenRecieved =new ReplaySubject<any>();
    let self = this;
    // if(this.model.onFirstApp)
    // document.addEventListener('deviceready',this.setupFcm.bind(this));
   
    
  }

  setupFcm() 
    { 
    //  alert("is here");
      // function setupFcm(){ //console.log('setup FCM here');
      window.plugins.insomnia.keepAwake();
      
      
        this.getFcmToken();
        //this.subscribeTopic();
            // setTimeout(() => {
            //   this.refreshFcmToken();
            // }, 1000);
  
        this.openNotification();
        
        
  }
   // Get pushnotification function
   
  getFcmToken() {  
    let self = this;
    window.FirebasePlugin.getToken(function(token:any) {
     // alert("to recive token");
      // save this server-side and use it to push notifications to this device
      self.notificationToken = token;
      //self.model.fcmToken = token;
      // self.model.setFcmToken(self.notificationToken);
     // self.localDb.addFcmDetails();//(self.notificationToken)
      // console.log('check from self '+ self.model.fcmToken);
      console.log(token);
      //this.onTokenRecieved.next(true);
  }, function(error:any) {
    //alert(' erroorrrr 11111'+ JSON.stringify(error));
      console.error(error);
      
  });
  }
   
   // Called when token refreshed
  refreshFcmToken() {
    let self :any = this;
    window.FirebasePlugin.onTokenRefresh(function(token:any) {
      // save this server-side and use it to push notifications to this device
      
      // console.log('FCMPlugin token refresh angular'+token);
      if(token != self.notificationToken){
        self.notificationToken = token;
        self.model.fcmToken = token;
        //self.localDb.setFcmData(self.notificationToken);
      }
        console.log(token);
    }, function(error:any) {
        console.error(error);
    });
  }

  subscribeTopic(id:any) { 
    window.FirebasePlugin.subscribe("Game_"+id);
    //alert(' token..'+ "Game_"+id);
  }

   // On open notification
  openNotification() {
    let self = this;
    window.FirebasePlugin.onMessageReceived(function(notification: any) {
    // alert('notifctn tapped..'+ JSON.stringify(notification));
      if(notification.wasTapped) {
        console.log(' notification tapped'+ JSON.stringify(notification));
        //self.router.navigateByUrl('homePage');
      } else {
        console.log(' not tapped'+ JSON.stringify(notification));
      }
      self.routeName = notification.gameId;
    //  self.checkIfLogin();
    }, function(error : any) {
     // alert(' erroorrrr'+ JSON.stringify(error));
        console.error(error);
    });
  }

  // routeDestination(name) {

  //   switch(name){
  //     case 'playDailyConfig':
  //     //  alert("playDailyConfig");
  //    // this.onNotificationClick.next(true);
     
  //     break;

  //     case 'room':
  //     console.log('in room ')
  //     break;
  //     case 'tourney':
  //     if(this.model.guestUser() == true) {
  //       this.zone.run(() => this.router.navigate(['/landingpage']));
  //     } else {
  //       this.zone.run(() => this.router.navigate(['/tourPage']));
  //     }
  //     break;
  //     case 'bonus':
  //       this.zone.run(() => this.router.navigate(['/bonus']));
  //     break;
  //     case 'auction':
  //     this.zone.run(() => this.router.navigate(['/auctions']));
  //     break;

  //     case 'invite':
  //       this.zone.run(() => this.router.navigate(['/bonus']));
  //       this.model.openinvite =true;
  //       break;
  //     // case 'avatar':
  //     //   this.zone.run(() => this.router.navigate(['/avatarShop']));
  //     // break;
  //   }
  // }
  //Checking if the user is already logged in or not before navigating.
  // checkIfLogin() 
  // {
  //   var data: any;
  //   data = this.localDb.getUserData();
  //   if(data.length != 0)
  //   {
  //     this.model.userId = data[0].userid;
  //     this.model.token = data[0].token;
  //     this.model.userName = data[0].username;
  //     this.model.imageUrl = data[0].imageUrl;
  //     this.model.fbid = data[0].fbid;
  //     this.model.vibration = data[0].vibration;
  //     this.model.autocam = data[0].manualcam;
  //     this.model.soundId = data[0].soundid;
  //     if(this.model.autocam==null)this.model.autocam =false;
  //     this.getCurrencyData();
  //     this.routeDestination(this.routeName);
  //   } else {
  //     this.zone.run(() => this.router.navigate(['/login']));
  //   }
  // }
  //Hitting api to get user wallet details.
 

  getDeviceDetail() {
      this.deviceType = device.platform;
      this.deviceToken = device.uuid; 
  }
}
