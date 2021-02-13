import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { IndexService } from 'src/app/core/shared/index.service';
import { SubSink } from 'subsink';
import { AuthService } from 'src/app/core/shared/auth.service';
declare var $: any;
@Component({
  selector: 'app-individual-settings',
  templateUrl: './individual-settings.component.html',
  styleUrls: ['./individual-settings.component.scss']
})
export class IndividualSettingsComponent implements OnInit {
  status: any;
  currencyData: any;
  search_currencies: any;
  currSettings: boolean = true;
  prevcurrTransForm: boolean;
  timer: any;
  intervalId: any;
  isDisabled: boolean;
  private subs = new SubSink();
  detailsList: any;
  personalMobile: any;
  mobileOTPMessage: any;
  mobileOtp: any;
  closeaccount: any = false;
  persoanlDetailsactive: boolean;
  priceplanActive: boolean;
  changePinActive: boolean;
  changeLang: boolean;
  aboutUs: boolean;
  otpActive: boolean;
  privacyActive: boolean;
  privacyPolicyActive: boolean;
  termsConditions: boolean;
  closeAccountActive: boolean;
  cookiesPolicy: boolean;
  //images
  imageTrue: boolean = true;
  imageFalse: boolean = false;
  planImage: boolean = true;
  planImage1: boolean = false
  pinChangeImage: boolean = true;
  pinChangeImage1: boolean = false;
  keyImage: boolean = true;
  keyImage1: boolean = false;
  privacyImage: boolean = true;
  privacyImage1: boolean = false;

  privacyPolicyImage: boolean = true;
  privacyPolicyImage1: boolean = false;
  terms_Conditions: boolean = true;
  terms_Conditions1: boolean = false;
  cookiesImage1: boolean = true;
  cookiesImage2: boolean = false;
  closeAccountImage: boolean = true;
  closeAccountImage1: boolean = false;
  generalDetail: boolean = false;
  generalDetailsactive: boolean;
  cookiesAndPolicy: boolean;
  personalselect: boolean = false;
  changeL: boolean
  imageTrue2: boolean = true;
  imageFalse2: boolean = false;
  showAboutusDropdown: boolean = false;
  showBusinessProfileDropdown: boolean = false;
  emptyCard: boolean = true;
  emptyCard1: boolean = false;
  emptyCard2: boolean = false;
  emptyCard3: boolean = false;
  contentCard: boolean = false;
  userData: any;

  constructor(private formBuilder: FormBuilder, private routerNavigate: Router, private homeService: HomeService, private alert: NotificationService, public authService: AuthService,
    private indexService: IndexService, private router: Router) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
  }

  ngOnInit() {
    this.getPersonalDetails();
  }
  toggleAboutUsDropdown() {
    this.personalselect = false;
    this.changeLang = false;
    this.aboutUs = true;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = false;
    this.imageFalse2 = true;
    this.showAboutusDropdown = !this.showAboutusDropdown;
  }
  privacyPolicy() {
    this.generalDetail = false;
    this.emptyCard1 = true;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.contentCard = false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = false;
    this.imageFalse2 = true;
  }
  termsConditions1() {
    this.generalDetail = false;
    this.emptyCard1 = false;
    this.emptyCard2 = true;
    this.emptyCard3 = false;
    this.contentCard = false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = false;
    this.imageFalse2 = true;
  }
  closeBusinessUserAccount(data) {
    this.status = data;
    const request = {
      status: data,
      account_type: this.userData.account_type
    };
    this.homeService.closeAccount(request).subscribe(res => {
      if (res['data']['status'] == 0) {
        this.alert.success(res['data']['message']);
      } else {
        this.alert.error(res['data']['message']);
      }
    });
    sessionStorage.clear();
    this.router.navigate(['/personal/login'])
  }
  closeAccount() {
    this.generalDetail = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = true;
    this.contentCard = false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = false;
    this.imageFalse2 = true;
  }
  keepAccount() {
    this.router.navigate(['/personal/individual-settings']);
    this.emptyCard = true;
    this.emptyCard3 = false;
    this.showAboutusDropdown = false;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
    this.aboutUs = false;
  }
  statusCurrency() {
    this.homeService.getAccountsCurrency().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.currencyData = res['data']['currency'];
        } else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message']);
        }
      } else if (res['status'] == 1) {
        this.alert.error(res['message']);
      }
    });
  }
  form() {
    this.currSettings = false;
    this.prevcurrTransForm = false;
  }
  getPersonalDetails() {
    this.homeService.getPersonalDetails().subscribe(res => {
      this.detailsList = res['data'];
      this.personalMobile = this.detailsList['mobile']
      this.generalDetails();
    })
  }
  showOtp() {
    $("#showOtpModal").modal({ backdrop: 'static', keyboard: false });
    this.setTimer();
    this.personalPrivacy = false;
    this.pinChange = false;
    this.password = true;
    //active
    this.otpActive = true;
    this.changePinActive = false;
    this.privacyActive = false;
    this.privacyPolicyActive = false;
    this.termsConditions = false;
    this.cookiesPolicy = false;
    this.closeAccountActive = false;
    this.priceplanActive = false;
    this.persoanlDetailsactive = false
    //image
    this.pinChangeImage1 = false;
    this.pinChangeImage = true;
    this.keyImage = false;
    this.keyImage1 = true;
    this.privacyImage = true;
    this.privacyImage1 = false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.planImage = true;
    this.planImage1 = false;
    this.privacyPolicyImage = true;
    this.privacyPolicyImage1 = false;
    this.terms_Conditions = true;
    this.terms_Conditions1 = false;
    this.closeAccountImage = true;
    this.closeAccountImage1 = false;
    this.cookiesImage1 = true;
    this.cookiesImage2 = false;

  }
  close(d) {
    $("#showOtpModal").modal("hide");
    d.reset();
    this.password = false;
    this.routerNavigate.navigate(['/settings/']);
  }
  setTimer() {
    this.timer = 59
    var thisObj = this;
    this.intervalId = setInterval(function () {
      if (thisObj.timer > 0) {
        thisObj.timer = thisObj.timer - 1;
        if (thisObj.timer < 10) {
          thisObj.timer = "0" + thisObj.timer;
        }
        if (thisObj.timer == 0) {
          thisObj.isDisabled = false;
        }
      }
    }, 1000);
  }
  verifyOTPAndSubmit(otp) {
    this.isDisabled = true;
    this.subs.sink = this.indexService.createOTP(this.personalMobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.subs.sink = this.indexService.verifyBusinessOTP(otp.value, this.personalMobile).subscribe(res => {
            if (res['status'] == 0) {
              if (res['data']['status'] == 0) {
                sessionStorage.setItem("isVerified", "yes");
                $("#showOtpModal").modal("hide");
                this.routerNavigate.navigate(['/home/individual-settings/change-password']);
                //  otp.reset();

              }
              else if (res['data']['status'] == 1) {
                this.alert.error(res['data']['message']);

              }
            }
            else {
              this.alert.error(res['message']);
              // otp.reset();
            }
          })
        }
      }
    })
  }

  changeOtp(changePassword: object) {
    this.homeService.changePassword(changePassword).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.alert.success(res['data']['message']);
          $("#setTargetModal").modal("show");
          this.setTimer();
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }
  mobileResendLink() {
    this.mobileOTPMessage = false;
    this.mobileOtp = '';
    this.isDisabled = false;
    clearInterval(this.intervalId);
    this.subs.sink = this.indexService.createOTP(this.detailsList.mobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.setTimer();
        }
        else if (res['data']['status'] == 1) {
          clearInterval();
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }

  personalDetail: any;
  pinChange: any;
  password: any;
  personalPlan: any;
  //personal details
  generalDetails() {
    this.routerNavigate.navigate(['/personal/individual-settings/general-details']);
    this.generalDetail = true;
    this.changeLang = true;
    this.aboutUs = false;
    this.showAboutusDropdown = false;
    this.generalDetailsactive = true;
    this.imageTrue = false;
    this.imageFalse = true;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
    this.keyImage = true;
    this.keyImage1 = false;
    this.persoanlDetailsactive = true;
    this.priceplanActive = false;
    this.changePinActive = false;
    this.otpActive = false;
    this.privacyActive = false;
    this.privacyPolicyActive = false;
    this.termsConditions = false;
    this.closeAccountActive = false;
    this.cookiesPolicy = false;
    //images
    this.imageTrue = false;
    this.imageFalse = true;
    this.planImage = true;
    this.planImage1 = false;

    this.pinChangeImage = true;
    this.pinChangeImage1 = false;
    this.keyImage = true;
    this.keyImage1 = false;
    this.privacyImage = true;
    this.privacyImage1 = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.contentCard = true;
    
  }
  parentFun(){
    this.routerNavigate.navigate(['/personal/individual-settings/general-details']);
    this.generalDetails();
      $(".scrty").removeClass("active");
      $(".genrl").addClass("active");
      $(".genrl1").addClass("show active");
      $(".scrty1").removeClass("show active");
  }
  parentFun2(){
    this.generalDetails();
    $(".genrl").addClass("active");
    $(".genrl1").addClass("show active");
    $(".prof").removeClass("active");
    $(".prof1").removeClass("show active");
  }
  personalDetails() {
    this.routerNavigate.navigate(['/personal/individual-settings/personal-details']);
    this.personalDetail = true;
    this.pinChange = false;
    this.personalPlan = false

    //active
    this.persoanlDetailsactive = true;
    this.priceplanActive = false;
    this.changePinActive = false;
    this.otpActive = false;
    this.privacyActive = false;
    this.privacyPolicyActive = false;
    this.termsConditions = false;
    this.closeAccountActive = false;
    this.cookiesPolicy = false;
    //images
    this.imageTrue = false;
    this.imageFalse = true;
    this.planImage = true;
    this.planImage1 = false;

    this.pinChangeImage = true;
    this.pinChangeImage1 = false;
    this.keyImage = true;
    this.keyImage1 = false;
    this.privacyImage = true;
    this.privacyImage1 = false;

    this.privacyPolicyImage = true;
    this.privacyPolicyImage1 = false;
    this.terms_Conditions = true;
    this.terms_Conditions1 = false;
    this.closeAccountImage = true;
    this.closeAccountImage1 = false;
    this.cookiesImage1 = true;
    this.cookiesImage2 = false;
  }
  activclrPlan() {
    this.personalDetail = false;
    this.personalPlan = true;


    this.imageTrue = true;
    this.imageFalse = false;
    this.planImage = false;
    this.planImage1 = true;

    this.pinChangeImage = true;
    this.pinChangeImage1 = false;
    this.keyImage = true;
    this.keyImage1 = false;
    this.privacyImage = true;
    this.privacyImage1 = false;

    this.privacyPolicyImage = true;
    this.privacyPolicyImage1 = false;
    this.terms_Conditions = true;
    this.terms_Conditions1 = false;
    this.closeAccountImage = true;
    this.closeAccountImage1 = false;
    this.cookiesImage1 = true;
    this.cookiesImage2 = false;

    //active

    this.priceplanActive = true
    this.persoanlDetailsactive = false
    this.changePinActive = false;
    this.otpActive = false;
    this.privacyActive = false;
    this.privacyPolicyActive = false;
    this.termsConditions = false;
    this.closeAccountActive = false;
    this.cookiesPolicy = false;
  }


  //security

  changePin() {
    this.routerNavigate.navigate(['/personal/individual-settings/change-pin']);
    this.personalPrivacy = false;
    this.pinChange = true;
    this.password = false;
    this.personalDetail = false;
    //active
    this.changePinActive = true;
    this.otpActive = false;
    this.privacyActive = false;
    this.privacyPolicyActive = false;
    this.termsConditions = false;
    this.closeAccountActive = false;
    this.cookiesPolicy = false;
    this.priceplanActive = false;
    this.persoanlDetailsactive = false
    //images
    this.pinChangeImage1 = true;
    this.pinChangeImage = false;
    this.keyImage = true;
    this.keyImage1 = false;
    this.privacyImage = true;
    this.privacyImage1 = false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.planImage = true;
    this.planImage1 = false
    this.privacyPolicyImage = true;
    this.privacyPolicyImage1 = false;
    this.terms_Conditions = true;
    this.terms_Conditions1 = false;
    this.closeAccountImage = true;
    this.closeAccountImage1 = false;
    this.cookiesImage1 = true;
    this.cookiesImage2 = false;
  }

  personalPrivacy: any;

  privacy() {
    this.personalPrivacy = true;
    this.pinChange = false;
    this.password = false;

    this.privacyActive = true;
    this.changePinActive = false;
    this.otpActive = false;
    this.privacyPolicyActive = false;
    this.termsConditions = false;
    this.closeAccountActive = false;
    this.cookiesPolicy = false;
    this.priceplanActive = false;
    this.persoanlDetailsactive = false;
    //images
    this.pinChangeImage = true;
    this.pinChangeImage1 = false;
    this.keyImage = true;
    this.keyImage1 = false;
    this.privacyImage = false;
    this.privacyImage1 = true;
    this.imageTrue = true;
    this.imageFalse = false;
    this.planImage = true;
    this.planImage1 = false
    this.privacyPolicyImage = true;
    this.privacyPolicyImage1 = false;
    this.terms_Conditions = true;
    this.terms_Conditions1 = false;
    this.closeAccountImage = true;
    this.closeAccountImage1 = false;
    this.cookiesImage1 = true;
    this.cookiesImage2 = false;
  }
  closeacc: boolean = false;
  privacyAndpolicy: boolean = false;
  termsAndConditions: boolean = false;

  cookies_policy() {
    this.closeacc = false
    this.privacyAndpolicy = false
    this.cookiesAndPolicy = true
    this.termsAndConditions = false;
    this.termsConditions = false;

    this.cookiesPolicy = true;
    this.privacyPolicyActive = false;
    this.closeAccountActive = false;
    this.privacyActive = false;
    this.changePinActive = false;
    this.otpActive = false;
    this.priceplanActive = false;
    this.persoanlDetailsactive = false;
    //images
    this.privacyPolicyImage = true;
    this.privacyPolicyImage1 = false;
    this.terms_Conditions = true;
    this.terms_Conditions1 = false;
    this.closeAccountImage = true;
    this.closeAccountImage1 = false;
    this.cookiesImage1 = false;
    this.cookiesImage2 = true;
    this.imageTrue = true;
    this.imageFalse = false;
    this.planImage = true;
    this.planImage1 = false
  }
  //   goToLink(url: string){
  //     window.open(url, "_blank");
  // }


  ngOnDestroy() {
    this.subs.unsubscribe();
    this.setTimer();
  }

  //
  personalSettingsPlan() {
    this.routerNavigate.navigate(['plan'])
  }
  backPlan() {
    this.generalDetails();
    $(".genrl").addClass("active");
    $(".genrl1").addClass("show active");
    $(".prof").removeClass("active");
    $(".prof1").removeClass("show active");
  }

}
