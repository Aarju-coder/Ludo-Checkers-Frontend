
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  } 
  token :any;

  requestPermission(): Observable<boolean> {
    return new Observable(observer => {
      this.angularFireMessaging.requestToken.subscribe(
        (token) => {
          console.log(token);
          this.token = token;
          observer.next(true);
          observer.complete();
        },
        (err) => {
          console.error('Unable to get permission to notify.', err);
          observer.next(false);
          observer.complete();
        }
      );
    });
  }
  // requestPermission() {
  //   let bool = false;
  //   this.angularFireMessaging.requestToken.subscribe(
  //     (token) => {
  //       console.log(token);
  //       this.token = token;
  //       bool = true;
  //     },
  //     (err) => {
  //       console.error('Unable to get permission to notify.', err);
  //     }
  //   );
  //   return bool;
  // }
  _id:any;
   subscribeTokenToTopic(id:any) {
   // console.log(String(process.env.gcm_sender_id),"gcm key");
   this._id = id;
    fetch('https://iid.googleapis.com/iid/v1/'+this.token+'/rel/topics/'+'Game_'+id, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'key='+ environment.gcm_sender_id
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
      }

      console.log('Subscribed to "'+'Game'+'"'+id);
      //console.log("keyyyy",environment.gcm_sender_id);

    }).catch(error => {
      console.error(error);
    })
  }
  receiveMessage() {
    this.angularFireMessaging.messaging.subscribe((payload) => {

    })
    this.angularFireMessaging.messages.subscribe(
      (payload:any) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      },(err:any)=>{
        console.log("new firebase err received. ", err);
      })
  }

  deleteMessage() {
   
      this.angularFireMessaging.deleteToken(this.token)
      if(this._id != null || this._id != undefined){
        fetch('https://iid.googleapis.com/iid/v1:batchRemove', {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'key='+ environment.gcm_sender_id
          }),
          body:JSON.stringify({
            "to": "/topics/"+'Game_'+this._id,
            "registration_tokens": [this.token]
        })
        }).then(response => {
          if (response.status < 200 || response.status >= 400) {
            throw 'Error unsubscribing to topic: '+response.status + ' - ' + response.text();
          }
          console.log('UnSubscribed to "'+'Game'+'"',response);
          //console.log("keyyyy",environment.gcm_sender_id);
        }).catch(error => {
          console.error(error);
        })
  }
}
}
