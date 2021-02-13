import { Injectable } from '@angular/core';
import { NotificationService } from 'src/core/toastr-notification/toastr-notification.service';
import { SepaService } from './sepa.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private alert: NotificationService, private sandboxService: SepaService, private router: Router) { }


  public async loginAction(data) {
  sessionStorage.setItem('loginData', data);
    this.sandboxService.login(data).subscribe(res => {
     if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'sandbox') {
        sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
        sessionStorage.setItem('Token', res['data']['Token']);
        sessionStorage.setItem('api_access_key', res['data']['api_access_key']);
        sessionStorage.setItem('member_id', res['data']['member_id']);
        sessionStorage.setItem('client_auth', res['data']['client_auth']);
        sessionStorage.setItem("userData", JSON.stringify(res));
        this.alert.success(res['data']['message']);
        
        setTimeout(() => {
          this.router.navigate(['/shopping-cart']);
        }, 200);
      } else if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'personal') {
        sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
        sessionStorage.setItem('Token', res['data']['Token']);
        sessionStorage.setItem('api_access_key', res['data']['api_access_key']);
        sessionStorage.setItem('member_id', res['data']['member_id']);
        sessionStorage.setItem('client_auth', res['data']['client_auth']);
        sessionStorage.setItem("userData", JSON.stringify(res));
        //this.alert.success(res['data']['message']);
        setTimeout(() => {
          this.router.navigate(['/merchant-card']);
        }, 200);
      }
      else {
        this.alert.error(res['data']['message']);
      }
    })

  }
}
