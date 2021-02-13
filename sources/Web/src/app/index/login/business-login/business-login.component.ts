 /**
   * Business Login Component
   * login to the business application if entered credential are correct
   * @package BusinessLoginComponent
   * @subpackage app\index\login\busines-login\BusinessLoginComponent
   * @author SEPA Cyber Technologies, Sayyad M.
  */
import { AuthService } from '../../../core/shared/auth.service';
import { Component, OnInit } from "@angular/core";
import {Validators, FormBuilder,FormGroup,FormControl} from "@angular/forms";
import { Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';

declare var $;

@Component({
  selector: 'app-business-login',
  templateUrl: './business-login.component.html',
  styleUrls: ['./business-login.component.scss']
})
export class BusinessLoginComponent implements OnInit {

  loginForm:FormGroup;
  loginActionActive=false;
  public loading=false;
  eye=false;
  slasheye=true;
  type="password";
  email: any;
  constructor(private fb:FormBuilder,private authService:AuthService,private homeService: HomeService,
    private routerNavigate:Router) {}
  LoginAction(formData:any){
   if(this.authService.loginAction(formData)){
      this.loginActionActive=true;
      sessionStorage.setItem('businessloginOtp','true')
   }
  }
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

  navigateToDashboard(){

    if(this.loginActionActive){
      this.email = this.loginForm.controls['userId'].value;
      let userData = {};
      userData['email'] = this.email;
      this.homeService.setEmail(userData);
      this.loading=false;
    }
  }


  ngOnInit() {
    this.loginForm = this.fb.group({
     // 'email': ['',Validators.compose([Validators.required,Validators.email])],
      'userId': ["",Validators.compose([Validators.required,Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      'password': [null,Validators.compose([Validators.required,Validators.minLength(7),Validators.maxLength(15)])],
      'account_type':['business',Validators.required]
    });

    // this.authService.logindata.subscribe(data => {
    //   this.navigateToDashboard();
    // });
  }

  //jquery


  password()
  {
    this.routerNavigate.navigate(['business/forgot']);
  }

  noSpace(){
    $("input").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
  });


  }
}
