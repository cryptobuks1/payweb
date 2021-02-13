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
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  responseData: any = [];
  @Output() logindata: EventEmitter<boolean> = new EventEmitter();
  userData: any;
  constructor(private http: HttpClient, private _notificationservice: NotificationService, private routerNavigate: Router, private IndexService: IndexService) { }

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
          sessionStorage.setItem('userData', JSON.stringify(res));
          sessionStorage.setItem('email', res['data']['userInfo']['email']);
        }
        else if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'sandbox') {
          sessionStorage.setItem('userData', JSON.stringify(res));
        }
        else if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'business') {
          if (res['data']['userInfo']['business_legal_name'] == null) {
            sessionStorage.setItem('Token', res['data']['Token']);
            sessionStorage.setItem('member_id', res['data']['member_id']);
            sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
            sessionStorage.setItem('api_access_key', res['data']['api_access_key']);
            sessionStorage.setItem('client_auth', res['data']['client_auth']);
            sessionStorage.setItem('account_type', res['data']['userInfo']['account_type']);
            sessionStorage.setItem('email', res['data']['userInfo']['email']);
            sessionStorage.setItem('password', postData.password);
            this.routerNavigate.navigate(["business/signup/register"]);
          }
          else {
            sessionStorage.setItem("mobile", res['data']['userInfo']['mobile'])
            this.IndexService.createOTP(res['data']['userInfo']['mobile']).subscribe(response => {
              if (response['status'] == 0) {
                if (response['data']['status'] == 0) {
                  sessionStorage.setItem('userData', JSON.stringify(res));
                  this.routerNavigate.navigate(["login/otp"]);
                }
                else if (response['data']['status'] == 1) {
                  this._notificationservice.error(res['data']['message'])

                  // sessionStorage.setItem("mobile", res['data']['userInfo']['mobile']);
                  // const countryIdFromRes = res['data']['userInfo']['country_id'];
                  // let countryListSubscription: Subscription = this.IndexService.getCountryDetails().subscribe(countriesRes => {
                  //   if (countriesRes['status'] == 0) {
                  //     let countryListData = countriesRes['data']['country list'];
                  //     let countryCode = countryListData.find(c => c.country_id === countryIdFromRes).calling_code;
                  //     let phoneNumberWithCountryCode = `${countryCode}${res['data']['userInfo']['mobile']}`;
                  //     this.IndexService.createOTP(phoneNumberWithCountryCode).subscribe(response => {
                  //       if (response['status'] == 0) {
                  //         if (response['data']['status'] == 0) {
                  //           sessionStorage.setItem('userData', JSON.stringify(res));
                  //           countryListSubscription.unsubscribe();
                  //           this.routerNavigate.navigate(["login/otp"]);
                  //         }
                  //         else if (response['data']['status'] == 1) {
                  //           countryListSubscription.unsubscribe();
                  //           this._notificationservice.error(res['data']['message'])
                  //         }
                  //       }
                  //       else {
                  //         countryListSubscription.unsubscribe();
                  //         this._notificationservice.error(res['message'])
                  //       }
                  //     })
                  //   }
                }
              }
              else {
                this._notificationservice.error(res['message'])
              }
            })
          }

          //   );
          // }

        }
        this.getFeatureToggles();
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
        }
        else if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'personal') {
          sessionStorage.setItem('userData', JSON.stringify(res));
        }
        else if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'business') {
          sessionStorage.setItem('userData', JSON.stringify(res));
          sessionStorage.setItem("mobile", res['data']['userInfo']['mobile']);
          this.routerNavigate.navigate(['/business/application']);
          //   this.IndexService.createOTP(res['data']['userInfo']['mobile']).subscribe(response=>{
          //   if(response['status']==0){
          //     if(response['data']['status']==0){
          //       sessionStorage.setItem('userData',JSON.stringify(res));
          //       this.routerNavigate.navigate(["login/otp"]);
          //     }
          //     else if(response['data']['status']==1){
          //     this._notificationservice.error(res['data']['message'])
          //     }
          //  }
          //  else{
          //    this._notificationservice.error(res['message'])
          //  }
          // })
        }

        //  else if(res['status']==0 && res['userInfo']['business_Id'] && res['userInfo']['account_type']=='Business'){
        //     if(res['status']==0){
        //       sessionStorage.setItem('userData',JSON.stringify(res));
        //     }
        //   }
        //  else if(res['status']==0 && !res['userInfo']['business_Id']){
        //   this._notificationservice.info('Please complete your company registration');
        //   sessionStorage.setItem('applicant_id',JSON.stringify(res['userInfo']['applicant_id']));
        //   sessionStorage.setItem("status",'yes');
        //   sessionStorage.setItem('user',JSON.stringify(postData));
        //   this.routerNavigate.navigate(["business-reg-form"]);
        //   return false;
        //  }
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
    var userAccount = this.userData && this.userData['data']['userInfo']['account_type'];
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

  getFeatureToggles() {
    this.http.get(`${HttpUrl.getFeatureToggleFlag}`).subscribe((res: any) => {
      if (res !== false) {
        for (const key of Object.keys(res)) {
          sessionStorage.setItem(key, JSON.stringify({ isFeatureOn: res[key] }));
        }
      } else {
        sessionStorage.setItem('PAYMENTS_FEATURE', JSON.stringify({ isFeatureOn: false }));
        sessionStorage.setItem('SCHEDULED_PAYMENTS_FEATURE', JSON.stringify({ isFeatureOn: false }));
      }
    });
  }

}
