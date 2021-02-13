/**
* PersonalSignup Component
* PersonalSignup registration
* @package PersonalComponent
* @subpackage app\core\shared\PersonalComponent
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { AuthService } from '../../../core/shared/auth.service';
import { IndexService } from "../../../core/shared/index.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import * as _ from "lodash";
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';

declare var $: any;

@Component({
  selector: "app-personal",
  templateUrl: "./personal-signup.component.html",
  styleUrls: ["./personal-signup.component.scss"]
})
export class PersonalSignupComponent implements OnInit {
  private subs = new SubSink();

  progressBarFlag: boolean = true;
  perSignUpFormm: FormGroup;
  countryData: any;
  OTPValue: any;
  emailId: any;
  EmailOTP: any;
  EmailOTPStatus: any;
  emailOTPMessage: boolean = false;
  mobileOTPMessage: boolean = false;
  enableEmailNext: boolean = false;
  enableMobileNext: boolean = false;
  OTPlength: any;
  mobileNumber: any;
  mobileNo: any;
  MobileOTP: any;
  MObileOTPStatus: any;
  callingCode: any;
  dob: any;
  otpFailMsg: string;
  emailOtpexpiredMsg: boolean = false;
  mobileOtpexpiredMsg: boolean = false;
  disabledOnSuccessMobile: boolean = true;
  existEmailerror: boolean = false;
  existEmail: string;
  existMobile: string;
  existMobileerror: boolean = false;
  loginActionActive = false;

  emailFieldSet: boolean = true;
  passwordFieldSet: boolean = false;
  passwordConfirmFieldset: boolean = false;
  confirmEmailFieldset: boolean = false
  personalDetailsFieldSet: boolean = false;
  homeAddressFieldSet: boolean = false;
  mobileNumberFieldSet: boolean = false;
  confirmMobileFeildSet: boolean = false;
  createPinFieldSet: boolean = false;
  profilecompleteFeildSet: boolean = false;
  loader: boolean = false;
  country_id: any;
  selectedDOB: any;
  selectedCountryId: any;
  validDOB: boolean = false;
  valid18DOB: boolean = false;
  minDOB = ''
  maxDOB: any;
  timer: any;
  intervalId: any;
  step1: boolean = true;
  value1: any = 'invalid';
  value2: any = 'current'
  value3: any = 'completed'

  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  step5: boolean = false;
  step6: boolean = false
  step7: boolean = false;
  value4: string;
  value5: string;
  value6: string;
  value7: string;
  value8: string;
  step8: boolean = false;
  createPin: any;
  confirmPin: any;
  checkPin: boolean = false;
  value9: string;
  btnLoad: boolean = false
  isDisabled: boolean = false;
  textShow:boolean= false;
  isUsingEdge = false;
  first_name:string = '';
  last_name:string = '';

  constructor(private alert: NotificationService, private fb: FormBuilder, private indexService: IndexService, private authService: AuthService, private routerNavigate: Router) {
    var date = new Date(),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    var obj = [date.getFullYear() - 100, mnth, day].join("-");
    this.minDOB = obj;
    this.maxDOB = [date.getFullYear() - 18, mnth, day].join("-");
  }
  checkDuplicate() {
    this.emailId = this.perSignUpFormm.get('email').value;
    let obj = { 'userId': this.perSignUpFormm.get('email').value, 'type': "personal" }
    this.subs.sink = this.indexService.duplicateEmailMobile(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 1) {
          this.emailFieldSet = true;
          this.passwordFieldSet = false;
          this.existEmailerror = true;
          this.existEmail = res['data']['message']
        }
        if (res['data']['status'] == 0) {
          this.existEmailerror = false;
          this.step1 = true;
          this.step2 = true;
          this.value3 = 'current'
          this.value2 = 'completed';
          this.emailFieldSet = false;
          this.passwordFieldSet = true;
        }
      }
      else {
        this.existEmailerror = false;
        this.step1 = true;
        this.step2 = true;
        this.value3 = 'current'
        this.value2 = 'completed';
        this.emailFieldSet = false;
        this.passwordFieldSet = true;
      }
    })
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

  emailFieldSetBack() {
    this.btnLoad = false;
    this.passwordFieldSet = false;
    this.existMobileerror = false;
    this.loader = false;
    this.step2 = false;
    this.step1 = true;
    this.step3 = false;
    this.value1 = 'invalid';
    this.value2 = 'current';
    this.emailFieldSet = true;
  }
  //create email otp
  createEmailOTP() {
    this.isDisabled = false;
    this.btnLoad = true;
    this.loader = true;
    clearInterval(this.intervalId);
    $("#emailconfirm").attr("autofocus", "autofocus").focus(); // autofocus for email
    this.emailId = this.perSignUpFormm.get('email').value;
    this.perSignUpFormm.get('EmailOTP').reset();
    this.emailOTPMessage = false;
    this.subs.sink = this.indexService.createOTP(this.emailId).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 1) {
          this.btnLoad = false;
          this.loader = false;
          this.existEmailerror = true;
          this.existEmail = res['data']['message']
        }
        if (res['data']['status'] == 0) {
          this.setTimer();
          this.btnLoad = false;
          this.loader = false;
          this.step3 = true;
          this.value3 = 'completed'
          this.value4 = 'current';
          this.emailFieldSet = false;
          this.passwordFieldSet = false;
          this.passwordConfirmFieldset = true;
        }
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }

  resendEmailOTP() {
    this.textShow = true;
    this.isDisabled = false;
    this.emailOTPMessage = false;
    clearInterval(this.intervalId);
    $("#emailconfirm").attr("autofocus", "autofocus").focus(); // autofocus for email
    this.emailId = this.perSignUpFormm.get('email').value;
    this.perSignUpFormm.get('EmailOTP').reset();
    this.subs.sink = this.indexService.createOTP(this.emailId).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 1) {
          this.existEmail = res['data']['message'];
        }
        if (res['status'] == 0) {
         // this.alert.success(res['data']['message']);
          this.setTimer();
        }
      }
      else {
        this.alert.error(res['message'])
      }
      setTimeout( () => {
        this.textShow = false;
      }, 10000);
    });
  }


  navigateToSignIn() {
    this.routerNavigate.navigate(['personal/login'])
  }
  //verify email with otp
  verifyEmail() {
    this.isDisabled = false;
    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.EmailOTP = this.perSignUpFormm.get('EmailOTP').value;

    if (this.EmailOTP.length == 6) {
      this.subs.sink = this.indexService.verifyOTP(this.EmailOTP, this.emailId).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            this.loader = false;
            this.personalDetailsFieldSet = true;
            this.enableEmailNext = false;
            this.emailOTPMessage = false;
            this.passwordConfirmFieldset = false;
            this.step4 = true;
            this.value4 = 'completed'
            this.value5 = 'current';
          }
          if (res['data']['status'] == 2) {
            this.emailOTPMessage = true;
            this.enableEmailNext = true;
            this.loader = false;
            this.isDisabled=true;
            var thisObj = this;
            thisObj.timer='00'
            clearInterval();
            this.otpFailMsg = res['data']['message']
            this.perSignUpFormm.get('EmailOTP').reset();
            //this.perSignUpFormm.controls.EmailOTP.updateValueAndValidity();
          }
          if (res['data']['status'] == 1) {
            this.emailOTPMessage = true;
            this.enableEmailNext = true;
            this.loader = false;
            this.isDisabled=true;
            var thisObj = this;
            thisObj.timer='00'
            clearInterval();
            this.otpFailMsg = res['data']['message']
            this.perSignUpFormm.get('EmailOTP').reset();
         //   this.perSignUpFormm.controls.EmailOTP.updateValueAndValidity();
          }
        }
        else {

          this.alert.error(res['message'])
          this.perSignUpFormm.get('EmailOTP').reset();
          //this.perSignUpFormm.controls.EmailOTP.updateValueAndValidity();
        }
      });
    }
  }
  homeAddrTemplate() {
    this.step5 = true;
    this.value5 = 'completed'
    this.value6 = 'current';
    this.passwordConfirmFieldset = false;
    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.personalDetailsFieldSet = false;
    this.homeAddressFieldSet = true;
  }
  // dobValidation($event){
  //   var dt = new Date();
  //   var yr= dt.getFullYear();
  //    var selectedYr = $event.target.value;
  //    if(selectedYr<=this.maxDOB){
  //       this.validDOB=false;
  //    }
  //    else{
  //     this.validDOB=true;
  //    }
  // }
  personalDetailsBack() {
    this.step5 = true;
    this.value5 = 'current'
    this.value6 = 'invalid';
    this.passwordConfirmFieldset = false;
    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.homeAddressFieldSet = false;
    this.personalDetailsFieldSet = true;
  }
  mobileNbrTemplate() {
    this.country_id = this.perSignUpFormm.get('country_id').value;
    this.step6 = true;
    this.value6 = 'completed'
    this.value7 = 'current';
    this.passwordConfirmFieldset = false;
    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.personalDetailsFieldSet = false;
    this.homeAddressFieldSet = false;
    this.mobileNumberFieldSet = true;
  }
  homeAddressBack() {
    this.loader = false;
    this.btnLoad = false;
    this.step6 = true;
    this.value6 = 'current'
    this.value7 = 'invalid';
    this.passwordConfirmFieldset = false;
    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.personalDetailsFieldSet = false;
    this.homeAddressFieldSet = true;
    this.mobileNumberFieldSet = true;
  }
  //mobile otp create
  createMobileOTP() {
    this.isDisabled = false;
    this.btnLoad = true;
    $("#confirmnumber").attr("autofocus", "autofocus").focus();
    this.loader = true;
    clearInterval(this.intervalId);
    this.mobileNo = this.perSignUpFormm.get('mobile').value;
    this.callingCode = this.perSignUpFormm.get('calling_code').value;
    this.perSignUpFormm.get('mobileOTP').reset();
    this.mobileOTPMessage = false;
    let obj = { 'userId': this.callingCode +" "+ this.mobileNo, 'type': "personal" }
    this.subs.sink = this.indexService.duplicateEmailMobile(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 1) {
          this.existMobileerror = true;
          this.btnLoad = false;
          this.loader = false;
          this.existMobile = res['data']['message'];
          clearInterval();
        }
        else if (res['data']['status'] == 0) {
          this.subs.sink = this.indexService.createOTP(this.callingCode + this.mobileNo).subscribe(res => {
            if (res['status'] == 0) {
              if (res['data']['status'] == 0) {
                this.btnLoad = false;
                this.loader = false;
                this.setTimer();
                this.existEmailerror = false;
                this.step7 = true;
                this.value7 = 'completed'
                this.value8 = 'current';
                this.passwordConfirmFieldset = false;
                this.emailFieldSet = false;
                this.passwordFieldSet = false;
                this.personalDetailsFieldSet = false;
                this.homeAddressFieldSet = false;
                this.mobileNumberFieldSet = false;
                this.confirmMobileFeildSet = true;
              }
              if (res['data']['status'] == 3) {
                this.existMobileerror = true;
                this.btnLoad = false;
                this.loader = false;
                this.existMobile = res['data']['message'];
                this.perSignUpFormm.get('mobileOTP').reset();
                clearInterval();
              }
              if (res.data.status == 4) {
                this.existMobileerror = true;
                this.btnLoad = false;
                this.loader = false;
                this.existMobile = res['data']['message'];
                this.perSignUpFormm.get('mobileOTP').reset();
                clearInterval();
              }
              if (res['data']['status'] == 1) {
                this.loader = false;
                this.btnLoad = false;
                this.confirmMobileFeildSet = false;
                this.existMobileerror = true;
                this.existMobile = res['data']['message']
                this.perSignUpFormm.get('mobileOTP').reset();
                clearInterval();
              }
              else {
                this.btnLoad = false;
                this.loader = false;
              }
            }
            else {
              this.alert.error(res['message'])
            }
          });
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }
  resendMobileOTP() {
    this.textShow = true;
    this.isDisabled = false;
    this.mobileOTPMessage = false;
    $("#confirmnumber").attr("autofocus", "autofocus").focus(); // autofocus for phone
    clearInterval(this.intervalId);
    this.mobileNo = this.perSignUpFormm.get('mobile').value;  
    this.callingCode = this.perSignUpFormm.get('calling_code').value;
    this.perSignUpFormm.get('mobileOTP').reset();
    this.subs.sink = this.indexService.createOTP(this.callingCode + this.mobileNo).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.setTimer();
       //   this.alert.success(res['data']['message']);
        }
        if (res.data.status == 1) {
          this.existMobile = res['data']['message']
          clearInterval();
        }
        else {
          this.btnLoad = false;
          this.loader = false;
        }
      }
      else {
        this.alert.error(res['message'])
      }
      setTimeout( () => {
        this.textShow = false;
      }, 10000);
    });
  }

  mobileerror() {
    this.existMobileerror = false;
  }

  verifyMobile() {
    this.passwordConfirmFieldset = false;
    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.personalDetailsFieldSet = false;
    this.homeAddressFieldSet = false;
    this.mobileNumberFieldSet = false;
    this.MobileOTP = this.perSignUpFormm.get('mobileOTP').value;
    if (this.MobileOTP.length == 6) {
      this.subs.sink = this.indexService.verifyOTP(this.MobileOTP, this.callingCode + this.mobileNo).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            this.step8 = true;
            this.value8 = 'completed'
            this.value9 = 'current';
            this.disabledOnSuccessMobile = false;
            this.enableMobileNext = false;
            this.mobileOTPMessage = false;
            this.confirmMobileFeildSet = false;
            this.createPinFieldSet = true;
          }
          if (res['data']['status'] == 2) {
            this.mobileOTPMessage = true
            this.otpFailMsg = res['data']['message'];
            this.isDisabled=true
            var thisObj = this;
            thisObj.timer='00'
            clearInterval();
            this.enableMobileNext = true;
            this.perSignUpFormm.get('mobileOTP').reset();
          }
          if (res['data']['status'] == 1) {
            this.mobileOTPMessage = true;
            this.enableMobileNext = true;
            this.isDisabled=true
            var thisObj = this;
            thisObj.timer='00'
            clearInterval();
            this.otpFailMsg = res['data']['message'];
            this.perSignUpFormm.get('mobileOTP').reset();
          }
          else {
            this.btnLoad = false;
            this.loader = false;
          }
        }
        else {
          this.alert.error(res['message'])
        }
      });
    }
  }
  getCountryDetails() {
    this.subs.sink = this.indexService.getCountryDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.countryData = res['data']['country list'];
      }
      else if (res['status'] == 1) {
        this.alert.error(res['message'])
      }
    }
    );
  }
  getCountryId() {
    this.selectedCountryId = this.perSignUpFormm.get('country_id').value || this.perSignUpFormm.get('nationality').value;
    for (var i = 0; i <= this.countryData.length; i++) {
      if(this.countryData[i] != undefined && this.countryData[i] != null) {
        if (this.selectedCountryId == this.countryData[i]['country_id']) {
          this.perSignUpFormm.patchValue({
            'calling_code': this.countryData[i]['calling_code']
          });
        }
      }
    }

  }

  dobValidation($event) {
    var dt = new Date();
    var yr = dt.getFullYear();
    var selectedYr = new Date($event.target.value);

    // Vaildate if applicant is over 18 years of age
    if (selectedYr > new Date(this.maxDOB)) {
      this.valid18DOB = false;
    }
    else {
      this.valid18DOB = true;
    }

    // Vaildate if applicant is less than 100 years of age
    const minYear = yr - 100;
    if(selectedYr.getFullYear() < minYear) {
      this.validDOB = false;
    } else {
      this.validDOB = true;
    }
  }

  userUsingEdgeBrowser() {
    var ua = window.navigator.userAgent;
    if (ua.indexOf('Edge/') > 0) {
      return true;
    } else {
      return false;
    }
  }
  businessTerms() {
    this.routerNavigate.navigate([]).then(result => {
      window.open('/#/index/termsofservice', '_blank');
    });
  }
  //submit signup data
  submitPersonal(formData: any) {
    formData.mobile = formData.calling_code +" "+ formData.mobile;
    const copiedObj = Object.assign({}, formData);
    delete copiedObj["EmailOTP"];
    delete copiedObj["mobileOTP"];
    delete copiedObj["calling_code"];
    copiedObj.phone = this.perSignUpFormm.get('mobile').value;

    var date = new Date(copiedObj.dob),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    var obj = [date.getFullYear(), mnth, day].join("-");
    copiedObj.dob = obj;

    this.subs.sink = this.indexService.registration(copiedObj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.step8 = true;
          this.value8 = 'completed'
          this.value9 = 'completed';
          this.progressBarFlag = false;
          this.passwordConfirmFieldset = false;
          this.emailFieldSet = false;
          this.passwordFieldSet = false;
          this.personalDetailsFieldSet = false;
          this.homeAddressFieldSet = false;
          this.mobileNumberFieldSet = false;
          this.confirmMobileFeildSet = false;
          this.createPinFieldSet = false;
          this.profilecompleteFeildSet = true;
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }

  get email() {
    return this.perSignUpFormm.get('email');
  }
  get mobile() {
    return this.perSignUpFormm.get('mobile');
  }

  backtophone() {
    this.step7 = false;
    this.value7 = 'current'
    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.passwordConfirmFieldset = false;
    this.personalDetailsFieldSet = false;
    this.homeAddressFieldSet = false;
    this.mobileNumberFieldSet = true;
    this.confirmMobileFeildSet = false;
    this.createPinFieldSet = false;
    this.profilecompleteFeildSet = false;
  }

  //login action after signup process
  LoginAction() {
    var formData = { userId: this.perSignUpFormm.get('email').value, password: this.perSignUpFormm.get('password').value, account_type: 'personal' }
    // var formData = { userId: this.perSignUpFormm.get('email').value, password: this.perSignUpFormm.get('password').value, account_type: this.perSignUpFormm.get('account_type').value }
    // var formData = { email: this.perSignUpFormm.get('email').value, password: this.perSignUpFormm.get('password').value, account_type: this.perSignUpFormm.get('account_type').value }
    if (this.authService.LoginFromRegistration(formData)) {
      this.loginActionActive = true;
    }
  }
  navigateToDashboard() {
    if (this.loginActionActive) {
      sessionStorage.setItem("isVerified", "yes");
      this.routerNavigate.navigate(['personal/accounts/getaccount']);
    }
  }

  ValidatePostal(control: AbstractControl) {
    let postalValue = control.value;
    if (postalValue == null) return null;

    let regex = new RegExp(/^[A-Za-z0-9- ]+$/);
    if (!regex.test(postalValue)) {
      return { invalidPostal: true };
    }
    else {
      let onlyNumeric = /^(?=.*[0-9- ])/;
      if (!postalValue.match(onlyNumeric)) {
        return { invalidPostal: true };
      }
    }
    return null;
  }

  noWhitespace(control: AbstractControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  ngOnInit() {
    this.subs.sink = this.authService.logindata.subscribe(data => {
      this.navigateToDashboard();
    });

    /*reactive form validating */
    this.perSignUpFormm = this.fb.group({

      email: ["", Validators.compose([Validators.required,
      Validators.email, Validators.pattern("[A-Za-z._-]+\(|[0-9])+\(|[A-Za-z0-9._-])+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      password: ["", Validators.compose([Validators.required, this.ValidatePassword,Validators.maxLength(40)])],
      EmailOTP: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      first_name: ["", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z- ']+$"), this.noWhitespace])],
      last_name: ["", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z- ']+$"), this.noWhitespace])],
      dob: ["", Validators.required],
      country_id: ["", Validators.required],
      postal_code: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9- ]+$")])],
      address_line1: ["", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9-.', ]+$"), , this.noWhitespace])],
      address_line2: ["", Validators.compose([Validators.pattern("^[a-zA-Z0-9-.', ]+$")])],
      city: ["", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z- ']+$"), this.noWhitespace])],
      region: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z- ]*$')])],


      calling_code: ["", Validators.required],
      mobile: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      mobileOTP: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      passcode_pin: ["", [Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]],
      confirm_pin: ["", [Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]],
      gender: [null, Validators.required],
      account_type: ["personal", Validators.required],
      next_step: ["KYC", Validators.required],
      middle_name: [''],
      town: [null, Validators.required],
      telephone: [null, Validators.required],
      phone: [null, Validators.required],
      place_of_birth: [null, Validators.required],
      nationality:["", Validators.required]

    });

    this.subs.sink=this.perSignUpFormm.get('passcode_pin').valueChanges.subscribe((value) => {
      this.createPin=value;
    });
    this.subs.sink=this.perSignUpFormm.get('confirm_pin').valueChanges.subscribe((value)=>{
      this.confirmPin=value;
      if(this.createPin == this.confirmPin){
       this.checkPin=false;
      }
      else{
       this.checkPin=true;
      }
    });
    this.subs.sink = this.perSignUpFormm.controls['EmailOTP'].valueChanges.subscribe(
      (selectedValue) => {
        if (selectedValue != null) {
          if (selectedValue.length < 6) {
            this.emailOTPMessage = false;
          }
        }
      }
    );
    this.subs.sink = this.perSignUpFormm.controls['mobileOTP'].valueChanges.subscribe(
      (selectedValue) => {
        if (selectedValue != null) {
          if (selectedValue.length < 6) {
            this.mobileOTPMessage = false;
          }
        }
      }
    );
    this.isUsingEdge = this.userUsingEdgeBrowser();
  }


  backtoemail() {
    this.step1 = true;
    this.value1 = 'invalid';
    this.value2 = 'current';


    this.step2 = false;
    this.step3 = false;



    this.emailFieldSet = true;
    this.passwordFieldSet = false;
    this.passwordConfirmFieldset = false;
    this.personalDetailsFieldSet = false;
    this.homeAddressFieldSet = false;
    this.mobileNumberFieldSet = false;
    this.confirmMobileFeildSet = false;
    this.createPinFieldSet = false;
    this.profilecompleteFeildSet = false;
  }


  removeerror() {
    this.existEmailerror = false;
  }



  ValidatePassword(control: AbstractControl) {

    let passwordvalue = control.value;
    if (passwordvalue == null) return null;
    var alphaCheck = new Array();
    alphaCheck.push("[A-Z]"); //Uppercase Alphabet.
    alphaCheck.push("[a-z]"); //Lowercase Alphabet.

    var numCheck = new Array();
    numCheck.push("[0-9]"); //Digit.
    //  numCheck.push("[!@#$%^&*]"); //Special Character.
    //  regex.push("[a-zA-Z0-9!@#$%^&*]{8,12}") // 8 to 12 Characters Password.

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
  noSpace(){
    $(".first, .last, .postal, .add1, .add2, .city, .region").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
          this.value = this.value.replace(/[ ]{2,}/gi," ");
  });
  }
  trimming_fn(x) {    
    return x ? x.replace(/^\s+|\s+$/gm, '') : ''; 
};
  ngAfterViewInit() {
    //enter bnt execute next
    $("#email").keyup(function (event) {
      if (event.keyCode === 13) {
        $("#step1").click();
      }
    });

    $("#password").keyup(function (event) {
      if (event.keyCode === 13) {
        $("#step2").click();
      }
    });
    $("#emailconfirm").keyup(function (event) {
      if (event.keyCode === 13) {
        $("#step3").click();
      }
    });
    $("#first_name,#last_name,#dob").keyup(function (event) {
      if (event.keyCode === 13) {
        $("#step4").click();
      }
    });
    $("#contryname,#postal_code,#addline1,#addline2,#city,#region").keyup(function (event) {
      if (event.keyCode === 13) {
        $("#step5").click();
      }
    });
    $("#countryid,#mobileno").keyup(function (event) {
      if (event.keyCode === 13) {
        $("#step6").click();
      }
    });

    $("#confirmnumber").keyup(function (event) {
      if (event.keyCode === 13) {
        $("#step7").click();
      }
    });
    $("#passcode_pin").keyup(function (event) {
      if (event.keyCode === 13) {
        $("#step8").click();
      }
    });
    $("#confirm_pin").keyup(function (event) {
      if (event.keyCode === 13) {
        $("#step9").click();
      }
    });
  }
 passwordType:string ='password';
 passwordShown: boolean = false;
 togglePassword(){
   if(this.passwordShown){
     this.passwordShown = false;
     this.passwordType = 'password';
   }
   else{
    this.passwordShown = true;
    this.passwordType = 'text';
   }
 }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  checkRegexForAlphaNumeric(text) {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(text);
  }

}
