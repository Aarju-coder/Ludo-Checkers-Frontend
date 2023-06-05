import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetailsClub } from '../clubGlobalVars';

import { ClubApiServicesService } from '../services/club-api-services.service';

@Component({
  selector: 'app-view-agent',
  templateUrl: './view-agent.component.html',
  styleUrls: ['./view-agent.component.css']
})
export class ViewAgentComponent implements OnInit {
  public agentList:any = [];
  constructor(private router:Router ,private api:ClubApiServicesService,private global:GlobalDetailsClub) { }

      /* pagination */
      p: number = 1;
      pageNumber: number = 1;
      limit: number = 20;
      total: number | undefined;
      agentPage: number = 1;

      handleViewAgentPage(event:any){
        this.agentPage = event;
        console.log(event);
      }

  ngOnInit(): void {
    // this.api.viewAgent().subscribe((result)=>{
    //   console.log(result);
    //   this.agentList=result.agentDetailsList;
    // })
    this.agentList=this.global.agentList;
  }
  agentDetail(agentDetail:any){
    this.global.agentDetail=agentDetail;
    this.router.navigateByUrl('agentPaymentDetail');
  }
  back(){
    this.router.navigateByUrl("ownerDashboard");
  }

}
