import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from 'src/app/globalVars';
import { ClubDetailsComponent } from '../club-details/club-details.component';
import { ConnectClubComponent } from '../connect-club/connect-club.component';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { PopupsuccessComponent } from '../popupsuccess/popupsuccess.component';
import { ClubApiServicesService } from '../services/club-api-services.service';
import { LocalDbClubService } from '../services/club-local-db-club.service';
import {MessagepopupComponent1} from '../messagepopup/messagepopup.component'
import { LocalDbService } from 'src/services/local-db.service';
@Component({
  selector: 'app-club-landing-page',
  templateUrl: './club-landing-page.component.html',
  styleUrls: ['./club-landing-page.component.css']
})
export class ClubLandingPageComponent implements OnInit {
    /* pagination */
    p: number = 1;
    pageNumber: number = 1;
    limit: number = 20;
    total: number | undefined;
    regClubTotal: number | undefined;

  isClubDetails:boolean=false;
  isConnect:boolean=false;
  public clubList: any = [];
  clubPage: number = 1;
  detailData:any;
  clubId:number|undefined;
  @ViewChild(MessagepopupComponent1)
  messagepopup: MessagepopupComponent1 = new MessagepopupComponent1 
  @ViewChild(ClubDetailsComponent)
  cDetails:ClubDetailsComponent=new ClubDetailsComponent;
  @ViewChild(ConnectClubComponent)
  cConnect:ConnectClubComponent=new ConnectClubComponent;
  @ViewChild(PopupsuccessComponent)
  popup:PopupsuccessComponent=new PopupsuccessComponent;
  
  constructor(private router:Router , private api:ClubApiServicesService, private global:GlobalDetailsClub, private localDb:LocalDbClubService,private localDbGlobal:LocalDbService,private gameGlobal:GlobalDetails) { }

  getClubPage(pageNo: number){

    //console.log("pagination ", pageNo,this.p);
   if(pageNo > this.p){

      this.getClubList(pageNo);
    }
    this.pageNumber = pageNo;
    // this.p = pageNo;
    
   // console.log("pagination ", pageNo);
  }

  ngOnInit(): void {
    this.gameGlobal.isAccessClub=false;
    this.gameGlobal.isCreateClub=false;
    this.global.isforgotPwd =false;
    this.getClubList(this.clubPage);
    
  }
   value = 0;
  getClubList(p: number){
    if(p >= this.p){
     // console.log("pagination ", p,this.p);
      try{
      this.p = p;
      
      if(p % 2 == 0 || this.value == 0){
        this.value = Math.floor(p - (p/2));
        console.log(this.value,p,"..values");
      
      this.api.clubList(this.limit, this.value).subscribe((result: any) => {
        var pushRows: any = [];
        for(let i = 0;i< this.clubList.length; i++){
          pushRows.push(this.clubList[i]);
        }
        for(let i = 0;i< result.length; i++){
          pushRows.push(result[i]);
        }
        
        this.clubList = pushRows;
        if(p == 1)
        this.total = 20;
        else
        this.total = this.total + result.length;
        console.log('reg club total >>>>', this.total);
        console.log('registered club list >>>>', this.clubList);
      })}
    }
      catch(error:any){
        console.log('error >>>>', error);
        var pushRows: any = [];
        for(let i = 0;i< this.clubList.length; i++){
          pushRows.push(this.clubList[i]);
        }
      this.clubList = pushRows;
      };
    } else{
      var pushRows: any = [];
        for(let i = 0;i< this.clubList.length; i++){
          pushRows.push(this.clubList[i]);
        }
        this.clubList = pushRows;
    }
  }
  checkIfLoggedIn() :boolean {
    var dataSession = this.localDbGlobal.getGameSessionData();
    console.log(dataSession, "dataSessiondataSession");
    if (dataSession.length != 0) {
      this.gameGlobal.authToken = dataSession.authToken;
      this.gameGlobal.userId = dataSession.userId;
      this.gameGlobal.userName = dataSession.userName;
      this.gameGlobal.avatar = dataSession.avatar;

      this.gameGlobal.firstName = dataSession.firstName;
      this.gameGlobal.lastName = dataSession.lastName;
      this.gameGlobal.dOb = dataSession.dOb;
      this.gameGlobal.address = dataSession.address;
      this.gameGlobal.myEmail = dataSession.myEmail;
      this.gameGlobal.myphone = dataSession.myphone;
      this.gameGlobal.gender = dataSession.gender;
      this.gameGlobal.accNum = dataSession.accNum;
      this.gameGlobal.bankName = dataSession.bankName;
      this.gameGlobal.expPhoneNumber = dataSession.expPhoneNumber;
      this.gameGlobal.coins = dataSession.coins;
      this.gameGlobal.moneyAmt = dataSession.moneyAmt;
      return true;
    }
    else {
      return false;
    }
  }
  accessClubcheckIfLoggedIn(){
    var dataSession =  this.localDb.getAccessClubSessionData();
    console.log(dataSession,"dataSessiondataSession");
    if(dataSession.length != 0)
     { 
       this.global.authToken = dataSession.authToken;
       this.global.userId = dataSession.userId;
       this.global.role = dataSession.role;
       this.global.email= dataSession.acessEmail;
       this.global.userName= dataSession.username;
       this.global.avatar =dataSession.avatar;
      //  this.global.coins=dataSession.coins;
      //  this.global.moneyAmt=dataSession.moneyAmt;
      //  this.global.moneyVal=dataSession.moneyVal;
       
     
}
  }
  onConnect(e:any){
    if(e=='close'){
      this.isConnect=false;
    }
    else if(e=="success"){
      console.log(this.cConnect.phNumber);
      {this.api.connectRequestSend(this.clubId,this.cConnect.phNumber).subscribe((result)=>{
        console.log(result);
        this.isConnect=false;
      this.popup.isVisible=true;
      })}
      
    }
  }
  onClaim(e:any){
    if(e=='close'){
      this.isClubDetails=false;
    }
    else if(e=='connect'){
      this.isClubDetails=false;
      this.isConnect=true;
    }
  }
  back(){
    this.router.navigateByUrl("clubLandingPage");
  }
  clubDetails(data:any){
    console.log("ClubDetails");
    console.log(data.clubName);
    this.detailData=data;
    this.clubId=data.clubId;
    // this.cDetails.clubName=data
    // this.cDetails.address=data;
    this.isClubDetails=true;
  }
  connectClub(clubId:number){
    this.isConnect=true;
    this.clubId=clubId;
  }
  createClubClicked(){
    //this.router.navigateByUrl("createClub");
    if(this.checkIfLoggedIn() == true){
      this.api.checkIfClubExist().subscribe((res) => {
        console.log("clubresp",res);
        if(res.message == "Club already exists." || res.message == "User is an AGENT and cannot create CLUB!!"){
          this.messagepopup.isVisible = true;
          this.messagepopup.popupMessage = res.message;
          const setTimeoutvar = setTimeout(() => {
          clearTimeout(setTimeoutvar);
          this.messagepopup.isVisible = false;
      },1500)
        }
        else{
          console.log(this.global.userId,"this.global.userId")
          this.router.navigateByUrl("createClub");
          
        }
      },(error)=> {console.log(error)});
    
    }
    else{
      this.gameGlobal.isCreateClub=true;
      this.router.navigateByUrl('landingPage');
    }
    
  }
  accessClubClicked(){
    this.gameGlobal.isAccessClub=true;
    this.accessClubcheckIfLoggedIn();
    this.router.navigateByUrl("accessClub");
  }

}
