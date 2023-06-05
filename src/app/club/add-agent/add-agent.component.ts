import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddAgentSuccessComponent } from '../add-agent-success/add-agent-success.component';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { MessagepopupComponent1 } from '../messagepopup/messagepopup.component';
import { ClubApiServicesService } from '../services/club-api-services.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {

  agentPhnNum:any;
  @ViewChild(AddAgentSuccessComponent)
  addSuccess:AddAgentSuccessComponent=new AddAgentSuccessComponent;
  @ViewChild(MessagepopupComponent1)
  messagepopup:MessagepopupComponent1=new MessagepopupComponent1;
  constructor(private router:Router, private api:ClubApiServicesService,private global:GlobalDetailsClub) { }

  ngOnInit(): void {
  
  }
  back(){
    this.router.navigateByUrl("ownerDashboard");
  }
  addAgent(){
    let isnum = /^\d+$/.test(this.agentPhnNum);
    //if(this.agentPhnNum.includes(".com")){
    if(isnum == false){
      this.global.agentEmail=this.agentPhnNum;
    }
    else{
      this.global.agentPhnNum=this.agentPhnNum;
    }
    this.api.addAgent().subscribe((result)=>{
      console.log(result);
      this.addSuccess.isVisible=true;
      this.addSuccess.popupmsg=result.message;
      // if(result.message !="Error Adding Agent" || result.message !="User already part of other club")
      // {
      //   this.addSuccess.popupmsg=result.message;
      // }
      // else{
      //   this.addSuccess.popupmsg='Agent Added successfully.';
      // }
      // else
      this.agentPhnNum="";
      this.global.agentEmail ="";
      this.global.agentPhnNum = null;
    },(e: any) => {
      this.messagepopup.isVisible= true;
      if(e.error.message!= null) {
      this.messagepopup.popupMessage = "Invalid credentials";
      }else {
        this.messagepopup.popupMessage = "Connection error. Try Again.";
      }
      setTimeout(()=>{
        this.messagepopup.isVisible=false;
        this.agentPhnNum="";
        this.global.agentEmail ="";
        this.global.agentPhnNum = null;
      },2000)
      //alert(JSON.stringify(e.error.message));
      //if(JSON.stringify(e.error.message)=="")
      });
    
  }
  agentPopupClosed(evt:any){
    this.router.navigateByUrl("ownerDashboard");
  }
  addAgentManually(){
    this.router.navigateByUrl("addAgentManually");
  }
  


}
