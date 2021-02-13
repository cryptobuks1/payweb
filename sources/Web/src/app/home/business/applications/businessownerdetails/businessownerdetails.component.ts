/**
* Dashboard Component
* KYC status, KYC verification process, user profile
* @package BusdashboardComponent
* @subpackage app\home\personal\business-dashboard\busdashboard.component.html
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { HomeService } from '../../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { IndexService } from 'src/app/core/shared/index.service';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { ApplicationsComponent } from '../applications.component';
import { HomeComponent } from 'src/app/home/home.component';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SubSink } from 'subsink';
import { environment } from '../../../../../environments/environment';
import { HomeDataService } from 'src/app/home/homeData.service';

declare var $: any;


@Component({
  selector: 'app-businessownerdetails',
  templateUrl: './businessownerdetails.component.html',
  styleUrls: ['./businessownerdetails.component.scss']
})
export class BusinessownerdetailsComponent implements OnInit {
  private subs = new SubSink();
  loadContent: boolean = true;
  countryData: any;
  profileData: any;
  KYBStatus: any;
  confmDirector: boolean = false;
  directorList: any;
  shareHoldertable: boolean = false;
  verifyIdenTemp: boolean = false;
  Invitaiontemplate: boolean = false
  busOwnPerTemplate: boolean = false;
  busSelfAddress: boolean = false;
  verifiedListTemp: boolean = false;
  shareholderTemp: boolean = false
  kycTemplate: boolean = false;
  utltimateOwner: boolean = false;
  updateContactDetails: boolean = false;
  addDirectorForm: FormGroup;
  isPrimaryApplicant: boolean = false;
  isShareHolder: boolean  = false;
  dob: any;
  gender: any;
  mobile: any;
  ultimateOwnForm: FormGroup;
  first_name: any;
  last_name: any;
  minDOB: any = '';
  min18DOB: any = '';
  valid18DOB: boolean = false;
  maxDOB: any;
  authorityPhotoImage: string;
  business_owner_id: number;
  dirlistTemplate: boolean = true;
  businessOwnersList: any;
  arrayList: any;
  KYCShareHolderStatus: any;

  directorDetailsTemplate: boolean = false;
  addDirectorFormData: any = [];
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
  place_of_birth: any;
  nationality: any;
  businessowner_list: any;

  constructor(private fb: FormBuilder, private indexService: IndexService, private homeDataService: HomeDataService,
    private homeService: HomeService, private alert: NotificationService, private routerNavigate: Router, private application: ApplicationsComponent, private loader: HomeComponent, public sanitizer: DomSanitizer) {
    this.application.loadContent = false;
    var date = new Date(),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    var obj = [date.getFullYear(), mnth, day].join("-");
    this.minDOB = [date.getFullYear() - 100, mnth, day].join("-");
    this.min18DOB = [date.getFullYear() -18, mnth, day].join("-");
    this.maxDOB = obj;
    this.getStatusCheck();
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
    this.subs.sink = this.homeService.getUserDetails().subscribe(data => {
      this.mobileNo = data.mobile;
    })
    this.subs.sink = this.homeDataService.getMobile().subscribe(data => {
      this.mobileNo = data;
    })
  }

  getDirectors() {
    this.confmDirector = true;
    this.homeService.getDirectors('director').subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.directorList = res['data']['ownerList']['directors'];
          this.dirlistTemplate = true;
          this.loader.apploader = false;
        }
        else if (res['data']['status'] == 1) {
          this.directorList = [];
          this.dirlistTemplate = false;
          this.loader.apploader = false;
        }
      }
      else {
        this.loader.apploader = false;
        this.alert.error(res['message'])
      }
    })
  }
  deleteDirectorFieldVal(index) {
    this.addDirectorForm.reset();
    this.getDirectors();
    this.confmDirector = true;
    this.directorDetailsTemplate = false;
  }
  submitDirecotrsNames(formData:any){
    formData.status=true;
    formData.percentage=null;
    formData.type="director";
    formData.dob=null;
    this.addDirectorFormData.push(formData)
    var obj = { list: this.addDirectorFormData }
    this.homeService.addDirShrHolder(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.addDirectorFormData = [];
          this.getDirectors();
          this.directorDetailsTemplate = false;
          this.confmDirector = true;
          this.addDirectorForm.reset();
          this.deleteDirectorFieldVal(0)
        }
        else if (res['data']['status'] == 1) {
          this.addDirectorForm.reset();
          this.addDirectorFormData=[];
          this.alert.warn(res['data']['message']);
        }
      }
      else {
        this.addDirectorForm.reset();
        this.addDirectorFormData=[];
        this.alert.error(res['message'])
      }
    })
  }

  getStatusCheck() {
    this.homeService.industryStatus().subscribe(res => {
      if (res && res['data'] && res['data']['Dashboard Status']) {
        if (res['data']['Dashboard Status']['business_owner_details'] == "2" || res['data']['Dashboard Status']['business_owner_details'] == "1") {
          this.shareholderTemp = false;
          this.confmDirector = false;
          this.verifyIdenTemp = true;
          this.getAllList('all');
        } else {
          this.getDirectors();
        }
      }
    })
  }
  noSpace(){
    $(".fname, .lname, .code, .add1, .add2, .city, .region, .pBirth").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
          this.value = this.value.replace(/  +/g, ' ');
  });
  }
  updateDirecotrsNames(formData: any, type) {
    formData.status = true;
    formData.percentage = null;
    formData.type = type
    formData.dob = null;
    this.addDirectorFormData.push(formData)
    var obj = { list: this.addDirectorFormData, id: this.currentEditOwner.id }
    this.homeService.updateDirShrHolder(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.addDirectorFormData = [];
          if(type == 'director') {
          this.getDirectors();
          this.deleteDirectorFieldVal(0)
          } else {           
            this.confmDirector = false;
            this.delShrHoldrFieldValue(0)
          }
          this.directorDetailsTemplate = false;
          
          this.addDirectorForm.reset();
         
        }
        else if (res['data']['status'] == 1) {
          this.addDirectorForm.reset();
          this.addDirectorFormData = [];
          this.alert.warn(res['data']['message']);
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }

  updateSharedHolder(formData) {
    this.confmDirector = false;
    formData.status = true;
    //var shareHolderUpdateList = [];
    this.shareHolderUpdateList.push(formData)
    var obj = { list: this.shareHolderUpdateList, id: this.currentEditOwner.id }
    this.homeService.updateDirShrHolder(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.getShareHoldersOwners();
        }
        else if (res['data']['status'] == 1) {
          this.shareHolderUpdateList = [];
        //  let id = this.ownerShareholderList ? this.ownerShareholderList.Shareholder.find(item => item.kyb_bo_id == this.currentEditOwner.id) : ''
          this.ultimateOwnForm.reset();
          this.alert.warn(res['data']['message']);
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }

  verifiedAllStatus() {
    this.loadContent = true;
    this.verifiedListTemp = false;
    this.verifyIdenTemp = false;
  }
  VeriyYourself(item) {
    if(item.kyc_status.includes("SUCCESS")) {
      return;
    }
    this.kyb_bo_id = item.kyb_bo_id;
    this.getCountryDetails()
    // this.getshreDirectorcontact(item)
    this.shareHolderEmail = item.email;
    this.isKycDirShare = item.isKyc;
    this.percentage = item.percentage ? item.percentage : null;
    this.SelectedVerifyData = item;
    this.personalAddress.reset();
    this.busOwnerForm.reset();
    if (item.type == 'director') {
      // this.dirList= ['director'];
      this.dirList = 'Director';
      this.busOwnerForm.controls['business_owner_type'].patchValue(item.type, { onlySelf: true });
    }
    else if (item.type == 'shareholder') {
      //   this.dirList= ['shareholder'];
      this.dirList = 'Shareholder';
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

  submitPersonalDetails(formData: any) {
    formData.percentage = this.percentage;
    formData.isKyc = true;
    formData.kyb_bo_id = this.kyb_bo_id
    formData.phone = formData.mobile;
    formData.mobile = formData.calling_code + ' ' + formData.mobile;
    this.sharelinkMobileNo = formData.mobile;


    this.homeService.submitPersonalDetails(formData).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.busOwnPerTemplate = false;
          this.busSelfAddress = true;
          this.kycTemplate = false;
          this.user_id = res['data']['user_id'];
          this.isKyc = res['data']['isKyc'];
          //this.storeAppIdforKYC()
          // this.getshreDirectorAdress();
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
  resetDirShreholrd() {
    this.addDirectorForm.reset();
    this.ultimateOwnForm.reset();
  }

  check_Kyc() {
    $("#myModalNew").modal('show');
    $("#kycpopupNew").modal('hide');
  }

  submitPersonalAddr(formData: any) {
    // this.loader.apploader=true;
    formData.address_type_id = 1;
    formData.account_type = 'business';
    formData.user_id = this.user_id;
    // formData.user_id=this.adressbusinessUser_id;
    // new line
    if(this.directorList.length > 0 && this.shareholdersList.length > 0) {
    this.businessOwnersList = [...this.directorList, ...this.shareholdersList]
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
              this.isVerifyKYC = true;
              this.loader.apploader = false;
              // this.verifyIdentity();
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
              // this.verifyIdentity();
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

  hideOk() {
    $("#successChanges").modal('hide');
  }

  updatePersonalAddr(formData: any) {

    // this.loader.apploader=true;
    formData.address_type_id = 1;
    formData.account_type = 'business';
    formData.user_id = this.user_id;
    // formData.user_id=this.adressbusinessUser_id;
    // new line

    this.homeService.updateAddress(formData).subscribe(res => {
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
          // this.verifyIdentity();
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

  addDirector(label) {
    this.actionLabel = label;
    this.addDirectorForm.reset();
    $('#addDirectorFieldVal').modal('show');
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
  kycOption() {
    $("#myModalNew").modal('show');
  }
  webCamera() {
    this.SubmitForKYC();
  }

  getApp() {   
    $("#appWarn").modal('show');
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
          this.application.KYBStatus = this.KYCStatus

        } else if (res['status'] == 2) {
          this.alert.error(res['message']);
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }

  sendInvitationAlert(platform) {
    this.platform_type = platform;
    $('#kycverifywarn_busowner').modal('show');
  }

  KYClinkToMobile(mobilePlatform) {
    mobilePlatform = this.platform_type
    this.loader.apploader = true;
    let obj = {
      "account_type": "business",
      "applicant_id": this.user_id
    }
    this.homeService.SubmitForKYC(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.MobidentId = res['data']['id'];
          this.loader.apploader = false;
          this.linkToMobile(mobilePlatform)
        }
        else if (res['data']['status'] == 1) {
          this.linkToMobile(mobilePlatform);
          this.loader.apploader = false;
        }
      }
      else {
        this.alert.error(res['message']);
        this.loader.apploader = false;
      }
    })
    this.isVerifyKYC = false;
    this.verifyIdenTemp = true;
  }
  linkToMobile(mobilePlatform) {
    let email = this.SelectedVerifyData ? this.SelectedVerifyData.email : this.busOwnerForm.get('email').value
    this.loader.apploader = true;
    this.homeService.KYClinkToMobile(this.busOwnerForm.get('mobile').value, email, mobilePlatform, this.MobidentId).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          //this.alert.success(res['data']['message']);
          this.loader.apploader = false;
          this.getAllList('all');
        }
        if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message']);
          this.loader.apploader = false;
        }
      }
      else {
        this.alert.error(res['message']);
        this.loader.apploader = false;
      }
    })
  }
  latestStatus() {
    this.smslinkBox = true;
    this.loader.apploader = false;
    this.getShareholderStaus(this.identId);
    this.busSelfAddress = false;
    this.busOwnPerTemplate = false;
    this.isVerifyKYC = false;
    this.verifyIdenTemp = true;
  }

  getShareholderStaus(identId) {
    this.homeService.getKYBshareholderStatus(identId).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.KYCShareHolderStatus = res['data']['kyc_status'];
          // if(this.KYCStatus == 'SUCCESSFUL_WITH_CHANGES') {
          //   $("#successChanges").modal('show');  
          // }
          //   this.KYBStatus=this.KYCShareHolderStatus
          this.loader.apploader = false;
          this.getAllList('all');
        }
        else if (res['data']['status'] == 1) {
          this.loader.apploader = false;
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.loader.apploader = false;
        //this.alert.error(res['message'])
      }
    });

  }
  IsVerifiedDirOwnr() {
    var obj = {
      "kyb_bisiness_owner_id": this.business_owner_id,
      "status": true
    }
    this.homeService.IsVerifiedDirOwnr(obj).subscribe(res => {
      if (res.status == 0) {
        if (res['data']['status'] == 0) {
          // this.alert.success(res['data']['message'])
          this.confmDirector = true;
        }
      }
      else {
        this.alert.error('status not updated');
      }
    });
  }
  selectedDirtitem = { first_name: '', last_name: '', email: '' }
  getCurrntDir(item) {
    var nameArr = item.name.split(',');
    this.first_name = nameArr[0];
    this.last_name = nameArr[1];
    this.selectedDirtitem = { first_name: this.first_name, last_name: this.last_name, email: item.email }
  }



  moveToShareHolder() {

    this.shareholderTemp = true;
    this.confmDirector = false;
    this.getShareHoldersOwners()

  }
  addShrHoldrFieldValue(label) {
    // this.type='businessowner'
    this.ultimateOwnForm.reset();
    this.actionLabel = label;
    $('#addShrHoldrFieldValue').modal('show');
    this.type = 'shareholder'
    this.ultimateOwnForm.value.type = this.type
    this.ultimateOwnForm.get('type').updateValueAndValidity();
  }

  delShrHoldrFieldValue(index) {
    this.ultimateOwnForm.reset();
    this.shareHolderData = [];
    this.utltimateOwner = false;
    this.shareholderTemp = true;
    this.getShareHoldersOwners();
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

  dobValidation($event) {
    var dt = new Date();
    var yr = dt.getFullYear();
    var selectedYr = $event.target.value;
    if ((selectedYr <= this.maxDOB) && (selectedYr >= this.minDOB)) {
      this.validDOB = false;
    }
    else {
      this.validDOB = true;
    }
    if (selectedYr <= this.min18DOB) {
      this.valid18DOB = false;
    }
    else {
      this.valid18DOB = true;
    }
  }


  submitSharedHolder(formData: any) {
    formData.dob = null;
    formData.type = this.type;
    this.shareHolderData.push(formData);
    var obj = { list: this.shareHolderData };
    this.homeService.addDirShrHolder(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          // this.alert.success(res['data']['message']);
          this.shareHolderData = [];
          this.ultimateOwnForm.reset();
          this.getShareHoldersOwners();
        }
        else if (res['data']['status'] == 1) {
          this.shareHolderData = [];
          this.ultimateOwnForm.reset();
          this.alert.warn(res['data']['message']);
        }
      }
      else {
        this.alert.error(res['message'])
      }

    })
    this.shareHolderData = [];
  }


  verifyIdentity() {
    this.shareholderTemp = false;
    this.confmDirector = false;
    this.verifyIdenTemp = true;
    this.getAllList('all');
    this.kycTemplate = false;
  }
  //  //update owner status
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
          this.application.getKYBStatus();
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
  editOwner(id, type, label) {
    this.actionLabel = label;
    if (type === 'director') {
      $("#addDirectorFieldVal").modal('show');
    }
    else {
      $("#addShrHoldrFieldValue").modal('show');
    }
    this.homeService.getDirectorsById(id).subscribe(res => {
      if(res['data'].getStakeHoldersById) {
        this.currentEditOwner = res['data'].getStakeHoldersById[0];
      }
      let percentage = res['data'].getStakeHoldersById[0].percentage == " " ? "" : res['data'].getStakeHoldersById[0].percentage;
      this.emailFieldReadonly = res['data'].getStakeHoldersById[0].email.trim().length > 0;
      if (type === 'director') {
        this.addDirectorForm.patchValue({ first_name: res['data'].getStakeHoldersById[0].name.split(',')[0], last_name: res['data'].getStakeHoldersById[0].name.split(',')[1], email: res['data'].getStakeHoldersById[0].email });
      }
      else {
        this.ultimateOwnForm.patchValue({ first_name: res['data'].getStakeHoldersById[0].name.split(',')[0], last_name: res['data'].getStakeHoldersById[0].name.split(',')[1], email: res['data'].getStakeHoldersById[0].email, percentage: percentage });
      }
    })
  }

  deleteOwner(id, type) {
    this.loader.apploader = true;
    this.homeService.deleteOwner(id, type).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          //this.alert.success(res['data']['message']);
          if (type == 'shareholder') {
            this.getShareHoldersOwners();
          }
          if (type == 'director') {
            this.getDirectors();
            this.shareholderTemp = false;
          }
        }
        else if (res['data']['status'] == 1) {
          this.loader.apploader = false;
          // this.alert.success(res['data']['message'])
        }
      }
      else {
        this.loader.apploader = false;
        this.alert.error(res['message'])
      }
    })
  }

  // getUpdatedStatus(col,status){
  //  let obj={
  //     "column" : col,
  //     "status":status
  //   }
  //   this.homeService.getUpdatedStatus(obj).subscribe(res => {
  //     if(res['status']==0){
  //        if(res['data']['status']==0){
  //         this.application.getKYBStatus();
  //        }
  //        else if(res['data']['status']==1){
  //          this.alert.error(res['data']['message'])
  //        }
  //     }
  //     else{
  //       this.alert.error(res['message'])
  //     }
  //   });
  // }


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

  numberOnly(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;


  }

  sendInvitationLink(item) {

    // var obj={
    // userEmail:this.profileData.data.userInfo.email,
    // inviteeEmail:item.email,
    // kyBusinessId:item.kyb_bo_id,
    // platformType:'web',
    // //isKyc:this.isKyc
    // }
    var obj = {
      "userEmail": item.email,
      "userName": item.name,
      "businessId": item.business_id,
      "isKyc": item.isKyc,
      "applicant_id": item.address ? item.address.applicant_id : ''
    }
    let kycObj = {
      "account_type": "business",
      "applicant_id": this.user_id
    }
    this.homeService.SubmitForKYC(kycObj).subscribe(resp => {
      obj['identId'] = resp['data']['id']
      this.identId = obj['identId']
      obj['transactionNumber'] = resp['data']['transactionId'];
      this.homeService.sendInvitationLink(obj).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            //this.alert.success(res['data']['message']);
            this.Invitaiontemplate = false;
            this.loadContent = true;
            this.alert.success("An Invitation has been sent to " + obj.userName);
            this.latestStatus();
          }
          else if (res['data']['status'] == 1) {
            this.alert.error(res['data']['message']);
          }
        }
        else {
          this.alert.error(res['message'])
        }
      })
    })




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

  directorTemplate() {
    this.shareholderTemp = false;
    this.confmDirector = true;
    this.getDirectors();
  }
  shareholderList() {
    this.verifyIdenTemp = false;
    this.shareholderTemp = true;
  }
  listTempalte() {
    this.busOwnPerTemplate = false;
    this.verifyIdenTemp = true;

  }
  personaDetailsTemplate() {
    this.busSelfAddress = false;
    this.busOwnPerTemplate = true;
  }
  busOwnerForm: FormGroup;
  personalAddress: FormGroup;
  ngOnInit() {
    this.addDirectorForm = this.fb.group({
      first_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      email: ["", Validators.compose([Validators.required, Validators.pattern("[A-Za-z._-]+\(|[0-9])+\(|[A-Za-z0-9._-])+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
    })

    this.ultimateOwnForm = this.fb.group({
      //type:['',Validators.required],
      type: [''],
      first_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      email: ["", Validators.compose([Validators.required, Validators.pattern("[A-Za-z._-]+\(|[0-9])+\(|[A-Za-z0-9._-])+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      percentage: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(2), Validators.maxLength(3), Validators.min(25), Validators.max(100)])],

    })

    this.busOwnerForm = this.fb.group({
      first_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: ["", Validators.compose([Validators.required, Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      email: ["", Validators.compose([Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      mobile: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      dob: ["", Validators.required],

      business_owner_type: ["", Validators.required],
      gender: ['', Validators.required],
      calling_code: ['', Validators.required],
      place_of_birth: ['', Validators.required],
      nationality: ['', Validators.required],
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
    this.subs.sink = this.busOwnerForm.controls['dob'].valueChanges.subscribe(
      (selectedValue) => {
        if (selectedValue != null) {
          var parms = selectedValue.split(/[\.\-\/]/);
          var yyyy = parseInt(parms[0], 10);
          var mm = parseInt(parms[1], 10);
          var dd = parseInt(parms[2], 10);
          var date = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
          if (mm === (date.getMonth() + 1) && dd === date.getDate() && yyyy === date.getFullYear()) {
            this.dobvalidator = false
          }
          else {
            this.dobvalidator = true
          }

        }
      })
  }
}
