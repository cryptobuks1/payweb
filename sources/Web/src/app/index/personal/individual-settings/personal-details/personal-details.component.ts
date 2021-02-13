import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { HomeService } from 'src/app/core/shared/home.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { HomeComponent } from 'src/app/home/home.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $:any;
@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  currentForm: boolean = true;
  editForm: boolean = false;
  individualDetailsData: unknown;
  name: any;
  dob: any;
  address: any;
  phoneNumber: any;
  email: any;
  firstName: any;
  lastName: any;
  country: any;
  postalcode: any;
  address_line1: any;
  city: any;
  region: any;
  address_line2: any;
  editFormGroup: any;
  abc: any;
  updatedDetails: Object;
  updateFail: any;
  updateSuccess: boolean;
  statusMessage: any;
  detailsList: any;
  addressDet: boolean;
  addressForm: FormGroup;
  personaldetails: any;
  show: any = true;
  hide: any = false;
  mobile: any;
  addressSpace: any;
  add: any = "";
  fullAddress: any;
  fullName: any;
  dateOfBirth: string;
  countryData: any;
  phoneNumberWithCallingCode;
  dobObject: any;
  place_of_birth: any;
  nationality: any;
  kycStatus: any;
  gplay:boolean;
  ios:boolean;
  user_id: string;
  userData: any;
  apploader:boolean = false;
  identId: any;
  kycIframe:boolean = false;
  url: any = "";
  urlSafe: SafeResourceUrl;
  selectedTab = '';
  parentRoutes = ['accounts', 'payments', 'settings','settings', 'exchange', 'accounts','add-money', 'exchange', 'application'];
  MobidentId: any;
  transactionId: any;
  constructor(private alert:NotificationService, private loader: HomeComponent, public sanitizer: DomSanitizer, 
    private activatedRoute: ActivatedRoute, private routerNavigate: Router, private homeService: HomeService, private formBuilder: FormBuilder, private router: Router, private datepipe : DatePipe) { 
      this.userData = JSON.parse(sessionStorage.getItem('userData'));
    }
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  setSelectedTab(tab) {
    const foundTab = this.parentRoutes.find(r => tab.toLowerCase().includes(r.toLowerCase()));
    if (this.selectedTab !== foundTab) {
      this.selectedTab = foundTab;
    }
  }
  ngOnInit() {
    const intialTab = (this.activatedRoute.snapshot as any)._routerState.url;
    this.setSelectedTab(intialTab);
    this.routerNavigate.events.subscribe(res => {
      this.setSelectedTab(this.routerNavigate.url);
    });
    this.displayDetailsForm();
    this.editFormGroup = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dob: ["", Validators.required],
       mobile: ["", Validators.required],
       email: ["", Validators.required],
       place_of_birth: ["", Validators.required],
       nationality: ["", Validators.required]

    })


    this.addressForm = this.formBuilder.group({
      country: ["", Validators.required],
      postalcode: ["", Validators.required],
      address_line1: ["", Validators.required],
      address_line2: ["", Validators.required],
      city: ["", Validators.required],
      region: ["", Validators.required],
    })
    this.getCountrys();
  }
  showPersonalForm() {
    this.router.navigate(['home/settings']);
  }
  getCountrys() {
    this.currentForm = true;
    this.editForm = false;
    this.homeService.getCountryDetails().subscribe(res => {
      if (res['status'] == 0) {

        this.countryData = res['data']['country list'];
       
      }
      else if (res['status'] == 1) {
        this.alert.error(res['message'])
      }

    })
  }
  displayDetailsForm() {
    this.currentForm = true;
    this.editForm = false;
    this.homeService.getPersonalDetails().subscribe(res => {
      this.detailsList = res;
      this.individualDetailsData = res["data"];
      this.firstName = this.individualDetailsData["first_name"];
      this.lastName = this.individualDetailsData["last_name"];
      this.fullName = this.firstName + " " + this.lastName;
      this.dob = this.individualDetailsData["dob"];
      this.place_of_birth = this.individualDetailsData['place_of_birth'];
      this.nationality = this.individualDetailsData['nationality'];
      if(this.dob) {
        const dobArray = this.dob.split("/").map(e => parseInt(e));
        const year: number = dobArray[2];
        const month: number = dobArray[1] - 1;
        const day: number = dobArray[0];
        this.dobObject = new Date(year, month, day);
        this.dateOfBirth = this.datepipe.transform(this.dobObject,"dd/MM/yyyy")
      }
      this.mobile = this.individualDetailsData["mobile"]
      if(this.individualDetailsData["address_line2"]==""){
        this.address = `${this.individualDetailsData["address_line1"]}, ${this.individualDetailsData["city"]}, ${this.individualDetailsData["region"]}, ${this.individualDetailsData["postal_code"]}, ${this.individualDetailsData["country_name"]}.`;
      }
      else {
        this.address = `${this.individualDetailsData["address_line1"]}, ${this.individualDetailsData["address_line2"]}, ${this.individualDetailsData["city"]}, ${this.individualDetailsData["region"]}, ${this.individualDetailsData["postal_code"]}, ${this.individualDetailsData["country_name"]}.`;
      }
      
      this.addressSpace = this.address.split(",");
      this.addressSpace.forEach(element => {
        this.add += element + ", ";
      });
      this.fullAddress = this.address;
      this.phoneNumber = this.individualDetailsData["mobile"];
      this.phoneNumberWithCallingCode = "+"+this.individualDetailsData["mobile"];;
      this.email = this.individualDetailsData["user_id"];
      this.country = this.individualDetailsData["country_name"];
      this.postalcode = this.individualDetailsData["postal_code"];
      this.address_line1 = this.individualDetailsData["address_line1"];
      this.address_line2 = this.individualDetailsData["address_line2"];
      this.city = this.individualDetailsData["city"];
      this.region = this.individualDetailsData["region"]; // no region in response
    })
  }

  editDetails(){
    $('#editDetails').modal("show")
  }
  editDetailsForm() {
    this.currentForm = false;
    this.editForm = true;
    this.show = true;
    this.hide = false;
  }

  adddressDetails() {

    this.addressDet = true;
  }
  get formControls(): AbstractControl { // name property
    return this.editFormGroup.get('firstName');
  }


  personalDetails(data) {
    this.show = false;
    this.hide = true;
    this.personaldetails = data;
  }


  // addressDetails(data){
  // }
  formatDate(d) {
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

  updateEditedDetails(data) {
    this.currentForm = true;
    this.editForm = false;
    this.show = false;
    this.hide = false;
  //   this.loader.apploader = true;
  // this.homeService.getKYCStatus('').subscribe(res => {
  //   if(res.code == 1 && res.status == 2) {
  //     return;
  //   }
  //   this.loader.apploader = false;
  //   this.kycStatus = res['data']['kyc_status'];
  //   if ( this.kycStatus && (this.kycStatus.includes('SUCCESS'))) {
  //     this.loader.apploader = false;
  //     $('#kycwarn1').modal('show');
  //     if(res['status'] == 2) {
  //       this.alert.error(res['message']);
  //     }
  //   }
  //   else {
  //     $('#success').modal('show');
  //   }
  // });
  
  var obj = {
    "first_name": this.personaldetails.firstName,
    "last_name": this.personaldetails.lastName,
    "dob": this.dateOfBirth,
    "place_of_birth": this.place_of_birth,
    "nationality": this.nationality,
    "postal_code": data.postalcode,
    "address_line1": this.address_line1,
    "address_line2": this.address_line2,
    "country_name": this.country,
    "city": this.city,
    "region": this.region,
    "town": this.city,
  }
  
  obj.dob=this.dateOfBirth;
  this.homeService.updatePersonalDetails(obj).subscribe(res => {
    if(res["status"] == 0){
      if(res["data"]['reTriggerKyc'] == true){
        $('#kycwarn1').modal('show');
      }
      else {
        this.updateFail = false;
        this.updateSuccess = true;
        this.updatedDetails = res;
        this.homeService.broadcastNewUserData(obj);
        this.statusMessage = res['data']['message']
        $('#success').modal('show');
      }
    }
  })
  }
  
  getApp(){
    $('#kycwarn1').modal('hide');
    $('#appWarn').modal('show');
  }
  getKyc() {
    $('#kycwarn1').modal('hide');
    $('#myModalnew').modal('show');
  }
  canceladdressDetails() {
    this.show = true;
    this.hide = false;
  }
  removeSpace(){
    this.firstName = this.firstName.trim().replace(/  +/g, ' ');
    this.lastName = this.lastName.trim().replace(/  +/g, ' ');
    this.country = this.country.trim().replace(/  +/g, ' ');
    this.postalcode = this.postalcode.trim().replace(/  +/g, ' ');
    this.address_line1 = this.address_line1.trim().replace(/  +/g, ' ');
    this.address_line2 = this.address_line2.trim().replace(/  +/g, ' ');
    this.city = this.city.trim().replace(/  +/g, ' ');
    this.region = this.region.trim().replace(/  +/g, ' ');
    this.place_of_birth = this.place_of_birth.trim().replace(/  +/g, ' ');
  }
  SubmitForKYC() {
    this.loader.apploader = true;
    if (sessionStorage.getItem('isCamera') == 'no') {
      this.loader.apploader = false;
      this.alert.info("No camera available or Broswer support")
    }
    if (sessionStorage.getItem('isCamera') == 'yes') {
      let obj = {
        "account_type": "business",
        "applicant_id": this.user_id
      }
      this.homeService.SubmitForKYC(obj).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            this.loader.apploader = false;
            this.kycIframe = true;
            this.identId = res['data']['id'];
            this.transactionId = res['data']['transactionId'];
            $("#myModalNew").modal('hide');
            $("#kycpopupNew").modal('show');
            this.url = `https://kyc.payvoo.com/app/${res['data']['sepaKycEnvironment']}/identifications/` + this.identId + '/identification/auto-ident'
            // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
            window.addEventListener('message', data => {
              $("#kycpopupNew").modal('hide');
              if(this.userData.account_type=='personal'){
                this.routerNavigate.navigate(['/personal/accounts/getaccount']);
              }
              else{
                this.routerNavigate.navigate(['business/exchange/action']);
              }
              //this.routerNavigate.navigate(['])
              console.log(data)
            })
          }
          else if (res['data']['status'] == 1) {
            this.loader.apploader = false;
            this.kycIframe = true;
            this.identId = res['data']['id'];
            $("#kycpopupNew").modal('show');
            this.url = `https://kyc.payvoo.com/app/${res['data']['sepaKycEnvironment']}/identifications/` + this.identId + '/identification/auto-ident'
            // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
          }
        }
        else {
          this.alert.error(res['message']);
          this.loader.apploader = false;
        }
      })
    }
  }
  
  KYClinkToMobile(mobilePlatform) {
    this.loader.apploader=true;
    let obj={
      "account_type": this.userData.account_type
    }
    this.homeService.SubmitForKYC(obj).subscribe(res=>{
      if(res['status']==0){
        this.identId =res['data']['id'];
        if (res['data']['status'] == 0) {
          this.MobidentId =res['data']['id'];
          this.linkToMobile(mobilePlatform);
          this.loader.apploader=false;
        } else if(res['data']['status']==1){
          this.linkToMobile(mobilePlatform);
          this.loader.apploader=false;
        }
      } else {
        this.alert.error(res['message']);
        this.loader.apploader=false;
      }
    });
  }

  linkToMobile(mobilePlatform){
    this.loader.apploader=true;
     this.homeService.KYClinkToMobile(this.mobile,this.email, mobilePlatform, this.MobidentId).subscribe(res => {
      if(res['status']==0){
       if(res['data']['status']==0){
         //this.alert.success(res['data']['message']);
         this.loader.apploader=false;
       }
      } else {
        this.alert.error(res['message']);
        this.loader.apploader=false;
      }
    });
   }
  
   webCamera() {
    this.SubmitForKYC();
  }
  onBack() {
    this.parentFun.emit();
  }
}
