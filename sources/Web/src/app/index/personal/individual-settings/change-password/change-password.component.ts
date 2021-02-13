import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { HomeService } from 'src/app/core/shared/home.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IndexService } from 'src/app/core/shared/index.service';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';
declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  //
  personalMobile: any;
  personalPhone: any;
  private subs = new SubSink();

  //change password Variables
  timer: any;
  intervalId: any;
  isDisabled: boolean;

  changePasswordForm: FormGroup;
  detailsList: any;
  secondForm: boolean;
  firstForm: boolean;
  profileData: any;
  userData: any;
  displayOtp:any=true;

  eye=false;
  slasheye=true;
  type="password";
  email: any;
  displayPassword: boolean=false;
  textShow: boolean;
  mobileOTPMessage: boolean;
  mobileOtp: string;
  callingCode: any;
  mobile: any;
  constructor( private formBuilder:FormBuilder,private routerNavigate: Router, private homeService: HomeService, private alert: NotificationService, public authService: AuthService,
    private indexService: IndexService) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.email = sessionStorage.getItem('email');
  }

  ngOnInit() {
    this.getPersonalDetails();
    this.homeService.getUserDetails().subscribe(data => {
      this.mobile = data.mobile;
    })
    //Password
    clearInterval(this.intervalId);
    this.setTimer();
    this.changePasswordForm = this.formBuilder.group({
      old_password: ["", Validators.compose([Validators.required, this.ValidatePassword])],
      new_password: ["", Validators.compose([Validators.required, this.ValidatePassword])],
    });
  }
  mobileResendLink() {
    this.textShow = true;
    this.mobileOTPMessage=false;
    this.mobileOtp='';
    this.isDisabled = false;
    clearInterval(this.intervalId);
    this.subs.sink = this.indexService.createOTP(this.personalMobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.setTimer();
          clearInterval();
         this.alert.success(res['data']['message'])
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.alert.error(res['message'])
      }
      setTimeout( () => {
        this.textShow = false;
      }, 10000);
    })
  }
  getPersonalDetails() {
    this.subs.sink = this.homeService.getPersonalDetails().subscribe((res: any) => {
      this.detailsList = res['data'];
      const country_name = this.detailsList.country_name;
      this.subs.sink = this.indexService.getCountryDetails().subscribe((res: any) => {
        const userCountry: any = (res["data"]["country list"] as Array<any>).find(c => c.country_name === country_name);
        this.personalMobile = `${this.detailsList['mobile']}`;        
        this.callingCode = userCountry.calling_code;
        this.personalPhone = this.mobile;   
        this.subs.sink = this.indexService.createOTP(this.personalMobile).subscribe(res => {
          if (res['status'] == 0) {
            if (res['data']['status'] == 0) {
              this.alert.success(res['data']['message'])
            }
            else if (res['data']['status'] == 1) {
              this.alert.error(res['data']['message'])
            }
          }
          else {
            this.alert.error(res['message'])
          }
        })
      });
    })
  }

  verifyOTPAndSubmit(otp) {
    this.isDisabled = true;
    this.subs.sink = this.indexService.verifyBusinessOTP(otp, this.personalMobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          sessionStorage.setItem("isVerified", "yes");
          //this.alert.success(res['data']['message']);
          this.displayOtp = false;
          this.displayPassword = true
          // $("#showOtpModal").modal("hide");
          // this.routerNavigate.navigate(['/home/individual-settings/change-password'])
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

  eyeHide(){
    if(this.eye==false){
      this.eye=true;
      this.slasheye=false;
      this.type="text";
    }
    else {
      this.eye = false;
      this.slasheye = true;
      this.type = "password";
    }
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

  redirect() {
    $("#setTargetModal").modal("hide");
    // this.initialForm =true;
    //this.logoutAction();
    this.changePasswordForm.reset();
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
          thisObj.isDisabled = true;
        }
      }
    }, 1000);
  }


  changePassword(changePassword: any) {
    if(changePassword.old_password != changePassword.new_password){
    this.homeService.changePassword(changePassword).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          //this.alert.success(res['data']['message']);
          $("#setTargetModal").modal("show");
          this.firstForm = false;
          this.secondForm = false;

          // this.thirdForm = true;

          this.setTimer();
        }
        else if (res['data']['status'] == 1) {
          // this.alert.error(res['data']['message'])
          this.alert.error("Please enter valid current password");
        }
      }
      else {
        this.alert.error(res['message']);
      }
    })}
    else{
      this.alert.error("Current password and new password should not be same");
    }
  }
  resetform(){
    this.parentFun.emit();
    this.changePasswordForm.reset();
    this.displayPassword = false;
    this.routerNavigate.navigate(['/personal/individual-settings/general-details'])
  }
  checkRegexForAlphaNumeric(text) {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(text);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
    this.setTimer();
  }
}
