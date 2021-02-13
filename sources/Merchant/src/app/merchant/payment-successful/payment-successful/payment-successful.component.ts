import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.scss']
})
export class PaymentSuccessfulComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit() {
  }
  returnMerchant(){
    this._router.navigate(['']);
  }
}
