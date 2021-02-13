import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';
import { SubSink } from 'subsink';
import { noop, Observable } from 'rxjs';

declare var $;
@Component({
  selector: 'app-business-settings-security',
  templateUrl: './business-settings-security.component.html',
  styleUrls: ['./business-settings-security.component.scss']
})
export class BusinessSettingsSecurityComponent implements OnInit, OnDestroy {

  //Change Pin
  changePinForm: any;
  updateFail: boolean;
  updateSuccess: boolean;
  showMyContainer2: boolean;
  showMyContainer1: boolean;
  showMyContainer: boolean;
  changeNewPinForm: any;
  newpasscode: any;
  openEye: boolean = false;
  closeEye: boolean = true;
  openEye1: boolean = false;
  closeEye1: boolean = true;
  password: any = "password";
  password1: any = "password";
  currentPinn: any = true;
  newPin: any = false;
  doEmailNotify: boolean = false;
  doPushNotify: boolean = false;
  isVisible: boolean = false;
  subs: SubSink = new SubSink();
  changePinActive;
  otpActive;
  privacyActive;
  isKybCompleted$: Observable<boolean>;
  
  selectedTab = {
    personal_privacy: true,
    change_password: false,
    change_pin: false
  };

  tabImagesBackground = {
    privacy: {
      whiteBackground: false
    },
    password: {
      whiteBackground: false
    },
    pin: {
      whiteBackground: true
    }
  };

  constructor(private formBuilder: FormBuilder,
    private homeService: HomeService,
    private alert: NotificationService,
    public authService: AuthService) { }

  ngOnInit() {
    this.changePinForm = this.formBuilder.group({
      old_passcode: ["", Validators.required],
      new_passcode: ["", Validators.required]
    });
    this.subs.sink = this.homeService.getPrivacyNotificationSettings().subscribe((res: any) => {
      this.doEmailNotify = res.data.doEmailNotify == 1 ? true : false;
      this.doPushNotify = res.data.doPushNotify == 1 ? true : false;
      this.isVisible = res.data.isVisible == 1 ? true : false;
    });
    this.selectTabInSecurity('change_pin');
    this.setImageInTab('pin');
    this.changePinActive = true;
    this.otpActive = false;
    this.privacyActive = false;
    this.isKybCompleted$ = this.homeService.getIsKybCompleted();
  }
  changePin(data?) {
    this.selectTabInSecurity('change_pin');
    this.setImageInTab('pin');
    this.changePinActive = true;
    this.otpActive = false;
    this.privacyActive = false;
    if (data && (data.old_passcode !== data.new_passcode)) {
      this.newPin = true;
      this.currentPinn = false;
      var request = {
        "old_passcode": data.old_passcode,
        "new_passcode": data.new_passcode
      }
      this.homeService.changePin(request).subscribe(res => {
        if (res["data"]["status"] == 0) {
          $('#success').modal('show')
          $('#fail').modal('hide');
        }
        if (res["data"]["status"] == 1) {
          $('#fail').modal('show');
          $('#success').modal('hide');
        }
        this.currentPinn = true;
        this.changePinForm.reset();
      });
    } else {
      $('#success').modal('hide');
      $('#fail').modal('hide');
      this.changePinForm.reset();
      this.alert.error("Current pin and New pin should be different");
    }
  }

  showCurrent() {
    this.openEye = false;
    this.closeEye = true;
    this.password = "password";
  }

  hideCurrent() {
    this.openEye = true;
    this.closeEye = false;
    this.password = "text";
  }
  showCurrent1() {
    this.openEye1 = false;
    this.closeEye1 = true;
    this.password1 = "password";
  }

  hideCurrent1() {
    this.openEye1 = true;
    this.closeEye1 = false;
    this.password1 = "text";

  }

  clearOldPinform() {
    this.changePinForm.reset();
  }


  removeCheckBox() {
    this.doEmailNotify = true;
    this.doPushNotify = true;
    this.isVisible = true;
    this.updatePrivacyNotificationSettings();
  }
  updatePrivacyNotificationSettings() {
    this.subs.sink = this.homeService.updatePrivacyNotificationSettings({
      doEmailNotify: this.doEmailNotify == true ? 1 : 0,
      doPushNotify: this.doPushNotify == true ? 1 : 0,
      isVisible: this.isVisible == true ? 1 : 0
    }).subscribe(() => noop);
  }

  showOtp() {
    // $("#showOtpModal").modal({ backdrop: 'static', keyboard: false });
    // this.setTimer();
    this.selectTabInSecurity('change_password');
    this.setImageInTab('password');
    this.password = true;
    this.otpActive = true;
    this.changePinActive = false;
    this.privacyActive = false;
  }

  privacy() {
    this.selectTabInSecurity('personal_privacy');
    this.setImageInTab('privacy');
    this.password = false;
    this.privacyActive = true;
    this.changePinActive = false;
    this.otpActive = false;
  }

  selectTabInSecurity(tab) {
    for (const key of Object.keys(this.selectedTab)) {
      this.selectedTab[key] = false;
    }
    this.selectedTab[tab] = true;
  }

  setImageInTab(selectedTab) {
    for (const tabKey of Object.keys(this.tabImagesBackground)) {
      if (selectedTab === tabKey) {
        this.tabImagesBackground[tabKey].whiteBackground = true;
      } else {
        this.tabImagesBackground[tabKey].whiteBackground = false;
      }
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
