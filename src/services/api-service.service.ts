import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { GlobalDetails } from '../app/globalVars';
import { GlobalDetailsClub } from 'src/app/club/clubGlobalVars';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  apiUrl: any;

  constructor(private http: HttpClient, private global: GlobalDetails, private globalLocal:GlobalDetailsClub) { }

  signUp():Observable<any>{
     
      const headers = { 'content-type': 'application/json'}  
    
      let param = {
        "password" : this.global.password,
        "email" : this.global.myEmail
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
   
    signIn():Observable<any>{
      
      const headers = { 'content-type': 'application/json'}  
    
      let param = {
        "password" : this.global.password,
        "email" : this.global.myEmail
        // userId: this.model.userId.toString(),
        // chips: coins
      };
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
    checkTournamentStatus(tid: string):Observable<any>{
      
      const headers = { 'content-type': 'application/json'}  
    
      let param = {
        "tId" : tid
      };
      
      return this.http.post('https://mojogos.ao:8443/admin-panel/tournamentStartTime',JSON.stringify(param), {'headers':headers});
        
    }
    getAds():Observable<any>{
      
      const headers = { 'content-type': 'application/json'}  
    
      // let param = {
      //   "userId" : String(this.globalLocal.userId)
      //   // userId: this.model.userId.toString(),
      //   // chips: coins
      // };
      
      return this.http.get('https://mojogos.ao:8443/admin-panel/getAdminAds');
        
    }
    getCoins():Observable<any>{
      
      const headers = { 'content-type': 'application/json'}  
      if(this.global.isClub){
        var param = {
          "userId" : String(this.globalLocal.userId)
          // userId: this.model.userId.toString(),
          // chips: coins
        };
      }
      else{
        var param = {
          "userId" : String(this.global.userId)
          // userId: this.model.userId.toString(),
          // chips: coins
        };
      }
      
      this.apiUrl = 'https://mojogos.ao:8443/register-login/user/getCoins';
      
      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers});
        
    }
    getRealMoney():Observable<any>{
      
      const headers = { 'content-type': 'application/json'}  
    
      let param = {
        "userId" : String(this.globalLocal.userId)
        // userId: this.model.userId.toString(),
        // chips: coins
      };
      
      return this.http.get('https://mojogos.ao:8443/admin-panel/getCoinValues');
        
    }
    getRank(name:any):Observable<any>{
      
      const headers = { 'content-type': 'application/json'}  
    
      let param = {
        "userId" : String(this.global.userId),
        "gameType" : String(name)
        // userId: this.model.userId.toString(),
        // chips: coins
      };
      this.apiUrl = 'https://mojogos.ao:8443/payment-gateway-service/getWins';
      
      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers});
        
    }
    getUserDetails():Observable<any>{
    //console.log(this.global.authToken,"authtoken");
        let headerOptions = {
          'userId': String(this.global.userId),
          'accessToken': String(this.global.authToken)
          
        }
        
            // let httpParams = new HttpParams()
            // .set('userId',String(this.global.userId))
          // console.log(headerOptions) 
        let requestOptions = {                                                                                                                                                                                 
          headers: new HttpHeaders(headerOptions) 
        };
        
       return this.http.get('https://mojogos.ao:8443/register-login/getUserDetails',  requestOptions)
            
    
    }

    getRankLB():Observable<any>{
      var name ='Ludo';
    if(this.global.gameName=="Checkers") name = 'Checker';
      let headerOptions = {
        //"content-type ": "application/json"
        // 'userId': String(this.global.userId),
        // 'authToken': String(this.global.authToken)
        
      }
          let httpParams = new HttpParams()
          .set('gameType',name)


          let requestOptions = {                                                                                                                                                                                 
            headers: new HttpHeaders(headerOptions),
            params: httpParams
          };
          
     return this.http.get('https://admin.mojogos.ao:8443/payment-gateway-service/getEloRanking/'+name)
          
  }
  saveData():Observable<any>{
    // const headers = { 'content-type': 'application/json'}
     let headerOptions = {
       //'userId': String(this.global.userId),
      // 'authToken': String(this.global.authToken)
       
     }
     let param = [{
      "userId": String(this.global.userId),
      "gameType": this.global.gameName,
      "bet_amount":'1000',
      "win_amount":'1200',
      "winCurrency":"Coin",
      "position":'1',
      "roomId":'37'
     }];
    
     
    this.apiUrl = 'https://admin.mojogos.ao:8443/payment-gateway-service/saveTransactionDetails';
     return this.http.post(this.apiUrl,param);
   }

   createProfile():Observable<any>{
    // const headers = { 'content-type': 'application/json'}
     let headerOptions = {
       'userId': String(this.global.userId),
       'accessToken': String(this.global.authToken)
       
     }
       let param = {
         "avatarId" : this.global.avatar,
         "firstname": this.global.firstName,
         "lastname": this.global.lastName,
         "gender": this.global.gender,
         "address": this.global.address,
         "dob" : this.global.dOb,
         "email": this.global.myEmail,
         "phoneNum": this.global.myphone,
         "bankAccNum": "AO06." + this.global.accNum,
         "bankName": this.global.bankName,
         "expressPhoneNumber":this.global.expPhoneNumber
         // userId: this.model.userId.toString(),
         // chips: coins
       };
  
     console.log(param,"paramssssss");
    this.apiUrl = 'https://mojogos.ao:8443/register-login/createProfile';
     return this.http.post(this.apiUrl,param,{ headers:new HttpHeaders(headerOptions) });
   }

    updateUserName():Observable<any>{
     // const headers = { 'content-type': 'application/json'}
      let headerOptions = {
        'userId': String(this.global.userId),
        'accessToken': String(this.global.authToken)
        
      }
      let param;
     if(this.global.setProfile){
      param = {
        "avatarId" : this.global.avatar,
        "username" : this.global.userName,
        "firstname": this.global.firstName,
        "lastname": this.global.lastName,
        "gender": this.global.gender,
        "address": this.global.address,
        "dob" : this.global.dOb,
        "email": this.global.myEmail,
        "phoneNum": this.global.myphone,
        "bankAccNum": "AO06." + this.global.accNum,
        "bankName": this.global.bankName,
        "expressPhoneNumber":this.global.expPhoneNumber
        // userId: this.model.userId.toString(),
        // chips: coins
      };
     } else{
        param = {
          "avatarId" : this.global.avatar,
          "firstname": this.global.firstName,
          "lastname": this.global.lastName,
          "gender": this.global.gender,
          "address": this.global.address,
          "dob" : this.global.dOb,
          "email": this.global.myEmail,
          "phoneNum": this.global.myphone,
          "bankAccNum": "AO06." + this.global.accNum,
          "bankName": this.global.bankName,
          "expressPhoneNumber":this.global.expPhoneNumber
          // userId: this.model.userId.toString(),
          // chips: coins
        };
     }
      console.log(param,"paramssssss");
     if(this.global.setProfile)this.apiUrl = 'https://mojogos.ao:8443/register-login/updateUserName';
      else this.apiUrl = 'https://mojogos.ao:8443/register-login/createProfile';
      return this.http.post(this.apiUrl,param,{ headers:new HttpHeaders(headerOptions) });
    }


    getOtpEmail():Observable<any>{
     
      const headers = { 'content-type': 'application/json'}  
    
      let param = {
        "email" : this.global.myEmail
      };
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
    
      let param = {
        "email" : this.global.myEmail,
        "otpNo" : otp
      };
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

    phoneSignIn():Observable<any>{
      const headers = { 'content-type': 'application/json'}
      let param = {
        "password" : this.global.password,
        "phoneNumber" : this.global.myphone
        // userId: this.model.userId.toString(),
        // chips: coins
      };
      this.apiUrl = 'https://mojogos.ao:8443/register-login/signin';

      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers});
    }

    phoneSignUp():Observable<any>{
      let param= {
        "password" : this.global.password,
        "phoneNumber" : this.global.myphone
      }
      const headers = { 'content-type': 'application/json'}
      
      if(!this.global.isforgotPwd)this.apiUrl = 'https://mojogos.ao:8443/register-login/signup';
      else this.apiUrl = 'https://mojogos.ao:8443/register-login/resetPasswordByMobile';
        
        console.log("phonesignup")

        return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers})
    }
    
    
    phoneOtpResend():Observable<any>{
      let param={
        'phoneNumber':this.global.myphone
      }
      const headers = { 'content-type': 'application/json'}

      this.apiUrl='https://mojogos.ao:8443/register-login/generateOtpForPassReset';
      console.log("PhoneOtp")
      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers})
    }
    phoneOtp():Observable<any>{
      // let param={
      //   'phoneNumber':this.global.myphone
      // }
      const headers = { 'content-type': 'application/json'}

      this.apiUrl='https://mojogos.ao:8443/register-login/sendMoblieNumber/'+this.global.myphone;
      console.log("PhoneOtp")
      return this.http.post(this.apiUrl,{'headers':headers})
    }
    phoneOtpVerificationResend():Observable<any>{
      let param={
        'phoneNumber':this.global.myphone,
        'mobileOtp':this.global.OTP
      }
      const headers = { 'content-type': 'application/json'}


      this.apiUrl="https://mojogos.ao:8443/register-login/verifyOtpForPassReset";
      console.log("PhoneOtpVarification")
      //return this.http.post(this.apiUrl,JSON.stringify(param))
      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers})
    }

    phoneOtpVerification():Observable<any>{
      let param={
        'phoneNumber':this.global.myphone,
        'otp':this.global.OTP
      }
      const headers = { 'content-type': 'application/json'}


      this.apiUrl="https://mojogos.ao:8443/register-login/otpVerify/"+this.global.myphone+'/'+this.global.OTP
      console.log("PhoneOtpVarification")
      //return this.http.post(this.apiUrl,JSON.stringify(param))
      return this.http.post(this.apiUrl,{'headers':headers})
    }
    upcomingTournaments(tournamentType: string): Observable<any> {
      console.log("tournamentType",tournamentType)
      let headerOptions = {
        "Authorization": 'Bearer ' + String(this.global.authToken),
      };
      let param = {
        "userId":String(this.global.userId),
        "lowerLimit" :0,
        "tournament_type": tournamentType
      };
  
      let requestOptions = {
        headers: new HttpHeaders(headerOptions),
      };
  
      this.apiUrl =
        'https://admin.mojogos.ao:8443/admin-panel/tournamentDetails/upcoming';
  
      return this.http.post(this.apiUrl, param, requestOptions);
    }

    registerToTournament(TournamentId:number): Observable<any>{
      let param={
        'userId':String(this.global.userId),
        'tId':TournamentId
      }
      const headers = { 'content-type': 'application/json'}


      this.apiUrl="https://admin.mojogos.ao:8443/admin-panel/register-player-tournament";
      
      return this.http.post(this.apiUrl,JSON.stringify(param),{'headers':headers})
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

    expressPayRefHistory(upperLimit: number, lowerLimit: number): Observable<any> {
      let headerOptions = {
        "Authorization": 'Bearer ' + String(this.global.authToken),
      };
  
  
      let requestOptions = {
        headers: new HttpHeaders(headerOptions),
      };

      let param={
        "userId": this.global.userId,
        "upperLimit": upperLimit,
        "lowerLimit": lowerLimit
      }
  
      this.apiUrl =
        'https://mojogos.ao:8443/payment-gateway-service/created-reference-history';
  
      return this.http.post(this.apiUrl, param, requestOptions);
    }
    vposPayHistory(upperLimit: number, lowerLimit: number): Observable<any> {
      let headerOptions = {
        "Authorization": 'Bearer ' + String(this.global.authToken),
      };
  
  
      let requestOptions = {
        headers: new HttpHeaders(headerOptions),
      };

      let param={
        "userId": this.global.userId,
        "upperLimit": upperLimit,
        "lowerLimit": lowerLimit
      }
  
      this.apiUrl =
        'https://mojogos.ao:8443/payment-gateway-service/view-coin-purchase';
  
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

    deleteRef(): Observable<any> {
      let headerOptions = {
        "Authorization": 'Bearer ' + String(this.global.authToken),
      };
  
      let requestOptions = {
        headers: new HttpHeaders(headerOptions),
      };

      let param={
        "userId": this.global.userId,
        "referenceId": this.global.referenceId
      }
  
      this.apiUrl =
        'https://mojogos.ao:8443/payment-gateway-service/delete-payment-reference';
  
      return this.http.post(this.apiUrl, param, requestOptions);
    }
}
