import { Component, OnInit } from '@angular/core';
import { LanguageModel } from '../language/langModel';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(public langModel: LanguageModel) { }

  ngOnInit(): void {
  }

}
