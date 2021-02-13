import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from './service/merchant.service';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  welcome: boolean = false;
  login: boolean = true;
  logout: boolean = false;
  loggedIn: boolean=true;
  constructor(private _router: Router, private _service:MerchantService) {
    this._service.loggedIn.subscribe(res =>{
      this.loggedIn = res;
    })
   }

  ngOnInit() {
  }
  onClickPay(){
    if(this.loggedIn){
      this._router.navigate(['/shopping-cart']);
    }
    else {
      this._router.navigate(['/login']);
  }
}
goBack() {
  this._router.navigate(['/shipping-back']);
}
}