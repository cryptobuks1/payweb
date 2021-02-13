import { IndexService } from './../../../../../core/shared/index.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';
import { SubSink } from 'subsink';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { LoaderService } from '../../../../../loader.service';

declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {




  cardData: any = [];
  intialpayment: boolean;

  all: any;
  cardlength: any;
  incorporation_data: any;
  business_profile_data: any;
  nature_of_business_data: any;
  structure_of_business_data: any;
  directorsList: any;
  ownersList: any;
  dirname: any;
  hide: boolean = true;


  //personal
  profileData: any;
  applicant_id: any;
  private subs = new SubSink()
  mobile: any;
  timer: any;
  intervalId: any;
  mobileOtp: any;
  isDisabled: boolean = false;
  showForm: boolean = true;
  disabledOnSuccessMobile: boolean = true;

  //plan
  routerDisplay: boolean = false
  profileDisplay: boolean = true;
  personalDet: boolean = false;
  initialForm: boolean = true;
  //modifications
  detailsList: any;
  settingsForm: boolean = false;
  showMyContainer: boolean = true;
  changePasswordForm: FormGroup;
  mobileOTPMessage: boolean = false;
  userData: any;
  displayOtp: any = false;
  displayPassword: boolean = true;
  closeOTP: boolean = false;
  mobileNumber: string;
  otpCallingCode: string;
  cuntrieslist: any;
  country_name: any;
  phoneNumber: any;
  textShow:boolean= false;
  constructor(private routerNavigate: Router, private homeService: HomeService, private alert: NotificationService, public authService: AuthService,
    private indexService: IndexService, private fb: FormBuilder, private loaderService: LoaderService) {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.otpCallingCode = sessionStorage.getItem("otpCallingCode");
  }

  ngOnInit() {
    this.getCountries();
    clearInterval(this.intervalId);
    this.getBusinessSettings();
    this.getPersonaldetails();
    this.changePasswordForm = this.fb.group({
      old_password: ["", Validators.compose([Validators.required, this.ValidatePassword])],
      new_password: ["", Validators.compose([Validators.required, this.ValidatePassword])],
    });
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


  getCountries(){
    // getCountryDetails
    this.homeService.getCountryDetails().subscribe(res => {
     if(res['status']==0){
     if (res['data']['status'] == 1) {
      //this.alert.error(res['data']['message'])
     } else if(res['data']['status']==0) {
       this.cuntrieslist=res['data']['country list'];
       this.cuntrieslist.forEach(element => {
         if(element.country_id==this.userData['country_id']){           
           this.country_name=element.country_name;
           this.callingCode = this.userData.data.userInfo.mobile.replace(this.userData.data.userInfo.phone,'');

         }       

       });
     }
   } else {
       this.alert.error(res['message'])
     }
   });
   }


  arr = [];
  structureOfBusiness() {
    this.incorp = false;
    this.businessprofile = false;
    this.natureOfBusiness = false;
    this.strucOfBusiness = true;
    this.homeService.getStructureOfBusinessData().subscribe(res => {
      this.ownersList = res['data']['ownerList']['shareholder'];

      this.directorsList = res['data']['ownerList']['directors'];
      this.directorsList.forEach(element => {
        var directorsName = element.name;
        this.dirname = directorsName.slice(0, 1);
        this.arr.push(this.dirname);
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
  settings() {
    this.hide = false;
  }
  @Output() closeEvent = new EventEmitter<boolean>();
  closeOtp(otpValidationForm) {
    otpValidationForm.reset();
    this.closeEvent.emit(this.closeOTP);
  }


  //Personal Functions
  resendLink:boolean = false;
  setTimer() {
    this.timer = 59
    var thisObj = this;
    this.intervalId = setInterval(function () {
      if (thisObj.timer > 0) {
        thisObj.timer = thisObj.timer - 1;
        if (thisObj.timer < 10) {
          thisObj.timer = "0" + thisObj.timer;
        }
        if (thisObj.timer == "00") {
          thisObj.isDisabled = true;
        }
      }
    }, 1000);
  }

  time(){
    this.timer = "00"
  }
  verifyOTPAndSubmit(otp) {
    this.isDisabled = true;
    this.subs.sink = this.indexService.createOTP(this.detailsList.mobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.subs.sink = this.indexService.verifyBusinessOTP(otp, this.detailsList.mobile).subscribe(res => {
            if (res['status'] == 0) {
              if (res['data']['status'] == 0) {
                sessionStorage.setItem("isVerified", "yes");
                //this.alert.success(res['data']['message']);
                $("#showOtpModal").modal("hide");
                this.displayOtp = false;
                this.displayPassword = true
              }
              else if (res['data']['status'] == 1) {
                this.alert.error(res['data']['message']);
              }
            }
            else {
              this.alert.error(res['message']);
            }
          })
        }
      }
    })

  }

  mobileResendLink() {
    this.textShow = true;
    this.mobileOTPMessage=false;
    this.mobileOtp='';
    this.isDisabled = false;
    clearInterval(this.intervalId);
    const self = this;
    this.subs.sink = this.indexService.createOTP(this.detailsList.mobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          self.setTimer();
          clearInterval();
       //  this.alert.success(res['data']['message'])
        }
        else if (res['data']['status'] == 1) {
          self.alert.error(res['data']['message'])
        }
      }
      else {
        self.alert.error(res['message'])
      }
      setTimeout( () => {
        self.textShow = false;
      }, 10000);
    })
  }

  personalProfile() {
    this.initialForm = false;
  }
  getPersonaldetails() {
    this.homeService.getPersonalDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.detailsList = res['data'];
        this.mobile = this.detailsList['mobile'];
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }
  formtrue() {
    this.showForm = true;
    this.profileDisplay = true

  }
  displayRouter() {
    this.routerDisplay = true;
    this.profileDisplay = false
  }
  ValidatePassword(control: AbstractControl) {

    let passwordvalue = control.value;
    if (passwordvalue == null) return null;
    var alphaCheck = new Array();
    alphaCheck.push("[A-Z]"); //Uppercase Alphabet.
    alphaCheck.push("[a-z]"); //Lowercase Alphabet.

    var numCheck = new Array();
    numCheck.push("[0-9]"); //Digit.


    var special = new Array();
    special.push("[-!$%^&*()_+|~=`{}[:;<>?,.@#\]");

    var alphaPassed = 0;
    var numPassed = 0;
    var specialCharacter = 0;

    for (var i = 0; i < alphaCheck.length; i++) {
      if (new RegExp(alphaCheck[i]).test(passwordvalue)) {
        alphaPassed++;
      } else { }
    }

    for (var i = 0; i < numCheck.length; i++) {
      if (new RegExp(numCheck[i]).test(passwordvalue)) {
        numPassed++;
      } else { }
    }

    for (var i = 0; i < special.length; i++) {
      if (new RegExp(special[i]).test(passwordvalue)) {
        specialCharacter++;
      } else { }
    }

    let minLength = false;
    let invalidPasswordAlpha = false;
    let invalidPasswordNumbers = false;
    let specialChara = false;

    if (passwordvalue.length >= 8) {
      minLength = true;
    }

    if (alphaPassed == alphaCheck.length) {
      invalidPasswordAlpha = true;
    }

    if (numPassed == numCheck.length) {
      invalidPasswordNumbers = true;
    }

    if (specialCharacter == special.length) {
      specialChara = true;
    }

    return {
      minLength: minLength,
      invalidPasswordAlpha: invalidPasswordAlpha,
      invalidPasswordNumbers: invalidPasswordNumbers,
      specialChara: specialChara
    };
  }

  showOtpScreen() {
    const changePassword = this.changePasswordForm.value;
    if (changePassword.old_password != changePassword.new_password) {
      this.displayPassword = false;
      this.mobileResendLink();
      $("#otpModal").modal("show");
      this.displayOtp = true;
      this.setTimer();
    } else {
      $("#otpModal").modal("hide");
      this.alert.error("Current password and new password should not be same");
      this.displayOtp = false;
      this.displayPassword = true;
    }
  }

  changeOtp() {
    const changePassword = this.changePasswordForm.value;
    if (changePassword.old_password != changePassword.new_password) {
      this.subs.sink = this.indexService.verifyBusinessOTP({otp: this.mobileOtp}, this.detailsList.mobile).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            sessionStorage.setItem("isVerified", "yes");
            this.homeService.changePassword(changePassword).subscribe(res2 => {
              if (res2['status'] == 0) {
                if (res2['data']['status'] == 0) {
                  this.displayOtp = false;
                  $("#otpModal").modal("hide");
                  this.displayPassword = true;
                  $("#setTargetModal").modal("show");
                }
                else if (res2['data']['status'] == 1) {
                  this.alert.error("Please enter valid current password");
                  this.displayOtp = false;
                  $("#otpModal").modal("hide");
                  this.displayPassword = true;
                }
              }
              else {
                this.alert.error(res2['message'])
              }
            })
          }
          else if (res['data']['status'] == 1) {
            this.mobileOtp = '';
            this.alert.error(res['data']['message']);
          }
        }
        else {
          this.alert.error(res['message']);
        }
      })
    }
    else {
      this.alert.error("Current password and new password should not be same");
      this.displayOtp = false;
      $("#otpModal").modal("hide");
      this.displayPassword = true;
    }
  }


  redirect() {
    this.displayPassword = true;
    this.changePasswordForm.reset();
    $("#setTargetModal").modal("hide");
    this.displayOtp = false;
    $("#otpModal").modal("hide");
    this.loaderService.hide();
  }
  showOtp() {
    $("#showOtpModal").modal("show");
    this.setTimer();
  }
  logoutAction() {
    if (this.userData.data.userInfo.account_type == 'personal') {

      if (this.authService.logOutAction()) {

        this.routerNavigate.navigate([''])
      }
    }
    else if (this.userData.data.userInfo.account_type == 'business') {
      if (this.authService.logOutAction()) {
        this.routerNavigate.navigate([''])
      }
    }
    else if (this.userData.data.userInfo.account_type == 'sandbox') {
      if (this.authService.logOutAction()) {
        this.routerNavigate.navigate([''])
      }
    }
  }
  checkRegexForAlphaNumeric(text) {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(text);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }


  mobileNo:any;
  callingCode:any;
  existMobile:any;
  btnLoad:any;
  loader:any;
  // resendMobileOTP() {
  //   this.isDisabled = false;
  //   this.mobileOTPMessage = false;
  //   $("#confirmnumber").attr("autofocus", "autofocus").focus(); // autofocus for phone
  //   clearInterval(this.intervalId);
  //   this.mobileNo = this.perSignUpFormm.get('mobile').value;
  //   this.mobileNo = (this.mobileNo.indexOf(0) == '0' && typeof (this.mobileNo) == 'string') ? this.mobileNo.substring(1) : this.mobileNo;
  //   this.callingCode = this.perSignUpFormm.get('calling_code').value;
  //   this.perSignUpFormm.get('mobileOTP').reset();
  //   this.subs.sink = this.indexService.createOTP(this.callingCode + this.mobileNo).subscribe(res => {
  //     if (res['status'] == 0) {
  //       if (res['data']['status'] == 0) {
  //         this.setTimer();
  //         this.alert.success(res['data']['message']);
  //       }
  //       if (res.data.status == 1) {
  //         this.existMobile = res['data']['message']
  //         clearInterval();
  //       }
  //       else {
  //         this.btnLoad = false;
  //         this.loader = false;
  //       }
  //     }
  //     else {
  //       this.alert.error(res['message'])
  //     }
  //   });
  // }

  // closeOtp() {
  //  //this.displayOtp = false;
  //   this.routerNavigate.navigate(['/home/settings']);
  //   this.displayOtp = true;
  // }
}
