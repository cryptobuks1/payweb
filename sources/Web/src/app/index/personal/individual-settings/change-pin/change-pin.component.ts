import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';
import { IndexService } from 'src/app/core/shared/index.service';

declare var $;

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.scss']
})
export class ChangePinComponent implements OnInit {
  //Change Pin
  changePinForm: any;
  updateFail: boolean;
  updateSuccess: boolean;
  showMyContainer2: boolean;
  showMyContainer1: boolean;
  showMyContainer: boolean;
  changeNewPinForm: any;
  //  presentPin: boolean;
  newpasscode: any;


  constructor(private formBuilder: FormBuilder, private homeService: HomeService, private alert: NotificationService, public authService: AuthService) { }
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
    this.changePinForm = this.formBuilder.group({
      old_passcode: ["", Validators.required],
      new_passcode: ["", Validators.required]

    });
    // this.changeNewPinForm = this.formBuilder.group({

    //   new_passcode: ["", Validators.required]
    // })
  }
  currentPinn: any = true;
  newPin: any = false;;
  // currentPin(data) {
  //   this.presentPin = data;
  //   this.currentPinn = false;
  //   this.newPin = true;
  //   var request = {
  //     "old_passcode": this.presentPin['old_passcode'],
  //     "new_passcode": this.newpasscode
  //   }

  // this.homeService.changePin(request).subscribe(res => {
  //   if (res["data"]["status"] == 0) {
  //     this.updateFail = false;
  //     this.updateSuccess = true;
  //   }
  //   if (res["data"]["status"] == 1) {
  //     this.updateFail = true;
  //     this.updateSuccess = false;
  //   }
  // })

  // }
  //Change Pin
  changePin(data) {
    //    this.presentPin = data;
    if (data.old_passcode !== data.new_passcode) {
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
          $('#success').modal('hide')
        }
        this.currentPinn = true;
        this.changePinForm.reset();
      })
    } else {
      $('#success').modal('hide');
      $('#fail').modal('hide');
      this.changePinForm.reset();
      this.alert.error("Current pin and New pin should be different");      
    }
  }

  openEye: boolean = false;
  closeEye: boolean = true;
  openEye1: boolean = false;
  closeEye1: boolean = true;
  password: any = "password";
  password1: any = "password";
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
    this.parentFun.emit();
  }
  // clearNewPinform(){
  //   this.changeNewPinForm.reset();
  // }
}
