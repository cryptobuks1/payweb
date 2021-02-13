import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/core/shared/auth.service';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { IndexService } from 'src/app/core/shared/index.service';
import { SubSink } from 'subsink';
declare var $: any;

@Component({
  selector: 'app-personal-settings',
  templateUrl: './personal-settings.component.html',
  styleUrls: ['./personal-settings.component.scss']
})
export class PersonalSettingsComponent implements OnInit {
  profileData: any;
  applicant_id: any;
  private subs = new SubSink()
  mobile: any;
  timer: any;
  intervalId: any;
  mobileOtp: any;
  isDisabled: boolean = true;
  detailsList: any;
  firstForm: boolean = true;
  secondForm: boolean = false;
  thirdForm: boolean = false;
  showMyContainer: boolean = true;
  changePasswordForm: FormGroup;
  
  loader: boolean = false;
  constructor(private routerNavigate: Router, private indexService: IndexService, private homeService: HomeService,
    private alert: NotificationService, public authService: AuthService, private fb: FormBuilder, ) {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));

  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      old_password: ["", Validators.compose([Validators.required, this.ValidatePassword])],
      new_password: ["", Validators.compose([Validators.required, this.ValidatePassword])],
    });

    clearInterval(this.intervalId);
    this.getPersonaldetails();
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
    this.subs.sink = this.indexService.createOTP(this.detailsList.mobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.subs.sink = this.indexService.verifyBusinessOTP(otp, this.detailsList.mobile).subscribe(res => {
            if (res['status'] == 0) {
              if (res['data']['status'] == 0) {
                sessionStorage.setItem("isVerified", "yes");
                //this.alert.success(res['data']['message']);
                $("#setTargetModal").modal("show");
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
  redirect() {
    $("#setTargetModal").modal("hide");
    this.routerNavigate.navigate(['/business/accounts/getaccount']);
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
  mobileResendLink() {
    this.isDisabled = true;
    this.subs.sink = this.indexService.createOTP(this.detailsList.mobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
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
  getPersonaldetails() {
    this.homeService.getPersonalDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.detailsList = res['data'];
        this.firstForm = true;
        this.secondForm = false;
        this.thirdForm = false;
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }
  changePwd() {
    this.firstForm = false;
    this.secondForm = true;
    this.thirdForm = false;
  }
  changeOtp(changePassword) {
    this.homeService.changePassword(changePassword).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
         // this.alert.success(res['data']['message'])
          this.firstForm = false;
          this.secondForm = false;
          this.thirdForm = true;
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
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

