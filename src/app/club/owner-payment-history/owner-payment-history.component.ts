import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { ClubApiServicesService } from '../services/club-api-services.service';

@Component({
  selector: 'app-owner-payment-history',
  templateUrl: './owner-payment-history.component.html',
  styleUrls: ['./owner-payment-history.component.css']
})
export class OwnerPaymentHistoryComponent implements OnInit {
  public paymentHis:any=[];
  constructor(private router:Router,private api:ClubApiServicesService,private global:GlobalDetailsClub) { }

  ngOnInit(): void {
    this.api.viewAcceptedTransaction(this.global.userId).subscribe((result)=>{
      console.log(result);
      this.paymentHis=result;
    })

  }
  back(){
    this.router.navigateByUrl("ownerDashboard");
  }

}
