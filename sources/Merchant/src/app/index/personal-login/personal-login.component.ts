import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/core/toastr-notification/toastr-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SepaService } from 'src/app/sepa.service';
import { AuthService } from 'src/app/auth.service';
import { LocationStrategy } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-personal-login',
  templateUrl: './personal-login.component.html',
  styleUrls: ['./personal-login.component.scss']
})
export class PersonalLoginComponent implements OnInit {


  id: any;
  details: any;
  mail: void;
  pwd: void;
  userForm: FormGroup;
  loadingButton = false;

  constructor(private alert: NotificationService,private locationStrategy: LocationStrategy, private activatedRoute: ActivatedRoute, private sandboxService: SepaService, private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit() {

    this.preventBackButton() ;
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
    })


    this.userForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    })


  }


  getOrderDetails(data) {
    this.sandboxService.getorderDetails(data).subscribe(res => {
      this.details = res['data']['result'];

      sessionStorage.setItem('orderDetails', JSON.stringify(this.details));
      let item = sessionStorage.getItem('orderDetails')

    })
  }


  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
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
      "account_type": "personal"
    }

    sessionStorage.setItem('loginData', data);
    this.sandboxService.login(request).subscribe(res => {

      if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'personal') {
        sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
        sessionStorage.setItem('Token', res['data']['Token']);
        sessionStorage.setItem('api_access_key', res['data']['api_access_key']);
        sessionStorage.setItem('member_id', res['data']['member_id']);
        sessionStorage.setItem('client_auth', res['data']['client_auth']);
        sessionStorage.setItem("userData", JSON.stringify(res));
        //this.alert.success(res['data']['message']);
        this.sandboxService.verifyKyc().subscribe(kycDetails=>{
          let kycStatus = kycDetails['data']['kyc_status']
          if(kycStatus.includes('SUCCESS')){
            this.getOrderDetails(this.id);
            setTimeout(() => {
              this.router.navigate([`merchant/merchant-card`]);
            }, 200);
          }
          else{
            $('#kycwarnhome').modal('show');
                   this.alert.warn('Please complete KYC to add money');
                   this.loadingButton = false;
          }

          
        })
        
      }
      else {
        this.alert.error(res['data']['message']);
      }
    })
  }
}