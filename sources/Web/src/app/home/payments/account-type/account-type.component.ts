import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { HomeDataService } from '../../homeData.service';
declare var $: any;

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss']
})
export class AccountTypeComponent implements OnInit {
  userData: any;
  accountType: any;

  constructor(private locationStrategy: LocationStrategy, private router: Router, private homeDataService: HomeDataService) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.accountType = this.userData.account_type;
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  ngOnInit() {
    this.preventBackButton();
    this.emitAccountType('PayVoo account');
  }

  setCSVFlag() {
    sessionStorage.setItem('csv', JSON.stringify(false));
  }

  goTo() {
    if(this.userData.account_type == 'personal') {
      this.router.navigateByUrl('/personal/payments/payment-type');
    }else {
      this.router.navigateByUrl('/business/payments/payment-type');
    }
  }

  emitAccountType(type) {
    this.homeDataService.emitAccountType(type);
  }

  requestFunds() {
    if(this.userData.account_type == 'personal') {
      this.router.navigateByUrl('personal/payments/request-payment');
  } else {
    this.router.navigateByUrl('business/payments/request-payment');
  }
}
  getApp() {
  $("#appWarn").modal('show');
  }
}
