import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';


@Component({
  selector: 'app-club-details',
  templateUrl: './club-details.component.html',
  styleUrls: ['./club-details.component.css']
})
export class ClubDetailsComponent implements OnInit {
  clubName="abc";
  address:any;
  picByte:any = null;
  @Input() details:any;
  @Output() isClaimed = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
    console.log(this.details);
    this.clubName=this.details.clubName;
    if(this.details.address == null)  this.address= 'Not Set';
    else this.address=this.details.address;
    this.picByte = this.details.picByte;
  }
  close(){
    this.isClaimed.emit("close");
  }
  connect(){
    this.isClaimed.emit("connect");
  }

}
