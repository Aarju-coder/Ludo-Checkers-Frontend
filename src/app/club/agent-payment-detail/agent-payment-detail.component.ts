import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgentDeleteComponent } from '../agent-delete/agent-delete.component';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { ClubApiServicesService } from '../services/club-api-services.service';

@Component({
  selector: 'app-agent-payment-detail',
  templateUrl: './agent-payment-detail.component.html',
  styleUrls: ['./agent-payment-detail.component.css']
})
export class AgentPaymentDetailComponent implements OnInit {



  displayAgent:string='block';
  displayPay:string='none';
  isPay:boolean=false;
  isAgent:boolean=true;
  agentDetail:any;
  public payHis:any = [];
  agentStatus:number|undefined;

  @ViewChild(AgentDeleteComponent)
  agentDel:AgentDeleteComponent=new AgentDeleteComponent;
  constructor(private router:Router,private global:GlobalDetailsClub,private api:ClubApiServicesService) { }

  ngOnInit(): void {
  this.agentDetail=this.global.agentDetail;
  console.log(this.agentDetail);
  }
  back(){
    this.router.navigateByUrl('viewAgent');
  }
  payHisClicked(){
    this.api.viewAcceptedTransaction(this.agentDetail.agentId).subscribe((result)=>{
      console.log(result);
      this.payHis=result;
    })
    this.displayAgent='none';
    this.displayPay='block';
    this.isAgent=false;
    this.isPay=true;
  }
  agentClicked(){
    this.displayAgent='block';
    this.displayPay='none';
    this.isAgent=true;
    this.isPay=false;
  }
  menu(){
    this.agentDel.isVisible=true;
    console.log("status===>",this.agentDetail.status);
    if(this.agentDetail.status==0){this.agentDel.isUnblock=true;
    this.agentDel.isBlock=false;}
    else if(this.agentDetail.status==1){this.agentDel.isBlock=true;
    this.agentDel.isUnblock=false;}
  }
  deactiveAgent(status:number){
    this.api.deactivateUser(this.agentDetail.agentId,status).subscribe((result=>{
      console.log(result);
      this.api.viewAgent().subscribe((result)=>{
        console.log(result);
        this.global.agentList=result.agentDetailsList;
        this.global.clubId=result.clubId
        console.log(this.global.clubId);
        this.router.navigateByUrl("viewAgent");
      })
    }))
  }

}
