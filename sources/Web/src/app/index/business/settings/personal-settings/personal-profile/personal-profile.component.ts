import { DatePipe } from '@angular/common';
import { IndexService } from './../../../../../core/shared/index.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';
import { SubSink } from 'subsink';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { HomeComponent } from 'src/app/home/home.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApplicationsComponent } from 'src/app/home/business/applications/applications.component';
declare var $: any;

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.scss']
})
export class PersonalProfileComponent implements OnInit {


  cardData: any = [];
  intialpayment: boolean;
  personalForm: boolean = true;
  editForm: boolean = false;
  editFormGroup: any;
  addressForm: FormGroup;
  show: boolean = false;
  hide: boolean = false;
  all: any;
  cardlength: any;
  incorporation_data: any;
  business_profile_data: any;
  nature_of_business_data: any;
  structure_of_business_data: any;
  directorsList: any;
  ownersList: any;
  dirname: any;
  //personal
  profileData: any;
  applicant_id: any;
  private subs = new SubSink()
  mobile: any;
  timer: any;
  intervalId: any;
  mobileOtp: any;
  isDisabled: boolean = false;
  showForm: boolean = true;
  change_password: boolean = false;
  //plan
  routerDisplay: boolean = false
  profileDisplay: boolean = true;
  personalDet: boolean = false;
  firstForm: boolean = false;
  initialForm: boolean = true;
  //modifications
  detailsList: any;
  secondForm: boolean = false;
  thirdForm: boolean = false;
  settingsForm: boolean = false;
  showMyContainer: boolean = true;
  changePasswordForm: FormGroup;
  mobileOTPMessage: boolean = false;
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
  userData: any;
  role_name: any;
  user_id: any;
  first_name: string;
  last_name: string;
  fullname: string;
  addressSpace: any;
  add: any = "";
  fullAddress: string;
  //settings
  aclObj: any;
  business_profile_billing: any;
  can_view: any;
  can_manage: any;
  business_management: any;
  user_management: any;
  business_can_view: any;
  business_can_manage: any;
  user_can_view: any;
  user_can_manage: any;
  accounts_statements: any;
  accounts: any;
  acc_can_view: any;
  transactions: any;
  transactions_can_view: any;
  operations_with_funds: any;
  exchanges: any;
  exchange_can_manage: any;
  payments: any;
  payments_can_view: any;
  payments_can_manage: any;
  counterparties: any;
  counterparties_can_view: any;
  counterparties_can_manage: any;
  cards_employees: any;
  physical_cards: any;
  cards_can_view: any;
  cards_can_manage: any;
  virtual_cards: any;
  virtual_can_view: any;
  virtual_can_manage: any;
  status: string;
  callingCode:any;
  countryData: any;
  place_of_birth: any;
  nationality: any;
  personaldetails: any;
  apploader: boolean = false;
  kycStatus: any;
  updateFail: any;
  updateSuccess: boolean;
  gplay:boolean;
  ios:boolean;
  statusMessage: any;
  updatedDetails: Object;
  first: any;
  kycIframe: boolean = false;
  url: string = "";
  urlSafe: SafeResourceUrl;

  editGroup= new FormGroup({
    first_name : new FormControl(),
    last_name : new FormControl(),
    dob : new FormControl(),
    mobile : new FormControl(),
    user_id : new FormControl(),
    place_of_birth : new FormControl(),
    nationality : new FormControl(),
  })
  addressGroup= new FormGroup({
    country : new FormControl(),
    postalcode : new FormControl(),
    address_line1 : new FormControl(),
    address_line2 : new FormControl(),
    city : new FormControl(),
    region : new FormControl(),
  })
  dobObject: Date;
  dateOfBirth: any;
  identId: any;
  transactionId: any;
  KYCStatus: any;
  MobidentId: any;
  constructor(private routerNavigate: Router, private homeService: HomeService, 
    private loader: HomeComponent, private alert: NotificationService, public authService: AuthService,
    private indexService: IndexService, public sanitizer: DomSanitizer, private datepipe : DatePipe, private fb: FormBuilder) {
      this.profileData = JSON.parse(sessionStorage.getItem('userData'));
      this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.indexService.getCountryDetails().subscribe(res => {
        this.countryData = res['data']['country list'];      
    })
  }
  
  ngOnInit() {
    clearInterval(this.intervalId);
    this.getPersonaldetails();
  }
  //Personal Functions
  setTimer() { 
    this.timer = 59
    var thisObj = this;
    this.intervalId = setInterval(function () {
      if (thisObj.timer > 0) {
        thisObj.timer = thisObj.timer - 1;
        if (thisObj.timer < 10) {
          thisObj.timer = "0" + thisObj.timer;
        }
        if (thisObj.timer == 0) {
          thisObj.isDisabled = true;
        }
      }
    }, 1000);
  }
  

  change_password_Form() {
    this.change_password = true;
    this.personalForm = false;
  }
  mobileResendLink() {
    this.mobileOTPMessage = false;
    this.mobileOtp = '';
    this.isDisabled = false;
    clearInterval(this.intervalId);
    this.subs.sink = this.indexService.createOTP(this.detailsList.mobile).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.setTimer();
        }
        else if (res['data']['status'] == 1) {
          clearInterval();
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }
  getPersonaldetails() {
    this.personalForm = true;
    this.editForm = false;
    this.homeService.getPersonalDetails().subscribe(res => {

      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.status = 'Active'
          this.detailsList = res['data'];
          this.first_name = this.detailsList["first_name"];
          this.last_name = this.detailsList["last_name"];
          this.fullname = this.first_name + " " + this.last_name;
          this.address_line1 = this.detailsList['address_line1'];
          this.address_line2 = this.detailsList['address_line2'];
          this.role_name = this.detailsList['role_name'];
          this.dob = this.detailsList['dob'];
          if(this.dob) {
            const dobArray = this.dob.split("/").map(e => parseInt(e));
            const year: number = dobArray[2];
            const month: number = dobArray[1] - 1;
            const day: number = dobArray[0];
            this.dobObject = new Date(year, month, day);
            this.dateOfBirth = this.datepipe.transform(this.dobObject,"dd/MM/yyyy")
          }
          this.address = this.detailsList['address'];
          this.place_of_birth = this.detailsList['place_of_birth'];
          this.nationality = this.detailsList['nationality'];
          this.addressSpace = this.address.split(",");
          this.mobile = "+" + this.detailsList['mobile'];
          this.country = this.detailsList['country_name'];
          this.postalcode = this.detailsList['postal_code'];
          this.city = this.detailsList['city'];
          this.region = this.detailsList['region'];
          this.addressSpace.forEach(element => {
            this.add += element + ", ";
            this.callingCode = this.mobile.substring(0, this.mobile.indexOf(" "))
            
          });
          this.fullAddress = this.add.substring(0, this.add.length - 2);

         
          this.user_id = this.detailsList['user_id']


          //acl object(personal profile settings object)
          this.aclObj = res['data']['acl'];
          this.business_management = this.aclObj['business_management'];
          this.business_profile_billing = this.business_management['business_profile_billing'];
          this.business_can_view = this.business_profile_billing['can_view'];
          this.business_can_manage = this.business_profile_billing['can_manage'];

          this.user_management = this.business_management['user_management'];
          this.user_can_view = this.user_management['can_view'];
          this.user_can_manage = this.user_management['can_manage'];

          this.accounts_statements = this.aclObj['accounts_statements'];
          //1
          this.accounts = this.accounts_statements['accounts'];
          this.acc_can_view = this.accounts['can_view'];
          this.user_can_manage = this.accounts['can_manage'];
          //2
          this.transactions = this.accounts_statements['transactions'];
          this.transactions_can_view = this.transactions['can_view']

          this.operations_with_funds = this.aclObj['operations_with_funds'];
          //1
          this.exchanges = this.operations_with_funds['exchanges'];
          this.exchange_can_manage = this.exchanges['can_manage'];
          //2
          this.payments = this.operations_with_funds['payments'];
          this.payments_can_view = this.payments['can_view'];
          this.payments_can_manage = this.payments['can_manage'];
          //3
          this.counterparties = this.operations_with_funds['counterparties'];
          this.counterparties_can_view = this.counterparties['can_view'];
          this.counterparties_can_manage = this.counterparties['can_manage'];

          // ****
          this.cards_employees = this.aclObj['cards_employees'];
          this.physical_cards = this.cards_employees['physical_cards'];
          this.cards_can_view = this.physical_cards['can_view'];
          this.cards_can_manage = this.physical_cards['can_manage'];

          this.virtual_cards = this.cards_employees['virtual_cards'];
          this.virtual_can_view = this.virtual_cards['can_view'];
          this.virtual_can_manage = this.virtual_cards['can_manage'];
        }
        else {
          this.status = 'Invited';
          this.alert.error(res['data']['message']);
        }
      }
      else {
        this.status = 'Inactive'
        this.alert.error(res['message']);
      }
    })
  }
  removeSpace(){
    this.first_name = this.first_name.trim().replace(/  +/g, ' ');
    this.last_name = this.last_name.trim().replace(/  +/g, ' ');
    this.country = this.country.trim().replace(/  +/g, ' ');
    this.postalcode = this.postalcode.trim().replace(/  +/g, ' ');
    this.address_line1 = this.address_line1.trim().replace(/  +/g, ' ');
    this.address_line2 = this.address_line2.trim().replace(/  +/g, ' ');
    this.city = this.city.trim().replace(/  +/g, ' ');
    this.region = this.region.trim().replace(/  +/g, ' ');
    this.place_of_birth = this.place_of_birth.trim().replace(/  +/g, ' ');
  }
  changeOtp(changePassword: object) {
    this.homeService.changePassword(changePassword).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          //this.alert.success(res['data']['message']);
          $("#setTargetModal").modal("show");
          this.setTimer();
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
  redirect() {
    $("#setTargetModal").modal("hide");
    //this.logoutAction();
    this.changePasswordForm.reset();
  }
  showOtp() {
    this.change_password_Form();
    //$("#showOtpModal").modal("show");
    this.setTimer();
  }
  logoutAction() {
    if (this.userData.data.userInfo.account_type == 'Personal') {
      if (this.authService.logOutAction()) {
        this.routerNavigate.navigate([''])
      }
    }
    else if (this.userData.data.userInfo.account_type == 'Business') {
      if (this.authService.logOutAction()) {
        this.routerNavigate.navigate([''])
      }
    }
    else if (this.userData.data.userInfo.account_type == 'sandbox') {
      if (this.authService.logOutAction()) {
        this.routerNavigate.navigate([''])
      }
    }
  }
  editDetails(){
    $("#editDetails").modal("show")
  }
  
  editDetailsForm() {
    this.personalForm = false;
    this.editForm = true;
    this.show = true;
    this.hide = false;
  }
  updateEditedDetails(data) {
    this.personalForm = true;
    this.editForm = false;
    this.show = false;
    this.hide = false;
    var obj = {
      "first_name": this.personaldetails.first_name,
        "last_name": this.personaldetails.last_name,
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
          this.getPersonaldetails();
          this.homeService.broadcastNewUserData(obj);
          this.statusMessage = res['data']['message']
          $('#success').modal('show');
        }
      }
    })
  
  
  }
  // dobObject(dobObject: any): any {
  //   throw new Error("Method not implemented.");
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
  getApp(){
    $('#kycwarn1').modal('hide');
    $('#appWarn').modal('show');
  }
  getKyc() {
    $('#kycwarn1').modal('hide');
    $('#myModalNew').modal('show');
  }
  personalDetails(data) {
    this.show = false;
    this.hide = true;
    this.personaldetails = data;
  }
  canceladdressDetails() {
    this.show = true;
    this.hide = false;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
    this.setTimer();
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
  getKYCStatus() {

    let obj = {
      "identityId": this.identId
    }
    this.homeService.getKYCStatus(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        } else if (res['data']['status'] == 0) {
          this.KYCStatus = res['data']['kyc_status'];

        } else if (res['status'] == 2) {
          this.alert.error(res['message']);
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
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
}
