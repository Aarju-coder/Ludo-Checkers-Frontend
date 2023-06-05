import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalDetailsClub} from '../clubGlobalVars';
import { Observable } from 'rxjs';
import { GlobalDetails } from 'src/app/globalVars';

@Injectable({
  providedIn: 'root'
})
export class ClubApiServicesService {
  apiUrl:any;
  constructor( private http: HttpClient,private global:GlobalDetailsClub,private gameGlobal:GlobalDetails) { 

  }

  signIn():Observable<any>{
      
    const headers = { 'content-type': 'application/json'}  
    let param;
    if(this.global.phnum){
       param = {
        "password" : this.global.password,
        "phoneNumber" : this.global.phnum
        // userId: this.model.userId.toString(),
        // chips: coins
      };
    }
    else{
       param = {
        "password" : this.global.password,
        "email" : this.global.email
        // userId: this.model.userId.toString(),
        // chips: coins
      };
      
    }
    //this.apiUrl = 'https://14.141.58.163:8443/play-daily-config/give-coins';
    this.apiUrl = 'https://mojogos.ao:8443/register-login/signin';
    //console.log(this.apiUrl+'&userid='+this.model.userId.toString()+'&token='+this.model.token+'&points='+itemid+'&tranSource='+type+'&purchaseToken='+token+'&pid='+pid, " -----------------");

      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers});
      // .pipe(map((res: Response) => res),
      // catchError((e) => {
      // //  alert(e+"erorrrrrrrrrrrrrrrrrr"+JSON.stringify(e));  
      //    return Observable.throw(new Error(`${ e.status } ${ e.statusText }`)) 
      // }))
  
  }
  signUp():Observable<any>{
     
    const headers = { 'content-type': 'application/json'}  
  
    let param = {
      "password" : this.global.password,
      "email" : this.global.email
      // userId: this.model.userId.toString(),
      // chips: coins
    };
    //this.apiUrl = 'https://14.141.58.163:8443/play-daily-config/give-coins';
      if(!this.global.isforgotPwd) this.apiUrl = 'https://mojogos.ao:8443/register-login/signup';
      else this.apiUrl = 'https://mojogos.ao:8443/register-login/reset-password';
      //console.log(this.apiUrl+'&userid='+this.model.userId.toString()+'&token='+this.model.token+'&points='+itemid+'&tranSource='+type+'&purchaseToken='+token+'&pid='+pid, " -----------------");
  
      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers});
      // .pipe(map((res: Response) => res),
      // catchError((e) => {
      // //  alert(e+"erorrrrrrrrrrrrrrrrrr"+JSON.stringify(e));  
      //    return Observable.throw(new Error(`${ e.status } ${ e.statusText }`)) 
      // }))
  
  }

  phoneSignUp():Observable<any>{
    let param= {
      "password" : this.global.password,
      "phoneNumber" : this.global.phnum
    }
    const headers = { 'content-type': 'application/json'}
    
    if(!this.global.isforgotPwd)this.apiUrl = 'https://mojogos.ao:8443/register-login/signup';
    else this.apiUrl = 'https://mojogos.ao:8443/register-login/resetPasswordByMobile';
      
      console.log("phonesignup")

      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers})
  }
  phoneOtp():Observable<any>{
    // let param={
    //   'phoneNumber':this.global.myphone
    // }
    const headers = { 'content-type': 'application/json'}

    this.apiUrl='https://mojogos.ao:8443/register-login/sendMoblieNumber/'+this.global.agentPhone;
    console.log("PhoneOtp")
    return this.http.post(this.apiUrl,{'headers':headers})
  }
  phoneOtpVerification():Observable<any>{
    let param={
      'phoneNumber':this.global.agentPhone,
      'otp':this.global.OTP
    }
    const headers = { 'content-type': 'application/json'}


    this.apiUrl="https://mojogos.ao:8443/register-login/otpVerify/"+this.global.agentPhone+'/'+this.global.OTP
    console.log("PhoneOtpVarification")
    //return this.http.post(this.apiUrl,JSON.stringify(param))
    return this.http.post(this.apiUrl,{'headers':headers})
  }
  phoneOtpResend():Observable<any>{
    let param={
      'phoneNumber':this.global.phnum
    }
    const headers = { 'content-type': 'application/json'}

    this.apiUrl='https://mojogos.ao:8443/register-login/generateOtpForPassReset';
    console.log("PhoneOtp")
    return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers})
  }
  phoneOtpVerificationResend():Observable<any>{
    let param={
      'phoneNumber':this.global.phnum,
      'mobileOtp':this.global.OTP
    }
    const headers = { 'content-type': 'application/json'}


    this.apiUrl="https://mojogos.ao:8443/register-login/verifyOtpForPassReset";
    console.log("PhoneOtpVarification")
    //return this.http.post(this.apiUrl,JSON.stringify(param))
    return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers})
  }
  getOtpEmail():Observable<any>{
     
    const headers = { 'content-type': 'application/json'}  
  
    let param;
    if(this.global.isforgotPwd){
      param = {
        "email" : this.global.email
      };
    }else{
      param = {
        "email" : this.global.agentEmail
      };
    }
      if(!this.global.isforgotPwd) this.apiUrl = 'https://mojogos.ao:8443/register-login/generate-verify-otp';
      else this.apiUrl = 'https://mojogos.ao:8443/register-login/generate-otp';
      //console.log(this.apiUrl+'&userid='+this.model.userId.toString()+'&token='+this.model.token+'&points='+itemid+'&tranSource='+type+'&purchaseToken='+token+'&pid='+pid, " -----------------");
      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers});
      // .pipe(map((res: Response) => res),
      // catchError((e) => {
      // //  alert(e+"erorrrrrrrrrrrrrrrrrr"+JSON.stringify(e));  
      //    return Observable.throw(new Error(`${ e.status } ${ e.statusText }`)) 
      // }))
  
  }
  verifyOtpEmail(otp:any):Observable<any>{
     
    const headers = { 'content-type': 'application/json'}  
  
    let param;
    if(this.global.isforgotPwd){
      param = {
        "email" : this.global.email,
        "otpNo" : otp
      };
    }else{
      param = {
        "email" : this.global.agentEmail,
        "otpNo" : otp
      };
    }
    if(!this.global.isforgotPwd) this.apiUrl = 'https://mojogos.ao:8443/register-login/validate-verify-otp';
     else this.apiUrl = 'https://mojogos.ao:8443/register-login/validate-otp';
      //console.log(this.apiUrl+'&userid='+this.model.userId.toString()+'&token='+this.model.token+'&points='+itemid+'&tranSource='+type+'&purchaseToken='+token+'&pid='+pid, " -----------------");
      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers});
      // .pipe(map((res: Response) => res),
      // catchError((e) => {
      // //  alert(e+"erorrrrrrrrrrrrrrrrrr"+JSON.stringify(e));  
      //    return Observable.throw(new Error(`${ e.status } ${ e.statusText }`)) 
      // }))
  
  }
  checkUserName(userName:any):Observable<any>{
     
    const headers = { 'content-type': 'application/json'}  
  
    let param = {
      "userName" : userName
    };
      this.apiUrl = 'https://mojogos.ao:8443/register-login/findUserName';
      //console.log(this.apiUrl+'&userid='+this.model.userId.toString()+'&token='+this.model.token+'&points='+itemid+'&tranSource='+type+'&purchaseToken='+token+'&pid='+pid, " -----------------");
      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers});
      // .pipe(map((res: Response) => res),
      // catchError((e) => {
      // //  alert(e+"erorrrrrrrrrrrrrrrrrr"+JSON.stringify(e));  
      //    return Observable.throw(new Error(`${ e.status } ${ e.statusText }`)) 
      // }))
  
  }

  clubList(upperLimit: number, lowerLimit:number): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    //console.log("pagination>>> ", lowerLimit,'10');
    let param = {
      'upperLimit': 20,
      'lowerLimit': lowerLimit,
    };
    this.apiUrl = 'https://admin.mojogos.ao:8443/admin-panel/get-clubs';

    return this.http.post(this.apiUrl,  param, {
      headers: headers,
    })
  }

  addAgent(): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    let param;
    if(this.global.agentPhnNum){ param = {
      "clubId":this.global.clubId,
      "phone" :[this.global.agentPhnNum],
      "email" : []
      
    };}
    else if(this.global.agentEmail){
      param={
        "clubId":this.global.clubId,
        "email":[this.global.agentEmail],
        "phone" : []
      }
    }
    console.log(param,"paramsssssssss");
    this.apiUrl = 'https://admin.mojogos.ao:8443/admin-panel/add-agent';

    return this.http.post(this.apiUrl, JSON.stringify(param), {
      headers: headers,
    })
  }
  addAgentManual(): Observable<any> {
    const headers = { 'content-type': 'application/json' };

    // let param = {
    //   "userId" : this.global.userId,
    //   "email" : this.global.agentEmail,
    //  "address" : this.global.agentAddress,
    //   "password" : this.global.agentPassword,
    //   "firstName" :this.global.agentFname,
    //   "lastName" : this.global.agentLname,
    //    "phone" : this.global.agentPhone
    // };
    let param;
    if(this.global.agentPhone){
       param = {
        "userId" : this.global.userId,
        "registrationString" : this.global.agentPhone,
      "address" : this.global.agentAddress,
        "password" : this.global.agentPassword,
        "firstName" :this.global.agentFname,
        "lastName" : this.global.agentLname,
        "userName" : this.global.agentUserName
      };
    }
    else{
       param = {
        "userId" : this.global.userId,
        "registrationString" : this.global.agentEmail,
       "address" : this.global.agentAddress,
        "password" : this.global.agentPassword,
        "firstName" :this.global.agentFname,
        "lastName" : this.global.agentLname,
         "userName" : this.global.agentUserName
      };
      
    }
    console.log(param);
    //this.apiUrl = 'https://admin.mojogos.ao:8443/admin-panel/add-agent/manual';
    this.apiUrl = 'https://admin.mojogos.ao:8443/register-login/add-agent/manual';

    return this.http.post(this.apiUrl, param, {
      headers: headers,
    })
  }
  nifImageUpload(file:any): Observable<any> {
    
    const formData =  new FormData();

      formData.append("image", file);

      // let headerOptions = {
      //   "Authorization": 'Bearer ' + String(this.gameGlobal.authToken)
      // };

      // let requestOptions = {
      //   headers: new HttpHeaders(headerOptions),
      // };
  
      this.apiUrl = "https://mojogos.ao:8443/admin-panel/uploadNIF/" + this.gameGlobal.userId;
  
      return this.http.post(this.apiUrl, formData);
    
  }
  clubImageUpload(file:any): Observable<any> {
    
    const formData =  new FormData();

      formData.append("image", file);

      // let headerOptions = {
      //   "Authorization": 'Bearer ' + String(this.gameGlobal.authToken)
      // };

      // let requestOptions = {
      //   headers: new HttpHeaders(headerOptions),
      // };
      this.apiUrl = "https://mojogos.ao:8443/admin-panel/uploadImg/club_owner/" + this.gameGlobal.userId;
  
      return this.http.post(this.apiUrl, formData);
    
  }

  createClub(): Observable<any> {
    const headers = { 'content-type': 'application/json' };

    let param = {
      "userId" : this.gameGlobal.userId,
      "clubName" : this.global.clubName,
      // "nif" : this.global.nif,
      // "clubPhotoUrl" : this.global.clubPhotoUrl,
      "address" : this.global.address
    };
    console.log(param);
    this.apiUrl = 'https://admin.mojogos.ao:8443/admin-panel/create-club';

    return this.http.post(this.apiUrl, param, {
      headers: headers,
    })
  }
   checkIfClubExist(): Observable<any> {
    let params = {
      "userId" : this.gameGlobal.userId
  }
    this.apiUrl = 'https://admin.mojogos.ao:8443/admin-panel/checkIfClubExist';
    return this.http.post(this.apiUrl, params);
   }
  // createClubImageUpload(): Observable<any> {
  //   return this.http.post();
  // }

  getCoin(): Observable<any> {
    const headers = { 'content-type': 'application/json' };

    let param = {
      "userId" :this.global.userId
    };
    this.apiUrl = 'https://admin.mojogos.ao:8443/register-login/user/getCoins';
    


    return this.http.post(this.apiUrl, JSON.stringify(param), {
      headers: headers,
    })
  }
  getCoinValue(): Observable<any> {
    const headers = { 'content-type': 'application/json' };

    // let param = {
    //   "userId" :this.global.userId
    // };
    // this.apiUrl = 'https://admin.mojogos.ao:8443/register-login/user/getCoins';
    this.apiUrl = 'https://mojogos.ao:8443/admin-panel/getCoinValues';


    return this.http.get(this.apiUrl, {
      headers: headers,
    })
  }

  getClubName(): Observable<any> {
    const headers = { 'content-type': 'application/json' };

    let param = {
      "userId" :this.global.userId
    };
    // this.apiUrl = 'https://admin.mojogos.ao:8443/register-login/user/getCoins';
    this.apiUrl = 'https://mojogos.ao:8443/admin-panel/clubName';


    return this.http.post(this.apiUrl, JSON.stringify(param), {
      headers: headers,
    });
  }


  givingCoin(): Observable<any> {
    const headers = { 'content-type': 'application/json' };

    let param = {
      "role":this.global.userRole,
      "senderUserId":this.global.userId,
      "receiverEmail":this.global.recEmail,
      "phoneNumber":this.global.recID,
      "transaction_amount_coins":this.global.transactionCoin
    };
    console.log(param,"paramparam");
    this.apiUrl = 'https://admin.mojogos.ao:8443/payment-gateway-service/direct-coin-transaction';

    return this.http.post(this.apiUrl, JSON.stringify(param), {
      headers: headers,
    })
  }
  requestClubPayment():Observable<any> {
    const headers = { 'content-type': 'application/json' };

    let param = {
      // "senderUserId":this.global.ownerID,
      "recieverUserId":this.global.userId,
      "transaction_amount_coins":this.global.transaction_amount_coins
    };
    this.apiUrl = 'https://admin.mojogos.ao:8443/payment-gateway-service/request-club-payment';

    return this.http.post(this.apiUrl, JSON.stringify(param), {
      headers: headers,
    })
  }
  // searchUser(): Observable<any>{
  //   let headerOptions = {
  //     "Authorization": 'Bearer ' + this.global.authToken,
  //   };
    

  //   let requestOptions = {
  //     headers: new HttpHeaders(headerOptions),
     
  //   };
  //   let param = {
  //     "userNameOrIdOrEmail" : this.global.userId

  //   };

  //   console.log(headerOptions)
    
  //   // let httpParams = new HttpParams()
  //   // .set('userNameOrIdOrEmail',this.global.userSearch.toString())
  //   this.apiUrl = "https://admin.mojogos.ao:8443/admin-panel/searchUser";

  //   // return this.http.get(this.apiUrl,{ headers:{"Authorization": 'Bearer ' + this.global.authToken },params:httpParams});
  //   return this.http.post(this.apiUrl,param,requestOptions)    
  // }

  getUserDetails():Observable<any>{
    
    let headerOptions = {
      'userId': String(this.global.userId),
      'accessToken': String(this.global.authToken)
      
    }
    
        // let httpParams = new HttpParams()
        // .set('userId',String(this.global.userId))
       console.log(headerOptions);
    let requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerOptions) 
    };
    
   return this.http.get('https://mojogos.ao:8443/register-login/getUserDetails',  requestOptions)
        

}
checkIfClubApproved():Observable<any> {
  const headers = { 'content-type': 'application/json' };

  let param = {
    "userId":this.global.userId
  };
  this.apiUrl = 'https://mojogos.ao:8443/admin-panel/isClubApproved';

  return this.http.post(this.apiUrl, JSON.stringify(param), {
    headers: headers,
  })
}

viewRequestedTransaction():Observable<any> {
  const headers = { 'content-type': 'application/json' };

  let param = {
    "clubOwnerId":this.global.userId
  };
  this.apiUrl = 'https://admin.mojogos.ao:8443/payment-gateway-service/view-requested-transaction';

  return this.http.post(this.apiUrl, JSON.stringify(param), {
    headers: headers,
  })
}

viewAcceptedTransaction(userId:number):Observable<any> {
  const headers = { 'content-type': 'application/json' };

  let param = {
    "clubOwnerId":userId
  };
  this.apiUrl = 'https://admin.mojogos.ao:8443/payment-gateway-service/view-accepted-transaction';

  return this.http.post(this.apiUrl, JSON.stringify(param), {
    headers: headers,
  })
}
viewConnectRequest(upperLimit: number, lowerLimit:number):Observable<any> {
  const headers = { 'content-type': 'application/json' };

  let param = {
    "clubId": this.global.clubId,
    'upperLimit': upperLimit,
    'lowerLimit': lowerLimit,
  };
  this.apiUrl = 'https://admin.mojogos.ao:8443/admin-panel/get-connect-request';

  return this.http.post(this.apiUrl, JSON.stringify(param), {
    headers: headers,
  })
}

updateRequestTransaction():Observable<any> {
  const headers = { 'content-type': 'application/json' };

  let param = {
    "clubOwnerId":this.global.userId,
    "requestMsg":this.global.requestMsg,
    "senderUserId":this.global.userId,
    "recieverUserId":this.global.recieverUserId,
    "transaction_amount_coins":this.global.transactionCoin
  };
  console.log(param);
  this.apiUrl = 'https://admin.mojogos.ao:8443/payment-gateway-service/update-requested-transaction';

  return this.http.post(this.apiUrl, JSON.stringify(param), {
    headers: headers,
  })
}
viewAgent():Observable<any> {
  const headers = { 'content-type': 'application/json' };

  let param = {
    "userId":this.global.userId
  };
  this.apiUrl = 'https://mojogos.ao:8443/admin-panel/get-agent-details';

  return this.http.post(this.apiUrl, JSON.stringify(param), {
    headers: headers,
  })
}

connectRequestSend(clubId:any,phoneNumber:any):Observable<any> {
  const headers = { 'content-type': 'application/json' };

  let param = {
    "clubId":clubId,
   "phoneNumber":phoneNumber
  };
  this.apiUrl = 'https://admin.mojogos.ao:8443/admin-panel/save-connect-request';

  return this.http.post(this.apiUrl, JSON.stringify(param), {
    headers: headers,
  })
}

deactivateUser(userId:any,status:any): Observable<any>{
  let headerOptions = {
    "Authorization": 'Bearer ' + this.global.authToken,
  };

  let requestOptions = {
    headers: new HttpHeaders(headerOptions),
  };
  console.log(headerOptions)
  let param = {
    "userId" : userId,
    "activateValue" : status
  };
  this.apiUrl = "https://admin.mojogos.ao:8443/admin-panel/deactivateUser";

  return this.http.post(this.apiUrl,param,requestOptions);

}  
vposPaymentRequest(): Observable<any> {
  let headerOptions = {
    "Authorization": 'Bearer ' + String(this.global.authToken),
  };

  console.log(this.global.payAmt);

  let requestOptions = {
    headers: new HttpHeaders(headerOptions),
  };

  let param={
    'userId':String(this.global.userId),
    'phoneNumber': this.global.expPhoneNumber,
    'amount':  this.global.payAmt
  }

  this.apiUrl =
    'https://mojogos.ao:8443/payment-gateway-service/request-payment';

  return this.http.post(this.apiUrl, param, requestOptions);
}

vposPaymentDetails(): Observable<any> {
  let headerOptions = {
    "Authorization": 'Bearer ' + String(this.global.authToken),
  };


  let requestOptions = {
    headers: new HttpHeaders(headerOptions),
  };

  let param={
    "transactionalId": this.global.transactionId
  }

  this.apiUrl =
    'https://mojogos.ao:8443/payment-gateway-service/transaction';

  return this.http.post(this.apiUrl, param, requestOptions);
}

expressPaymentRef(): Observable<any> {
  let headerOptions = {
    "Authorization": 'Bearer ' + String(this.global.authToken),
  };

  console.log(this.global.payAmt);

  let requestOptions = {
    headers: new HttpHeaders(headerOptions),
  };

  let param={
    "userId": this.global.userId,
    "amt": this.global.payAmt
  }

  this.apiUrl =
    'https://mojogos.ao:8443/payment-gateway-service/create-payment-reference';

  return this.http.post(this.apiUrl, param, requestOptions);
}

ExpressRefDetailByRefId(): Observable<any> {
  let headerOptions = {
    "Authorization": 'Bearer ' + String(this.global.authToken),
  };


  let requestOptions = {
    headers: new HttpHeaders(headerOptions),
  };

  let param={
    "referenceId": this.global.referenceId
  }

  this.apiUrl =
    'https://mojogos.ao:8443/payment-gateway-service/get-created-reference';

  return this.http.post(this.apiUrl, param, requestOptions);
}


}
