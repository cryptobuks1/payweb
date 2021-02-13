import { HomeService } from './../../../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';

@Component({
  selector: 'app-nature-of-business',
  templateUrl: './nature-of-business.component.html',
  styleUrls: ['./nature-of-business.component.scss']
})
export class NatureOfBusinessComponent implements OnInit {
  nature_of_business_data: any;
  business_sector: any;
  nature_of_business: any;
  website: any;
  companyName: string;
  companySymbol: string;
  country_of_incorporation: string;

  constructor(private homeService: HomeService, private alert: NotificationService, ) { }

  ngOnInit() {
    this.getBusinessSettings();
  }
  getBusinessSettings() {
    this.homeService.getBusinessSettings().subscribe(res => {
      //get company details
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          // this.alert.success(res['data']['message']);
          this.companyName = sessionStorage.getItem("companyName");
          this.companySymbol = sessionStorage.getItem("companySymbol");
          this.country_of_incorporation = sessionStorage.getItem("country_of_incorporation");
          this.nature_of_business_data = res['data']['nature_of_business'];
          this.business_sector = this.nature_of_business_data.business_sector;
          this.nature_of_business = this.nature_of_business_data.nature_of_business;
          this.website = this.nature_of_business_data.website;
          sessionStorage.setItem("nature_of_business", this.nature_of_business);
        }
        else {
          this.alert.error(res['data']['message']);
        }
      }
      else {
        this.alert.error(res['message']);
      }
    })
  }
}
