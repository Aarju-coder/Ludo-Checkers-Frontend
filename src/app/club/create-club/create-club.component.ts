import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDetailsClub } from '../clubGlobalVars';
import { MessagepopupComponent1 } from '../messagepopup/messagepopup.component';
import { ClubApiServicesService } from '../services/club-api-services.service';

@Component({
  selector: 'app-create-club',
  templateUrl: './create-club.component.html',
  styleUrls: ['./create-club.component.css']
})
export class CreateClubComponent implements OnInit {
  
  
  firstName:string='';
  lastName:string='';
  userName:string='';
  email:string='';
  phoneNumber:number=NaN;
  clubName:string='';
  NIF:string='';
  address:string='';
  imgfile:any;
  imgUrl:any="../../../assets/img/club/uploadClubAvatar.png";
  
  
  isNext:string|undefined;

  @ViewChild(MessagepopupComponent1)
  messagepopup:MessagepopupComponent1=new MessagepopupComponent1;
  constructor(private router :Router, private api:ClubApiServicesService, private global:GlobalDetailsClub) { }

  ngOnInit(): void {
   
  }
  back(){
    if(this.isNext!= 'none')
    this.router.navigateByUrl("clubLanding");
    else this.isNext = '';
  }
  nextClicked(){
    if(this.clubName == "" || this.imgNIFFile == undefined){
      this.messagepopup.isVisible = true;
      if(this.clubName == "") this.messagepopup.popupMessage = "There is an empty field";
      if(this.imgNIFFile == undefined) this.messagepopup.popupMessage = "Please upload NIF document";
      const setTimeoutvar = setTimeout(() => {
        clearTimeout(setTimeoutvar);
        this.messagepopup.isVisible = false;
        
      },1500)
      return;
    }
    
    this.onUpload();
  }
  onFile(event:any){
    console.log(event);
    this.imgfile=event.target.files[0];
    console.log(this.imgfile);
    const reader = new FileReader();
    reader.onload = () => {
      this.imgUrl = reader.result as string;
    }
    reader.readAsDataURL(this.imgfile)

  }
  imgNIFFile: any = null;
  onFileSelected(event: any){
    this.imgNIFFile = event.target.files[0];
    console.log(this.imgNIFFile);
  }
  docUploaded = false;
  onUpload(){
    if(this.imgNIFFile){
      this.docUploaded =true;
      this.api.nifImageUpload(this.imgNIFFile).subscribe((res:any) => {
        console.log('photo upload >>>',res);
        if(res.message == 'NIF uploaded'){
          this.messagepopup.isVisible = true;
          this.docUploaded =false;
          this.messagepopup.popupMessage = "NIF uploaded";
          const setTimeoutvar = setTimeout(() => {
            clearTimeout(setTimeoutvar);
            this.messagepopup.isVisible = false;
            this.isNext='none';
          },1500);
        }
      },(e: any) => {
        console.log('errorrr',JSON.stringify(e));
        this.messagepopup.isVisible = true;
        this.docUploaded =false;
        this.messagepopup.popupMessage = "NIF not uploaded. Try again.";
        const setTimeoutvar = setTimeout(() => {
          clearTimeout(setTimeoutvar);
          this.messagepopup.isVisible = false;
        
        },1500);
      }
      );
    }
}
  createClub(){
    // console.log(this.firstName,this.lastName,this.address,this.imgfile)
    if(this.address == ""){
      this.messagepopup.isVisible = true;
      this.messagepopup.popupMessage = "There is an empty field";
      const setTimeoutvar = setTimeout(() => {
        clearTimeout(setTimeoutvar);
        this.messagepopup.isVisible = false;
      },1500)
      return;
    }
    this.global.clubName=this.clubName;
    this.global.nif=this.NIF;
    this.global.clubPhotoUrl=this.imgUrl;
    this.global.address = this.address;
    console.log("this.imgurl",this.imgfile);
    if(this.imgfile){

    this.api.clubImageUpload(this.imgfile).subscribe((result)=>{
      console.log(result);
      this.submitClub();
    },(e: any) => {
      this.messagepopup.isVisible= true;
      this.messagepopup.popupMessage = "Image upload failed.";
      
      setTimeout(()=>{this.messagepopup.isVisible=false;
        },1500);
      //alert(JSON.stringify(e.error.message));
      //if(JSON.stringify(e.error.message)=="")
      })
    }
    else{
      this.submitClub();
    }

  }

  submitClub(){
    this.api.createClub().subscribe((result)=>{
      console.log(result);
      this.messagepopup.isVisible= true;
      this.messagepopup.popupMessage = result.message;
      setTimeout(()=>{this.messagepopup.isVisible=false;
        this.router.navigateByUrl("clubLanding");},1500);

    },(e: any) => {
      this.messagepopup.isVisible= true;
      if(e.error.message!= null) {
      this.messagepopup.popupMessage = "Club Already Exist With This UserID.";
      }else {
        this.messagepopup.popupMessage = "Connection error. Try Again.";
      }
      setTimeout(()=>{this.messagepopup.isVisible=false;
        this.router.navigateByUrl("clubLanding");},2000);
     
      //alert(JSON.stringify(e.error.message));
      //if(JSON.stringify(e.error.message)=="")
      })
  }

}
