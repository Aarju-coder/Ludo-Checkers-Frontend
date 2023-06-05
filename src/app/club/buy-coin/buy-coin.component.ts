import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-coin',
  templateUrl: './buy-coin.component.html',
  styleUrls: ['./buy-coin.component.css']
})
export class BuyCoinComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }
  back(){
    this.router.navigateByUrl("ownerDashboard");
  }
}
