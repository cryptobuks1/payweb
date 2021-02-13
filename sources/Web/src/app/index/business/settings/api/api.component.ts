import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms'
import { HomeService } from '../../../../core/shared/home.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
declare var $: any;

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {
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
    this.homeservice.getUserDetails().subscribe(data => {      
      this.api_key= data['sandboxInfo']['api_key'];
      this.url = data['sandboxInfo']['url'];     
      this.memberuser=data['sandboxInfo']['memberId'];
    })
    this.homeservice.getEmail().subscribe(data => {
      this.email = data.email
    })   
    this.support="https://documenter.getpostman.com/view/10670567/SzYUZMCT";
    // this.support="https://documenter.getpostman.com/view/10197369/SWTD7cCV";
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
    window.open("/#/payvoo-business","_blank")
  }


  sendEmail(){
    this.emaildata={
      "email":this.uservalue
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
