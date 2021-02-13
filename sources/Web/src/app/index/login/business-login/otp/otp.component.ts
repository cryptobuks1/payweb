import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/shared/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IndexService } from 'src/app/core/shared/index.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import { LocationStrategy } from '@angular/common';
import { HomeService } from 'src/app/core/shared/home.service';
import { HomeDataService } from 'src/app/home/homeData.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit,OnDestroy {
  private subs=new SubSink()
  timer:any;
  intervalId:any;
  mobileOtp:any='';
  isDisabled: boolean = false;
  mobileOTPMessage: boolean = false;
  otpFailMsg: string;
  callingCode: any;
  userData: any;
  phone: any;
  mobile: any;
  cuntrieslist: any;
  country_name: any;
  isCompleted: boolean = false;
  textShow:boolean= false;
  phoneNo: any;


  constructor(private indexService:IndexService,private homeService:HomeService, private AuthService:AuthService,private routerNavigate:Router,private alert:NotificationService,
    private locationStrategy: LocationStrategy, private authService: AuthService, 
    private homeDataService: HomeDataService) {
    this.userData = JSON.parse(sessionStorage.getItem("userData"));
    
    // this.callingCode = sessionStorage.getItem('callCode');
    // this.mobile = this.callingCode + this.userData.data.userInfo.phone;
  }
  ngOnInit() {
    this.subs.sink = this.homeService.getUserDetails().subscribe(data => {
      if(data) {
        this.mobile = data.mobile;
      }
    });     
    this.preventBackButton()
    clearInterval(this.intervalId);
    this.setTimer();
  //  this.getCuntries();
    this.isActivated();
  }
  // getCuntries(){
  //   // getCountryDetails
  //   this.homeService.getCountryDetails().subscribe(res => {
  //    if(res['status']==0){
  //    if (res['data']['status'] == 1) {
  //     //this.alert.error(res['data']['message'])
  //    } else if(res['data']['status']==0) {
  //      this.cuntrieslist=res['data']['country list'];
  //      this.cuntrieslist.forEach(element => {
  //        if(element.country_id==this.userData['data']['userInfo']['country_id']){
  //          this.userData['data']['userInfo']['country_id']
  //          this.country_name=element.country_name;
  //          let index = this.userData.data.userInfo.mobile.indexOf(" ");
  //          this.callingCode = this.userData.data.userInfo.mobile.substr(0, index);
  //        }
  //        this.phoneNo = this.userData.data.userInfo.mobile.substr(this.userData.data.userInfo.mobile.indexOf(" ")+1);
  //        this.mobile = this.callingCode +" "+ this.phoneNo;
  //      });
  //    }
  //  } else {
  //      this.alert.error(res['message'])
  //    }
  //   });
  //  }



  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
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
  verifyOTPAndSubmit(otp){
    this.subs.sink=this.indexService.verifyOTP(otp,this.mobile).subscribe(res=>{
      if(res['status']==0){
            if(res['data']['status']==0){
              sessionStorage.setItem('businessloginOtp','false');
            //  this.routerNavigate.navigate(['/home/application']);
            if(this.isCompleted) {             
              this.routerNavigate.navigate(['business/accounts/getaccount']);
                } else {
                  this.routerNavigate.navigate(['business/application']);
                }
            }
            else if(res['data']['status']==1){
              this.mobileOTPMessage = true;
              this.otpFailMsg = res['data']['message'];
              this.isDisabled=true
            var thisObj = this;
            thisObj.timer='00'
            clearInterval();
            this.mobileOtp='';
            }
          }
          else{
            this.alert.error(res['message']);
            this.mobileOtp='';
          }
        })
  }
isActivated() {
  if(this.userData && this.userData.kyb_status === "COMPLETED") {
    this.isCompleted = true;
  } else {
    this.isCompleted = false;
  }
  this.homeDataService.isKYBDone(this.isCompleted);
  }

  mobileResendLink() {
    this.textShow = true;
    this.mobileOTPMessage=false;
    this.mobileOtp='';
    this.isDisabled = false;
    clearInterval(this.intervalId);
    this.subs.sink = this.indexService.createOTP(this.mobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.setTimer();
          //this.alert.success(res['data']['message']);
        }
        if (res['data']['status'] == 1) {
          clearInterval();
          this.otpFailMsg = res['data']['message'];
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






    ngOnDestroy(){
      this.subs.unsubscribe();
    }
}
