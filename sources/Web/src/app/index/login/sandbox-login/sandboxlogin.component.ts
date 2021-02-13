import { RouterModule, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from '../../../core/shared/auth.service';
import { SubSink } from 'subsink';



@Component({
  selector: 'app-sandboxlogin',
  templateUrl: './sandboxlogin.component.html',
  styleUrls: ['./sandboxlogin.component.scss']
})
export class SandboxloginComponent implements OnInit,OnDestroy {
  private subs=new SubSink()

  loginForm: FormGroup;
  loginActionActive = false;
  spins:boolean=false;
  showMyContainer;

  constructor(private router: Router ,private fb: FormBuilder,private authService:AuthService) { }

  LoginAction(formData:any){
    if(this.authService.loginAction(formData)){
     this.loginActionActive=true;
    }
   }

   navigateToDashboard(){
    if(this.loginActionActive){
      sessionStorage.setItem("isVerified","yes");
      this.router.navigate(['/sandbox/dashboard']);
    }
  }

  businessAccount() {
    this.router.navigateByUrl('/business/signup');
  }
  sandboxSignUp() {
    this.router.navigateByUrl('/sandbox/signup');
  }

  forgotPassword(){
    this.router.navigateByUrl('sandbox/forgot');
  }

  ngOnInit() {
    this.subs.sink=this.authService.logindata.subscribe(data => {
      this.navigateToDashboard();
    });

    this.loginForm = this.fb.group({
      'userId': ['', Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.compose([Validators.required,Validators.minLength(6)])],
      'account_type': ['sandbox', Validators.required]
    });
  }
  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
