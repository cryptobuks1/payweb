import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { HomeService } from 'src/app/core/shared/home.service';

@Component({
  selector: 'app-payments-tab',
  templateUrl: './payments-tab.component.html',
  styleUrls: ['./payments-tab.component.scss']
})
export class PaymentsTabComponent implements OnInit {
  userData: any;
  accountType: any;
  isPersonal: any;

  constructor(private locationStrategy: LocationStrategy, 
    private homeService: HomeService) { 
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
    if(this.userData.account_type == "personal") {
      this.isPersonal = true;
    } else {
      this.isPersonal = false;
    }
  }

  setCSVFlag(){
    let bulkDetils = {}; 
    bulkDetils['csv'] = false;
    this.homeService.setBulkPayments(bulkDetils);
  //  sessionStorage.setItem('csv', JSON.stringify(false));
  }

}
