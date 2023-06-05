import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ClubApiServicesService } from '../services/club-api-services.service';

@Component({
  selector: 'app-connect-club-request',
  templateUrl: './connect-club-request.component.html',
  styleUrls: ['./connect-club-request.component.css']
})
export class ConnectClubRequestComponent implements OnInit {
    /* pagination */
    p: number = 1;
    pageNumber: number = 1;
    limit: number = 20;
    total: number | undefined;
  public requestlist:any = [];

    connectRequestPage: number =1;

  getRequestPage(pageNo: number){
    if(pageNo > this.p){
      this.viewConnectRequest(pageNo);
    }
    this.pageNumber = pageNo;
    // this.p = pageNo;
    
    console.log("pagination ", pageNo);
  }
  constructor(private router:Router,private api:ClubApiServicesService) { }

  ngOnInit(): void {
    this.viewConnectRequest(this.connectRequestPage);
  }

  viewConnectRequest(p: number){
    if(p >= this.p){
      try{
      this.p = p;
      this.api.viewConnectRequest(this.limit, p-1).subscribe((result: any) => {
        var pushRows: any = [];
        for(let i = 0;i< this.requestlist.length; i++){
          pushRows.push(this.requestlist[i]);
        }
        for(let i = 0;i< result.length; i++){
          pushRows.push(result[i]);
        }
        
        this.requestlist = pushRows;
        if(p == 1)
        this.total = 20;
        else
        this.total = this.total + result.length;
        console.log('connect req >>>>', this.total);
        console.log('connect req list >>>>', this.requestlist);
      })}catch(error:any){
        console.log('error >>>>', error);
        var pushRows: any = [];
        for(let i = 0;i< this.requestlist.length; i++){
          pushRows.push(this.requestlist[i]);
        }
      this.requestlist = pushRows;
      };
    } else{
      var pushRows: any = [];
        for(let i = 0;i< this.requestlist.length; i++){
          pushRows.push(this.requestlist[i]);
        }
      this.requestlist = pushRows;
    }
  }
  
  back(){
    this.router.navigateByUrl("ownerDashboard");
  }

}
