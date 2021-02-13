/**
 * Business registraion Component
 * Business registration
 * @package BusinessComponent
 * @subpackage app\index\sign-up\business\BusinessComponent
 * @author SEPA Cyber Technologies, Sayyad M.
 */

import { AuthService } from '../../../core/shared/auth.service';
import { IndexService } from "../../../core/shared/index.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import { HomeService } from 'src/app/core/shared/home.service';

declare var $: any;

@Component({
  selector: 'app-business',
  templateUrl: './business-signup.component.html',
  styleUrls: ['./business-signup.component.scss']
})
export class BusinessSignupComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  progressBarFlag: boolean = true;
  perSignUpFormm: FormGroup;
  countryData: any;
  OTPValue: any;
  apploader: boolean = false;
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
  emailotpReason: string;
  otpFailMsg: string;
  emailOtpexpiredMsg: boolean = false;
  mobileOtpexpiredMsg: boolean = false;
  disabledOnSuccessMobile: boolean = true;
  existEmailerror: boolean = false;
  existEmail: string;
  existMobile: string;
  existMobileerror: boolean = false;
  loginActionActive = false;
  timer: any;
  intervalId: any;

  emailFieldSet: boolean = true;
  passwordFieldSet: boolean = false;
  passwordConfirmFieldset: boolean = false;
  confirmEmailFieldset: boolean = false
  mobileNumberFieldSet: boolean = false;
  confirmMobileFeildSet: boolean = false;
  profilecompleteFeildSet: boolean = false;
  loader: boolean = false;
  country_id: any;

  step1: boolean = true;
  step3: boolean = false;
  value1: any = 'invalid';
  value2: any = 'current'
  value3: any = 'completed'
  step2: boolean = false;
  value4: string;
  value5: string;
  step4: boolean = false;
  step5: boolean = false;
  value6: string;
  btnLoad: boolean = false;
  isDisabled: boolean = false;
  callCode: any;
  textShow:boolean= false;


  constructor(private fb: FormBuilder, private indexService: IndexService, 
    private alert: NotificationService, private authService: AuthService,
    private homeService: HomeService,
    private routerNavigate: Router) {
  }

  //check duplicate email

  checkDuplicate() {
    this.emailId = this.perSignUpFormm.get('email').value;
    var obj = { userId: this.perSignUpFormm.get('email').value, type: 'business' };
    this.subs.sink = this.indexService.duplicateEmailMobile(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 1) {
          this.emailFieldSet = true;
          this.passwordFieldSet = false;
          this.existEmailerror = true;
          this.existEmail = res['data']['message'];
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

  mobileerror() {
    this.existMobileerror = false;
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
  fieldSetBack(){
    this.isDisabled = false;
    this.btnLoad = true;
    this.loader = true;
    clearInterval(this.intervalId);
    this.emailId = this.perSignUpFormm.get('email').value;
    this.perSignUpFormm.get('EmailOTP').reset();
    this.emailOTPMessage = false;
    this.subs.sink = this.indexService.createOTP(this.emailId).subscribe(response => {
      if (response['status'] == 0) {
        if (response['data']['status'] == 1) {
          this.btnLoad = false;
          this.loader = false;
          this.existEmailerror = true;
          this.existEmail = response['data']['message']
        }
        if (response['data']['status'] == 0) {
          this.setTimer();
          this.btnLoad = false;
          this.step3 = true;
          this.value3 = 'completed'
          this.value4 = 'current';
          this.value5='invalid'
          this.loader = false;
          this.emailFieldSet = false;
          this.passwordFieldSet = false;
          this.passwordConfirmFieldset = true;
        }
      }
      else {
        this.alert.error(response['message']);
      }
    });
  }
  emailFieldSetBack() {
    this.step2 = false;
    this.step1 = true;
    this.value1 = 'invalid';
    this.value2 = 'current';
    this.perSignUpFormm.get('password').reset();
    this.existMobileerror = false;
    this.loader = false;
    this.emailFieldSet = true;
    this.passwordFieldSet = false;
  }
  //create email otp
  createEmailOTP() {
    this.isDisabled = false;
    this.btnLoad = true;
    this.loader = true;
    clearInterval(this.intervalId);
    this.emailId = this.perSignUpFormm.get('email').value;
    this.perSignUpFormm.get('EmailOTP').reset();
    this.emailOTPMessage = false;
    this.subs.sink = this.indexService.createOTP(this.emailId).subscribe(response => {
      if (response['status'] == 0) {
        if (response['data']['status'] == 1) {
          this.btnLoad = false;
          this.loader = false;
          this.existEmailerror = true;
          this.existEmail = response['data']['message']
        }
        if (response['data']['status'] == 0) {
          this.setTimer();
          this.btnLoad = false;
          this.step3 = true;
          this.value3 = 'completed'
          this.value4 = 'current';
          this.loader = false;
          this.emailFieldSet = false;
          this.passwordFieldSet = false;
          this.passwordConfirmFieldset = true;
        }

      }
      else {
        this.alert.error(response['message']);
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
          this.existEmail = res['message']
        }
        if (res['data']['status'] == 0) {
        //  this.alert.success(res['data']['message']);
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

  //verify email with otp
  verifyEmail() {
    this.isDisabled = false;
    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.EmailOTP = this.perSignUpFormm.get('EmailOTP').value;
    if (this.EmailOTP.length == 6) {
      this.subs.sink = this.indexService.verifyOTP(this.EmailOTP, this.emailId).subscribe(response => {
        if (response['status'] == 0) {
          if (response['data']['status'] == 0) {
            this.step4 = true;
            this.value4 = 'completed'
            this.value5 = 'current';
            this.getCountryDetails();
            this.loader = false;
            this.enableEmailNext = false;
            this.emailOTPMessage = false;
            this.passwordConfirmFieldset = false;
            this.country_id = this.perSignUpFormm.get('country_id').value;
            this.emailFieldSet = false;
            this.passwordFieldSet = false;
            this.mobileNumberFieldSet = true;
          }
          if (response['data']['status'] == 2) {
            this.emailOTPMessage = true;
            this.enableEmailNext = true;
            this.loader = false;
            this.isDisabled = true;
            var thisObj = this;
            thisObj.timer='00'
            this.perSignUpFormm.get('EmailOTP').reset();
            clearInterval();
            this.otpFailMsg = response['data']['message'];
          }
          if (response['data']['status'] == 1) {
            this.emailOTPMessage = true;
            this.enableEmailNext = true;
            this.loader = false;
            this.isDisabled = true
            var thisObj = this;
            thisObj.timer='00'
            this.perSignUpFormm.get('EmailOTP').reset();
            clearInterval();
            this.otpFailMsg = response['data']['message']
          }
        }
        else {
          this.alert.error(response['message']);
          this.perSignUpFormm.get('EmailOTP').reset();
        }
      });
    }
   // this.perSignUpFormm.get('mobileOTP').reset();
  }

  //create mobile otp
  createMobileOTP() {
    this.isDisabled = false;
    clearInterval(this.intervalId);
    this.loader = true;
    this.mobileNo = this.perSignUpFormm.get('mobile').value;   
    this.callingCode = this.perSignUpFormm.get('calling_code').value;
    this.callCode = sessionStorage.setItem('callCode', this.callingCode);
    this.perSignUpFormm.get('mobileOTP').reset();
    this.mobileOTPMessage = false;
    let obj = { userId: this.callingCode +" "+ this.mobileNo, type: 'business' };
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
                this.setTimer();
                this.step5 = true;
                this.value5 = 'completed'
                this.value6 = 'current'
                this.loader = false;
                this.existEmailerror = false;
                this.passwordConfirmFieldset = false;
                this.emailFieldSet = false;
                this.passwordFieldSet = false;
                this.mobileNumberFieldSet = false;
                this.confirmMobileFeildSet = true;
              }
              if (res['data']['status'] == 3) {
                this.existMobileerror = true;
                this.btnLoad = false;
                this.loader = false;
                this.existMobile = res['data']['message'];
                clearInterval();
              }
              if (res.data.status == 4) {
                this.existMobileerror = true;
                this.btnLoad = false;
                this.loader = false;
                this.existMobile = res['data']['message'];
                clearInterval();
              }
              if (res['data']['status'] == 1) {
                this.loader = false;
                this.btnLoad = false;
                this.confirmMobileFeildSet = false;
                this.existMobileerror = true;
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
    this.subs.sink = this.indexService.createOTP(this.callingCode + this.mobileNo).subscribe(response => {
      if (response['status'] == 0) {
        if (response.data.status == 0) {
          this.setTimer();
        //  this.alert.success(response['data']['message']);
        }
        if (response.data.status == 1) {
          this.existMobile = response['data']['message']
          clearInterval();
        }
        else {
          this.btnLoad = false;
          this.loader = false;
        }
      } else {
        this.alert.error(response['message'])
      }
      setTimeout( () => {
        this.textShow = false;
      }, 10000);
    });
  }

  //verify mobile otp and submit
  verifyOTPAndSubmit(formData: any) {
    this.apploader = true;
    this.passwordConfirmFieldset = false;
    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.mobileNumberFieldSet = false;
    this.MobileOTP = this.perSignUpFormm.get('mobileOTP').value;
    this.perSignUpFormm.get('mobileOTP').reset();
    if (this.MobileOTP.length == 6) {
      this.subs.sink = this.indexService.verifyOTP(this.MobileOTP, this.callingCode + this.mobileNo).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            this.disabledOnSuccessMobile = false;
            this.enableMobileNext = false;
            this.mobileOTPMessage = false;
            this.confirmMobileFeildSet = false;            
            delete formData['phone'];
            formData['mobile'] = this.mobileNo;            
            this.submitBusiness(formData);
          }
          if (res['data']['status'] == 2) {
            this.mobileOTPMessage = true
            this.otpFailMsg = res['data']['message']
            this.enableMobileNext = true;
            this.isDisabled=true;
            var thisObj = this;
            thisObj.timer='00';
            clearInterval();

          }
          if (res['data']['status'] == 1) {
            this.mobileOTPMessage = true;
            this.enableMobileNext = true;
            this.otpFailMsg = res['data']['message'];
            this.isDisabled=true;
            var thisObj = this;
            thisObj.timer='00';
            clearInterval();
          }
          else {
            this.btnLoad = false;
            this.loader = false;
          }
        }
        else {
          this.alert.error(res['message']);
        }
      });
    }
  }

  //get coutry details for country drowndown
  getCountryDetails() {
    this.subs.sink = this.indexService.getCountryDetails().subscribe(response => {
      if (response['status'] == 0) {
        this.countryData = response['data']['country list'];
      }
      else if (response['status'] == 1) {
        this.alert.error(response['message'])
      }
    });
  }

  //submit signup data
  submitBusiness(formData: any) {
    this.progressBarFlag = false;
    const copiedObj = Object.assign({}, formData);
    copiedObj.mobile = copiedObj.calling_code +" "+ copiedObj.mobile;
    delete copiedObj["EmailOTP"];
    delete copiedObj["mobileOTP"];
    for (var i = 0; i < this.countryData.length; i++) {
      if (formData.calling_code == this.countryData[i].calling_code) {
        var country_id = this.countryData[i]['country_id'];
      }
    }
    delete copiedObj["calling_code"];
    copiedObj.country_id = country_id;
    copiedObj.phone = this.mobileNo;
    this.subs.sink = this.indexService.registration(copiedObj).subscribe(data => {
      this.apploader = false;
      if (data.status == 0) {
        if (data['data']['status'] == 0) {
          this.progressBarFlag = false;
          this.passwordConfirmFieldset = false;
          this.emailFieldSet = false;
          this.passwordFieldSet = false;
          this.mobileNumberFieldSet = false;
          this.confirmMobileFeildSet = false;
          this.profilecompleteFeildSet = true;
          // sessionStorage.setItem('Token', data['data']['Token']);
          // sessionStorage.setItem('client_auth', data['data']['client_auth']);
          // sessionStorage.setItem('member_id', data['data']['member_id']);
          sessionStorage.setItem('x-auth-token', data['data']['x-auth-token']);
          // sessionStorage.setItem('api_access_key', data['data']['api_access_key']);

          sessionStorage.setItem('account_type', this.perSignUpFormm.get('account_type').value);
          let userDetails = {};
          userDetails['userId'] = this.perSignUpFormm.get('email').value;
          userDetails['password'] = this.perSignUpFormm.get('password').value;
          this.indexService.setUserDetails(userDetails);
          // sessionStorage.setItem('password', this.perSignUpFormm.get('password').value);
          // sessionStorage.setItem('email', this.perSignUpFormm.get('email').value);

        } else if (data['data']['status'] == 1) {
          this.alert.error(data['data']['message'])
        }
      } else if (data.status == 1) {
        this.alert.error('Signup failed');
      }
    });
  }

  get email() {
    return this.perSignUpFormm.get('email');
  }
  get mobile() {
    return this.perSignUpFormm.get('mobile');
  }
  //choose business plan
  chooseBusinessPlan() {
    this.routerNavigate.navigate(['/business/signup/reg-form'])
  }
  businessTerms() {
    this.routerNavigate.navigate([]).then(result => {
      window.open('/#/index/termsofservice', '_blank');
    });
  }
  businessLogin() {
    this.routerNavigate.navigate(['/business/login'])
  }

  ngOnInit() {
    /* reactive form validating*/
    this.perSignUpFormm = this.fb.group({
      email: ["", Validators.compose([Validators.required,
      Validators.email, Validators.pattern("[A-Za-z._-]+\(|[0-9])+\(|[A-Za-z0-9._-])+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      password: ["", Validators.compose([Validators.required, this.ValidatePassword])],
      EmailOTP: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9 ]*$")])],
      mobile: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]{6,15}$")])],
      mobileOTP: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      calling_code: ["359", Validators.required],
      gender: [, Validators.required],
      account_type: ["business", Validators.required],
      next_step: ["KYC", Validators.required],

      first_name: ["", Validators.compose([Validators.required, Validators.pattern('[a-zA-Z_]{1,}')])],
      last_name: ["", Validators.compose([Validators.required, Validators.pattern('[a-zA-Z_]{1,}')])],
      country_id: [null, Validators.required],
      middle_name: [''],
      dob: [null, Validators.required],
      postal_code: [null, Validators.required],
      address_line1: [null, Validators.required],
      address_line2: [null],
      city: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])],
      region: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z- ]*$')])],
      passcode_pin: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      town: [null, Validators.required],
      telephone: [null, Validators.required],
      phone: [null, Validators.required]
    });

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

  ngAfterViewInit() {
    //enter btn continue fieldset
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
    this.mobileNumberFieldSet = false;
    this.confirmMobileFeildSet = false;
    this.profilecompleteFeildSet = false;
  }

  backtophone() {
    this.step4 = true;
    this.value5 = 'current'
    this.value6 = ''


    this.emailFieldSet = false;
    this.passwordFieldSet = false;
    this.passwordConfirmFieldset = false;
    this.mobileNumberFieldSet = true;
    this.confirmMobileFeildSet = false;
    this.profilecompleteFeildSet = false;
  }


  removeError() {
    this.existEmailerror = false;
  }

  mobileError() {
    this.existMobileerror = false;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  checkRegexForAlphaNumeric(text) {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(text);
  }
  noSpace(){
    $("input").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
  });


  }
}
