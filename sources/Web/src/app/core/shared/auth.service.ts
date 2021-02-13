/**
* This service is used to get the token and manages in session storage and provide the boolean value for auth service.
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { HttpUrl } from './httpUrl.component';
import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IndexService } from './index.service';
import { NotificationService } from '../toastr-notification/toastr-notification.service';
import { HomeService } from './home.service';
import { HomeDataService } from 'src/app/home/homeData.service';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  responseData: any = [];
  @Output() logindata: EventEmitter<boolean> = new EventEmitter();
  userData: any;
  constructor(private http: HttpClient, private _notificationservice: NotificationService, 
    private routerNavigate: Router, private homeService: HomeService,private homeDataService: HomeDataService,
    private IndexService: IndexService) { }

  public isAuthenticate(): boolean {
    const userData = sessionStorage.getItem('userData');
    if (userData && userData.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  public async loginAction(postData) {
    this.http.post(HttpUrl.Login_PayVoo, postData).subscribe(res => {

      if (res['status'] == 0 && res['data']['status'] == 1) {
        this._notificationservice.error(res['data']['message']);
        return false;
      }

      if (res['status'] == 0) {
        if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'personal') {

          sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
          let userInfo = {};
          userInfo['account_type'] =  res['data']['userInfo']['account_type'];          
          sessionStorage.setItem('userData',JSON.stringify(userInfo));
          let userDetails = {}
          userDetails['firstName'] = res['data']['userInfo']['first_name'];
          userDetails['lastName'] = res['data']['userInfo']['last_name'];
          userDetails['mobile'] = res['data']['userInfo']['mobile'];
          userDetails['email'] = res['data']['userInfo']['email'];
          this.homeDataService.setMobile(res['data']['userInfo']['mobile']);
          localStorage.setItem('mobile', res['data']['userInfo']['mobile']);
          localStorage.setItem('email', res['data']['userInfo']['email']);
          this.homeService.setUserDetails(userDetails);
        } else if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'sandbox') {
          sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
          let userInfo = {};
          userInfo['account_type'] =  res['data']['userInfo']['account_type'];          
          sessionStorage.setItem('userData',JSON.stringify(userInfo));
          this.homeDataService.setMobile(res['data']['userInfo']['mobile']);
        } else if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'business') {
          
          if (res['data']['userInfo']['business_legal_name'] == null) {

            sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
            sessionStorage.setItem('account_type', res['data']['account_type']);
            let userInfo = {};
            userInfo['mobile'] = res['data']['userInfo']['mobile'];          
            userInfo['initialPayment'] =  res['data']['userInfo']['initialPayment'];
            sessionStorage.setItem('userData',JSON.stringify(userInfo));
            let userDetails = {};
            userDetails['mobile'] = res['data']['userInfo']['mobile'];
            this.homeService.setUserDetails(userDetails);
            localStorage.setItem('mobile', res['data']['userInfo']['mobile']);
          localStorage.setItem('email', res['data']['userInfo']['email']);
            this.homeDataService.setMobile(res['data']['userInfo']['mobile']);

            this.routerNavigate.navigate(["business/signup/register"]);
          } else {
              this.IndexService.createOTP(res['data']['userInfo']['mobile']).subscribe(response => {
              if (response['status'] == 0) {
                if (response['data']['status'] == 0) {
                  
                  sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
                  let userInfo = {};
                  let userDetails = {};
                  userDetails['mobile'] = res['data']['userInfo']['mobile'];
                  userDetails['business_country_of_incorporation'] = res['data']['userInfo']['business_country_of_incorporation'];
                  userDetails['sandboxInfo'] = res['data']['sandBoxInfo'];
                  userDetails['firstName'] = res['data']['userInfo']['first_name'];
                  userDetails['lastName'] = res['data']['userInfo']['last_name'];
                  userInfo['account_type'] =  res['data']['userInfo']['account_type'];                  
                  userInfo['kyb_status'] =  res['data']['userInfo']['kyb_status'];
                  userInfo['business_country_of_incorporation'] = res['data']['userInfo']['business_country_of_incorporation'];
                  userDetails['business_legal_name'] =  res['data']['userInfo']['business_legal_name'];
                  userInfo['country_id'] = res['data']['userInfo']['country_id'];
                  this.homeService.setUserDetails(userDetails);
                  this.homeDataService.setMobile(res['data']['userInfo']['mobile']);
                  localStorage.setItem('mobile', res['data']['userInfo']['mobile']);
                 localStorage.setItem('email', res['data']['userInfo']['email']);           
                  sessionStorage.setItem('userData',JSON.stringify(userInfo));

                  this.routerNavigate.navigate(["login/otp"]);

                } else if (response['data']['status'] == 1) {
                  this._notificationservice.error(res['data']['message'])
                }
              }
              else {
                this._notificationservice.error(res['message'])
              }
            })
         }
        }
      }
      else {
        this._notificationservice.error(res['message'])
      }
      this.logindata.emit();
    });
    return true;
  }

  public async LoginFromRegistration(postData) {
    this.http.post(HttpUrl.Login_PayVoo, postData).subscribe(res => {
      if (res['status'] == 0) {

        if (res['data']['status'] == 1) {
          this._notificationservice.error(res['data']['message']);
          return false;
        } else if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'personal') {

          sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
          let userInfo = {};
          userInfo['account_type'] =  res['data']['userInfo']['account_type'];
          sessionStorage.setItem('userData',JSON.stringify(userInfo));
          let userDetails = {}
          userDetails['firstName'] = res['data']['userInfo']['first_name'];
          userDetails['lastName'] = res['data']['userInfo']['last_name'];
          userDetails['mobile'] = res['data']['userInfo']['mobile'];
          this.homeService.setUserDetails(userDetails);
          this.homeDataService.setMobile(res['data']['userInfo']['mobile']);
          localStorage.setItem('mobile', res['data']['userInfo']['mobile']);
          localStorage.setItem('email', res['data']['userInfo']['email']);
        } else if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'business') {
          
          sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
          sessionStorage.setItem('account_type', res['data']['account_type']);

          let userInfo = {};
          userInfo['account_type'] =  res['data']['userInfo']['account_type'];
          userInfo['country_id'] =  res['data']['userInfo']['country_id'];
          let userDetails = {};
          sessionStorage.setItem('userData',JSON.stringify(userInfo));
          userDetails['firstName'] = res['data']['userInfo']['first_name'];
          userDetails['lastName'] = res['data']['userInfo']['last_name'];
          userDetails['mobile'] = res['data']['userInfo']['mobile'];
          userDetails['country_id'] = res['data']['userInfo']['country_id'];
          userDetails['business_country_of_incorporation'] = res['data']['userInfo']['business_country_of_incorporation'];
          this.homeService.setUserDetails(userDetails);
          this.homeDataService.setMobile(res['data']['userInfo']['mobile']);
          localStorage.setItem('mobile', res['data']['userInfo']['mobile']);
          localStorage.setItem('email', res['data']['userInfo']['email']);
          this.routerNavigate.navigate(['/business/application']);
        }
        this.logindata.emit();
      }
      else {
        this._notificationservice.error(res['message'])
      }
    });
    return true;
  }
  public async logOutAction() {
    sessionStorage.removeItem('profileData');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('businessSavedData');
    sessionStorage.clear();
    return true;
  }
  accountMatch(allowedAccounts): boolean {
    var isMatch = false;
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    var userAccount = this.userData && this.userData['account_type'];
    allowedAccounts.forEach(element => {
      if (userAccount && userAccount.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
  veriFyloginOtp(): boolean {
    //  businessloginOtp
    var isMatch = false;
    var bussinesLoginOtp = sessionStorage.getItem('businessloginOtp');
    if (bussinesLoginOtp) {
      var isMatch = true;
    }

    return isMatch;
  }

}
