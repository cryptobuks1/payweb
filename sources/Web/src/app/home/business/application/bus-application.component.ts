
/**
* Dashboard Component
* KYC status, KYC verification process, user profile
* @package BusdashboardComponent
* @subpackage app\home\personal\business-dashboard\busdashboard.component.html
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { HomeService } from '../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import {FormGroup,Validators,FormBuilder,AbstractControl} from "@angular/forms";
import { IndexService } from 'src/app/core/shared/index.service';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';

declare var $: any;



@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {


  loadContent:boolean=true;
  busAddrTemp:boolean=false;
  operatingAddrTemp:boolean=false;
  busAddrForm: FormGroup;
  operatingAddrForm:FormGroup;
  countryData: any;
  bus_applicant_id: number;
  profileData: any;
  typesOfBus:boolean=false;
  isBusList:boolean=false
  fieldArray: Array<any> = [{}];
  newAttribute: any = {};
  businessSectorData: any;
  range_of_service: any;
  busTypesFormData: any={};
  businessSectorId: any;
  transcationinfo:boolean=false;

  MnthVolTransData=[];
  PayntPerMonth=[];
  max_value_of_payment: any;
  monthy_transfer_amount: any;
  no_payments_per_month: any;
  monthlyTrsnAmt: any;
  pyntpermonth: any;
  KYBStatus: any;
  confmDirector:boolean=false;
  insdustriesData: any;
  ids: number[];
  facility:any;
  ids1:any;
  selectedInsData: any=[];
  selectedIndustries: any;
  receivePayTempl:boolean=false;
  sendPayTempl:boolean=false;
  reveivePaymentTemp:boolean=false;
  countryFieldArray: Array<any> = [{}];
  newCountryAttribute: any = {};
  sendPaycountryFieldArray:Array<any> = [{}];
  sendPayCountryAttribute: any = {};
  directorList: any;
  country: any;
  shareHoldertable:boolean=false;
  sendPymtBtn:boolean=false;
  sbmtOperBtn:boolean=false;
  businessList:boolean=true;
  verifyIdenTemp:boolean=false;
  Invitaiontemplate:boolean=false
  busOwnPerTemplate:boolean=false;
  busSelfAddress:boolean=false;
  verifiedListTemp:boolean=false;
  shareholderTemp:boolean=false
  kycTemplate:boolean=false;
  utltimateOwner:boolean=false;
  directorForm:FormGroup;
  smslinkBox:boolean=true;
  smslinkBox1:boolean=true;
  identId: any;
  identLoader:boolean=false;
  KYCStatus: any;
  updateContactDetails:boolean=false;
  updateContactForm:FormGroup;
  addDirectorForm:FormGroup;
  dob: any;
  gender: any;
  mobile: any;
  ultimateOwnForm:FormGroup;
  customLoadingTemplate:any;

  restricted_business: boolean=true;
  // indlistFlag = [
  //   {isSelected: false,name:'Yes'},
  //   {isSelected: true,name:'No'},
  // ]

  first_name: any;
  last_name: any;
  email: any;
  isVeryfiedList: any;
  addr_applicant_id: any;
  minDOB=''
  maxDOB:any;
  selectedfile: any;
   myObject = {};
   fileupload:boolean=false;
   photoimage:string;
   responsedata:any;
   responseDataOperting:any;
   opertingPhotoImage:string;
   shareholder:string;
   responseDatashare:any;
   authorityPhotoImage:string;
   responseDataAuthority:any;
   supportDocument:boolean=false;
   suppDocumRegistered:boolean=false;
   proofofOperating:boolean=false;
   proofOfShareHolder:boolean=false;
   authorityAddress:boolean=false;
   activeclick:boolean=false;
   activeClickOperating:boolean=false;
   activeClickShareHolder:boolean=false;
   activeClickAuthority:boolean=false;
   operatingObject={};
   shareholderObject={};
   authorityObject={};
   registeredcheckimage:boolean=false;
   registeredcheckfile:boolean=false;
   operatingcheckimage:boolean=false;
   operatingcheckfile:boolean=false;
   sharefolderchceckimage:boolean=false;
   sharefoldercheckfile:boolean=false;
   authoritycheckimage:boolean=false;
   authoritycheckfile:boolean=false;
   business_Id: number;
   business_owner_id: number;
   ShrHoldrList: any;
  dirlistTemplate:boolean=true;
  busUserList: unknown;
  Owner: any;
  directors: any;
  arrayList: any;
  business_owner_type: any;
  applicant_Id: number;
  allow: boolean=false;
  selectedIndValue: any;
  restricted:Array<any>=[]
  errordata:any;
  industrycheck:boolean=false;
  blockindustries:boolean=false;
  countrieserror:boolean=false;
  countrieslist:Array<any>=["Afghanistan","Algeria", "Angola", "Belarus", "Bosnia and Herzegovina", "Burkina Faso",
    "Burundi", "Cambodia", "Central African Republic", "Congo",
    "Democratic Republic of the Congo", "Cuba, Côte d\'Ivoire", "Egypt", "Eritrea", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti","Iran (Islamic Republic of)", "Iraq", "Lao People\'s Democratic Republic",
    "Lebanon", "Liberia", "Libya", "Mozambique", "Myanmar", "Nigeria", "Democratic People\'s Republic of Korea",
    "Pakistan", "State of Palestine", "Panama", "Sierra Leone", "Somalia", "South Sudan", "Sudan, Swaziland",
    "Syrian Arab Republic", "Tajikistan", "Timor-Leste", "Tunisia", "Uganda", "Ukraine", "Vanuatu",
    "Venezuela","Denmark"];
   contact_mobile: any;
   contact_email: any;
   verifiedAll: boolean;
   sendcompanies:boolean;
   country_incorporation: any;
   country_business:any;
   directorDetailsTemplate:boolean=false;
   addDirectorFormData: any=[];
   shareHolderData: any=[];
   imgValue: any;
   supportDocBtn: boolean=true;
   legalName: any;
   businessname:any;
   updateContactAddress: boolean=false;
   business_description:any;
   dirList: string[];
   ownList:string[];
   docData: any;
   verifyAllbtn: boolean=false;
   post_validation:boolean=false;
   invalidWebsite:boolean=true;
   invalidcountries:boolean=true;
   sendcountires:boolean=true;
   validDOB: boolean=false;
   SelectedVerifyData: any;


    applybusiness:boolean;
    checkoption:boolean=true;
    optionvalid:boolean=true;
    validationIndustries:boolean=true;


  ownerShareholderList:any;
  selectedCountryId: any;
  isKyc: any;
  SharidentId: any;
  kycTemplateShare: boolean=false;
  shareHolderEmail: any;
  industrStatus: any;
  restricted_businessValue: number;
  type: string;





   // supporting document end


  constructor(private fb: FormBuilder, private indexService: IndexService,private homeService:HomeService,private alert:NotificationService,private routerNavigate:Router) {
    var date = new Date(),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    var obj=[date.getFullYear(), mnth, day].join("-");
    this.maxDOB=obj;

     this.getBusSectorTypes();
     this.getCountryDetails();
      this.getKYBStatus();
      this.industryStatus()
      this.profileData=JSON.parse(sessionStorage.getItem('userData'));
    //  this.business_Id=this.profileData.userInfo.business_Id;
    //  this.applicant_Id=this.profileData.userInfo.applicant_id;
    //  this.country_incorporation=this.profileData.userInfo.business_country_of_incorporation;
      //this.legalName=this.profileData.data.userInfo.business_legal_name;

    //

   }
   industryStatus(){

    this.homeService.industryStatus().subscribe(res => {
        this.industrStatus=res['isRestricted'];
        if(this.industrStatus == 1) {
        //  this.alert.error('Your account blocked, please contact customer support');
        }

    });
   }
   noSpace(){
    $("input").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
  });
}
   getKYBStatus(){
    this.homeService.getKYBStatus().subscribe(res => {
      if(res['status']==0){
        if(res['data']['status']==0){
          this.KYBStatus=res['data']['Dashboard Status'];
        }
        else if(res['data']['status']==1){
           this.insertKYB();
        }
      }
      else{
        this.alert.error(res['message'])
      }
    //  this.KYBStatus=response;  
    //  if(response.status==0){
    //     this.insertKYB();
    //  }
    });
   }
   typesOfBusniess(){
    this.validationIndustries=true;
     this.kycTemplateShare=false;
     this.updateContactAddress=false;
     this.loadContent=false;
    this.transcationinfo=false;
    this.typesOfBus=true;
    this.isBusList=false;
    this.busAddrTemp=false;
    this.operatingAddrTemp=false;
    this.confmDirector=false;
    this.receivePayTempl=false;
    this.sendPayTempl=false;
    this.verifyIdenTemp=false;
    this.Invitaiontemplate=false;
    this.busSelfAddress=false;
    this.verifiedListTemp=false
    this.shareholderTemp=false;
    this.supportDocument = false;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = false;
    this.kycTemplate=false;
    this.blockindustries=false;
    this.countrieserror=false;
    this.updateContactDetails=false;
    this.sendcompanies=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;
    this.applybusiness=false;
  }

  addFieldValue(index){
  if(this.fieldArray.length <= 10) {
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
  }
  }



  deleteFieldValue(index) {
    if(this.fieldArray.length > 1) {
    this.fieldArray.splice(index, 1);
    }
  }

 //receive payment
  addreceivedFieldValue(){
    if(this.countryFieldArray.length <= 2) {
      this.countryFieldArray.push(this.newCountryAttribute);
      this.newCountryAttribute = {};
      this.validateBusiness();
   }
  }
  deletereceiveFieldValue(index) {
      if(this.countryFieldArray.length > 1) {
      this.countryFieldArray.splice(index, 1);
      this.validateBusiness();
      }
    }


    // countries start


    validateBusiness()
    {
      let invalidCountries= false;
      let wsRegex = new RegExp(/^[A-Za-z0-9' ,-]+$/);
      for(var i=0;i<this.countryFieldArray.length;i++){
        if( this.countryFieldArray[i].business_description.length < 30 || !this.countryFieldArray[i].business_description.match(wsRegex)){
            this.countryFieldArray[i].error = true;
            invalidCountries = true;
            break;
        }
        else{
          this.countryFieldArray[i].error = false;
        }
      }
      if(invalidCountries){
        this.invalidcountries = true;
      }else{
        this.invalidcountries = false;
      }
    }


    // countries end



  receivePayment(){

    var thisObj = this
    let countrydetails=[];
    let countrynames=[];
    let countrylistcheck=[];
    var blockCompany =[]


     // get country name using id

    for (var j = 0; j < this.countryData.length; j++) {
      for (var k = 0; k < this.countryFieldArray.length; k++) {
        if (this.countryData[j]['country_id'] == this.countryFieldArray[k]['country_id']) {
          countrynames.push(this.countryData[j]['country_name']);
        }
      }
    }


    _.forEach(countrynames, function (row) {
      _.forEach(thisObj.countrieslist, function (row1) {
        if (row == row1) {
          blockCompany.push(row)
        }
      })
    })



    if(_.size(blockCompany)>0) // here we have to place api coutry
    {
       this.countrieserror=true;
       this.receivePayTempl=false;
       blockCompany=[]
    }
    else
    {
    for(var i = 0; i < this.countryFieldArray.length; i++){
      this.countryFieldArray[i].business_id=this.business_Id;
      this.countryFieldArray[i].transaction_type="RECEIVE"
    }
    var obj={countries_Details:this.countryFieldArray}
    this.homeService.receivesendFromCountry(obj).subscribe(res=>{
      if(res['status']==0){
      if(res['data']['status']==0){
        this.receivePayTempl=false;
        this.sendPymtBtn=false;
        this.sendPayTempl=true;
        this.verifyIdenTemp=false;
        this.Invitaiontemplate=false;
        this.busSelfAddress=false;
        this.verifiedListTemp=false
        this.shareholderTemp=false;
        this.utltimateOwner=false;
        this.kycTemplate=false;
        this.updateContactDetails=false;
        this.directorDetailsTemplate=false;
       // this.countryFieldArray=[];
      }
      else if(res['data']['status']==1){
        this.sendPayTempl=false;
        this.alert.warn(res['data']['message']);
      }
    }
    else if(res['status']==1){
      this.alert.error(res['message']);
    }
    })
  }

  }
  //send payment
  addsendFieldValue(){
    if(this.sendPaycountryFieldArray.length <= 2) {
      this.sendPaycountryFieldArray.push(this.sendPayCountryAttribute);
      this.sendPayCountryAttribute = {};
      this.sendPaymentCountries();
    }
    }
  deletesendFieldValue(index) {
      if(this.sendPaycountryFieldArray.length > 1) {
      this.sendPaycountryFieldArray.splice(index, 1);
      this.sendPaymentCountries();
      }
    }


    // send countries start


    sendPaymentCountries()
    {
      let sendsCountries= false;
      let wsRegex = new RegExp(/^[A-Za-z0-9' ,-]+$/);
      for(var i=0;i<this.sendPaycountryFieldArray.length;i++){
        if(this.sendPaycountryFieldArray[i].business_description.length < 30 || !this.sendPaycountryFieldArray[i].business_description.match(wsRegex)){
            this.sendPaycountryFieldArray[i].error = true;
            sendsCountries = true;
            break;
        }
        else{
          this.sendPaycountryFieldArray[i].error = false;
        }
      }
      if(sendsCountries){
        this.sendcountires = true;
      }else{
        this.sendcountires = false;
      }
    }


    // send countries end



  sendPayment(){

    var thisObj = this
    var paycountrynames =[];
    var blockCompanyreceive=[];

     // get country name using id

     for (var j = 0; j < this.countryData.length; j++) {
      for (var k = 0; k < this.sendPaycountryFieldArray.length; k++) {
        if (this.countryData[j]['country_id'] == this.sendPaycountryFieldArray[k]['country_id']) {
          paycountrynames.push(this.countryData[j]['country_name']);
        }
      }
    }


    _.forEach(paycountrynames, function (row) {
      _.forEach(thisObj.countrieslist, function (row1) {
        if (row == row1) {
          blockCompanyreceive.push(row)
        }
      })
    })


    if(_.size(blockCompanyreceive)>0) // here we have to place api coutry
    {
       this.sendcompanies=true;
       this.sendPayTempl=false;
       blockCompanyreceive=[];
    }
    else
    {
    for(var i = 0; i < this.sendPaycountryFieldArray.length; i++){
      this.sendPaycountryFieldArray[i].business_id=this.business_Id;;
      this.sendPaycountryFieldArray[i].transaction_type="SEND"
    }
    var obj={countries_Details:this.sendPaycountryFieldArray}
    this.homeService.receivesendFromCountry(obj).subscribe(res=>{
      if(res['status']==0){
      if(res['data']['status']===0){
        this.loadContent=true;
        this.sendPayTempl=false;
        //this.alert.success(res['data']['message']);
        this.getUpdatedStatus('type_of_business',2);
        this.insertKYB();
      }
      else if(res['data']['status']==1){
        this.sendPayTempl=true
        this.alert.warn(res['data']['message']);
      }
     } else if(res['status']==1){
      this.alert.error(res['message']);
    }
    })
    }
  }

  getDirectors(){
    this.homeService.getDirectors('director').subscribe(res=>{
      if(res['status']==0){
      if(res['data']['status']==0){
        this.directorList=res['data']['ownerList']['directors'];
       this.dirlistTemplate=true;
      }
      else if(res['data']['status']==1){
        this.dirlistTemplate=false;
      }
    }
    else{
      this.alert.error(res['message'])
     }
      })
  }
  addDirectorFieldVal(){
      this.directorDetailsTemplate=true;
      this.confmDirector=false;
      // this.addDirBtn=false;
      // this.dirlistTemplate=false;
      this.newCountryAttribute = {};
  }
  deleteDirectorFieldVal(index){
      this.addDirectorForm.reset();
      this.getDirectors();
      this.confmDirector=true;
      this.directorDetailsTemplate=false;
     // this.addDirBtn=true;
  }
  submitDirecotrsNames(formData:any){
         formData.status=false;
         formData.percentage=null;
         formData.type="director"
         formData.dob=null
         this.addDirectorFormData.push(formData)
    var obj= {list:this.addDirectorFormData}
   this.homeService.addDirShrHolder(obj).subscribe(res=>{
     if(res['status']==0){
      if(res['data']['status']==1){
        this.addDirectorFormData=[]
        //this.alert.success(res['data']['message']);
        this.getDirectors();
        this.directorDetailsTemplate=false;
        this.confmDirector=true;
        this.addDirectorForm.reset();
        this.deleteDirectorFieldVal(0)
      }
      else if(res['data']['status']==0){
        this.alert.error("failed");
      }
    }
    else{
      this.alert.error(res['message'])
    }
    })
}
  verifyIdenData(item){
    this.shareHolderEmail=item.email;
    this.isKyc=item.isKyc;
    this.SelectedVerifyData=item;
    this.personalAddress.reset();
    this.busOwnerForm.reset();
    if(item.type=='director'){
      this.dirList= ['director'];
      this.busOwnerForm.controls['business_owner_type'].patchValue(item.type, {onlySelf: true});
    }
   else if(item.type=='shareholder'){
      this.dirList= ['shareholder'];
      this.busOwnerForm.controls['business_owner_type'].patchValue(item.type, {onlySelf: true});
    }
    else if(item.type=='businessowner'){
      this.dirList= ['businessowner'];
      this.busOwnerForm.controls['business_owner_type'].patchValue(item.type, {onlySelf: true});
    }


    //this.business_owner_type=item.type
    this.business_owner_id=item.kyb_bo_id
    var nameArr = item.name.split(',');
    this.busOwnerForm.patchValue({
      email:item.email,
      first_name:nameArr[0],
      last_name:nameArr[1],
    })
    this.first_name=nameArr[0];
    this.last_name=nameArr[1];
    this.verifyIdenTemp=false;
    this.Invitaiontemplate=true;
    this.busSelfAddress=false;
    this.verifiedListTemp=false;
    this.shareholderTemp=false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;


    this.dob = item.dob;
    this.gender = item.gender;
    this.mobile = item.mobile;
   }
   verifiedAllStatus(){
     this.loadContent=true;
    this.verifiedListTemp=false;
    this.verifyIdenTemp=false;
  }
   VeriyYourself(){
    this.Invitaiontemplate=false;
    this.busSelfAddress=false;
    this.busOwnPerTemplate=true;
    this.verifiedListTemp=false
    this.shareholderTemp=false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;


   }
   submitPersonalDetails(formData:any){
    formData.percentage=null;
    // formData.business_id= this.business_Id;
    this.homeService.submitPersonalDetails(formData).subscribe(res=>{
      if(res['status']==0){
        if(res['data']['status']==0){
         // this.addr_applicant_id=res.applicantId;
         // this.alert.success(res['data']['message']);
          this.busOwnPerTemplate=false;
          this.busSelfAddress=true;
          this.kycTemplate=false;
        }
        else if(res['data']['status']==1){
          this.alert.error(res['data']['message']);
        }
      }
      else{
        this.alert.error(res['message'])
      }
    })
   }



  addBusType(id,rangeofservice){

    this.transcationinfo=false;
    this.businessSectorId=id;
    this.range_of_service=rangeofservice;


    this.typesOfBus=false;
    this.isBusList=true;
    this.confmDirector=false;
    this.receivePayTempl=false;
    this.sendPayTempl=false;
    this.verifyIdenTemp=false;
    this.Invitaiontemplate=false;
    this.busOwnPerTemplate=false;
    this.busSelfAddress=false;
    this.verifiedListTemp=false
    this.shareholderTemp=false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;


    this.getBusinessIndustries();
  }

  getSelectedInsd(value,isSelected,index,id){


    this.selectedIndValue=value;
    this.validationIndustries=false;

    if(isSelected){
      this.selectedInsData.push(value);
    }
    else{
    //  var index =  this.selectedInsData.indexOf(value);
      if(index!=-1){
       this.selectedInsData.splice(index, 1);
      }
    }
    this.selectedIndustries = this.selectedInsData.toString();


    // restricted start

    // if(id==1)
    // {
    // this.restricted.push(id);
    // }

  }
  checkOpt(value){
    this.optionvalid=false;
    if(value=='no'){
      this.restricted_businessValue=0;
    }
    else if(value=='yes'){
      this.restricted_businessValue=1;
    }
  }
  optionCheck(){

    if(this.restricted_businessValue==0){
    var websitesArray=[];
    var websites;

    for(var i=0;i<this.fieldArray.length;i++){
      var websiteName=[this.fieldArray[i].name];
      websitesArray.push(websiteName);
      websites = websitesArray.toString();
    }
    //this.busTypesFormData.business_sector_id=this.businessSectorId;
    this.busTypesFormData.website=websites;
    this.busTypesFormData.restricted_business= this.restricted_businessValue;
    this.busTypesFormData.range_of_service=this.range_of_service;
    this.busTypesFormData.business_sector=this.businessSectorId;
    this.busTypesFormData.selected_industries=null

      this.homeService.submitBusTypes(this.busTypesFormData).subscribe(res => {
      if(res['status']==0){
      if(res['data']['restricted']==0){
      //this.alert.success(res['data']['message']);
      this.isBusList=false;
      this.transcationinfo=true;
      this.confmDirector=false;
      this.receivePayTempl=false;
      this.sendPayTempl=false;
      this.verifyIdenTemp=false;
      this.Invitaiontemplate=false;
      this.busOwnPerTemplate=false;
      this.busSelfAddress=false;
      this.verifiedListTemp=false
      this.shareholderTemp=false;
      this.kycTemplate=false;
      this.directorDetailsTemplate=false;
      this.utltimateOwner=false;
      this.applybusiness=false;
      this.selectedInsData=[];
      this.getTrnsInfo()
      }
      if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      }
      else if(res['data']['restricted']==1){
      this.alert.error(res['data']['message']);
      }}
      else if(res['status']==1){
      this.alert.error(res['message']);
      }
    });
    }

    else if(this.restricted_businessValue==1){
      this.applybusiness=true;
      this.isBusList=false;
    }

  }


  submitBusTypes(){
    var websitesArray=[];
    var websites;
    for(var i=0;i<this.fieldArray.length;i++){
      var websiteName=[this.fieldArray[i].name];
      websitesArray.push(websiteName);
      websites = websitesArray.toString();
    }
    //this.busTypesFormData.business_sector_id=this.businessSectorId;
    this.busTypesFormData.website=websites;
    this.busTypesFormData.restricted_business=this.restricted_businessValue;
    this.busTypesFormData.range_of_service=this.range_of_service;
    this.busTypesFormData.business_sector=this.businessSectorId;
    this.busTypesFormData.selected_industries=this.selectedIndustries;
    this.homeService.submitBusTypes(this.busTypesFormData).subscribe(res => {
      if(res['status']==0){
      if(res['data']['restricted']==1){
        this.blockindustries=true
        this.applybusiness=false;
        this.industryStatus();
      }
      if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      }
      else if(res['data']['restricted']==0){
       // this.alert.success(res['data']['message']);
        this.isBusList=false;
        this.transcationinfo=true;
        this.confmDirector=false;
        this.receivePayTempl=false;
        this.sendPayTempl=false;
        this.verifyIdenTemp=false;
        this.Invitaiontemplate=false;
        this.busOwnPerTemplate=false;
        this.busSelfAddress=false;
        this.verifiedListTemp=false
        this.shareholderTemp=false;
        this.kycTemplate=false;
        this.directorDetailsTemplate=false;
        this.utltimateOwner=false;
        this.applybusiness=false;
        this.selectedInsData=[];
         this.getTrnsInfo()
      }
    }
    else if(res['status']==1){
      this.alert.error(res['message']);
    }
    });

  }
  getTrnsInfo(){
  this.MnthVolTransData=['1 000 - 10 000','10 000 - 100 000','100 000 - 1 000 000','1 000 000+'];
  this.PayntPerMonth=['<10','<50','<100','>100'];
  }
  getBusSectorTypes(){
    this.homeService.getBusSectorTypes().subscribe(res => {
      if(res['status']==0){
        if(res['data']['status']==0){
          this.businessSectorData=res['data']['Type Of Sector']
        } else if(res['data']['status']==1){
          this.alert.error(res['data']['message'])
        }
      }
      else{
        this.alert.error(res['message'])
      }
    });
  }
  mnthlyTrnsAmt(value){
   if(value=='1 000 - 10 000'){
    this.monthlyTrsnAmt=10000;
    this.max_value_of_payment=this.monthlyTrsnAmt/this.pyntpermonth;
     if(isNaN(this.max_value_of_payment)){
      this.max_value_of_payment='';
     }
   }
   else if(value=='10 000 - 100 000'){
    this.monthlyTrsnAmt=100000;
    this.max_value_of_payment=this.monthlyTrsnAmt/this.pyntpermonth;
    if(isNaN(this.max_value_of_payment)){
      this.max_value_of_payment='';
     }
   }
   else if(value=='100 000 - 1 000 000'){
    this.monthlyTrsnAmt=1000000;
    this.max_value_of_payment=this.monthlyTrsnAmt/this.pyntpermonth;
    if(isNaN(this.max_value_of_payment)){
      this.max_value_of_payment='';
     }
   }
   else if(value=='1 000 000+'){
    this.monthlyTrsnAmt=1000000;
    this.max_value_of_payment=this.monthlyTrsnAmt/this.pyntpermonth;
    if(isNaN(this.max_value_of_payment)){
      this.max_value_of_payment='';
     }
   }
  }
  getPaymtPerMonth(value){
  if(value.charAt(0) === '>'||value.charAt(0) === '<'){
   this.pyntpermonth = value.slice(1);
   this.max_value_of_payment=this.monthlyTrsnAmt/this.pyntpermonth;
   if(isNaN(this.max_value_of_payment)){
    this.max_value_of_payment='';
   }
  }}
  transcationVolume(){
    var formData={monthy_transfer_amount:this.monthlyTrsnAmt,no_payments_per_month:this.no_payments_per_month,max_value_of_payment:this.max_value_of_payment}
    this.homeService.transcationVolume(formData).subscribe(res => {
     if(res['status']==0){
     if(res['data']['status']==0){
       //this.alert.success(res['data']['message']);
       this.receivePayTempl=true;
       this.transcationinfo=false;
       this.sendPayTempl=false;
       this.verifyIdenTemp=false;
       this.Invitaiontemplate=false;
       this.busOwnPerTemplate=false;
       this.busSelfAddress=false;
       this.verifiedListTemp=false
       this.shareholderTemp=false;
       this.kycTemplate=false;
       this.updateContactDetails=false;
       this.utltimateOwner=false;
       this.directorDetailsTemplate=false;
     }
     else if(res['data']['status']==1){
       this.alert.error(res['data']['message']);
       this.receivePayTempl=false;
       this.transcationinfo=true;
       this.sendPayTempl=false;
       this.verifyIdenTemp=false;
       this.Invitaiontemplate=false;
       this.busOwnPerTemplate=false;
       this.busSelfAddress=false;
       this.verifiedListTemp=false
       this.shareholderTemp=false;
       this.kycTemplate=false;
       this.updateContactDetails=false;
       this.directorDetailsTemplate=false;
       this.utltimateOwner=false;
     }
    } else if (res['status']==1){
      this.alert.error(res['message']);
    }
    });
  }
  businessAddress(){
    this.kycTemplateShare=false;
    this.updateContactAddress=false;
    this.busAddrForm.reset();
    this.updateContactForm.reset();
    this.operatingAddrForm.reset();
    this.loadContent=false;
    this.transcationinfo=false;
    this.receivePayTempl=false;
    this.typesOfBus=false;
    this.isBusList=false
    this.busAddrTemp=true;
    this.operatingAddrTemp=false;
    this.typesOfBus=false;
    this.confmDirector=false;
    this.sendPayTempl=false;
    this.verifyIdenTemp=false;
    this.Invitaiontemplate=false;
    this.busOwnPerTemplate=false;
    this.busSelfAddress=false;
    this.verifiedListTemp=false
    this.shareholderTemp=false;
    this.supportDocument = false;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.isBusList=false;
    this.applybusiness=false;
    this.blockindustries=false;
    this.countrieserror=false;
    this.sendcompanies=false;

    //country details pre populated

    this.busAddrForm.get('country_id').setValue(this.country_incorporation);

    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;



  }


  getCountryDetails() {
    this.indexService.getCountryDetails().subscribe(res => {
      if(res['status']==0){
        this.countryData = res['data']['country list'];
      }
      else{
        this.alert.error(res['message'])
      }
    });
  }

  submitBusAddr(formData:any){
    formData.address_type_id=2,
    this.homeService.submitAddr(formData).subscribe(res => {
      if(res['status']==0){
      if(res['data']['status']==0){
        this.busAddrTemp=false;
        this.operatingAddrTemp=true;
        this.receivePayTempl=false;
        this.sendPayTempl=false;
        this.confmDirector=false;
        this.sbmtOperBtn=false;
        this.verifyIdenTemp=false;
        this.Invitaiontemplate=false;
        this.busOwnPerTemplate=false;
        this.busSelfAddress=false;
        this.verifiedListTemp=false
        this.shareholderTemp=false;
        this.kycTemplate=false;
        this.updateContactDetails=false;
        this.utltimateOwner=false;
        this.directorDetailsTemplate=false;
      }
      else if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      }
    }
    else{
      this.alert.error(res['message'])
    }
    });
  }
  submitPersonalAddr(formData:any){
    // formData.applicant_id=this.addr_applicant_id;
     formData.address_type_id=1;

    this.homeService.submitAddr(formData).subscribe(res => {
      if(res['status']==0){
      if(res['data']['status']==0){
        //this.alert.success(res['data']['message']);
        this.busSelfAddress=false;
      //  this.storeAppIdforKYC();
        this.IsVerifiedDirOwnr();
      }
      else if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      }
    }
    else{
      this.alert.error(res['message'])
    }
    });
  }
  // storeAppIdforKYC(){
  //   // var obj={
  //   //   applicant_id:this.addr_applicant_id
  //   // }
  //   this.homeService.storeAppIdforKYC().subscribe(res => {
  //     if(res['status']==0){
  //     if(res['data']['status']==0){
  //       if(this.isKyc==true){
  //         this.verifiedListTemp=false;
  //         this.kycTemplateShare=true;
  //        this.submitForShareHolderIdentId();
  //       }
  //       else{
  //         this.verifiedListTemp=true;
  //         this.kycTemplateShare=false;
  //         this.alert.error(res['data']['message']);
  //       }
  //     }
  //     else if(res['data']['status']==1){
  //       this.alert.success(res['data']['message']);
  //     }
  //   }
  //   else{
  //     this.alert.error(res['message'])
  //   }
  //   });
  // }
  submitForShareHolderIdentId(){
    this.homeService.Bus_SubmitForKYC(this.addr_applicant_id).subscribe(res=>{
      if(res.status==1){
        this.SharidentId=res['data']['id'];
      }
      else{
        this.alert.error(res['message']);
      }
    })
  }

  IsVerifiedDirOwnr(){
    var obj={
      "kyb_bisiness_owner_id":this.business_owner_id,
      "status":true
    }
    this.homeService.IsVerifiedDirOwnr(obj).subscribe(response => {
        if(response.status==1){
          // this.getAllList(this.business_Id,'all');
        }
        else{
          this.alert.error('status not updated');
        }
    });
  }
  selectedDirtitem={first_name:'',last_name:'',email:''}
  getCurrntDir(item){
    var nameArr = item.name.split(',');
    this.first_name=nameArr[0];
    this.last_name=nameArr[1];
    this.selectedDirtitem={first_name:this.first_name,last_name:this.last_name,email:item.email}
  }
  moveToShareHolder(){
    this.shareholderTemp=true;
    this.confmDirector=false;
    this.getShareHoldersOwners()

  }
  addShrHoldrFieldValue(index){
       this.type='businessowner'
      this.utltimateOwner=true;
      this.shareholderTemp=false;
    }
  delShrHoldrFieldValue(index) {
      this.shareHolderData=[];
       this.ultimateOwnForm.reset();
        this.utltimateOwner=false;
        this.shareholderTemp=true;
       this.getShareHoldersOwners();
  }
  getShareHoldersOwners(){
    this.shareHoldertable=true;
      this.homeService.getAllList('all').subscribe(res => {
        if(res['status']==0){
        if(res['data']['status']==0){
          this.ownerShareholderList=res['data']['ownerList']
        }
        else if(res['data']['status']==1){
           this.alert.error(res['data']['message'])
        }
      }
      else{
        this.alert.error(res['message'])
      }

      })
  }
  dobValidation($event){
    var dt = new Date();
    var yr= dt.getFullYear();
     var selectedYr = $event.target.value;
     if(selectedYr<=this.maxDOB){
        this.validDOB=false;
     }
     else{
      this.validDOB=true;
     }
  }
  submitSharedHolder(formData:any){
    formData.status=false;
    formData.dob=null
    this.shareHolderData.push(formData)
    var obj= {list:this.shareHolderData}
   this.homeService.addDirShrHolder(obj).subscribe(res=>{
     if(res['status']==0){
     if(res['data']['status']==0){
      // this.alert.success(res['data']['message']);
       this.shareHolderData=[];
       this.ultimateOwnForm.reset();
       this.getDirectors();
       this.getShareHoldersOwners();
       this.delShrHoldrFieldValue(0)
       this.getShareHoldersOwners();
     }
     else if(res['data']['status']==1){
      this.shareHolderData=[];
      this.ultimateOwnForm.reset();
       this.alert.error(res['data']['message']);
     }
    }
    else{
      this.alert.error(res['message'])
    }

   })
   this.shareHolderData=[];
 }
 verifyIdentity(){
   this.smslinkBox1=true;
   this.verifyIdenTemp=true;
   this.shareholderTemp=false;
   this.kycTemplate=false;
   this.getAllList('all');
 }
 //update owner status
 getAllList(type){
  this.homeService.getAllList(type).subscribe(res => {
    if(res['status']==0){
      if(res['data']['status']==0){
        this.arrayList=res['data']['ownerList'];
        if(_.size(res['data']['ownerList']["directors"]) == _.size(_.filter(res['data']['ownerList']["directors"], {status:1}))  && _.size(res['data']['ownerList']["businessowner"]) == _.size(_.filter(res['data']['ownerList']["businessowner"], {status:1})) && _.size(res['data']['ownerList']["shareholder"]) == _.size(_.filter(res['data']['ownerList']["shareholder"], {status:1}))){
         this.getUpdatedStatus("business_owner_details", 2)
         this.verifyAllbtn=true;
        }
      }
      else if(res['data']['status']==1){
        this.alert.error(res['data']['message'])
      }

        }
        else{
        this.alert.error(res['messsage'])
        }
  })

}


deleteOwner(id,type){
  this.homeService.deleteOwner(id,type).subscribe(res=>{
            this.getDirectors();
            this.getShareHoldersOwners();
  })
}
  submitOperatingAddr(formData:any){
    formData.address_type_id=3;
    this.homeService.submitAddr(formData).subscribe(res => {
      if(res['status']==0){
      if(res['data']['status']==0){
        this.loadContent=true;
        this.operatingAddrTemp=false;
        this.kycTemplate=false;
        //this.alert.success(res['data']['message']);
        this.insertKYB();
        this.getUpdatedStatus('business_address',2);
      }
      else if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      }
    }
    else{
      this.alert.error(res['message'])
    }
    });
  }


  setBusAddr(value){
    if(value.currentTarget.checked==true){
      this.sbmtOperBtn=false;
      this.operatingAddrForm.patchValue({
         country_id:this.busAddrForm.get('country_id').value,
         postal_code:this.busAddrForm.get('postal_code').value,
         city:this.busAddrForm.get('city').value,
         address_line1:this.busAddrForm.get('address_line1').value,
         address_line2:this.busAddrForm.get('address_line2').value,
         region:this.busAddrForm.get('region').value,
         });
    }
    else if(value.currentTarget.checked==false){
      this.operatingAddrForm.reset();
      this.sbmtOperBtn=true;
    }
  }
  confirmDirector(){
    this.smslinkBox1=true;
    this.kycTemplateShare=false;
    this.updateContactAddress=false;
    this.busOwnerForm.reset();
    this.personalAddress.reset();
    this.addDirectorForm.reset();
    this.ultimateOwnForm.reset();
    this.dirlistTemplate=false;
    this.loadContent=false;
    this.confmDirector=true;
    this.transcationinfo=false;
    this.typesOfBus=false;
    this.isBusList=false
    this.busAddrTemp=false;
    this.operatingAddrTemp=false;
    this.typesOfBus=false;
    this.receivePayTempl=false;
    this.sendPayTempl=false;
    this.verifyIdenTemp=false;
    this.Invitaiontemplate=false;
    this.busOwnPerTemplate=false;
    this.busSelfAddress=false;
    this.verifiedListTemp=false;
    this.shareholderTemp=false;
    this.supportDocument = false;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.kycTemplate=false;
    this.utltimateOwner=false;
    this.isBusList=false;
    this.applybusiness=false;
    this.blockindustries=false;
    this.countrieserror=false;
    this.sendcompanies=false;
    this.getDirectors();
  }
  insertKYB(){
    this.homeService.insertKYB().subscribe(res => {
      if(res['status']==0){
        if(res['data']['status']==0){
          this.getKYBStatus();
        }
        else if(res['data']['status']==1){
           //this.alert.error(res['data']['message'])
        }
      }
      else{
        this.alert.error(res['message'])
      }
    });
  }
  getUpdatedStatus(col,status){
   let obj={
      "column" : col,
      "status":status
    }
    this.homeService.getUpdatedStatus(obj).subscribe(res => {
      if(res['status']==0){
         if(res['data']['status']==0){
          this.getKYBStatus();
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
  getBusinessIndustries(){
    this.homeService.getBusinessIndustries().subscribe(res => {
    if(res['status']==0){
    this.insdustriesData=res['data']['Type Of Industries'];
    }
    else if(res['stauts']==1){
      this.alert.error(res['message']);
    }
    });
  }

  /* supporting documentation start */

  //  reg address start


  handleFileSelect(evt) {

    var files = evt.target.files;
    var file = files[0];
    var string = evt.target.files[0].type;
    var file_upload = string.slice(6).toUpperCase();

    this.myObject['file_type'] = file_upload;

    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }

  }


  _handleReaderLoaded(readerEvt) {

    var binaryString = readerEvt.target.result;
    var base64textString = btoa(binaryString);
    this.myObject['file_content'] = base64textString;
    this.fileupload = true;
    this.activeclick = true;

  }


  uploadAddressDocument() {
    this.myObject['file_name'] = "REGISTERED_ADDRESS";
    this.homeService.sendRegisterdAddressDocument(this.myObject).subscribe(res => {
      if(res['status']==0){
      if(res['data']['status'] == 1) {
        this.alert.error('Uploading failed');
      } else if (res['data']['status'] == 0) {
        this.supportDocument = true;
        this.suppDocumRegistered = false;
        this.getRegisterdAddressDocument();
      }
      } else if(res['status']==1){
      this.alert.error(res['message']);
    }
    });
    this.fileupload = false;
  }


  getRegisterdAddressDocument() {
    var checkfiletype: any;
    this.homeService.getRegisterdAddressDocument().subscribe(res => {
      if (res['status'] == 0) {
        if(res['data']['status']==0){
        for (let i = 0; i < res['data']['documents'].length; i++) {
          if (res['data']['documents'][i].kyb_doc_type == 'BUSINESS_ADDRESS') {
            this.photoimage = res['data']['documents'][i]['kyb_doc_base64'];
            checkfiletype = res['data']['documents'][i]['kyb_doc_file_type'];
          }
        }
        if (checkfiletype) {
          this.registeredcheckimage = true;
          this.registeredcheckfile = false;
        } else {
          this.registeredcheckimage = false;
          this.registeredcheckfile = true;
        }
       } else if(res['data']['status']==1){
         //this.alert.success(res['message']);
      }
     }
      else if(res['status'] == 1){
        this.alert.error(res['message']);
      }
    });
  }

  getRegisterdAddress() {
    this.homeService.getRegisterdDetails().subscribe(res => {
      if(res['status']==0){
      if (res['data']['status'] == 0) {
        for (let i = 0; i < res['data']['addressDetails'].length; i++) {
          if (res['data']['addressDetails'][i].address_type == "PERSONAL_ADDRESS") {
            this.responsedata = res['data']['addressDetails'][i];
          }
        }
      } else if(res['data']['status']==1){
        this.alert.error(res['message']);
      }
     } else if(res['status']==1){
       this.alert.error(res['message'])
     }
    });
  }

  // reg address end


  //proof of operating start


  handleFileSelects(evt) {

    var files = evt.target.files;
    var file = files[0];
    var string = evt.target.files[0].type;
    var file_upload = string.slice(6).toUpperCase(); //changed


    this.operatingObject['file_type'] = file_upload;

    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoadeds.bind(this);
      reader.readAsBinaryString(file);
    }

  }

  _handleReaderLoadeds(readerEvt) {

    var binaryString = readerEvt.target.result;
    var base64textString = btoa(binaryString);
    this.operatingObject['file_content'] = base64textString;
    this.fileupload = true;
    this.activeClickOperating=true;
  }

  uploadOperatingDocument() {
    this.operatingObject['file_name'] = "OPERATING_ADDRESS";
    this.homeService.sendRegisterdAddressDocument(this.operatingObject).subscribe(res => {
      if(res['status']==0){
      if (res['data']['status'] == 1) {
        this.alert.error('Uploading failed');
      } else if (res['data']['status'] == 0) {
        this.supportDocument = true;
        this.proofofOperating = false;
        this.getOperatingDocumets();
      }
      } else if (res['status']==1){
        this.alert.error(res['message']);
      }
    });
    this.fileupload = false;
  }

  getOperatingDocumets() {
    let requestobj = {};
    var operatingCheckFile: any;
    this.homeService.getRegisterdAddressDocument().subscribe(response => {
    if (response['status'] == 1){
    for (let i = 0; i < response['data'].length; i++){
    if (response['data'][i].kyb_doc_type == 'OPERATING_ADDRESS') {
         this.opertingPhotoImage = response['data'][i]['kyb_doc_base64'];
         operatingCheckFile = response['data'][i]['kyb_doc_file_type'];
    }
    }
    if (operatingCheckFile)
    {
       this.operatingcheckimage = true;
       this.operatingcheckfile = false;
    }
    else
    {
       this.operatingcheckimage = false;
       this.operatingcheckfile = true;
    }
    }
    });
  }

  getOperatingAddress() {
    this.homeService.getRegisterdDetails().subscribe(res => {
    if (res['status'] == 0) {
      if(res['data']['status']==0){
        for (let i = 0; i < res['data']['addressDetails'].length; i++) {
          if (res['data']['addressDetails'][i].address_type == 'OPERATING_ADDRESS') {
            this.responseDataOperting = res['data']['addressDetails'][i];
          }
        }
      } else if(res['data']['status']==1){
        this.alert.error(res['message']);
      }
      } else if (res['status'] == 1){
        this.alert.error(res['message']);
      }

    })
  }
  SetCountryKYBDetails(obj){
       this.personalAddress1.patchValue({
              'country_id': obj,
            });
   }
   //submit for kyc
   Bus_SubmitForKYC(){
     this.kycTemplateShare=false;
    this.operatingAddrForm.reset();
    this.personalAddress1.reset();
    this.busAddrForm.reset();
    this.updateContactForm.reset();
    this.contact_mobile=this.profileData['data']['userInfo']['mobile'];
    var country_id=this.profileData['data']['userInfo']['country_id'];
      for(var i=0;i<this.countryData.length;i++){
            if(country_id==this.countryData[i]['country_id']){
              this.updateContactForm.patchValue({
                calling_code:this.countryData[i]['calling_code']
              })
            }
      }

     this.updateContactAddress=false;
    this.contact_mobile=this.profileData['data']['userInfo']['phone'];
    this.contact_email=this.profileData['data']['userInfo']['email'];
    this.updateContactForm.patchValue({
      'mobile': this.contact_mobile,
      'email': this.contact_email,
    })


    this.updateContactDetails=true;
    this.identLoader=true;
    this.kycTemplate=false;
    this.loadContent=false;
    this.confmDirector=false;
    this.transcationinfo=false;
    this.typesOfBus=false;
    this.isBusList=false
    this.busAddrTemp=false;
    this.operatingAddrTemp=false;
    this.typesOfBus=false;
    this.receivePayTempl=false;
    this.sendPayTempl=false;
    this.verifyIdenTemp=false;
    this.Invitaiontemplate=false;
    this.busOwnPerTemplate=false;
    this.busSelfAddress=false;
    this.verifiedListTemp=false;
    this.shareholderTemp=false;
    this.supportDocument = false;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;
    this.isBusList=false;
    this.applybusiness=false;
    this.blockindustries=false;
    this.countrieserror=false;
    this.sendcompanies=false;

    this.SetCountryKYBDetails(country_id)


  }
  updateAddrDetails(formData:any){
    delete formData["calling_code"];
    this.homeService.updateContact(formData).subscribe(res=>{
      if(res['status']==0){
      if(res['data']['status']==0){
        this.personalAddress.reset();
        //this.alert.success(res['data']['message']);
         this.updateContactAddress=true;
        this.updateContactDetails=false
      }
      else if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      }
    }
    else{
      this.alert.error(res['message'])
    }
    })
  }
  submitAddr(formData:any){
    formData.address_type_id=1;
    this.homeService.submitAddr(formData).subscribe(res => {
      if(res['status']==0){
      if(res['data']['status']==0){
         // this.alert.success(res['data']['message']);
          this.kycTemplate=true;
          this.updateContactAddress=false;
          this.submitForIdentId()
      }
      else if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      }
    }
    else{
      this.alert.error(res['message'])
    }
    });
  }

  submitForIdentId(){
    this.homeService.SubmitForKYC(null).subscribe(res=>{
      if(res['status']==0){
      if(res['data']['status']==0){
        this.identLoader=false;
        this.identId=res['data']['id'];
        this.getUpdatedStatus('personal_profile',2);
      }
      else if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      }
    }
    else{
      this.alert.error(res['message'])
    }
    })
  }
  KYClinkToMobile(mobilePlatform){
    this.homeService.KYClinkToMobile(this.mobile,this.email,mobilePlatform,this.identId).subscribe(res=>{
    if(res['status']==1){
      this.smslinkBox=false;
    }
    })

  }
  ShareHoldKYClinkToMobile(mobilePlatform){
    this.updateContactDetails=false
    this.updateContactAddress=false;

    this.homeService.KYClinkToMobile(this.mobile,this.email,mobilePlatform,this.identId).subscribe(res=>{
    if(res['status']==1){
      this.smslinkBox1=false;
      this.verifiedListTemp=true;
      this.kycTemplateShare=false;
    }
    })

  }



  // proof of operating end


  //proof of shareholder start


  handleFileSelectshare(evt) {

    var files = evt.target.files;
    var file = files[0];
    var string = evt.target.files[0].type;
    var file_upload = string.slice(6).toUpperCase();

    this.shareholderObject['file_type'] = file_upload;

    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoadedshare.bind(this);
      reader.readAsBinaryString(file);
    }

  }

  _handleReaderLoadedshare(readerEvt) {

    var binaryString = readerEvt.target.result;
    var base64textString = btoa(binaryString);
    this.shareholderObject['file_content'] = base64textString;
    this.fileupload = true;
    this.activeClickShareHolder=true;
  }

  uploadShareDocument() {
    this.shareholderObject['file_name'] = "SHAREHOLDER_DETAILS";
    this.homeService.sendRegisterdAddressDocument(this.shareholderObject).subscribe(res => {
      if(res['status']==0){
        if(res['data']['status'] == 1) {
        this.alert.error('Uploading failed');
       }
       else if(res['data']['status'] == 0) {
        this.supportDocument = true;
        this.proofOfShareHolder = false;
        this.getshareholderDocumets();
       }
     } else if(res['status']==1){
      this.alert.error(res['message']);
     }
    });
    this.fileupload = false;
  }

  getshareholderDocumets() {
    let requestobj = {};
    requestobj['business_id'] = this.business_Id;
    var shareHolderFile: any;
    this.homeService.getRegisterdAddressDocument().subscribe(response => {
    if (response['status'] == 1){
      for (let i = 0; i < response['data'].length; i++){
      if (response['data'][i].kyb_doc_type == 'SHAREHOLDER_DETAILS')
      {
            this.shareholder = response['data'][i]['kyb_doc_base64'];
            shareHolderFile = response['data'][i]['kyb_doc_file_type'];
      }
      }
      if (shareHolderFile)
      {
           this.sharefolderchceckimage = true;
           this.sharefoldercheckfile = false;
      }
      else
      {
           this.sharefoldercheckfile=true;
           this.sharefolderchceckimage=false;
      }
      }

    });
  }
  getdoumentImg(doc_type){
    this.homeService.getDocStatus().subscribe(res=>{
      if(res['status']==0){
      if(res['data']['status']==0){
      for(var i=0;i<=res['data']['documents'].length;i++){
        if(res['data']['documents'][i].kyb_doc_type==doc_type){
          this.imgValue=res['data']['documents'][i]['kyb_doc_base64']
        }
      }}
      else if(res['data']['status']==1){
        this.alert.error(res['message']);
      }
      }
      else if(res['status']==1){
        this.alert.error(res['message']);
      }
    })

  }


  //proof of shareholder end


  //proof of authority start


  handleFileAuthority(evt) {

    var files = evt.target.files;
    var file = files[0];
    var string = evt.target.files[0].type;
    var file_upload = string.slice(6).toUpperCase();

    this.authorityObject['file_type'] = file_upload;

    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderAuthority.bind(this);
      reader.readAsBinaryString(file);
    }

  }

  _handleReaderAuthority(readerEvt) {

    var binaryString = readerEvt.target.result;
    var base64textString = btoa(binaryString);
    this.authorityObject['file_content'] = base64textString;
    this.fileupload = true;
    this.activeClickAuthority = true;

  }

   uploadAuthorityDocument()
   {
    this.authorityObject['file_name'] = "SIGNING_AUTHORITY";
    this.homeService.sendRegisterdAddressDocument(this.authorityObject).subscribe(res => {
    if(res['status']==0){
    if(res['data']['status'] == 1){
        this.alert.error('Uploading failed');
     } else if (res['data']['status'] == 0){
      this.supportDocument = true;
      this.authorityAddress = false;
      this.getsAuthorityDocumets();
    }}
    else if(res['status']==1){
       this.alert.error(res['message']);
    }
    });
    this.fileupload = false;
  }

  getsAuthorityDocumets() {
    let requestobj = {};
    requestobj['business_id'] = this.business_Id;
    var checkAuthorityFile: any;
    this.homeService.getRegisterdAddressDocument().subscribe(response => {
      if (response['status'] == 1){
      for (let i = 0; i < response['data'].length; i++){
      if (response['data'][i].kyb_doc_type == 'SIGNING_AUTHORITY')
      {
          this.authorityPhotoImage = response['data'][i]['kyb_doc_base64'];
          checkAuthorityFile = response['data'][i]['kyb_doc_file_type'];
      }
      }
      if (checkAuthorityFile)
      {
          this.authoritycheckimage = true;
          this.authoritycheckfile = false;
      }
      else
      {
          this.authoritycheckimage = false;
          this.authoritycheckfile = true;
      }
      }
    });
  }
  sendInvitationLink(){
    var obj={
    inviteeEmail:this.SelectedVerifyData.email,
    userEmail:this.profileData.data.userInfo.email,
    platformType:'web',
    kyBusinessId:this.SelectedVerifyData.kyb_bo_id,
    isKyc:this.isKyc
    }
     this.homeService.sendInvitationLink(obj).subscribe(res=>{
       if(res['status']==0){
          if(res['data']['status']==0){
            //this.alert.success(res['data']['message']);
            this.Invitaiontemplate=false;
            this.loadContent=true;
          }
          else if(res['data']['status']==1){
            this.alert.error(res['data']['message']);
          }
        }
        else{
          this.alert.error(res['message'])
        }
     })
  }


  supportingDocument() {

    this.kycTemplateShare=false;
    this.updateContactAddress=false;
    this.blockindustries=false;
    this.homeService.getDocStatus().subscribe(res=>{
    this.docData=res['data']['documents'];

      if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type: "REGISTERED_ADDRESS"}))>0){

    this.activeclick=true;
    this.supportDocBtn=false;
    this.loadContent = false;
    this.transcationinfo = false;
    this.receivePayTempl = false;
    this.typesOfBus = false;
    this.isBusList=false;
    this.applybusiness=false;
    this.blockindustries=false;
    this.countrieserror=false;
    this.sendcompanies=false;
    this.busAddrTemp = false;
    this.operatingAddrTemp = false;
    this.typesOfBus = false;
    this.confmDirector = false;
    this.sendPayTempl = false;
    this.verifyIdenTemp = false;
    this.Invitaiontemplate = false;
    this.busOwnPerTemplate = false;
    this.busSelfAddress = false;
    this.verifiedListTemp = false
    this.shareholderTemp = false;
    this.supportDocument = true;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;
      }
    if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type: "SHAREHOLDER_DETAILS"}))>0){
      this.activeClickShareHolder=true;
      this.supportDocBtn=false;
      this.loadContent = false;
    this.transcationinfo = false;
    this.receivePayTempl = false;
    this.typesOfBus = false;
    this.isBusList = false;
    this.busAddrTemp = false;
    this.applybusiness=false;
    this.blockindustries=false;
    this.countrieserror=false;
    this.sendcompanies=false;
    this.operatingAddrTemp = false;
    this.typesOfBus = false;
    this.confmDirector = false;
    this.sendPayTempl = false;
    this.verifyIdenTemp = false;
    this.Invitaiontemplate = false;
    this.busOwnPerTemplate = false;
    this.busSelfAddress = false;
    this.verifiedListTemp = false
    this.shareholderTemp = false;
    this.supportDocument = true;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;
    }
    if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type: "OPERATING_ADDRESS"}))>0){
      this.activeClickOperating=true;
      this.supportDocBtn=false;
      this.loadContent = false;
    this.transcationinfo = false;
    this.receivePayTempl = false;
    this.typesOfBus = false;
    this.busAddrTemp = false;
    this.isBusList=false;
    this.applybusiness=false;
    this.blockindustries=false;
    this.countrieserror=false;
    this.sendcompanies=false;
    this.operatingAddrTemp = false;
    this.typesOfBus = false;
    this.confmDirector = false;
    this.sendPayTempl = false;
    this.verifyIdenTemp = false;
    this.Invitaiontemplate = false;
    this.busOwnPerTemplate = false;
    this.busSelfAddress = false;
    this.verifiedListTemp = false
    this.shareholderTemp = false;
    this.supportDocument = true;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;
    }
    if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type: "OPERATINGADDRESS"}))>0){
      this.activeClickOperating=true;
      this.loadContent = false;
      this.supportDocBtn=false;
    this.transcationinfo = false;
    this.receivePayTempl = false;
    this.typesOfBus = false;
    this.isBusList=false;
    this.applybusiness=false;
    this.blockindustries=false;
    this.countrieserror=false;
    this.sendcompanies=false;
    this.busAddrTemp = false;
    this.operatingAddrTemp = false;
    this.typesOfBus = false;
    this.confmDirector = false;
    this.sendPayTempl = false;
    this.verifyIdenTemp = false;
    this.Invitaiontemplate = false;
    this.busOwnPerTemplate = false;
    this.busSelfAddress = false;
    this.verifiedListTemp = false
    this.shareholderTemp = false;
    this.supportDocument = true;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;
    }
    if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type:"SIGNING_AUTHORITY"}))>0){
    this.activeClickAuthority=true;
    this.supportDocBtn=false;
    this.loadContent = false;
    this.transcationinfo = false;
    this.receivePayTempl = false;
    this.typesOfBus = false;
     this.isBusList=false;
    this.applybusiness=false;
    this.blockindustries=false;
    this.countrieserror=false;
    this.sendcompanies=false;
    this.busAddrTemp = false;
    this.operatingAddrTemp = false;
    this.typesOfBus = false;
    this.confmDirector = false;
    this.sendPayTempl = false;
    this.verifyIdenTemp = false;
    this.Invitaiontemplate = false;
    this.busOwnPerTemplate = false;
    this.busSelfAddress = false;
    this.verifiedListTemp = false
    this.shareholderTemp = false;
    this.supportDocument = true;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;
    }
       else{
        this.supportDocBtn=true;
        this.loadContent = false;
        this.transcationinfo = false;
        this.receivePayTempl = false;
        this.typesOfBus = false;
        this.isBusList = false
        this.busAddrTemp = false;
        this.operatingAddrTemp = false;
        this.typesOfBus = false;
        this.confmDirector = false;
        this.sendPayTempl = false;
        this.verifyIdenTemp = false;
        this.Invitaiontemplate = false;
        this.busOwnPerTemplate = false;
        this.blockindustries=false;
        this.busSelfAddress = false;
        this.verifiedListTemp = false
        this.shareholderTemp = false;
        this.supportDocument = true;
        this.suppDocumRegistered = false;
        this.proofofOperating = false;
        this.proofOfShareHolder = false;
        this.authorityAddress = false;
        this.kycTemplate=false;
        this.updateContactDetails=false;
        this.directorDetailsTemplate=false;
        this.utltimateOwner=false;
        this.applybusiness=false;
       }

    })

  }


  registeredAddress() {
    if(this.KYBStatus.business_address==1 || this.KYBStatus.business_address==2){
      this.getRegisterdAddress();
      this.supportDocument = false;
      this.suppDocumRegistered = true;
      this.proofofOperating = false;
      this.proofOfShareHolder = false;
      this.authorityAddress = false;
      this.kycTemplate=false;
      this.updateContactDetails=false;
      this.directorDetailsTemplate=false;
      this.utltimateOwner=false;
    }
     else{
       this.alert.warn('Please, Submit or Verify your business address');
     }
  }

  proofOfOperatingAdd() {
    if(this.KYBStatus.business_address==1 || this.KYBStatus.business_address==2){
      this.getOperatingAddress();
      this.supportDocument = false;
      this.suppDocumRegistered = false;
      this.proofofOperating = true;
      this.proofOfShareHolder = false;
      this.authorityAddress = false;
      this.kycTemplate=false;
      this.updateContactDetails=false;
      this.directorDetailsTemplate=false;
      this.utltimateOwner=false;
    }
    else{
      this.alert.warn('Please, Submit or Verify your business address');
    }
  }

  proofOfShareAdd() {
    this.supportDocument = false;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = true;
    this.authorityAddress = false;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;
  }

  proofOfOpenAcc()
  {
    this.supportDocument = false;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = true;
    this.kycTemplate=false;
    this.updateContactDetails=false;
    this.directorDetailsTemplate=false;
    this.utltimateOwner=false;
  }
  SetCountry(){
    this.selectedCountryId=this.busOwnerForm.get('calling_code').value;
    for(var i=0;i<=this.countryData.length;i++){
          if(this.selectedCountryId==this.countryData[i].calling_code){
            this.personalAddress.patchValue({
              'country_id':  this.countryData[i].country_id,
            });
          }
    }
   }
   SetCountryKYB(){
    this.selectedCountryId=this.updateContactForm.get('calling_code').value;
    for(var i=0;i<=this.countryData.length;i++){
          if(this.selectedCountryId==this.countryData[i].calling_code){
            this.personalAddress1.patchValue({
              'country_id':  this.countryData[i].country_id,
            });
          }
    }
   }

  /* supporting document end */

  // postal code start


  ValidatePostal(control:AbstractControl) {
    let postalValue = control.value;
    if(postalValue == null) return null;

    let regex = new RegExp(/^[A-Za-z0-9- ]+$/);
    if (!regex.test(postalValue)) {
      return { invalidPostal: true };
    }
    else{
    let  onlyNumeric = /^(?=.*[0-9- ])/;
      if(!postalValue.match(onlyNumeric)){
        return { invalidPostal: true };
      }
    }
    return null;
  }


  // postal code end

  busOwnerForm:FormGroup;
  personalAddress:FormGroup;
  personalAddress1:FormGroup;
  ngOnInit() {

    this.updateContactForm=this.fb.group({
      first_name: [ "", Validators.compose([Validators.required,Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: [ "", Validators.compose([Validators.required,Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      dob: ["",Validators.required],
      mobile: ["",Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    //  email: ["",Validators.compose([ Validators.required,Validators.pattern("[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}")])],
      email: ["",Validators.compose([Validators.required,Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      gender: ['', Validators.required],
      middle_name:[''],
      telephone:[null],
      calling_code: ['', Validators.required],
    })

    this.busAddrForm=this.fb.group({
    'country_id':['',Validators.required],
    'postal_code':['',Validators.compose([Validators.required,this.ValidatePostal, Validators.pattern("^[a-zA-Z0-9- ]+$")])],
    'city':['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z- ']+$")])],
    'address_line1':['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9', -]+$")])],
    'address_line2':['',Validators.compose([Validators.pattern("^[a-zA-Z0-9' ,-]+$")])],
    'region':['',Validators.compose([Validators.required])],
    })

    this.operatingAddrForm=this.fb.group({
      'country_id':['',Validators.required],
      'postal_code':['',Validators.compose([Validators.required,Validators.min(4),Validators.max(9),this.ValidatePostal])],
      'city':['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z- ']+$")])],
      'address_line1':['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      'address_line2':['',Validators.compose([Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      'region':['',Validators.compose([Validators.required])],
    });

    this.addDirectorForm=this.fb.group({
      first_name: [ "", Validators.compose([Validators.required,Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: [ "", Validators.compose([Validators.required,Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      email: ["",Validators.compose([Validators.required,Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
    })

    this.ultimateOwnForm=this.fb.group({
      type:['',Validators.required],
      first_name: [ "", Validators.compose([Validators.required,Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: [ "", Validators.compose([Validators.required,Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
     email: ["",Validators.compose([Validators.required,Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
     percentage: ["",Validators.compose([Validators.required,Validators.pattern("^[0-9]*$"), Validators.minLength(2),Validators.maxLength(3),Validators.min(25),Validators.max(100)])],

    })

    this.busOwnerForm=this.fb.group({
      first_name: [ "", Validators.compose([Validators.required,Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      last_name: [ "", Validators.compose([Validators.required,Validators.pattern("(?=.*[a-zA-Z-'])(?!.*[0-9])(?!.*[@#$%^&+=:;></?\|.,~{}_]).{1,}")])],
      email: ["",Validators.compose([Validators.required,Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,4}")])],
      mobile: ["",Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      dob: ["",Validators.required],

      business_owner_type: ["",Validators.required],
      gender: ['', Validators.required],
      calling_code: ['', Validators.required],
    })

    this.personalAddress=this.fb.group({
    country_id:['',Validators.required],
    postal_code:['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9- ]+$")])],
    city:['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z- ']+$")])],
    address_line1:['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9', -]+$")])],
    address_line2:['',Validators.compose([Validators.pattern("^[a-zA-Z0-9', -]+$")])],
    region:['',Validators.compose([Validators.required])],
    })

    this.personalAddress1=this.fb.group({
      country_id:['',Validators.required],
      postal_code:['',Validators.compose([Validators.required,Validators.min(4),Validators.max(9),Validators.pattern("^[a-zA-Z0-9- ]+$")])],
      city:['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z- ']+$")])],
      address_line1:['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      address_line2:['',Validators.compose([Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      region:['',Validators.compose([Validators.required])],
      })
  }
}
