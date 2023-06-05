import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetails } from 'src/app/globalVars';
import { LanguageModel } from 'src/app/language/langModel';
import { ApiServiceService } from 'src/services/api-service.service';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { PayPopupComponent } from '../payment-popup/pay-popup.component';
import { interval, Subscription} from 'rxjs';


@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  @ViewChild(PayPopupComponent)
  payPopUp: PayPopupComponent = new PayPopupComponent;

        /* pagination */
        vposP: number = 1;
        vposPageNumber: number = 1;
        limit: number = 20;
        vposTotal: number | undefined;

        wikipayP: number = 1;
        wikipayPageNumber: number = 1;
        wikipayTotal: number | undefined;

        getVposPage(pageNo: number){
          if(pageNo > this.vposP){
            this.getPaymentHistory(pageNo);
          }
          this.vposPageNumber = pageNo;
          // this.p = pageNo;
          
          console.log("pagination ", pageNo);
        }


        getWikipayPage(pageNo: number){
          if(pageNo > this.wikipayP){
            this.getRefHistory(pageNo);
          }
          this.wikipayPageNumber = pageNo;
          // this.p = pageNo;
          
          console.log("pagination ", pageNo);
        }

        handleWikiPayPage(event:any){
          this.wikipayPageNumber = event;
          console.log(event);
        }

  isPending:boolean = true;
  statusColor: string = '';
  refId="";
  refNum="";
  entityId="";
  amount="";
  date= "";
  status= "";
  public refArray: any=[];
  public paymentArray:any=[];

  tIdSub: Subscription | undefined;

  rIdSub: Subscription | undefined;

  constructor(private router: Router,public api:ApiServiceService,private soundService: SoundServiceService, public langModel: LanguageModel, public global:GlobalDetails) { }

  ngOnInit(): void {
    if(this.global.isHistory){
      this.getPaymentHistory(this.vposP);
    }else{
      this.getRefHistory(this.wikipayP);
    }
  }
  getPaymentHistory(p: number){
    if(p >= this.vposP){
      try{
        this.vposP = p;
      this.api.vposPayHistory(this.limit, p-1).subscribe((result) => {
        var pushRows: any = [];
        for(let i = 0;i< this.paymentArray.length; i++){
          pushRows.push(this.paymentArray[i]);
        }
        for(let i = 0;i< result.length; i++){
          pushRows.push(result[i]);
        }
        
        this.paymentArray = pushRows;
        if(p == 1)
        this.vposTotal = 20;
        else
        this.vposTotal = this.vposTotal + result.length;
        console.log('vpos history total >>>>', this.vposTotal);
        console.log('vpos history list >>>>', this.paymentArray);
      })}catch(error:any){
        console.log('error >>>>', error);
        var pushRows: any = [];
        for(let i = 0;i< this.paymentArray.length; i++){
          pushRows.push(this.paymentArray[i]);
        }
      this.paymentArray = pushRows;
      };
    } else{
      var pushRows: any = [];
        for(let i = 0;i< this.paymentArray.length; i++){
          pushRows.push(this.paymentArray[i]);
        }
        this.paymentArray = pushRows;
    }
  }
  getRefHistory(p: number){
    if(p >= this.wikipayP){
      try{
        this.wikipayP = p;
      this.api.expressPayRefHistory(this.limit, p-1).subscribe((result) => {
        var pushRows: any = [];
        for(let i = 0;i< this.refArray.length; i++){
          pushRows.push(this.refArray[i]);
        }
        for(let i = 0;i< result.length; i++){
          pushRows.push(result[i]);
        }
        
        this.refArray = pushRows;
        if(p == 1)
        this.wikipayTotal = 20;
        else
        this.wikipayTotal = this.wikipayTotal + result.length;
        console.log('wikipay history total >>>>', this.wikipayTotal);
        console.log('wikipay history list >>>>', this.refArray);
      })}catch(error:any){
        console.log('error >>>>', error);
        var pushRows: any = [];
        for(let i = 0;i< this.refArray.length; i++){
          pushRows.push(this.refArray[i]);
        }
      this.refArray = pushRows;
      };
    } else{
      var pushRows: any = [];
        for(let i = 0;i< this.refArray.length; i++){
          pushRows.push(this.refArray[i]);
        }
        this.refArray = pushRows;
    }
  }
  onPopupTap(evt:any){

  }
  back(){
    this.soundService.playAudio('click');
    this.router.navigateByUrl('wallet');
  }

  deleteRefById(t:any){
    this.global.referenceId = t.wikipayReferenceId;
    console.log(this.global.referenceId, this.global.userId);
    this.api.deleteRef().subscribe((result) => {
      console.log(result);
     var timer=  setTimeout(() => {
        this.getRefHistory(this.wikipayP);
        clearTimeout(timer);
      }, 1000);
    });
  }
}
