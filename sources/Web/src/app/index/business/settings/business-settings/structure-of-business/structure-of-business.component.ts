import { HomeService } from './../../../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { IndexService } from 'src/app/core/shared/index.service';
import { HomeComponent } from 'src/app/home/home.component';
import { Router } from '@angular/router';
import { HomeDataService } from 'src/app/home/homeData.service';
import { ApplicationsComponent } from 'src/app/home/business/applications/applications.component';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-structure-of-business',
  templateUrl: './structure-of-business.component.html',
  styleUrls: ['./structure-of-business.component.scss']
})
export class StructureOfBusinessComponent implements OnInit {
  count: number;
  count1: number;
  companyName: string;
  companySymbol: string;
  country_of_incorporation: string;
  directorsCount: any;
  shareholdersCount: any;
  first_name: any;
  last_name: any;
  dob: any;
  gender: any;
  mobile: any;
  place_of_birth: any;
  nationality: any;
  verifyIdenTemp: boolean = false;
  verifyId: boolean = false;
  busOwnPerTemplate: boolean = false;
  private subs = new SubSink();
  loadContent: boolean = true;
  countryData: any;
  profileData: any;
  KYBStatus: any;
  confmDirector: boolean = false;
  directorList: any;
  shareHoldertable: boolean = false;
  Invitaiontemplate: boolean = false
  busSelfAddress: boolean = false;
  verifiedListTemp: boolean = false;
  shareholderTemp: boolean = false
  kycTemplate: boolean = false;
  utltimateOwner: boolean = false;
  updateContactDetails: boolean = false;
  addDirectorForm: FormGroup;
  isPrimaryApplicant: boolean = false;
  isShareHolder: boolean  = false;
  ultimateOwnForm: FormGroup;
  minDOB: any = '';
  addDirectorFormData: any = [];
  min18DOB: any = '';
  valid18DOB: boolean = false;
  maxDOB: any;
  authorityPhotoImage: string;
  business_owner_id: number;
  dirlistTemplate: boolean = true;
  businessOwnersList: any;
  arrayList: any;
  KYCShareHolderStatus: any;
  shareStructure: boolean = false;
  directorDetailsTemplate: boolean = false;
  shareHolderUpdateList: any = [];
  shareHolderData: any = [];
  dirList: string;
  verifyAllbtn: boolean = false;
  validDOB: boolean = false;
  SelectedVerifyData: any;
  ownerShareholderList: any = {};
  shareholdersList: any;
  selectedCountryId: any;
  isKyc: any;
  shareHolderEmail: any;
  type: string;
  user_id: any;
  isKycDirShare: any;
  directorListFlag: boolean = true;
  url: string = "";
  urlSafe: SafeResourceUrl;
  authToken: any;
  userData: any = [];
  smslinkBox: boolean = true;
  identId: any;
  transactionId: any;
  KYCStatus: any;
  isIdentId: boolean = true;
  email: any;
  mobileNo: any;
  kycIframe: boolean = false;
  kycTargetURL: any;
  isVerifyKYC: boolean = false;
  completeIdentity: boolean = false;
  sharelinkMobileNo: any;
  kyb_bo_id: any;
  gplay: boolean;
  ios: boolean;
  MobidentId: any;
  platform_type: any;

  s_d_infoEmail: any;
  busOwnerFormcontact: any;
  adressbusinessUser_id: any;
  actionLabel: string;
  currentEditOwner: any;
  percentage: any;
  dobvalidator: boolean = true;
  ownerForm: boolean = false;
  emailFieldReadonly = false;
  emailFieldReadonlyInBusOwnerForm = false;
  shareholderMessage: any;
  businessowner_list: any;
  busStructureForm: boolean = true;
  editButton:boolean = true;


  constructor(private alert: NotificationService,
    private fb: FormBuilder, private indexService: IndexService, private homeDataService: HomeDataService,
    private homeService: HomeService, private routerNavigate: Router,  
    private loader: HomeComponent, public sanitizer: DomSanitizer) { }
  directorsList: any;
  ownersList: any;
  dirname: any;
  arrayy: any;
  ownerarr: any = [];
  busOwnerForm: FormGroup;
  personalAddress: FormGroup;
  sharePercent: boolean = false;

  ngOnInit() {
    this.structureOfBusiness();
    this.busOwnerForm = this.fb.group({
      business_owner_type: ["", Validators.required],
      first_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      email: ["", Validators.compose([Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      mobile: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      dob: ["", Validators.required],

      gender: ['', Validators.required],
      calling_code: ['', Validators.required],
      place_of_birth: ['', Validators.required],
      nationality: ['', Validators.required],
      percentage: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(2), Validators.maxLength(3), Validators.min(25), Validators.max(100)])],
      //phone: [''],

    })

    this.personalAddress = this.fb.group({
      country_id: ['', Validators.required],
      postal_code: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9- ]+$")])],
      city: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z- ']+$")])],
      address_line1: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9.', -]+$")])],
      address_line2: ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9.', -]+$")])],
      region: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z', -]+$")])],
    })
  }

  arr = [];
  structureOfBusiness() {
    //get company details
    this.companyName = sessionStorage.getItem("companyName");
    this.companySymbol = sessionStorage.getItem("companySymbol");
    this.country_of_incorporation = sessionStorage.getItem("country_of_incorporation");
    this.arr = [];
    this.homeService.getStructureOfBusinessData().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          // this.alert.success(res['data']['message']);
          this.ownerarr = [];
          this.count = 0;
          this.count1 = 0;
          // OwnersList
          this.ownersList = res['data']['ownerList']['Shareholder'];
          this.ownersList.forEach(element => {

            var ownersname = element.name;
            var ownersemail = element.email;
            var percentage = element.percentage;
            var ownersSymbol = ownersname.slice(0, 1)
            this.ownerarr.push({
              "ownername": ownersname,
              "owneremail": ownersemail,
              "percentage": percentage,
              "ownersSymbol": ownersSymbol
            })
            this.count++;
          });
        sessionStorage.setItem("count", this.count.toString());


          // directorsList
          this.directorsList = res['data']['ownerList']['Directors'];
          this.directorsList.forEach(element => {
            var directorsName = element.name;
            var directorsMail = element.email;
            this.dirname = directorsName.slice(0, 1);
            this.arr.push({
              "symbol": this.dirname,
              "directorsName": directorsName,
              "email": directorsMail
            });
            this.count1++;
          });
         sessionStorage.setItem("count1", this.count1.toString());
        }
        else {
          this.alert.error(res['data']['message']);
        }
      }
      else {
        this.alert.error(res['message']);
      }

    })
  }
  editDetails(){
    $('#editDetails').modal('show');
  }
  edit(){
    this.editButton = false;
    $('#editDetails').modal('hide');
  }
  VeriyYourself(item) {
    this.busOwnPerTemplate = true;
    this.busStructureForm = false;
    // if(item.kyc_status.includes("SUCCESS")) {
    //   return;
    // }
    this.kyb_bo_id = item.kyb_bo_id;
    this.getCountryDetails()
    //this.getShareHoldersOwners()
    //this.getshreDirectorcontact(item)
    this.shareHolderEmail = item.email;
    this.isKycDirShare = item.isKyc;
    this.percentage = item.percentage ? item.percentage : null;
    this.SelectedVerifyData = item;
    //this.personalAddress.reset();
    //this.busOwnerForm.reset();
    if (item.type == 'director') {
      // this.dirList= ['director'];
      this.dirList = 'Director';
      this.sharePercent = false;
      this.busOwnerForm.controls['business_owner_type'].patchValue(item.type, { onlySelf: true });
    }
    else if (item.type == 'shareholder') {
      //   this.dirList= ['shareholder'];
      this.dirList = 'Shareholder';
      this.sharePercent = true;
      this.busOwnerForm.controls['business_owner_type'].patchValue(item.type, { onlySelf: true });
    }
    else if (item.type == 'businessowner') {
      this.dirList = 'businessowner';
      //this.dirList= ['businessowner'];
      this.busOwnerForm.controls['business_owner_type'].patchValue(item.type, { onlySelf: true });
    }

    this.business_owner_id = item.kyb_bo_id
    var nameArr = item.name.split(',');
    this.busOwnerForm.patchValue({
      email: item.email,
      first_name: nameArr[0],
      last_name: nameArr[1],
      gender: item.contact ? item.contact.gender : '',
      mobile: item.contact ? item.contact.mobile.substring(item.contact.mobile.indexOf(" ")+1) : '',
      dob: item.dob ? item.dob : '',
      calling_code: '359',
      nationality: item.contact ? item.contact.nationality : '',
      place_of_birth: item.contact ? item.contact.place_of_birth : '',
      percentage: item.contact ? item.contact.percentage : '',
      
    });   
    this.isPrimaryApplicant = false;
    if(item.is_primary_applicant == 1) {
      this.isPrimaryApplicant = true;
      let dob_applicant = JSON.parse(sessionStorage.getItem('profileData'));    
      this.busOwnerForm.patchValue({
        mobile: this.mobileNo ? this.mobileNo.substring(this.mobileNo.indexOf(" ")+1) : '',
        dob: dob_applicant ? dob_applicant.dob : '',
        nationality: item.contact ? item.contact.nationality : '',
      place_of_birth: item.contact ? item.contact.place_of_birth : '',
      }); 
    } else if (item.is_shareholder == 1 && item.is_director == 1) {
      this.isShareHolder = true;
      let dob_applicant = JSON.parse(sessionStorage.getItem('profileData'));
      this.busOwnerForm.patchValue({
        mobile: item.contact ? item.contact.mobile.substring(item.contact.mobile.indexOf(" ")+1) : '',
        dob: dob_applicant ? dob_applicant.dob : '',
        nationality: item.contact ? item.contact.nationality : '',
      place_of_birth: item.contact ? item.contact.place_of_birth : '',
      });
    }
    this.emailFieldReadonlyInBusOwnerForm = item.email.trim().length > 0;
    this.personalAddress.patchValue({
      country_id: item.address ? item.address.country_id : '',
      postal_code: item.address ? item.address.postal_code : '',
      city: item.address ? item.address.city : '',
      address_line1: item.address ? item.address.address_line1 : '',
      address_line2: item.address ? item.address.address_line2 : '',
      region: item.address ? item.address.region : ''
    })
    this.first_name = nameArr[0];
    this.last_name = nameArr[1];


    this.dob = item.dob;
    this.gender = item.gender;
    this.mobile = item.mobile;
    this.place_of_birth = item.place_of_birth;
    this.nationality = item.nationality;

    this.verifyIdenTemp = false;
    this.busOwnPerTemplate = true;
  }
  getCountryDetails() {
    this.indexService.getCountryDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.countryData = res['data']['country list'];
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }
  SetCallingCode(code) {

    if (code != null) {
      let callcod = code.split(' ')[0]
      let callcode = this.countryData.filter(c => {
        if (callcod == c.calling_code) {
          return c;

        }
      })
      this.personalAddress.patchValue({ country_id: callcode[0].country_id })

      this.busOwnerForm.patchValue({ calling_code: callcode[0].calling_code })
    }
  }
  SetCountry() {

    this.selectedCountryId = this.busOwnerForm.get('calling_code').value;
    for (var i = 0; i <= this.countryData.length; i++) {
      if (this.countryData[i] != undefined && this.countryData[i] != null) {
        if (this.selectedCountryId == this.countryData[i].calling_code) {
          this.personalAddress.patchValue({
            'country_id': this.countryData[i].country_id,
          });
        }
      }
    }
  }
  getShareHoldersOwners() {
    this.homeService.getAllList('all').subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.ownerShareholderList = res['data']['ownerList']
          this.loader.apploader = false;
          this.shareHoldertable = true;
        }
        else if (res['data']['status'] == 1) {
          this.loader.apploader = false;
          this.shareHoldertable = false;
          this.ownerShareholderList = {};
        }
      }
      else {
        this.loader.apploader = false;
        this.shareHoldertable = false;
        this.alert.error(res['message'])
      }

    })
  }
  getAllList(type) {
    this.homeService.getAllList(type).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.arrayList = res['data']['ownerList'];
          this.shareholdersList = this.arrayList['Shareholder'] ? this.arrayList['Shareholder'] : '';
          if (_.size(res['data']['ownerList']["Directors"]) == _.size(_.filter(res['data']['ownerList']["Directors"], { status: 1 })) && _.size(res['data']['ownerList']["Businessowner"]) == _.size(_.filter(res['data']['ownerList']["Businessowner"], { status: 1 })) && _.size(res['data']['ownerList']["Shareholder"]) == _.size(_.filter(res['data']['ownerList']["Shareholder"], { status: 1 }))) {
            //  this.getUpdatedStatus("business_owner_details", 2)
            this.verifyAllbtn = true;
          }          
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        }

      }
      else {
        this.alert.error(res['messsage'])
      }
    })

  }
  submitPersonalDetails(formData: any) {
    this.busOwnPerTemplate = false;
    this.busSelfAddress = true;
    formData.percentage = '';
    formData.isKyc = true;
    formData.kyb_bo_id = this.kyb_bo_id
    formData.phone = formData.mobile;
    if(formData.business_owner_type == 'Director') {
      formData.type = 'director'
    } else {
      formData.type = 'shareholder'
    }
    formData.mobile = formData.calling_code + ' ' + formData.mobile;
    this.sharelinkMobileNo = formData.mobile;
  //  this.addDirectorFormData.push(formData)
    var obj = formData
    this.homeService.submitPersonalDetails(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.busOwnPerTemplate = false;
          this.busSelfAddress = true;
          this.kycTemplate = false;
          this.user_id = res['data']['user_id'];
          this.isKyc = res['data']['isKyc'];
          //this.storeAppIdforKYC()
           this.getshreDirectorAdress();
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
  getshreDirectorAdress() {


    let obj = {
      'user_id': this.adressbusinessUser_id
    }
    this.homeService.getshreDirectorAdress(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          //this.alert.success(res['data']['message']);
          let data = res['data']['addressDetails'][0]

          this.personalAddress.patchValue({ 'postal_code': data['postal_code'] == 'null' ? '' : data['postal_code'] })
          this.personalAddress.patchValue({ 'city': data['city'] == 'null' ? '' : data['city'] })
          this.personalAddress.patchValue({ 'address_line1': data['address_line1'] == 'null' ? '' : data['address_line1'] })
          this.personalAddress.patchValue({ 'address_line2': data['address_line2'] == 'null' ? '' : data['address_line2'] })
          this.personalAddress.patchValue({ 'region': data['region'] == 'null' ? '' : data['region'] })


        }
        else if (res['data']['status'] == 1) {
          // this.alert.error(res['data']['message']);
        }
      }
      else {
        // this.alert.error(res['message'])
      }
    })
  }
  listTempalte(){
    this.busStructureForm = true;
    this.busOwnPerTemplate = false;
  }
  submitPersonalAddr(formData: any) {
    this.busSelfAddress = false;
    $('#success').modal('show');
    // this.loader.apploader=true;
    formData.address_type_id = 1;
    formData.account_type = 'business';
    formData.user_id = this.user_id;
    // formData.user_id=this.adressbusinessUser_id;
    // new line
    if(this.directorsList.length > 0 && this.ownersList.length > 0) {
    this.businessOwnersList = [...this.directorsList, ...this.ownersList]
    }

    const bizOwner = this.businessOwnersList.find(element => {
      if (element && element.address) {
        element.address.applicant_id === formData.user_id
      }
      });
    if (bizOwner) {
        this.homeService.updateBusinessAddress(formData).subscribe(res => {
          if (res.code == 1 && res.status == 2) {
            return;
          }
          if (res['status'] == 0) {
            if (res['data']['status'] == 0) {
              // this.alert.success(res['data']['message']);
              // this.busSelfAddress=false;
              if (this.isKycDirShare == true) {
                // $('#kycwarn').modal('show');
                //   $("#myModalNew").modal('show');
                //  $("#kycpopupNew").modal('hide');
              } // else if(this.isKycDirShare==false){
              // this.alert.success(res['data']['message']);
              this.busSelfAddress = false;
              this.verifyIdenTemp = false;
              $('#success').modal('show');
              this.isVerifyKYC = true;
              this.loader.apploader = false;
              this.verifyIdentity();
              
            } else if (res['data']['status'] == 1) {
              this.loader.apploader = false;
              this.alert.error(res['data']['message']);
            }
          } else {
            this.loader.apploader = false;
            this.alert.error(res['message'])
          }
        });
      } else {
        this.homeService.submitBusinessAddress(formData).subscribe(res => {
          if (res.code == 1 && res.status == 2) {
            return;
          }
          if (res['status'] == 0) {
            if (res['data']['status'] == 0) {
              // this.alert.success(res['data']['message']);
              // this.busSelfAddress=false;
              if (this.isKycDirShare == true) {
                // $('#kycwarn').modal('show');
                //   $("#myModalNew").modal('show');
                //  $("#kycpopupNew").modal('hide');
              } // else if(this.isKycDirShare==false){
              // this.alert.success(res['data']['message']);
              this.busSelfAddress = false;
              this.verifyIdenTemp = false;
              this.isVerifyKYC = true;
              this.loader.apploader = false;
              this.verifyIdentity();
              // }
            } else if (res['data']['status'] == 1) {
              this.loader.apploader = false;
              this.alert.error(res['data']['message']);
            }
          } else {
            this.loader.apploader = false;
            this.alert.error(res['message'])
          }
        });
      }

  }
  getshreDirectorcontact(item) {

    let obj = {
      'email': item.email,
      'business_id': item.business_id,
      'type': item.type,
      'kyb_id': item.kyb_bo_id

    }

    this.homeService.getshreDirectorcontact(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.busOwnerFormcontact = res['data']['ownerDetails'][0]

          this.SetCallingCode(this.busOwnerFormcontact['phone'])
          this.adressbusinessUser_id = this.busOwnerFormcontact['user_id'];
          this.busOwnerForm.patchValue({ 'business_owner_type': this.busOwnerForm['type'] == 'null' ? '' : this.busOwnerFormcontact['type'] })
          this.busOwnerForm.patchValue({ 'first_name': this.busOwnerForm['first_name'] == 'null' ? '' : this.busOwnerFormcontact['first_name'] })
          this.busOwnerForm.patchValue({ 'last_name': this.busOwnerFormcontact['last_name'] == 'null' ? '' : this.busOwnerFormcontact['last_name'] })
          this.busOwnerForm.patchValue({ 'email': this.busOwnerFormcontact['email'] == 'null' ? '' : this.busOwnerFormcontact['email'] })
          this.busOwnerForm.patchValue({ 'gender': this.busOwnerFormcontact['gender'] == 'null' ? '' : this.busOwnerFormcontact['gender'] })
          this.busOwnerForm.patchValue({ 'dob': this.busOwnerFormcontact['dob'] == 'null' ? '' : this.busOwnerFormcontact['dob'] })
          this.busOwnerForm.patchValue({ 'mobile': this.busOwnerFormcontact['mobile'] == 'null' ? '' : this.busOwnerFormcontact['mobile'] });
          this.busOwnerForm.patchValue({ 'place_of_birth': this.busOwnerFormcontact['place_of_birth'] == 'null' ? '' : this.busOwnerFormcontact['place_of_birth'] });
          this.busOwnerForm.patchValue({ 'nationality': this.busOwnerFormcontact['nationality'] == 'null' ? '': this.busOwnerFormcontact['nationality']})


        }
        else if (res['data']['status'] == 1) {
          //   this.alert.error(res['data']['message']);
        }
      }
      else {
        //  this.alert.error(res['message'])
      }
    })

  }
  personaDetailsTemplate(){
    this.busOwnPerTemplate = true;
    this.busSelfAddress = false;
  }
  StuctureOfBusiness(){
    this.busStructureForm = true;
    this.editButton = true;
    this.busOwnPerTemplate = false;
    this.busSelfAddress = false;
    this.verifyId = true;
  }
  newDirector(){
    this.busOwnPerTemplate = true;
    this.busStructureForm = false;
    this.sharePercent = false;
    this.getCountryDetails()
    this.personalAddress.reset();
    this.busOwnerForm.reset();
    this.dirList = 'Director';
    this.busOwnerForm.controls['business_owner_type'].patchValue('director', { onlySelf: true });
  }

  newShareHolder(){
    this.busOwnPerTemplate = true;
    this.busStructureForm = false;
    this.getCountryDetails();
    this.dirList = 'Shareholder';
    this.busOwnerForm.controls['business_owner_type'].patchValue('shareholder', { onlySelf: true });
  }
  verifyIdentity(){
    this.busStructureForm = false;
    this.verifyIdenTemp = true;
    this.homeService.getVerifyIdentiesInformation().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {

          this.directorsList = res['data']['ownerList']['Directors'];
          this.directorsList.forEach(element => {
            var directorsName = element.name;
            var directorsMail = element.email;
            this.dirname = directorsName.slice(0, 1);
            this.arr.push({
              "symbol": this.dirname,
              "directorsName": directorsName,
              "email": directorsMail
            });
            this.count1++;
          });

          this.ownersList = res['data']['ownerList']['Shareholder'];
          this.ownersList.forEach(element => {

            var ownersname = element.name;
            var ownersemail = element.email;
            var percentage = element.percentage;
            var ownersSymbol = ownersname.slice(0, 1)
            this.ownerarr.push({
              "ownername": ownersname,
              "owneremail": ownersemail,
              "percentage": percentage,
              "ownersSymbol": ownersSymbol
            })
            this.count++;
          });


        }
      }
    });
  }
  attDocument(){
    this.verifyIdenTemp = false;
    this.shareStructure = true;
  }
  onComplete(){
    this.shareStructure = false;
    this.completeIdentity = true;
  }
  check_Kyc(){
    this.completeIdentity = false;
    this.shareStructure = false;
    this.busStructureForm = true;
  }
}
