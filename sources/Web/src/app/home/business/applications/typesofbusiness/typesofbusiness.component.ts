/**
* Dashboard Component
* KYC status, KYC verification process, user profile
* @package BusdashboardComponent
* @subpackage app\home\personal\business-dashboard\busdashboard.component.html
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { HomeService } from '../../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import * as _ from "lodash";
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { ApplicationsComponent } from '../applications.component';
import { HomeComponent } from 'src/app/home/home.component';
declare var $: any;

@Component({
  selector: 'app-typesofbusiness',
  templateUrl: './typesofbusiness.component.html',
  styleUrls: ['./typesofbusiness.component.scss']
})
export class TypesofbusinessComponent implements OnInit {
   countryData: any;
   profileData: any;
   typesOfBus: boolean = true;
   isBusList: boolean = false;
   specialAttention: boolean = false;
   fieldArray: Array<any> = [{}];
   businessSectorData: any;
   range_of_service: any;
   busTypesFormData: any = {};
   businessSectorId: any;
   transcationinfo: boolean = false;
   MnthVolTransData = [];
   PayntPerMonth = [];
   max_value_of_payment: any;
   no_payments_per_month: any;
   monthlyTrsnAmt: any;
   pyntpermonth: any;
   confmDirector: boolean = false;
   insdustriesData: any;
   selectedInsData: any = [];
   selectedIndustries: any;
   receivePayTempl: boolean = false;
   sendPayTempl: boolean = false;
   countryFieldArray: Array<any> = [{}];
   newCountryAttribute: Array<any> = [{}];
   sendPaycountryFieldArray: Array<any> = [{}];
   business_Id: number;
   selectedIndValue: any;
   selectedCountry: any;
   blockindustries: boolean = false;
   countrieserror: boolean = false;
   sendcountires:boolean=true;
   restricted:boolean=false;
   notrestricted:boolean=false
   erroMessage:boolean=true;
  countrieslist: Array<any> = ["Afghanistan", "Algeria", "Angola", "Belarus", "Bosnia and Herzegovina", "Burkina Faso",
    "Burundi", "Cambodia", "Central African Republic", "Congo",
    "Democratic Republic of the Congo", "Cuba, Côte d\'Ivoire", "Egypt", "Eritrea", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Iran (Islamic Republic of)", "Iraq", "Lao People\'s Democratic Republic",
    "Lebanon", "Liberia", "Libya", "Mozambique", "Myanmar", "Nigeria", "Democratic People\'s Republic of Korea",
    "Pakistan", "State of Palestine", "Panama", "Sierra Leone", "Somalia", "South Sudan", "Sudan, Swaziland",
    "Syrian Arab Republic", "Tajikistan", "Timor-Leste", "Tunisia", "Uganda", "Ukraine", "Vanuatu",
    "Venezuela", "Denmark"];
   sendcompanies: boolean;
   invalidcountries: boolean = true;
   applybusiness: boolean;
   optionvalid: boolean = true;
   validationIndustries: boolean = true;
   industrStatus: any;
   restricted_businessValue: number;
   newAttribute: {};
   sendPayCountryAttribute: any = {};
   sendPaymentErroMessage:boolean=true;
  allcountryData: any=[];
  checkWebsiteURL: boolean = true;

  constructor(private fb: FormBuilder,private homeService: HomeService, private alert: NotificationService,
              private routerNavigate: Router, private application: ApplicationsComponent, private homecom :HomeComponent ) {
    this.application.loadContent = false;
 //   this.application.industryStatus() 
    this.getBusSectorTypes();
    this.getCountryDetails();
//    this.industryStatus();
    this.getAllCountryDetails();
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
  }

  checkWebsitePat() { // to enable disable button for websiteURL
    let rePattern = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
      let count=this.fieldArray.filter(c=>(c.name!='' && !rePattern.test(c.name)));  
      this.checkWebsiteURL = count.length > 0 ? true : false; 
  }
  removeSpace() {
    this.range_of_service = this.range_of_service.trim().replace(/  +/g, ' ');
  }
  noSpace(){
    $("textarea").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
          this.value = this.value.replace(/  +/g, ' ');
  });
  }
  industryStatus() {
     this.homeService.industryStatus().subscribe(res => {
       if(res['status']==0){
       if(res['data']['status']==0){
         if(res['data']['Dashboard Status']['isRestricted']==1){
           this.application.industrStatus=res['data']['Dashboard Status']['isRestricted'];
           this.homecom.isDisabled=true;
           this.blockindustries=true;
           this.typesOfBus=false;
         }
         else if(res['data']['Dashboard Status']['isRestricted']==0){
           if(res['data']['Dashboard Status']['type_of_business']==1 || res['data']['Dashboard Status']['type_of_business']==2){
            this.typesOfBus=false;
           }
         }
       } else if(res['data']['status']==1){
         this.alert.error(res['data']['message'])
       }
      } else{
        this.alert.error(res['message'])
      }
    });
  }

  typesOfBusniess() {
    this.validationIndustries = true;
    this.transcationinfo = false;
    this.typesOfBus = true;
    this.isBusList = false;
    this.confmDirector = false;
    this.receivePayTempl = false;
    this.sendPayTempl = false;
    this.blockindustries = false;
    this.countrieserror = false;
    this.sendcompanies = false;
    this.applybusiness = false;
  }
  addFieldValue(index){
    if(this.fieldArray.length <= 10) {
      let obj={
        "name":''
      }
      this.fieldArray.unshift(obj);
     // this.newAttribute = {};
     this.checkWebsiteURL = true;
    }
  }

  deleteFieldValue(index) {
    if (this.fieldArray.length > 1) {
      this.fieldArray.splice(index, 1);
    }
    this.checkWebsiteURL = false;
  }

  validateBusiness() {
    let invalidCountries = false;
    let wsRegex = new RegExp(/^[A-Za-z0-9' ,-]+$/);
    for (var i = 0; i < this.countryFieldArray.length; i++) {
      if (this.countryFieldArray[i].business_description.length < 30 || !this.countryFieldArray[i].business_description.match(wsRegex)) {
        this.countryFieldArray[i].error = true;
        invalidCountries = true;
        break;
      }
      else {
        this.countryFieldArray[i].error = false;
      }
    }
    if (invalidCountries) {
      this.invalidcountries = true;
    } else {
      this.invalidcountries = false;
    }
  }
  addsendFieldValue(){
    this.sendPaymentErroMessage=false;
    if(this.sendPaycountryFieldArray.length <= 9) {
      let obj={
        business_description: "",
         country_id: '',
         error: '',
         focus:''
      }

      this.sendPaycountryFieldArray.unshift(obj);
      this.sendPayCountryAttribute = {};
      this.sendPaymentCountries();
      this.sendcountires = false;
    }
    }
  deletesendFieldValue(index) {
      if(this.sendPaycountryFieldArray.length > 1) {
      this.sendPaycountryFieldArray.splice(index, 1);
      this.sendPaymentCountries();
      this.sendcountires = false;
      }
    }
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

  receivePayment() {
    var thisObj = this
    let countrydetails = [];
    let countrynames = [];
    let countrylistcheck = [];
    var blockCompany = []
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
    if (_.size(blockCompany) > 0)
    {
      this.countrieserror = true;
      this.receivePayTempl = false;
      blockCompany = []
    }
    else {
      for (var i = 0; i < this.countryFieldArray.length; i++) {
        this.countryFieldArray[i].business_id = this.business_Id;
        this.countryFieldArray[i].transaction_type = "RECEIVE"
      }
      this.countryFieldArray = this.countryFieldArray.filter(item => item.country_id !=='');
      var obj = { countries_Details: this.countryFieldArray, paymentType:"RECEIVE"}
      this.homeService.receivesendFromCountry(obj).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {            
            this.receivePayTempl = false;
            this.sendPayTempl = true;
           //  this.countryFieldArray=[];
          }
          else if (res['data']['status'] == 1) {
            this.sendPayTempl = false;
            this.alert.warn(res['data']['message']);
          }
        }
        else if (res['status'] == 1) {
          this.alert.error(res['message']);
        }
      })
    }

  }
  focusout(i){
    let wsRegex = new RegExp(/^[A-Za-z0-9' ,-]+$/);
    if(this.countryFieldArray[i].business_description != undefined && this.countryFieldArray[i].business_description != null) {
      if(this.countryFieldArray[i].business_description.length < 30 || !this.countryFieldArray[i].business_description.match(wsRegex)){
        this.countryFieldArray[i].focus=true
      }
      else{
        this.countryFieldArray[i].focus=false
      }
    }
  }

  focusoutpt(i){
    let wsRegex = new RegExp(/^[A-Za-z0-9' ,-]+$/);
    if(this.sendPaycountryFieldArray[i].business_description != undefined && this.sendPaycountryFieldArray[i].business_description != null) {
    if(this.sendPaycountryFieldArray[i].business_description.length < 30 || !this.sendPaycountryFieldArray[i].business_description.match(wsRegex)){
      this.sendPaycountryFieldArray[i].focus=true
    } else{
      this.sendPaycountryFieldArray[i].focus=false
    }
  }
  }
  addreceivedFieldValue(){
    this.erroMessage=false;
    if(this.countryFieldArray.length <= 9) {
      let obj={
        business_description: "",
         country_id: '',
         error: '',
         focus:''


      }
      this.invalidcountries = false;
   //   this.newCountryAttribute.push(this.countryFieldArray[0]);
      this.selectedCountry = this.allcountryData.filter(item => item.country_id === this.countryFieldArray[0].country_id);
    //  this.countryFieldArray = [];  
      this.countryFieldArray.unshift(obj);      
      this.validateBusiness();
      this.invalidcountries = false;
   }
  }
  deletereceiveFieldValue(index) {
      if(this.countryFieldArray.length > 1) {
      this.countryFieldArray.splice(index, 1);
      this.validateBusiness();
      }
    }
    sendPayment(){
      var thisObj = this
      var paycountrynames =[];
      var blockCompanyreceive=[];
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
      if(_.size(blockCompanyreceive)>0) 
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
      this.sendPaycountryFieldArray = this.sendPaycountryFieldArray.filter(item => item.country_id !=='');
      var obj={countries_Details:this.sendPaycountryFieldArray, paymentType:"SEND"}
      this.homeService.receivesendFromCountry(obj).subscribe(res=>{
        if(res['status']==0){
        if(res['data']['status']===0){
          this.sendPayTempl=false;
          this.application.getKYBStatus();
          this.routerNavigate.navigate(['/business/application/businessadd']);
         // this.getUpdatedStatus('type_of_business',2);
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
    businessTemplate(){
      this.isBusList=false
      this.typesOfBus=true;
    }
    optionTemplate(){
      this.applybusiness=false;
      this.isBusList=true;
    }
    restrictedIndustryList(){
      this.isBusList=true
      this.transcationinfo=false;
    }
    industryList(){
       this.applybusiness=true;
      this.transcationinfo=false;
    }
    receivePaymentTemplate(){
      this.receivePayTempl=false;
      this.transcationinfo=true;
    }

    receivedPaymenttoFrom(){
      this.sendPayTempl=false;
      this.receivePayTempl=true;
    }

    // getUpdatedStatus(col,status){
    //   let obj={
    //      "column" : col,
    //      "status":status
    //    }
    //    this.homeService.getUpdatedStatus(obj).subscribe(res => {
    //      if(res['status']==0){
    //         if(res['data']['status']==0){
    //           this.application.getKYBStatus();
    //           this.application.loadContent=true;
    //           this.routerNavigate.navigate(['home/application'])
    //         }
    //         else if(res['data']['status']==1){
    //           this.alert.error(res['data']['message'])
    //         }
    //      }
    //      else{
    //        this.alert.error(res['message'])
    //      }
    //    });
    //  }
    
 addBusType(id, rangeofservice) {
    this.transcationinfo = false;
    this.businessSectorId = id;
    this.range_of_service = rangeofservice;
    this.typesOfBus = false;
    this.isBusList = true;
    this.confmDirector = false;
    this.receivePayTempl = false;
    this.sendPayTempl = false;
    this.getBusinessIndustries();
  }
  getSelectedInsd(value, isSelected, index, id) {
    this.selectedIndValue = value;
    this.validationIndustries = false;
    if (isSelected) {
      this.selectedInsData.push(value);
    }
    else {
    //  var index = this.selectedInsData.indexOf(value);
      if (index != -1) {
        this.selectedInsData.splice(index, 1);
      }
    }
    this.selectedIndustries = this.selectedInsData.toString();
  }
  checkOpt(value) {
    this.optionvalid = false;
    if (value == 'no') {
      this.restricted_businessValue = 0;
    }
    else if (value == 'yes') {
      this.restricted_businessValue = 1;
    }
  }
  optionCheck() {
//    if (this.restricted_businessValue == 0) {
      this.restricted=true;
      this.notrestricted=false;
      var websitesArray = [];
      var websites;
      //changes
      this.busTypesFormData.website=this.fieldArray[0].name
      //
      // for (var i = 0; i < this.fieldArray.length; i++) {
      //   var websiteName = [this.fieldArray[i].name];
      //   websitesArray.push(websiteName);
      //   websites = websitesArray.toString();
      // }
      //this.busTypesFormData.website = websites;
      this.busTypesFormData.restricted_business = this.restricted_businessValue;
      this.busTypesFormData.range_of_service = this.range_of_service;
      this.busTypesFormData.business_sector_id = this.businessSectorId;
      this.busTypesFormData.business_sector = this.businessSectorId;
      this.busTypesFormData.selected_industries = "null"
      this.homeService.submitBusTypes(this.busTypesFormData).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['restricted'] == 0) {            
            this.isBusList = false;
            this.transcationinfo = true;
            this.confmDirector = false;
            this.receivePayTempl = false;
            this.sendPayTempl = false;
            this.applybusiness = false;
            this.selectedInsData = [];
            this.getTrnsInfo()
          }
          if (res['data']['status'] == 1) {
            this.alert.error(res['data']['message']);
          }
          else if (res['data']['restricted'] == 1) {
            this.applybusiness = false;
           this.isBusList = false;
           this.specialAttention = true;
           this.application.getKYBStatus();
           // this.alert.error(res['data']['message']);
          }
        }
        else if (res['status'] == 1) {
          this.alert.error(res['message']);
        }
      });
    // }
    // else if (this.restricted_businessValue == 1) {
    //   this.applybusiness = false;
    //   this.isBusList = false;
    //   this.specialAttention = true;
    //   this.application.getKYBStatus();
    // }
  }
  submitBusTypes() {

    this.restricted=false;
    this.notrestricted=true;
    var websitesArray = [];
    var websites;
    for (var i = 0; i < this.fieldArray.length; i++) {
      var websiteName = [this.fieldArray[i].name];
      websitesArray.push(websiteName);
      websites = websitesArray.toString();
    }
    this.busTypesFormData.website = websites;
    this.busTypesFormData.restricted_business = this.restricted_businessValue;
    this.busTypesFormData.range_of_service = this.range_of_service;
    this.busTypesFormData.business_sector_id = this.businessSectorId;
    this.busTypesFormData.business_sector = this.businessSectorId;
    this.busTypesFormData.selected_industries = this.selectedIndustries;
    this.homeService.submitBusTypes(this.busTypesFormData).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['restricted'] == 1) {
          this.blockindustries = true
          this.applybusiness = false;
          this.industryStatus();
        }
        if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message']);
        }
        else if (res['data']['restricted'] == 0) {
          //this.alert.success(res['data']['message']);
          this.isBusList = false;
          this.transcationinfo = true;
          this.confmDirector = false;
          this.receivePayTempl = false;
          this.sendPayTempl = false;
          this.applybusiness = false;
          this.selectedInsData = [];
          this.getTrnsInfo()
        }
      }
      else if (res['status'] == 1) {
        this.alert.error(res['message']);
      }
    });

  }
  getTrnsInfo() {
    this.MnthVolTransData = ['1 000 - 10 000', '10 000 - 100 000', '100 000 - 1 000 000', '1 000 000+'];
    this.PayntPerMonth = ['<10', '<50', '<100', '>100'];
  }
  getBusSectorTypes() {
    this.homeService.getBusSectorTypes().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.businessSectorData = res['data']['Type Of Sector']
        } else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }
  mnthlyTrnsAmt(value) {
    if (value == '1 000 - 10 000') {
      this.monthlyTrsnAmt = 10000;
      this.max_value_of_payment = this.monthlyTrsnAmt / this.pyntpermonth;
      if (isNaN(this.max_value_of_payment)) {
        this.max_value_of_payment = '';
      }
    }
    else if (value == '10 000 - 100 000') {
      this.monthlyTrsnAmt = 100000;
      this.max_value_of_payment = this.monthlyTrsnAmt / this.pyntpermonth;
      if (isNaN(this.max_value_of_payment)) {
        this.max_value_of_payment = '';
      }
    }
    else if (value == '100 000 - 1 000 000') {
      this.monthlyTrsnAmt = 1000000;
      this.max_value_of_payment = this.monthlyTrsnAmt / this.pyntpermonth;
      if (isNaN(this.max_value_of_payment)) {
        this.max_value_of_payment = '';
      }
    }
    else if (value == '1 000 000+') {
      this.monthlyTrsnAmt = 1000000;
      this.max_value_of_payment = this.monthlyTrsnAmt / this.pyntpermonth;
      if (isNaN(this.max_value_of_payment)) {
        this.max_value_of_payment = '';
      }
    }
  }
  getPaymtPerMonth(value) {
    if (value.charAt(0) === '>' || value.charAt(0) === '<') {
      this.pyntpermonth = value.slice(1);
      this.max_value_of_payment = this.monthlyTrsnAmt / this.pyntpermonth;
      if (isNaN(this.max_value_of_payment)) {
        this.max_value_of_payment = '';
      }
    }
  }
  transcationVolume() {
    var formData = { monthy_transfer_amount: this.monthlyTrsnAmt, no_payments_per_month: this.no_payments_per_month, max_value_of_payment: this.max_value_of_payment }
    this.homeService.transcationVolume(formData).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {         
          this.receivePayTempl = true;
          this.transcationinfo = false;
          this.sendPayTempl = false;
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message']);
          this.receivePayTempl = false;
          this.transcationinfo = true;
          this.sendPayTempl = false;
                }
      } else if (res['status'] == 1) {
        this.alert.error(res['message']);
      }
    });
  }

  getCountryDetails() {
    this.homeService.getCountryDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.countryData = res['data']['country list'];
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }

  
  getAllCountryDetails() {
    this.homeService.getAllCountryDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.allcountryData = res['data']['global_country_list'];
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }

  
  getBusinessIndustries() {
    this.homeService.getBusinessIndustries().subscribe(res => {
      if (res['status'] == 0) {
        this.insdustriesData = res['data']['Type Of Industries'];
      }
      else if (res['stauts'] == 1) {
        this.alert.error(res['message']);
      }
    });
  }
 ngOnInit() {
  }
}


