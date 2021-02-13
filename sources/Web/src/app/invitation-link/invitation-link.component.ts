
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IndexService } from 'src/app/core/shared/index.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
//import { IndexComponent } from '../index/';

declare var $: any;

@Component({
  selector: 'app-invitation-link',
  templateUrl: './invitation-link.component.html',
  styleUrls: ['./invitation-link.component.scss']
})
export class InvitationLinkComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  personalAddress: FormGroup;
  updateContactForm: FormGroup;
  updateContactDetails: boolean = true;
  updateContactAddress: boolean = false;
  thanksFlag: boolean = false;
  minDOB = ''
  maxDOB: any;


  public href: string = "";
  url: string = "";
  dirList: string[];
  business_Id: any;
  percentage: any;
  countryData: any;
  validDOB: boolean = false;
  applicantId: any;
  business_owner_id: any;
  kycTemplate: boolean = false;
  smslinkBox: boolean = true;
  identLoader: boolean = false;
  identId: any;
  applicant_Id: any;
  Token: any;
  api_access_key: any;
  client_auth: any;
  member_id: any;
  email: any;
  selectedCountryId: any;
  isKyc: any;
  tokenObj: any;
  token: any;
  dataToken: any;
  userData: any;
  user_id: any;
  gplay: any;
  ios: any;

  urlSafe: SafeResourceUrl;
  kycIframe: boolean = false;
  apploader: boolean = false;

  constructor(private fb: FormBuilder, private indexService: IndexService,
    private alert: NotificationService, private router: Router, private route: ActivatedRoute,
    public sanitizer: DomSanitizer) {
    var date = new Date(),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    var obj = [date.getFullYear(), mnth, day].join("-");
    this.maxDOB = obj;

    this.getCountryDetails();
    this.href = this.router.url;
    var obj = this.router.url.slice(24)
    this.tokenObj = obj.slice(0, -1);
    this.route.queryParams.subscribe(params => {
      this.token = params.token
      //  this.dataToken=params.data_token
    });


    // this.dirList= ['director','shareholder'];
    this.getDireSharehloderDetails()

  }

  noSpace(){
    $("input").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
  });
}
  getDireSharehloderDetails() {

    this.indexService.getUserData(this.token).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
      this.userData = res;
      this.userData['data']['userInfo']['account_type'] = 'notAccount';
      this.updateContactForm.patchValue({
        //email: res['email'],
        first_name: this.userData['data']['userInfo']['first_name'],
        last_name: this.userData['data']['userInfo']['last_name'],
        email: this.userData['data']['userInfo']['email'],
        business_owner_type: this.userData['data']['userInfo']['type'],

      });
      this.updateContactForm.updateValueAndValidity();
      sessionStorage.setItem('x-auth-token', this.userData['data']['userInfo']['access_token']);
      sessionStorage.setItem('userData', JSON.stringify(this.userData));
    }
    else if(res['data']['status'] == 1){
      this.alert.error(res['data']['message']);
  this.router.navigate(['']);
    }

  }
  else{
    this.alert.error(res['message']);
  }



    })


  }




  submitBussinessAdress() {



    this.indexService.getPersonalDetails(this.tokenObj).subscribe(res => {

      if (res['status'] = '1') {
        this.isKyc = res['isKyc']

        if (res['type'] == 'director') {
          this.dirList = ['director'];
          this.updateContactForm.controls['business_owner_type'].patchValue(res['type'], { onlySelf: true });
        }
        else if (res['type'] == 'shareholder') {
          this.dirList = ['shareholder'];
          this.updateContactForm.controls['business_owner_type'].patchValue(res['type'], { onlySelf: true });
        }
        else if (res['type'] == 'businessowner') {
          this.dirList = ['businessowner'];
          this.updateContactForm.controls['business_owner_type'].patchValue(res['type'], { onlySelf: true });
        }
        var nameArr = res['name'].split(',');
        var first_name = nameArr[0];
        var last_name = nameArr[1];
        this.business_Id = res['business_id'],
          this.percentage = res['percentage']
        this.business_owner_id = res['kyb_bo_id'];
        this.Token = res['Token'];
        this.api_access_key = res['api_access_key'];
        this.client_auth = res['client_auth'];
        this.member_id = res['member_id'];
        this.email = res['email']

        this.updateContactForm.patchValue({
          email: res['email'],
          first_name: first_name,
          last_name: last_name,

        });
      }

      else {
        this.alert.error("Invitation failed")
      }
    })
  }


  //    {
  //     "first_name": "satya",
  //     "last_name": "narayana",
  //     "email": "breatly12389@gmail.com",
  //     "dob": "1996-12-10",
  //     "mobile": "89745452",
  //     "gender": "MALE",
  //     "business_owner_type": "shareholder",
  //     "isKyc": true,
  //     "percentage": "30%",
  //     "kyb_bo_id": 54
  // }


  submitPersonalDetails(formData: any) {


    // jsonObject.addProperty("first_name", firstName);
    // jsonObject.addProperty("last_name", lastName);
    // jsonObject.addProperty("email", emailId);
    // jsonObject.addProperty("mobile", mobile);
    // jsonObject.addProperty("dob", date);
    // jsonObject.addProperty("isKyc", isKyc);
    // jsonObject.addProperty("gender", gender.toUpperCase());
    // jsonObject.addProperty("percentage", "");
    // jsonObject.addProperty("business_owner_type", type);
    // jsonObject.addProperty("token", invitationToken);
    // jsonObject.addProperty("kyb_bo_id", kyb_bo_id);
    // formData.mobile = formData.calling_code + formData.mobile;
    // formData.percentage ='';
    // formData.token = this.token;
    // formData.kyb_bo_id = this.userData['data']['userInfo']['kybBoId'];
    // formData.isKyc = this.userData['data']['userInfo']['isKyc'];

    let data={

      "mobile": formData.mobile,
      "first_name":formData.first_name,
      "last_name":formData.last_name,
      "email":formData.email,
      "dob":formData.dob,
      "isKyc":this.userData['data']['userInfo']['isKyc'],
      "gender":formData.gender,
      "percentage":'',
      "business_owner_type":formData.business_owner_type,
      "token":this.token,
      "kyb_bo_id":this.userData['data']['userInfo']['kybBoId']

    }

    this.indexService.submitPersonalDetails(data).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          if (res['status'] == 0) {
            this.applicantId = res['applicantId']
            this.user_id = res['data']['user_id'];
            this.isKyc = res['data']['isKyc'];

            this.updateContactDetails = false;
            this.updateContactAddress = true
           // this.alert.success(res['data']['message'])
          }
          else if (res['data']['status'] == 1) {
            this.alert.error(res['data']['message']);
          }
        }

        else {
          this.alert.error(res['message'])
        }
      }
      else if (res['status'] == 2) {
        this.alert.error(res['message'])
        this.router.navigate(['/business/login'])
      }

    })
  }


  SetCountry() {
    this.selectedCountryId = this.updateContactForm.get('calling_code').value;
    let count = this.countryData.filter(c => (c.calling_code == this.selectedCountryId));
    this.personalAddress.patchValue({
      'country_id': count[0].country_id,
    });
  }



  //    {
  //     "country_id": 1,
  //     "address_type_id":3,
  //     "postal_code": "EC4V 6JA",
  //     "address_line1": "HYD",
  //     "address_line2": "HYD",
  //     "city": "London",
  //     "region": "HYD",
  //     "country": "UK",
  //     "account_type":"business"
  // }



  submitPersonalAddr(formData: any) {

    formData.address_type_id = 1;
    formData.account_type = "business"
    formData.user_id = this.user_id;
    this.indexService.submitAddr(formData).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 1) {
        //  this.alert.success(res['data']['status']);
          if (this.userData['data']['userInfo']['isKyc'] == true) {
            $('#kycwarn').modal({ backdrop: 'static', keyboard: false });
          }
          if (this.userData['data']['userInfo']['isKyc'] == false) {
            this.IsVerifiedDirOwnr();

          }
          // this.storeAppIdforKYC();
        }
        else if (res['data']['status'] == 0) {
          if (this.userData['data']['userInfo']['isKyc'] == true) {
            $('#kycwarn').modal({ backdrop: 'static', keyboard: false });
          }
          if (this.userData['data']['userInfo']['isKyc'] == false) {
            this.IsVerifiedDirOwnr();
          }
        }

      }
      else if (res['status'] == 2) {
        alert(res['message'])
        this.alert.error(res['message'])
        this.router.navigate(['/business/login'])
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }

  check_Kyc() {

    $("#myModal").modal('show');

    // $("#kycpopup").modal('hide');
  }

  webCamera() {
    this.SubmitForKYC()
  }



  IsVerifiedDirOwnr() {

    var obj = {
      "kyb_bisiness_owner_id": this.user_id,
      "status": true
    }
    this.indexService.IsVerifiedDirOwnr(obj).subscribe(res => {
      if (res.status == 1) {

      }
      else if (res['status'] == 0) {
        this.router.navigate([''])
      }
      else {
        this.alert.error("status not updated");
      }
    });
  }

  getCountryDetails() {

    this.indexService.getCountryDetails().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.countryData = res['data']['country list'];
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
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
    if (selectedYr <= this.maxDOB) {
      this.validDOB = false;
    }
    else {
      this.validDOB = true;
    }
  }






  SubmitForKYC() {


    this.apploader = true;
    if (sessionStorage.getItem('isCamera') == 'no') {
      this.apploader = false;
      this.alert.info("No camera available or Broswer support")
    }
    if (sessionStorage.getItem('isCamera') == 'yes') {
      let obj = {
        "account_type": "business",
        "user_id": this.user_id
      }


      this.indexService.Bus_SubmitForKYCInvitaion(obj).subscribe(res => {
        if (res['status'] == 0) {
          this.apploader = false;
          if (res['data']['status'] == 0) {

            this.kycIframe = true;
            this.identId = res['data']['id'];
            $("#myModal").modal('hide');
            $("#kycpopup").modal('show');
            this.url = `https://kyc.payvoo.com/app/${res['data']['sepaKycEnvironment']}/identifications/` + this.identId + '/identification/auto-ident'
            // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
          }
          else if (res['data']['status'] == 1) {
            this.apploader = false;
            this.kycIframe = true;
            this.identId = res['data']['id'];
            $("#kycpopup").modal('show');
            this.url = `https://kyc.payvoo.com/app/${res['data']['sepaKycEnvironment']}/identifications/` + this.identId + '/identification/auto-ident'
            // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
          }
        }
        else {
          this.alert.error(res['message']);
          this.apploader = false;
        }
      })
    }
    else {
      this.apploader = false;
    }
  }



  getKYCStatus() {
    $('#kycpopup').modal('hide');
    let obj = {
      "identityId": this.identId
    }
    let uerdata = this.userData.data.userInfo
    this.apploader = true
    this.indexService.getKYCStatus(obj).subscribe(res => {
      if (res['status'] == 0) {
        this.apploader = false;
        if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        } else if (res['data']['status'] == 0) {
          $('#kycpopup').modal('hide');
          //this.KYCStatus=res['data']['kyc_status'];
          this.router.navigate(['/business/login']);
          this.router.navigate(['']);
        } else if (res['status'] == 2) {
          this.alert.error(res['message']);
        }
      }
      else {
        this.apploader = false;
        this.alert.error(res['message'])
      }
    })

    //
  }



  KYClinkToMobile(mobilePlatform) {
    this.subs.sink = this.indexService.KYClinkToMobile(null, this.email, mobilePlatform, this.identId).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.smslinkBox = false;
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }



  ngOnInit() {
    this.updateContactForm = this.fb.group({
      first_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      // email: ["",Validators.compose([ Validators.required,Validators.pattern("[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}")])],
      email: ["", Validators.compose([Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      mobile: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      dob: ["", Validators.required],
      business_owner_type: ["", Validators.required],
      gender: ['', Validators.required],
      calling_code: ['', Validators.required],
    })
    this.personalAddress = this.fb.group({
      country_id: ['', Validators.required],
      postal_code: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9- ]+$")])],
      city: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z-']+$")])],
      address_line1: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      address_line2: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      region: ['', Validators.compose([Validators.required])],
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }



}
