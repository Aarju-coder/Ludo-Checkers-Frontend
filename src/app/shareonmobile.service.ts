/***
Install plugin cordova-plugin-x-socialsharing from https://www.npmjs.com/package/cordova-plugin-x-socialsharing 
to use this service. It supports all the three mobile platforms. 
.........
This plugin is used for sharing message via different social platforms 
like Whatsapp, mail, sms etc....
***/
import { Injectable } from '@angular/core';
import { GlobalDetails } from 'src/app/globalVars';
//import { ModelViewLocator } from '../model/ModelViewLocator';

declare let window: any;
@Injectable()
export class ShareonmobileService {

  constructor(private model: GlobalDetails) { }

  openSharePvtRoom(displayCode: string){
    
    //console.log("share Code - > ", displayCode);
    var msgtoSend:string= displayCode.replace(/\"/g,"");;
   // var msgtoSend:string= "Use this Code: "+displayCode+"\xa0"+" Or Use this link:"+"\n" ;
    //var referurl:string = shareableLink;
    console.log("share Code - > ", msgtoSend);
    var options = {
      
      message: msgtoSend,
      subject: '', // fi. for email
      files: ['', ''], // an array of filenames either locally or remotely
      url: "",
      // chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title,
      // appPackageName: 'com.apple.social.facebook' // Android only, you can provide id of the App you want to share with
    };
    window.plugins.socialsharing.share(msgtoSend);
  // window.plugins.socialsharing.shareWithOptions(options, this.onSuccess, this.onError);
  //  window.plugins.socialsharing.shareViaWhatsApp(msgtoSend, null /* img */, referurl /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});

  //   window.plugins.socialsharing.shareViaSMS('My cool message', null , function(msg) {console.log('ok: ' + msg)}, function(msg) {});
  }


  onSuccess(result: any) {
    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  }
  
  onError(msg: any) {
    console.log("Sharing failed with message: " + msg);
  }
}
