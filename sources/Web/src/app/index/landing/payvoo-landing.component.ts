import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payvoo-landing',
  templateUrl: './payvoo-landing.component.html',
  styleUrls: ['./payvoo-landing.component.scss']
})
export class PayvooLandingComponent implements OnInit {
 apploader: boolean = false;
 showLandingPage = true;
 personal: boolean = false;
 business: boolean = false;
 personalRoute = '';
 businessRoute = '';
  constructor(private routerNavigate: Router, private route: ActivatedRoute) { }

  ngOnInit() {
     this.route.queryParams.subscribe(q => {
      if (q && q.registration) {
        this.personalRoute = '/personal/signup';
        this.businessRoute = '/business/signup';
      } else {
        this.personalRoute = '/personal/login';
        this.businessRoute = '/business/login';
      }
    });
  }
  personalIn() {
    this.personal = true;
  }
  personalOut() {
    this.personal = false;
  }
  businessIn() {
    this.business = true;
  }
  businessOut() {
    this.business = false;
  }
  personalLogin() {   
    this.routerNavigate.navigate([this.personalRoute]);
  }
  businessLogin() {  
    this.routerNavigate.navigate([this.businessRoute]);
  }
}
