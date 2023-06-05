import { Component, EventEmitter,OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-pay-popup',
  templateUrl: './pay-popup.component.html',
  styleUrls: ['./pay-popup.component.css']
})
export class PayPopupComponent implements OnInit {
  isVisible =false;
  isExpress = false;
  isExpressDone = false;
  paymentMethod: string = "";
  isPayment: boolean = false;
  heading ="Make Payment";
  subheading ="";
  expressHead= "";
  yes= "";
  no= "";
  expRef="";
  amountText="";
  refNumText="";
  refIdText="";
  entityidText="";
  vposPayStatus ="";
  payStatusHead = "";
  payStatus = "";
  footRef="";
  footRefExpress = "";
  language = 'en';
  refNum ="454";
  refId = "453";
  EntityId="452";
  amountSelected = 0;
  isPhnNum =  false;
  expPhoneNumber: Number = NaN;
  phnNumHeading ="";
  vposHead ="";
  vpos ="";
  express="";
  isVpos =false;
  amountNum = 0;
  transactionText ="";
  transactionId= "";
  isTIdGenerated:boolean = false;
  phoneInputBox: boolean = true;
  copyText = "Copied";
  isRefNCopied:boolean = false;
  isEntityCopied:boolean = false;
  referenceCreateText = "REFERENCE CREATED";
  isReferenceCreated:boolean = false;
  successRef= "Reference successfully created and below are the details:";
  errorMsg = "Something went wrong. Try Again."
  isErr =false;
  @Output() onClick = new EventEmitter<any>();

  constructor() {  }

  ngOnInit(): void {

  }

  close(){
    this.isVisible =false;
    this.isExpress = false;
    this.isPayment = false;
    this.isExpressDone = false;
    this.isPhnNum =false;
    this.expPhoneNumber = NaN;
    this.phnNumHeading ="";
    this.vposHead ="";
    this.isVpos =false;
    this.transactionText ="";
    this.transactionId= "";
    if(this.language == 'en')this.heading ="Make Payment";
    else this.heading ="Faça o pagamento";
    this.isErr =false;
  }
  onExpress(action:string){
    console.log(action);
    this.isExpress =true;
    if(this.language == 'en')this.heading ="Pagamento por Referência";
    else this.heading ="Pagamento por Referência";
    this.paymentMethod = 'express';
    this.expRef = "Pagamento por Referência";
  }
  onVpos(action:string){
    console.log(action);
    this.isExpress = true;
    this.isVpos = true;
    if(this.language == 'en')this.heading ="Multicaixa Express";
    else this.heading ="Multicaixa Express";
    this.paymentMethod = 'vpos';
    this.expRef = "Multicaixa Express";
  }
  onNumber(){
    this.isPhnNum = false;
    this.onClick.emit(this.expPhoneNumber);
  }
  approveExp(){
    this.isPayment = true;
    let data;
    data = {paymentMethod:this.paymentMethod, isPayment: this.isPayment}
    this.onClick.emit(data);
  }

  denyExp(){
    this.close();
  }

  refNCopy(){
    this.isRefNCopied = true;
  }
  entityCopy(){
    this.isEntityCopied = true;
  }
}
