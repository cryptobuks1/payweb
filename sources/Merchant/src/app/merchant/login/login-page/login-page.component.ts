import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MerchantService } from '../../service/merchant.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  loginActionActive = false;
  constructor(private _router:Router, private fb: FormBuilder, private _service:MerchantService, private authService: AuthService) { }
  ngOnInit() {
    this._service.loggedIn.next(true)
    this.loginForm = this.fb.group({
      'userId': ['', Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.compose([Validators.required,Validators.minLength(6)])],
      'account_type': ['sandbox', Validators.required]
    });
  }

  onLogin(data:any){
    if(this.authService.loginAction(data)){
     this.loginActionActive=true;
    }
   }
  
  onLogged(){
    this._router.navigate(['/shopping-cart']);
  }
  signUp(){
    this._router.navigate(['/signUp']);
  }
  ngOnDestroy() {
    //this._service.loggedIn.next(false)
  }
}
