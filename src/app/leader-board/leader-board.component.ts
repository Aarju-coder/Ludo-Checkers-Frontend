import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/services/api-service.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { GlobalDetails } from '../globalVars';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {
  public rankerList =[{avatarId: 3,
    createDate: "",
    elorankings: 0,
    gametype: "Ludo",
    id: 1,
    modifiedDate: "",
    monthyRank: 0,
    userId: 0,
    userName: "",
    weeklyRank: 0,
    yearlyRanks: 0,
    avtarImg : ""}];

  constructor(private router: Router, public global: GlobalDetails,private api: ApiServiceService,private soundService: SoundServiceService, public langModel: LanguageModel) { }

  ngOnInit(): void {
    this.getRanks();
  }
  
  getRanks(){
    this.api.getRankLB().subscribe((data) => {
      var response = data;
      this.rankerList = response;
   
    for(var i in this.rankerList){
      this.rankerList[i].avtarImg = "../../assets/img/profile/Avatar"+this.rankerList[i].avatarId+".png"
    }
    console.log("response---------->",response,this.rankerList);
      
    },(e: any) => {
      console.log("error",JSON.stringify(e));
    //   this.messagePopUp.isVisible= true;
    //   if(e.error.message!= null) {
    //     this.messagePopUp.popupMessage = JSON.stringify(e.error.message);
    //     }else {
    //       this.messagePopUp.popupMessage = "Connection error. Try Again.";
    //     }
    //  this.router.navigateByUrl('landingPage');
      });
  }
  gameCheck(type:any){
    switch(type){
      case 'bg':
      if(this.global.gameName =="Ludo")
      {
         return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)'};
      }
      else{
         return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(./../../assets/BG_1px.png)'};
      }
      break;
      case 'back-header':
        if(this.global.gameName =="Ludo")
        {
           return {'background': 'url(../../assets/img1/Header_Stretchable.png) 0/100% 100% no-repeat'};
        }
        else{
          return {'background': 'url(../../assets/Checkers_Home/header.png) 0/100% 100% no-repeat'};
        }
        break;
        case 'userbg':
        if(this.global.gameName =="Ludo")
        {
           return {'background':'#9a0e0e'};
        }
        else{
           return { 'background':'#006200'};
        }
        break;
      default:
        return { 'background-image': 'url(../../assets/img1/Repeatable_Bg.png),url(../../assets/img1/Stretchable_BG.png)'};
    }
  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('ludoLandingPage');
  }
}
