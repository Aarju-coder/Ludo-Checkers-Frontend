import { Component, OnInit } from '@angular/core';
import { LanguageModel } from 'src/app/language/langModel';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent implements OnInit {

  constructor(public langModel: LanguageModel) { }

  ngOnInit(): void {
  }

}
