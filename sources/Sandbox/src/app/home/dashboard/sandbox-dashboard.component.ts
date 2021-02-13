import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms'
import { HomeService } from '../../core/shared/home.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/toastr-notification/toastr-notification.service';
declare var $: any;

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox-dashboard.component.html',
  styleUrls: ['./sandbox-dashboard.component.scss']
})
export class SandboxDashboardComponent implements OnInit {

  userProfile:FormGroup;
  userData:any;
  api_key:any;
  url:any;
  uservalue:any;
  emaildata:any = {};
  responsedata:any;
  application_id:any;
  email:any;
  memberuser:any;
  copymember:any;
  support:any;
  redirect_url:any

  constructor(private fb: FormBuilder,private alert:NotificationService,private homeservice:HomeService,private router:Router) 
  { 
    this.userData=JSON.parse(sessionStorage.getItem('userData'));   
    this.api_key=this.userData['data']['sandBoxInfo']['api_key'];
    this.url=this.userData.data.sandBoxInfo.url;
    this.application_id=this.userData.data.userInfo.applicant_id;
    this.email=this.userData.data.userInfo.email;
    this.memberuser=this.userData.data.sandBoxInfo.memberId;
    this.support="https://documenter.getpostman.com/view/10670567/SzYUZMCT";
   // this.redirect_url = this.userData.data.sandBoxInfo.redirect_url;
  }

  ngOnInit() {

    this.userProfile =  this.fb.group({
      url :[this.url],
      apikey: [this.api_key],
      support: [this.support]
    });
    
  }


  copyInputMessage(input){
    input.select();
    input.setSelectionRange(0, 999);
    document.execCommand('copy');
  }

  business(){
    localStorage.setItem('redirect','true')
    window.open("/business/signup")
  }


  sendEmail(){
    $('#sendemail').modal('hide');
    this.emaildata={
      "email":this.uservalue,
      "applicant_id":this.application_id
    }
    this.homeservice.sendEmail(this.emaildata).subscribe(res => {
    if(res['status']==0){
      if(res['data']['status']==0){
      $('#success').modal('show');
      $('#sendemail').modal('hide');
      } else if(res['data']['status']==1){
       this.alert.error(res['data']['message']); 
      }
    }
    else {
      this.alert.error(res['message']);  
    }
    });
    this.uservalue='';
  }

  closeModal(){
    $('#sendemail').modal('hide');
    $('#success').modal('hide');
   }
 



}
