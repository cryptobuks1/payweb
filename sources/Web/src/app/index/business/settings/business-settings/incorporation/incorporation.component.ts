import { DatePipe } from '@angular/common';
import { HomeService } from 'src/app/core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';

@Component({
  selector: 'app-incorporation',
  templateUrl: './incorporation.component.html',
  styleUrls: ['./incorporation.component.scss']
})
export class IncorporationComponent implements OnInit {
  incorporation_data: any;
  companySymbol: any;
  incorporation_date: string;

  constructor(private homeService: HomeService,private alert: NotificationService, private datepipe : DatePipe) { }

  ngOnInit() {
    this.getBusinessSettings();
  }
  companyName: any;
  country_of_incorporation: any;
  registration_number: any;
  date_of_incorporation: any;
  business_type: any;

  getBusinessSettings() {
    this.homeService.getBusinessSettings().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          // this.alert.success(res['data']['message']);
          this.incorporation_data = res['data']['incorporation'];
          this.companyName = this.incorporation_data.legal_name;
          this.companySymbol = this.companyName.slice(0, 1)
          sessionStorage.setItem("companyName", this.companyName);
          sessionStorage.setItem("companySymbol", this.companySymbol);

          this.country_of_incorporation = this.incorporation_data.country_of_incorporation;
          sessionStorage.setItem("country_of_incorporation", this.country_of_incorporation);
          this.registration_number = this.incorporation_data.registration_number;
          this.date_of_incorporation = this.incorporation_data.date_of_incorporation;

          //date format
          let date = new Date(this.date_of_incorporation);
          this.incorporation_date = this.datepipe.transform(date,"dd/MM/yyyy")
          this.business_type = this.incorporation_data.business_type;
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
