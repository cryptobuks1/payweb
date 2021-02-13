import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-about-us',
  templateUrl: './business-about-us.component.html',
  styleUrls: ['./business-about-us.component.scss']
})
export class BusinessAboutUsComponent implements OnInit {
  closeaccount: any = false;
  persoanlDetailsactive: boolean;
  priceplanActive: boolean;
  changePinActive: boolean;
  otpActive: boolean;
  privacyActive: boolean;
  privacyPolicyActive: boolean = true;
  termsConditions: boolean;
  closeAccountActive: boolean;
  cookiesPolicy: boolean;
  imageTrue = true;
  imageFalse = false;
  planImage = true;
  planImage1 = false;
  pinChangeImage = true;
  pinChangeImage1 = false;
  keyImage = true;
  keyImage1 = false;
  privacyImage = true;
  privacyImage1 = false;
  privacyPolicyImage = true;
  privacyPolicyImage1 = false;
  terms_Conditions = true;
  terms_Conditions1 = false;
  cookiesImage1 = true;
  cookiesImage2 = false;
  closeAccountImage = true;
  closeAccountImage1 = false;
  cookiesAndPolicy: boolean;
  closeacc: boolean;
  privacyAndpolicy: boolean;
  termsAndConditions: boolean;
  status: number;
  currencyData: any;
  search_currencies: any;
  currSettings = true;
  prevcurrTransForm: boolean;
  timer: any;
  intervalId: any;
  isDisabled: boolean;
  detailsList: any;
  personalMobile: any;
  mobileOTPMessage: any;
  mobileOtp: any;
  generalDetail = false;
  generalDetailsactive: boolean;
  selectedTab = {
    privacy_policy: true,
    terms_and_conditions: false,
    close_account: false
  };
  isKybCompleted$: Observable<boolean>;
  userData: any;


  constructor(private homeService: HomeService, private alert: NotificationService, private router:Router) { 
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
  }

  ngOnInit() {
    this.isKybCompleted$ = this.homeService.getIsKybCompleted();
  }

  closeBusinessUserAccount(data) {
    this.status = data;
    const request = {
      status: data,
      account_type: this.userData.data.userInfo.account_type
    };
    this.homeService.closeAccount(request).subscribe(res => {
      if (res['data']['status'] == 0) {
        this.alert.success(res['data']['message']);
      } else {
        this.alert.error(res['data']['message']);
      }
    });
    sessionStorage.clear();
    this.router.navigate(['/business/login'])
  }

  // keepAccount() {
  //   this.router.navigate(['/home/settings'])
  //   location.reload();
  //   // this.status = 1;
  //   // this.closeBusinessUserAccount(1);
  // }

  selectTab(tab) {
    for (const key of Object.keys(this.selectedTab)) {
      this.selectedTab[key] = false;
    }
    this.selectedTab[tab] = true;
    if (tab == 'privacy_policy') {
      this.privacyPolicyActive = true;
      this.termsConditions = false;
      this.closeAccountActive = false;
    }
    if (tab == 'terms_and_conditions') {
      this.privacyPolicyActive = false;
      this.termsConditions = true;
      this.closeAccountActive = false;
    }
    if (tab == 'close_account') {
      this.privacyPolicyActive = false;
      this.termsConditions = false;
      this.closeAccountActive = true;
    }
  }


}
