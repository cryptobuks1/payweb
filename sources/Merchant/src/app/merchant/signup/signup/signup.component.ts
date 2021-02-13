import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MerchantService } from '../../service/merchant.service';
import { SubSink } from 'subsink';


import { IndexService } from 'src/app/index.service';
import { NotificationService } from 'src/core/toastr-notification/toastr-notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public loginForm: FormGroup;
  private subs=new SubSink();
  countryData: any;
  createPassword:any;
  signupsandbox: boolean = true;
  profilecompleteFeildSet: boolean = false;
  emailS;
  passwordS;
  repeatPassword:any;
  checkPassword:boolean=false;

  optionid:any;
  spins:boolean=false;
  constructor(private formBuilder: FormBuilder, private _router:Router, private indexservice: IndexService, 
    private _sercive:MerchantService, private alert:NotificationService) {
      this.getCountryDetails();
     }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      companyname: ['', Validators.required],
      email: ["", Validators.compose([Validators.required,Validators.email])],
      country: ["",Validators.required],
      calling_code: ['',Validators.required],
      mobile: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"),Validators.maxLength(13)])],
      password: ["", Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[-!$%^&*()_+|~=^`{}[:;<>?,.@#\ ]).{8,}')])],
      repeat: ["", Validators.required],
      agree: ["", Validators.required],
      account_type:['sandbox'],
      address_line1:[''],
      address_line2:[''],
      city:[''],
      country_id:[null],
      dob:[null],
      gender:[''],
      middle_name:[''],
      next_step:[''],
      passcode_pin:[''],
      postal_code:[''],
      region:[''],
      telephone:[''],
      town:[''],
      phone:['']
  })

  this.subs.sink=this.loginForm.get('password').valueChanges.subscribe((value) => {
    this.createPassword=value;
 });
 this.subs.sink=this.loginForm.get('repeat').valueChanges.subscribe((value)=>{
    this.repeatPassword=value;
    if(this.createPassword===this.repeatPassword){
     this.checkPassword=false;
    }
    else{
     this.checkPassword=true;
    }
 });

  $(document).ready(function(){
    $("#country").click(function(e){
      e.stopPropagation();
      $(".ul_style").toggle();
      $(".calling_code").hide();
    });
    $(document).click(function(){
      $(".ul_style").hide();
      $(".calling_code").hide();
    });
  });

  $(document).ready(function(){
    $("#calling_code").click(function(e){
      e.stopPropagation();
      $(".calling_code").toggle();
      $(".ul_style").hide();
    });
    $(document).click(function(){
      $(".calling_code").hide();
      $(".ul_style").hide();
    });
  });
}
  onRegister(form:FormGroup){
    console.log(form.value)
  }
  sandboxLogin(){
    this._router.navigate(['/login']);
  }

  onSelectBusiness(some){

    this.loginForm.patchValue({
       country:some.country_name
    });
    this.loginForm.patchValue({
     country_id:some.country_id
  });

    this.optionid=some.country_id;
    $(".ul_style").hide();
 }

 codeValue(some){
  this.loginForm.patchValue({
    calling_code:some.calling_code
 });
 $(".calling_code").hide();
 }

 getCountryDetails() {
  this.subs.sink=this.indexservice.getCountryDetails().subscribe(res => {
    if(res['status']==0){
    if(res['data']['status']==0){
      this.countryData = res['data']['country list'];
    } else if(res['data']['status']==1){
      this.alert.error(res['data']['message']);
    }
    } else {
      this.alert.error(res['message']);
    }
  });
}


  createAccount(formData:any) {
  this.spins=true;

  let registrationkyb = {};
  registrationkyb['country_of_incorporation'] = 1;
  registrationkyb['business_legal_name'] = this.loginForm.get('companyname').value;
  registrationkyb['trading_name'] = "";
  registrationkyb['registration_number'] = "";
  registrationkyb['incorporation_date'] = null;
  registrationkyb['business_type'] = 6

  const copiedObj = Object.assign({}, formData);
  copiedObj.mobile=this.loginForm.get('calling_code').value+this.loginForm.get('mobile').value;
 
   
  delete copiedObj["agree"];
  delete copiedObj["repeat"];
  delete copiedObj['calling_code'],
  delete copiedObj['companyname'],
  delete copiedObj['country'],

  copiedObj.country_id=this.optionid;
  copiedObj.passcode_pin= JSON.stringify(Math.floor(1000 + Math.random() * 9000));
  this.subs.sink=this.indexservice.registration(copiedObj).subscribe(res => {
    if(res['status']==0){
      if(res['data']['status']==0){
        this.spins=false;
        this.signupsandbox = false;
        this.profilecompleteFeildSet = true;
        this.alert.success("Successfully registered");
        this._router.navigate(['/login']);
      } else if(res['data']['status']==1){
        this.spins=false;
        this.alert.error(res['data']['message']);
      }
    }
    else {
      this.spins=false;
      this.alert.error(res['message']);
    }
  });
}
}
