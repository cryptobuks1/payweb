import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeDataService } from '../../homeData.service';
import { HomeService } from 'src/app/core/shared/home.service';

@Component({
  selector: 'app-req-downloadapp',
  templateUrl: './req-downloadapp.component.html',
  styleUrls: ['./req-downloadapp.component.scss']
})
export class ReqDownloadappComponent implements OnInit {
  userData: any;
  transaction:any;
  account_type: string;
  constructor(private locationStrategy: LocationStrategy, private router: Router, private homeDataService: HomeDataService,
    private route: ActivatedRoute, private homeService: HomeService) { 
    this.homeService.transaction.subscribe(tran=>{
      this.transaction = tran;
    })
  }

  ngOnInit() {
    if(this.route.snapshot.routeConfig.path.includes("personal")) {
      this.account_type = "personal";
    } else if(this.route.snapshot.routeConfig.path.includes("business")){
      this.account_type = "business";
    }
  }
  signup(){
    if(this.account_type == "personal") {
      this.router.navigate(['/personal/signup']);
      } else if(this.account_type == "business"){
        this.router.navigate(['/business/signup']);
      }
    }
}
