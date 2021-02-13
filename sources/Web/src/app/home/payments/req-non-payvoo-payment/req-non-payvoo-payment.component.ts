import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';


@Component({
  selector: 'app-req-non-payvoo-payment',
  templateUrl: './req-non-payvoo-payment.component.html',
  styleUrls: ['./req-non-payvoo-payment.component.scss']
})
export class ReqNonPayvooPaymentComponent implements OnInit {
  transaction: any;
  account_type: string;

  constructor(private route: ActivatedRoute, private router: Router, private homeService: HomeService) {
    this.homeService.transaction.subscribe(tran=>{
      this.transaction = tran;
      if(this.route.snapshot.routeConfig.path.includes("personal")) {
        this.account_type = "personal";
      } else if(this.route.snapshot.routeConfig.path.includes("business")){
        this.account_type = "business";
      }
    })
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.homeService.getNonPayvooPaymentDetails(params.unique_payment_id).subscribe((res: any) => {
        if (res.code === 404) {
          this.router.navigate(['not-found']);
        } else {
          this.homeService.transaction.next(res.data);
        }
      });
    });
  }
  joinUs() {
    if(this.account_type == "personal") {
    this.router.navigate(['personal/req-downloadapp'])
    } else if(this.account_type == "business") {
      this.router.navigate(['business/req-downloadapp'])
    }
  }

}
