
/**
* Dashboard Component
* KYC status, KYC verification process, user profile
* @package BusdashboardComponent
* @subpackage app\home\personal\business-dashboard\busdashboard.component.html
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { HomeService } from '../../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { ApplicationsComponent } from '../applications.component';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { HomeComponent } from 'src/app/home/home.component';
import { SubSink } from 'subsink';
import { HomeDataService } from 'src/app/home/homeData.service';
import { environment } from '../../../../../environments/environment';
import { IndexService } from 'src/app/core/shared/index.service';
declare var $: any;

@Component({
  selector: 'app-personalprofile',
  templateUrl: './personalprofile.component.html',
  styleUrls: ['./personalprofile.component.scss']
})
export class PersonalprofileComponent implements OnInit {
  private subs = new SubSink();
  countryData: any;
  profileData: any;
  kycTemplate: boolean = false;
  updateContactDetails: boolean = true;
  updateContactForm: FormGroup;
  maxDOB: any;
  minDOB:any=''
  contact_mobile: any;
  updateContactAddress: boolean = false;
  validDOB: boolean = false;
  valid18DOB: boolean = false;
  selectedCountryId: any;
  personalAddress1: FormGroup;

  url: string = "";
  urlSafe: SafeResourceUrl;
  authToken: any;
  userData: any = [];
  smslinkBox: boolean = true;
  identId: any;
  KYCStatus: any;
  isIdentId:boolean=true;
  email: any;
  kycIframe:boolean=false;
  kycTargetURL:any;
  gplay:boolean;
  ios:boolean;
  MobidentId: any;
  personalInfo: any;
  contactInfo: any;
  platform_type: any;
  dobvalidator: boolean=true;
  personalEmail: any;
  mobile: any;



  constructor(private fb: FormBuilder, private homeService: HomeService,
    private dataService: HomeDataService, private indexService: IndexService,
    private alert: NotificationService, private routerNavigate: Router,private application: ApplicationsComponent,public sanitizer: DomSanitizer,private loader: HomeComponent) {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));

    var date = new Date(),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    var obj = [date.getFullYear() -100, mnth, day].join("-");
    this.minDOB = obj;
    this.maxDOB = [date.getFullYear() -18, mnth, day].join("-");
    this.application.loadContent=false;
    this.application.industryStatus();

    this.getCountryDetails();
    this.getPersonalInfo();
    this.indexService.getUserDetails().subscribe(data => {
      this.personalEmail = data.userId;
    })


  }
  noSpace(){
    $(".fname, .lname, .code, .add1, .add2, .city, .region").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
          this.value = this.value.replace(/  +/g, ' ');
  });
  }
  getCountryDetails() {
    this.homeService.getCountryDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.countryData = res['data']['country list'];
        this.Bus_SubmitForKYC();
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }

  getPersonalInfo(){
    //business_conatct_data
    this.homeService.getPersonalInfo().subscribe(res => {
      if (res['status'] == 0) {
        this.personalInfo= res['data'];
        this.personalInfo=res['data'] && res['data']['ownerDetails'] ? res['data']['ownerDetails'][0] : ''
        
          this.updateContactForm.patchValue({'first_name':this.personalInfo['first_name']=='null'?'': this.personalInfo && this.personalInfo['first_name'] })
          this.updateContactForm.patchValue({'last_name':this.personalInfo['last_name']=='null' ? '' : this.personalInfo && this.personalInfo['last_name']})
          this.updateContactForm.patchValue({'email':this.personalInfo['email']=='null'?'' : this.personalInfo && this.personalInfo['email']})
          this.updateContactForm.patchValue({'gender':this.personalInfo['gender'] == 'null' ? '' :this.personalInfo && this.personalInfo['gender'] })
          this.updateContactForm.patchValue({'dob':this.personalInfo['dob'] =='null' ? '' :this.personalInfo && this.personalInfo['dob']})
          this.updateContactForm.patchValue({'calling_code':this.personalInfo['mobile'] =='null' ? '' : this.personalInfo && +this.personalInfo['mobile'].replace(this.personalInfo['phone'],'')})
          this.updateContactForm.patchValue({'mobile':this.personalInfo['phone'] =='null' ? '' :this.personalInfo && this.personalInfo['phone']})
          this.updateContactForm.patchValue({'place_of_birth':this.personalInfo['place_of_birth'] =='null' ? '' :this.personalInfo && this.personalInfo['place_of_birth']})
          this.updateContactForm.patchValue({'nationality':this.personalInfo['nationality'] =='null' ? '' :this.personalInfo && this.personalInfo['nationality']})

      }
      else {
        this.alert.error(res['message'])
      }
    });
  }

  setcallCode(val){
   let data= this.countryData.filter(c=>{
      if(c.calling_code==val){
return c
      }
    })
    return data[0];



  }

  getApp() {
    $("#myModal1").modal('hide');
    $("#appWarn1").modal('show');
  }

  getAddressDetails(){
    //business_conatct_data
    this.homeService.getPersonalAddressDetails().subscribe(res => {
      if (res['status'] == 0) {
      ///  address_type: "PERSONAL_ADDRESS"
      if(res && res['data'] && res['data']['addressDetails']) {
      res['data']['addressDetails'].forEach(c=> {
        if(c.address_type_id=="1"){
        this.contactInfo=c
        }})
      }

if(this.contactInfo) {
        this.personalAddress1.patchValue({'address_line1':this.contactInfo['address_line1']=='null'?'' : this.contactInfo['address_line1']})
        this.personalAddress1.patchValue({'address_line2':this.contactInfo['address_line2'] == 'null' ? '' :this.contactInfo['address_line2'] })
        this.personalAddress1.patchValue({'region':this.contactInfo['region'] =='null' ? '' :this.contactInfo['region']})
        this.personalAddress1.patchValue({'city':this.contactInfo['city']=='null' ? '' :this.contactInfo['city']})
        this.personalAddress1.patchValue({'postal_code':this.contactInfo['postal_code']=='null'?'': this.contactInfo['postal_code'] })
      }
    }
      else {
        this.alert.error(res['message'])
      }
    });
  }



  dobValidation($event) {
    var dt = new Date();
    var yr = dt.getFullYear();
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

  Bus_SubmitForKYC() {
    this.homeService.getUserDetails().subscribe(data => {
      if(data) {
      this.contact_mobile = data.mobile;
      }
    })
    var calling_code = this.contact_mobile.substr(0, this.contact_mobile.indexOf(" "))
    var country_id = this.countryData.find(c => c.calling_code == calling_code).country_id;
    console.log(country_id);
    for (var i = 0; i < this.countryData.length; i++) {
      if (country_id == this.countryData[i]['country_id']) {
        this.updateContactForm.patchValue({
          calling_code: +calling_code
        })
        this.personalAddress1.patchValue({
          country_id: country_id
        })
      }
    }
    }

  updateAddrDetails(formData: any) {
    const copiedObj = JSON.parse(JSON.stringify(formData))
    copiedObj.mobile = copiedObj.calling_code +" "+ copiedObj.mobile;
    delete copiedObj["calling_code"];
    this.homeService.updateContact(copiedObj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          let profileData ={
            firstName : copiedObj.first_name,
            lastName : copiedObj.last_name, 
             dob: copiedObj.dob
          }
         // sessionStorage.setItem('profileData', JSON.stringify(profileData));
          this.updateContactAddress = true;
          this.updateContactDetails = false;
          this.getAddressDetails()

        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message']);
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }

  showPersonalInfo() {
    this.updateContactAddress = false;
    this.updateContactDetails = true;
  }

  checkKYC() {
    $('#myModal').modal('show');
    $('#kycwarn').modal('hide');
  }

  submitAddr(formData: any) {
    formData.country = this.countryData.find(c => c.country_id === formData.country_id).country_name;
    formData.address_type_id = 1;
    formData.account_type ='business';
    this.homeService.submitAddr(formData).subscribe(res => {
       if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
         // $("#myModal").modal('show');
         // this.SubmitForKYC()
         this.application.getKYBStatus();
         this.routerNavigate.navigate(['/business/application/businessOwner']);
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message']);
        }
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }
  SubmitForKYC() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    this.loader.apploader=true;
    if(sessionStorage.getItem('isCamera')=='no'){
      this.loader.apploader=false;
       this.alert.info("No camera available or Broswer support")
    }
    if(sessionStorage.getItem('isCamera')=='yes'){
      let obj={
        "account_type": this.userData.data.userInfo.account_type
      }
    this.homeService.SubmitForKYC(obj).subscribe(res => {
      if(res['status']==0){
      if (res['data']['status'] == 0) {
        this.loader.apploader=false;
        this.kycIframe=true;
        this.identId =res['data']['id'];
         $("#myModal").modal('hide');
        $("#kycpopup").modal('show');
      //  this.url='https://go.idnow.de/app/${environment.sepaKycEnvironment}/identifications/'+this.identId+'/identification/auto-ident'
        // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
        this.url=`https://kyc.payvoo.com/app/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/auto-ident'
        // this.url='https://go.idnow.de/app/${environment.sepaKycEnvironment}/identifications/'+this.identId+'/identification/start';
      //  this.url='https://go.idnow.de/app/${environment.sepaKycEnvironment}/identifications/'+this.identId+'/identification/auto-ident'
        this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      }
       else if(res['data']['status']==1) {
          this.loader.apploader=false;
          this.kycIframe=true;
          this.identId =res['data']['id'];
          $("#kycpopup").modal('show');
          this.url=`https://kyc.payvoo.com/app/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/auto-ident'
          // this.url='https://go.idnow.de/app/${environment.sepaKycEnvironment}/identifications/'+this.identId+'/identification/start';
          // this.url='https://go.idnow.de/app/${environment.sepaKycEnvironment}/identifications/'+this.identId+'/identification/auto-ident'
          // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
          this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
    }
    else{
      this.alert.error(res['message']);
      this.loader.apploader=false;
    }
    })
  }

  }
  kycOption(){
    $("#myModal").modal('show');
  }
  webCamera(){
     this.SubmitForKYC();
  }
  // getKYCStatus(){
  //   this.homeService.getKYCStatus('').subscribe(res => {
  //     if(res['data']['message'] !=='SUCCESS'){
  //       this.KYCStatus='Pending'
  //       this.routerNavigate.navigate(['home/application/personal']);
  //     }
  //     else{
  //       this.KYCStatus='Success'
  //     }
  //   })
  // }
  getKYCStatus(){
    this.loader.apploader = true;

    this.homeService.getKYCStatus('').subscribe(res => {

      this.loader.apploader = false;
      this.application.getKYBStatus();

      if(res['data']['kyc_status'] =='SUCCESS' || res['data']['kyc_status'] =='SUCCESSFUL_WITH_CHANGES') {
        this.KYCStatus = res['data']['kyc_status'];
        this.loader.apploader = false;
        this.routerNavigate.navigate(['business/application']);

      } else if(res['data']['kyc_status'] =='PENDING' || res['data']['kyc_status'] =='CHECK_PENDING' ) {
        this.KYCStatus ='PENDING';
        this.loader.apploader = false;
        this.routerNavigate.navigate(['business/application/personal']);
      } else if (res['data']['message'] =='OBJECT_NOT_FOUND' || res['data']['message'] =='NOT_FOUND') {
        this.KYCStatus ='PENDING';
        this.loader.apploader = false;
       // this.routerNavigate.navigate(['home/application/personal']);

        this.routerNavigate.navigate(['business/application/personal']);
      }else if(res['data']['kyc_status'] =='NOT_INITIATED') {
        this.KYCStatus ='NOT_INITIATED';
        this.loader.apploader = false;
        this.routerNavigate.navigate(['business/application/personal']);
      } else if(res['data']['kyc_status'] =='CHECK_PENDING'){
        this.loader.apploader = false;
        this.KYCStatus ='CHECK_PENDING';
      //  this.routerNavigate.navigate(['home/application/personal']);
        this.routerNavigate.navigate(['business/application']);
      }
      else if(res['data']['kyc_status'] =='FRAUD_SUSPICION_PENDING'){
        this.loader.apploader = false;
        this.KYCStatus ='FRAUD_SUSPICION_PENDING';
      //  this.routerNavigate.navigate(['home/application/personal']);
        this.routerNavigate.navigate(['business/application']);
      }


      else if(res['status'] == 2) {
          this.alert.error(res['message']);
          this.routerNavigate.navigate(['business/application/personal']);
      }
      else if(res['data']['serverResponse']['status'] == 2) {
        this.alert.error(res['message']);
        this.routerNavigate.navigate(['business/application/personal']);
    }
      else{
        this.KYCStatus = res['data']['kyc_status'];
        this.loader.apploader = false;
        this.routerNavigate.navigate(['business/application/personal']);
      }
    });
  }

  sendInvitationAlert(platform) {
    this.platform_type = platform;
    $('#kycverifywarn').modal('show');
  }

  KYClinkToMobile(mobilePlatform) {
    this.loader.apploader = true;
    let obj={
      "account_type": "personal"
    }
    this.homeService.SubmitForKYC(obj).subscribe(res=>{
      if(res['status']==0){
        if (res['data']['status'] == 0) {
          this.MobidentId =res['data']['id'];
          this.linkToMobile(mobilePlatform);
          this.loader.apploader = false;
        } else if(res['data']['status']==1){
          this.linkToMobile(mobilePlatform);
          this.loader.apploader = false;
        }
      } else {
        this.alert.error(res['message']);
        this.loader.apploader = false;
      }
    });
  }

  linkToMobile(mobilePlatform) {
    this.loader.apploader = true;
    this.homeService.KYClinkToMobile(this.mobile,this.email, mobilePlatform, this.MobidentId).subscribe(res => {
    if(res['status']==0){
      if(res['data']['status']==0){
        //this.alert.success(res['data']['message']);
        this.loader.apploader=false;
      } if(res['data']['status']==1){
      this.alert.error(res['data']['message']);
      this.loader.apploader=false;
      }
    } else{
      this.alert.error(res['message']);
      this.loader.apploader=false;
    }
  });
  }

  latestStatus(){

    this.smslinkBox = true;
    this.loader.apploader=false;
    this.getKYCStatus();
  }

  personalAddTemplate(){
    this.updateContactAddress=false;
    this.updateContactDetails=true;
  }

  SetCountryKYB() {
    this.selectedCountryId = this.updateContactForm.get('calling_code').value;
     let obj =  this.countryData.filter(({calling_code}) => calling_code == this.selectedCountryId);
     let list=obj[0];
        this.personalAddress1.patchValue({
          'country_id': list.country_id,
        });
    }

  ngOnInit() {
    this.updateContactForm = this.fb.group({
      first_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      dob: ["", [Validators.required]],
      mobile: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      email: ["", Validators.compose([Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      gender: ['', Validators.required],
      middle_name: [''],
      telephone: [null],
      calling_code: ['', Validators.required],
      place_of_birth: ['', Validators.required],
      nationality: ['', Validators.required],

    })

    this.personalAddress1 = this.fb.group({
      country_id: ['', Validators.required],
      postal_code: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9- ]+$")])],
      city: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z- ']+$")])],
      address_line1: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9.', -]+$")])],
      address_line2: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9.', -]+$")])],
      region: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z', -]+$")])],
    })

  this.subs.sink = this.updateContactForm.controls['dob'].valueChanges.subscribe(
    (selectedValue) => {
      if (selectedValue != null) {
        var parms = selectedValue.split(/[\.\-\/]/);
        var yyyy = parseInt(parms[0],10);
        var mm   = parseInt(parms[1],10);
        var dd   = parseInt(parms[2],10);
        var date = new Date(yyyy,mm-1,dd,0,0,0,0);
    if(mm === (date.getMonth()+1) && dd === date.getDate() && yyyy === date.getFullYear()){
this.dobvalidator=false
    }
    else{
      this.dobvalidator=true
    }


      }
    }
  );
  }

}

