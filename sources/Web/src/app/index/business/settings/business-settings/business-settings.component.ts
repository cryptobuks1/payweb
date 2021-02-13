import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';

@Component({
  selector: 'app-business-settings',
  templateUrl: './business-settings.component.html',
  styleUrls: ['./business-settings.component.scss']
})
export class BusinessSettingsComponent implements OnInit {
  profileData: any;
  applicant_id: any;
  cardData: any = [];
  intialpayment: boolean;
  aplicant_id: any;
  all: any;
  cardlength: any;
  incorporation_data: any;
  business_profile_data: any;
  nature_of_business_data: any;
  structure_of_business_data: any;
  directorsList: any;
  ownersList: any;
  dirname: any;
  arrayy: any;
  ownerarr: any = [];

  constructor(private router: Router, private homeService: HomeService, private alert: NotificationService, public authService: AuthService) {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
  }

  ngOnInit() {
    this.getBusinessSettings();
  }

  incorp: boolean = false;
  businessprofile = false;
  natureOfBusiness = false;
  strucOfBusiness = false;

  incorporation() {
    this.incorp = true;
    this.businessprofile = false;
    this.natureOfBusiness = false;
    this.strucOfBusiness = false;
  }
  businessProfileSepa() {
    this.incorp = false;
    this.businessprofile = true;
    this.natureOfBusiness = false;
    this.strucOfBusiness = false;
  }
  naturOfBusiness() {
    this.incorp = false;
    this.businessprofile = false;
    this.natureOfBusiness = true;
    this.strucOfBusiness = false;
  }
  arr = [];
  structureOfBusiness() {
    this.arr = [];
    this.incorp = false;
    this.businessprofile = false;
    this.natureOfBusiness = false;
    this.strucOfBusiness = true;
    this.homeService.getStructureOfBusinessData().subscribe(res => {
      this.ownerarr = [];
      // OwnersList
      this.ownersList = res['data']['ownerList']['Shareholder'];
      this.ownersList.forEach(element => {
        var ownersname = element.name;
        var ownersemail = element.email;
        var percentage = element.percentage;
        var ownersSymbol = ownersname.slice(0, 1)
        this.ownerarr.push({
          "ownername": ownersname,
          "owneremail": ownersemail,
          "percentage": percentage,
          "ownersSymbol": ownersSymbol
        })
      });

      // directorsList
      this.directorsList = res['data']['ownerList']['Directors'];
      this.directorsList.forEach(element => {
        var directorsName = element.name;
        var directorsMail = element.email;
        this.dirname = directorsName.slice(0, 1);
        this.arr.push({
          "symbol": this.dirname,
          "directorsName": directorsName,
          "email": directorsMail
        });
      });
    })
  }
  getBusinessSettings() {
    this.homeService.getBusinessSettings().subscribe(res => {
      this.incorporation_data = res['data']['incorporation'];
      this.business_profile_data = res['data']['business_profile'];
      this.nature_of_business_data = res['data']['nature_of_business'];
      this.structure_of_business_data = res['data']['structure_of_business'];
    })
  }
}
