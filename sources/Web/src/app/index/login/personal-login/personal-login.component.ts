 /**
   * Login Component
   * @package LoginComponent
   * @subpackage app\index\login\personal-login\LoginComponent
   * @author SEPA Cyber Technologies, Sayyad M.
  */
import { AuthService } from '../../../core/shared/auth.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import {Validators, FormBuilder,FormGroup} from "@angular/forms";
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { IndexService } from 'src/app/core/shared/index.service';
import { HomeService } from 'src/app/core/shared/home.service';

declare var $;


@Component({
  selector: "personal-login",
  templateUrl: "./personal-login.component.html",
  styleUrls: ["./personal-login.component.scss"]
})
export class PersonalLoginComponent implements OnInit,OnDestroy {
  private subs=new SubSink()
  loginForm:FormGroup;
  loginActionActive=false;
  constructor(private fb:FormBuilder,private authService:AuthService,
    private homeService: HomeService,
    private routerNavigate:Router) {}
  eye=false;
  slasheye=true;
  type="password";
  email: any;

  eyeHide() {
    if(this.eye == false && this.slasheye == true) {
      this.eye=true;
      this.slasheye=false;
      this.type="text";
    }
    else if(this.eye == true && this.slasheye == false) {
      this.eye=false;
      this.slasheye=true;
      this.type="password";
    }
  }
  LoginAction(formData:any){
    

   if(this.authService.loginAction(formData)){
    this.loginActionActive=true;
    this.email = this.loginForm.controls['userId'].value;
    let userData = {};
    userData['email'] = this.email;
    this.homeService.setEmail(userData);
  //  this.routerNavigate.navigate(['dashboard']);
   }
  }
  navigateToDashboard(){
    if(this.loginActionActive){     
      this.routerNavigate.navigate(['personal/accounts/getaccount']);
    }

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'userId': ['',Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
      'password': [null,Validators.compose([Validators.required,Validators.minLength(8)])],
      'account_type':['personal',Validators.required],
    });

    this.subs.sink=this.authService.logindata.subscribe(data => {
      this.navigateToDashboard();
    });
  }


  password()
  {
    this.routerNavigate.navigate(['/personal/forgot']);
  }
  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  noSpace(){
    $("input").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
  });


  }

}
