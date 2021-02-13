import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HomeDataService } from '../homeData.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  mainTitle = 'Send funds';
  subTitle = 'Payments';
  subRoute = 'PayVoo account';
  currentRoute = '';
  requestPayment: Observable<boolean>;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private homeDataService: HomeDataService) { }

  ngOnInit() {
    this.currentRoute = (this.activatedRoute.snapshot as any)._routerState.url;
    this.setMainTitle();

    this.router.events.subscribe((res: any) => {
      if (this.subRoute.trim().length === 0) {
        this.subRoute = 'PayVoo account';
      }

      if (this.currentRoute && res.url && this.currentRoute !== res.url) {
        this.currentRoute = res.url;
        this.setMainTitle();
      }
    });

    this.homeDataService.receiveAccountType().subscribe(type => {
      console.log(type);
      if (type && type.length > 0) {
        this.subRoute = type;
      }
    });

    this.requestPayment = this.homeDataService.getIsRequestPayment();
  }
  setMainTitle() {
    if (this.currentRoute === '/personal/payments' || this.currentRoute === '/business/payments' ) {
      this.mainTitle = 'Payments';
      this.subRoute = 'PayVoo account';
    } else if (this.currentRoute === '/personal/payments/request-payment' || this.currentRoute === '/business/payments/request-payment') {
      this.mainTitle = 'Request funds';
      this.subRoute = 'Request funds';
    } else {
      this.mainTitle = 'Send funds';
      this.subRoute = 'Send funds';
    }
  }
}
