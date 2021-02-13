import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SepaService } from 'src/app/sepa.service';
import { NotificationService } from 'src/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/auth.service';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  id: any;
  details: any;
  mail: void;
  pwd: void;
  userForm: FormGroup;

  constructor(private alert: NotificationService, private activatedRoute: ActivatedRoute,private locationStrategy: LocationStrategy, private authService: AuthService, private sandboxService: SepaService, private fb: FormBuilder, private router: Router) {
    
   }

  ngOnInit() {
    
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']

    })
    this.preventBackButton();

    this.userForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    })


  }


  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }


  getOrderDetails(data) {
    this.sandboxService.getOrderDetails(data).subscribe(res => {
      this.details = res['data']['result'];

      sessionStorage.setItem('orderDetails', JSON.stringify(this.details));
      let item = sessionStorage.getItem('orderDetails')

    })
  }

  email(data) {
    this.mail = data;

  }

  password(data) {
    this.pwd = data;

  }

  login() {
    var req = {
      userId: this.mail,
      password: this.pwd
    }

  }


  loginForm(data) {
    var request = {
      "userId": data.userId,
      "password": data.password,
      "account_type": "sandbox"
    }
    
    sessionStorage.setItem('loginData', data);
    this.sandboxService.login(request).subscribe(res => {

      if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'sandbox') {
        sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
        sessionStorage.setItem('Token', res['data']['Token']);
        sessionStorage.setItem('api_access_key', res['data']['api_access_key']);
        sessionStorage.setItem('member_id', res['data']['member_id']);
        sessionStorage.setItem('client_auth', res['data']['client_auth']);
        sessionStorage.setItem("userData", JSON.stringify(res));
        this.getOrderDetails(this.id);
        //this.alert.success(res['data']['message']);
        this.getOrderDetails(this.id);
        setTimeout(() => {
          this.router.navigate(['card']);
        }, 200);
      }
      else {
        this.alert.error(res['data']['message']);
      }
    })
  }
}
