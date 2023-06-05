import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddAgentSuccessComponent } from '../add-agent-success/add-agent-success.component';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { MessagepopupComponent1 } from '../messagepopup/messagepopup.component';
import { ClubApiServicesService } from '../services/club-api-services.service';

@Component({
  selector: 'app-manual-add-agent',
  templateUrl: './manual-add-agent.component.html',
  styleUrls: ['./manual-add-agent.component.css']
})
export class ManualAddAgentComponent implements OnInit {
  email:string|undefined;
  fName:string|undefined;
  lName:string|undefined;
  username :string ="";
  password:string="";
  phone:any;
  emailOrNum: string = "";
  address:string|undefined;

  @ViewChild(AddAgentSuccessComponent)
  addSuccess:AddAgentSuccessComponent=new AddAgentSuccessComponent;
  @ViewChild(MessagepopupComponent1)
  messagepopup:MessagepopupComponent1=new MessagepopupComponent1;
  constructor(private router:Router,private global:GlobalDetailsClub,private api:ClubApiServicesService) { }

  ngOnInit(): void {
    this.usernameExist = false;
  }
  back(){
    this.router.navigateByUrl('addAgent');
  }
  addAgent(){
    
      
    this.global.agentAddress=this.address;
   //this.global.agentEmail=this.email;
    this.global.agentFname=this.fName;
    this.global.agentLname=this.lName;
    this.global.agentPassword=this.password;
    this.global.agentUserName = this.username;
   // this.global.agentPhone=this.phone;
    if(this.global.agentPassword.length>6 && this.username != ''&& this.fName != '' &&
    this.lName != '' && this.address != '' && this.emailOrNum != '' && this.usernameExist == false){
      let isnum = /^\d+$/.test(this.emailOrNum);
      if(isnum){
        this.global.agentPhone = this.emailOrNum;
        this.validateDetails("Number");
      }
      else{
        this.global.agentEmail = this.emailOrNum;
        this.validateDetails("Email");
      }

      if(this.global.agentEmail || this.global.agentPhone){
        }
        else{
          this.messagepopup.popupMessage = "Enter valid Email or Phone Number ";
          this.messagepopup.isVisible= true;
        setTimeout(()=>{this.messagepopup.isVisible=false;
        this.email="";
        this.phone="";
      },2000)
        }
    }
    else{
      console.log("password Wrong");
      if(this.global.agentPassword.length <= 6)this.messagepopup.popupMessage = "Password length must be more than 6 ";
      else if(this.usernameExist == true) this.messagepopup.popupMessage = "Username already exists. Try another.";
      else this.messagepopup.popupMessage = "Input fields should not be empty ";
      
      this.messagepopup.isVisible= true;
      setTimeout(()=>{this.messagepopup.isVisible=false;
        this.password="";
      },2000)
    }
  }
  usernameExist = false;
  checkUserName(){
    console.log("isusername");
    if(this.username!= ""){
      this.api.checkUserName(this.username).subscribe((data) => {
        console.log("username check", data);
        if(data.message == "Username already exist")
        {
          this.usernameExist = true;
        }
        else if(data.message == "Username available"){
          this.usernameExist = false;
        }
        else{
          this.usernameExist = false;
        }

      });

    }
  }

  agentPopupClosed(evt:any){
    this.router.navigateByUrl("ownerDashboard");
  }

  validateDetails(numberOrmail: any){
   
   if(numberOrmail == "Email")
    {
        this.api.getOtpEmail().subscribe((data) => {
          this.address="";
          this.email="";
          this.fName="";
          this.lName="";
          this.password="";
          this.phone="";
          var response = data;
          console.log("response---------->",response);
          if(response.success)this.router.navigateByUrl("emailOTP");
          
        },(e: any) => {
          //alert(JSON.stringify(e.error.message));
          
          });
      }
    else if(numberOrmail == "Number")
    {
      this.api.phoneOtp().subscribe((data)=>{
        this.address="";
        this.email="";
        this.fName="";
        this.lName="";
        this.password="";
        this.phone="";
        console.log( data," this.res this.res");
      });
      this.router.navigateByUrl('phonesignupOTP');
      console.log('otpPage route');
      }
      
    }
}
