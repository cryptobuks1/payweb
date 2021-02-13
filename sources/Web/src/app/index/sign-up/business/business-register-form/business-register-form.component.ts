  /**
   * Business registration Component
   * @package BusinessRegisterFormComponent
   * @subpackage app\index\sign-up\business\business-register-form\BusinessRegisterFormComponent
   * @author SEPA Cyber Technologies, Sayyad M.
   */

import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup,Validators,FormBuilder} from "@angular/forms";
import { IndexService } from 'src/app/core/shared/index.service';
import { AuthService } from 'src/app/core/shared/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import { IndexComponent } from 'src/app/index/index.component';
import { LocationStrategy } from '@angular/common';

declare var $;

@Component({
  selector: 'app-business-register-form',
  templateUrl: './business-register-form.component.html',
  styleUrls: ['./business-register-form.component.scss']
})
export class BusinessRegisterFormComponent implements OnInit,OnDestroy{
  private subs=new SubSink();
  businessDetailForm:FormGroup;
  countryData: any;
  businessDetailTemplate:boolean=true;
  detailsCompltTemplate:boolean=false;
  loginActionActive: boolean;
  businessTypeData: any;
  businessProfileData: any;
  loginProfileData: any;
  otherCompanyReg:boolean=false;
  validDOB: boolean=false;
  valid18DOB: boolean = false;
  minDOB=''
  maxDOB:any;
  legalName :string = '';
  tradName :string = '';
  Rn :string = '';
  address1 :string = '';
  address2 :string = '';
  userId: any;
  password: any;
  userData: any;
  account_type: string;


  constructor(private fb: FormBuilder,private indexService: IndexService,
    private alert:NotificationService,private authService:AuthService,private routerNavigate:Router,
    private indexload:IndexComponent,
    private locationStrategy: LocationStrategy
    ) {
      var date = new Date(),

      day = ("0" + date.getDate()).slice(-2),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2);
      var obj=[date.getFullYear() - 100, mnth, day].join("-");
      this.minDOB = obj;
      this.maxDOB = [date.getFullYear(), mnth, day].join("-");
     this.getCountryDetails();
     this.getBusinessType();
     this.indexService.getUserDetails().subscribe(data => {
       if(data) {
      this.userId = data.userId,
      this.password = data.password
       }
     })
    // this.businessProfileData=JSON.parse(sessionStorage.getItem('businessSavedData'));
   }

  ngOnInit() {
    this.preventBackButton();
    this.subs.sink=this.authService.logindata.subscribe(data => {
      this.navigateToDashboard();
    });
    this.account_type = sessionStorage.getItem('account_type');

    this.businessDetailForm=this.fb.group({
      'country_of_incorporation':[0 ,Validators.required],
      'business_legal_name':['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9 .-]+$")])],
      'trading_name':[null],
      'registration_number':['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9 .-]+$")])],
      'incorporation_date':['',Validators.required],
      'address_line1':['',Validators.required],
      'address_line2':[''],
      'business_type':[0,Validators.required],
      "account_type":["business"]
    })
//    this.businessDetailForm.controls['country_of_incorporation'].setValue('0', {onlySelf: true});

  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  tredingNameclear(){
    this.businessDetailForm.patchValue({
      trading_name:''
    })
  }
  getCountryDetails() {
    this.subs.sink=this.
    indexService.getCountryDetails().subscribe(response => {
      if(response['status']==0){
        this.countryData = response['data']['country list'];
      }
      else if(response['status']==1){
          this.alert.error(response['message'])
      }
    });
  }
  getBusinessType(){
    this.subs.sink=this.indexService.getBusinessType().subscribe(res => {
      if(res['status']==0){
      if(res['data']['status']==0){
        this.businessTypeData = res['data']['Type Of Business'];
      }
      else if(res['data']['status']==1){
          this.alert.error(res['data']['message'])
      }
    }
    else{
      this.alert.error(res['message'])
    }
    });
  }

 registerBusiness(formData:any){
  this.indexload.apploader=true;
    this.subs.sink=this.indexService.registerBusiness(formData).subscribe(res => {
    if(res['status']==0){
    if(res['data']['status']==1){
      // this.saveCompanywithoutKYB(formData);
      this.indexload.apploader=false;
      this.detailsCompltTemplate=false;

      this.alert.error(res['data']['message']);
    }
     else if(res['data']['status']==0){
      this.indexload.apploader=false;
      this.businessDetailTemplate=false;
      this.detailsCompltTemplate=true;
    }
    else if(res['data']['status']==2){
         this.indexload.apploader=false;
          this.alert.info(res['data']['message']);
     }
     else if(res['data']['status']==3){
        this.indexload.apploader=false;
      this.alert.error(res['data']['message'])
     }
   }
  else {
    this.indexload.apploader=false;
    this.alert.error(res['message']);
  }
  });
  }

  dobValidation($event){
    var dt = new Date();
    var yr= dt.getFullYear();
     var selectedYr = $event.target.value;
     if (selectedYr <= this.minDOB) {
      this.validDOB = true;
    }
    else {
      this.validDOB = false;
      this.valid18DOB = false;
    }
    if (selectedYr <= this.maxDOB) {
      this.valid18DOB = false;
    }
    else {
      this.valid18DOB = true;
    }
  }
  saveCompanywithoutKYB(formData){
    this.subs.sink=this.indexService.saveCompanywithoutKYB(formData).subscribe(res => {
      if(res['status']==0){
      if(res['data']['status']==0){
        this.indexload.apploader=false;
        this.businessDetailTemplate=false;
        this.detailsCompltTemplate=true;
      }
      else if(res['data']['status']==1){
         this.indexload.apploader=false;
         this.alert.error(res['data']['message'])
      }
    }
    else{
      this.indexload.apploader=false;
      this.alert.error(res['message'])
    }
    });
  }


//login action after complete business profile

LoginAction(){
//if(sessionStorage.getItem('status') && sessionStorage.getItem('applicant_id')){
 // this.loginProfileData=JSON.parse(sessionStorage.getItem('user'));
// }
 //else{
  //this.loginProfileData={account_type:this.businessProfileData['userInfo']['account_type'],email:this.businessProfileData['userInfo']['email'],password:this.businessProfileData['userInfo']['password']}
// }
  // this.loginProfileData={account_type:sessionStorage.getItem('account_type'),email:sessionStorage.getItem('email'),password:sessionStorage.getItem('password')}
  this.loginProfileData={account_type:this.account_type,userId:this.userId,password:this.password}
  if(this.authService.LoginFromRegistration(this.loginProfileData)){
   this.loginActionActive=true;
  }
 }

 navigateToDashboard(){
   if(this.loginActionActive){
    // sessionStorage.setItem("isVerified","yes");
    // this.routerNavigate.navigate(['bus-application']);
   }
 }
 ngOnDestroy(){
  this.subs.unsubscribe();
}
noSpace(){
  $(".legal, .tradName, .Rn, .add1, .add2").on("keypress", function(e) {
    if (e.which === 32 && !this.value.length)
        e.preventDefault();
        this.value = this.value.replace(/  +/g, ' ');
});
}
trimming_fn(x) {    
  return x ? x.replace(/^\s+|\s+$/gm, '') : ''; 
};
}
