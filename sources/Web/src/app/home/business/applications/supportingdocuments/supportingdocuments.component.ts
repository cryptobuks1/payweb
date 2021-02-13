/**
* Dashboard Component
* KYC status, KYC verification process, user profile
* @package BusdashboardComponent
* @subpackage app\home\personal\business-dashboard\busdashboard.component.html
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { HomeService } from '../../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import {FormGroup,Validators,FormBuilder,AbstractControl} from "@angular/forms";
import { IndexService } from 'src/app/core/shared/index.service';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { ApplicationsComponent } from '../applications.component';

declare var $: any;

@Component({
  selector: 'app-supportingdocuments',
  templateUrl: './supportingdocuments.component.html',
  styleUrls: ['./supportingdocuments.component.scss']
})
export class SupportingdocumentsComponent implements OnInit {
 

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
  documentStatus: any;
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
  authorityDocumentStatus: number=0;
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
   registerDocumentStatus: number=0;
   operatingDocumentStatus: number=0;
   shareHolderDocumentStatus: number=0;
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
   showContinueButton: boolean = false;
   SelectedVerifyData: any;
  fileName:any;

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
  registeredFileName: any;
  shareholderFileName: any;
  authorityFileName: any;
  fileupload_1: boolean=false;




 
   // supporting document end

   
  constructor(private fb: FormBuilder, private application:ApplicationsComponent, private indexService: IndexService,private homeService:HomeService,private alert:NotificationService,private routerNavigate:Router) {
    this.application.loadContent=false;
  //  this.application.industryStatus() 
    var date = new Date(),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    var obj=[date.getFullYear(), mnth, day].join("-");
    this.maxDOB=obj;
     this.supportingDocument();      
      this.profileData=JSON.parse(sessionStorage.getItem('userData'));     
      this.legalName=this.profileData.business_legal_name;
    //  this.getRegisterdAddressDocument();      
   }

   enableFinishApp() {
     this.application.industryStatus();
   }


   getKYBStatus(){
    this.homeService.getKYBStatus().subscribe(res => {
      if(res['status']==0){
        if(res['data']['status']==0){
          this.KYBStatus=res['data']['Dashboard Status'];
        }
        else if(res['data']['status']==1){
        }
      }
      else{
        this.alert.error(res['message'])
      }
    });
   }

 

  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];
    var string = evt.target.files[0].type;
    var file_upload = string.slice(6).toUpperCase(); 
    var file_name = file.name;
    if(file_upload.includes("PDF")){
      this.myObject['file_type'] = 1;
      } else if (file_upload.includes("JPG")) {
        this.myObject['file_type'] = 2;
      } else if (file_upload.includes("JPEG")) {
        this.myObject['file_type'] = 3;
      } else if (file_upload.includes("PNG")) {
        this.myObject['file_type'] = 4;
      } else if (file.name.includes("xlsx") || file.name.includes("xls")) {
        this.myObject['file_type'] = 5;
      }
      else {
        return;
      }
    this.registeredFileName=file_name;
    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      this.fileupload=true;
      if(file_upload === 'ATION/PDF') {
        $('#registeredFileNamePDF').attr('src', '../../../../assets/images/icons/pdf.png');
      }else {
        $('#registeredFileName').attr('src', window.URL.createObjectURL(files[0]));        
      }
      reader.readAsBinaryString(file);
    }

  }


  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    var base64textString = btoa(binaryString);
    this.myObject['file_content'] = base64textString;
    this.fileupload = true;
  }


  uploadAddressDocument() {
    this.myObject['file_name'] = 1;
    this.myObject['doc_name'] = this.registeredFileName;
    this.homeService.sendRegisterdAddressDocument(this.myObject).subscribe(res => {     
      if(res['status']==0){
      if(res['data']['status'] == 1) {
        this.alert.error(res['data']['message']);
      } else if (res['data']['status'] == 0) {
        //this.alert.success(res['data']['message']);       
        this.supportDocument = true;
        this.suppDocumRegistered = false;
        this.activeclick = true;
        this.getRegisterdAddressDocument();
        this.application.getKYBStatus();       
      }
      } else if(res['status']==1){
      this.alert.error(res['message']);
    }
    });
    this.suppDocumRegistered=false;
    this.fileupload = false;
  }


  getRegisterdAddressDocument() {
    var checkfiletype: any;
    this.homeService.getRegisterdAddressDocument().subscribe(res => {
      if (res['status'] == 0) {
        if(res['data']['status']==0){
        // for (let i = 0; i < res['data']['documents'].length; i++) {
        //   if (res['data']['documents'][i].kyb_doc_type == 'BUSINESS_ADDRESS') {
        //     this.photoimage = res['data']['documents'][i]['kyb_doc_base64'];
        //     checkfiletype = res['data']['documents'][i]['kyb_doc_file_type'];
        //     this.documentStatus = "Submitted";            
        //   }
        // }
        // if(res['data']['business_id']){
        //   this.business_Id = res['data']['business_id']; 
        //   this.getDocumentsStatus(this.business_Id);
        // }
        this.docData=res['data']['documents'];
    if(this.docData && this.docData.length > 0) {
        for (let i = 0; i <this.docData.length; i++) {
          if (res['data']['documents'][i].kyb_doc_type == 1) {                    
          this.registerDocumentStatus = this.docData[i].doc_status;
          } else if (res['data']['documents'][i].kyb_doc_type == 2) {
            this.operatingDocumentStatus = this.docData[i].doc_status;
          } else if (res['data']['documents'][i].kyb_doc_type == 4) {
            this.shareHolderDocumentStatus = this.docData[i].doc_status;
          } else if (res['data']['documents'][i].kyb_doc_type == 3) {
            this.authorityDocumentStatus = this.docData[i].doc_status;
          }
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

  getDocumentsStatus(id) {    
    this.homeService.getDocumentsStatus(id).subscribe(res => {
      if (res['status'] == 0) {
        if(res['data']['status']==0){
        for (let i = 0; i < res['data']['documents'].length; i++) {
          if (res['data']['documents'][i].kyb_doc_type == 1) {                    
          this.registerDocumentStatus = res['data']['documents'][i].kyb_doc_status;
          } else if (res['data']['documents'][i].kyb_doc_type == 2) {
            this.operatingDocumentStatus = res['data']['documents'][i].kyb_doc_status;
          } else if (res['data']['documents'][i].kyb_doc_type == 4) {
            this.shareHolderDocumentStatus = res['data']['documents'][i].kyb_doc_status;
          } else if (res['data']['documents'][i].kyb_doc_type == 3) {
            this.authorityDocumentStatus = res['data']['documents'][i].kyb_doc_status;
          }
        }
        if(this.registerDocumentStatus == 1 && this.operatingDocumentStatus == 1 && this.shareHolderDocumentStatus == 1
          && this.authorityDocumentStatus == 1){
           this.showContinueButton = true;
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
          if (res['data']['addressDetails'][i].address_type == "BUSINESS_ADDRESS") {
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

  handleFileSelects(evt) {

    var files = evt.target.files;
    var file = files[0];
    var string = evt.target.files[0].type;
    var file_upload = string.slice(6).toUpperCase(); //changed

    var file_name=file.name;
    if(file_upload.includes("PDF")){
      this.operatingObject['file_type'] = 1;
      } else if (file_upload.includes("JPG")) {
        this.operatingObject['file_type'] = 2;
      } else if (file_upload.includes("JPEG")) {
        this.operatingObject['file_type'] = 3;
      } else if (file_upload.includes("PNG")) {
        this.operatingObject['file_type'] = 4;
      } else if (file.name.includes("xlsx") || file.name.includes("xls")) {
        this.operatingObject['file_type'] = 5;
      }
      else {
        return;
      }
      
    this.fileName=file_name;
    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoadeds.bind(this);
      this.fileupload=true;
    //  $('#fileName').attr('src', window.URL.createObjectURL(files[0]));
      reader.readAsBinaryString(file);
      if(file_upload === 'ATION/PDF') {
        $('#registeredFileNamePDF').attr('src', '../../../../assets/images/icons/pdf.png');
      }else {
        $('#fileName').attr('src', window.URL.createObjectURL(files[0]));        
      }
    }

  }

  _handleReaderLoadeds(readerEvt) {

    var binaryString = readerEvt.target.result;
    var base64textString = btoa(binaryString);
    this.operatingObject['file_content'] = base64textString;
    this.fileupload = true;
  }

  uploadOperatingDocument() {
    this.operatingObject['file_name'] = 2;
    this.operatingObject['doc_name'] = this.fileName;
    this.homeService.sendRegisterdAddressDocument(this.operatingObject).subscribe(res => {
      if(res['status']==0){
      if (res['data']['status'] == 1) {
        this.alert.error(res['data']['message']);
        this.authorityAddress=false;
      } else if (res['data']['status'] == 0) {
        this.application.getKYBStatus();
       // this.alert.success(res['data']['message']);
        this.supportDocument = true;
        this.proofofOperating = false;
        this.activeClickOperating=true;
        this.documentStatus = "Submitted";
        this.getOperatingDocumets();
        this.authorityAddress=false;
      }
      } else if (res['status']==1){
        this.alert.error(res['message']);
      }
    });
    this.proofofOperating=false;
    this.proofOfShareHolder=false;
    this.fileupload = false;
    this.authorityAddress=false;
  }

  getOperatingDocumets() {
    let requestobj = {};
    var operatingCheckFile: any;
    this.homeService.getRegisterdAddressDocument().subscribe(response => {
    if (response['status'] == 1){
    for (let i = 0; i < response['data'].length; i++){
    if (response['data'][i].kyb_doc_type == 2) {
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
    } else {
      // if(response['data']['business_id']){
      //   this.business_Id = response['data']['business_id']; 
      //   this.getDocumentsStatus(this.business_Id);
      // }
      this.docData=response['data']['documents'];
    if(this.docData && this.docData.length > 0) {
      for (let i = 0; i <this.docData.length; i++) {
        if (response['data']['documents'][i].kyb_doc_type == 1) {                    
        this.registerDocumentStatus = this.docData[i].doc_status;
        } else if (response['data']['documents'][i].kyb_doc_type == 2) {
          this.operatingDocumentStatus = this.docData[i].doc_status;
        } else if (response['data']['documents'][i].kyb_doc_type == 4) {
          this.shareHolderDocumentStatus = this.docData[i].doc_status;
        } else if (response['data']['documents'][i].kyb_doc_type == 3) {
          this.authorityDocumentStatus = this.docData[i].doc_status;
        }
      }
    }
  }
    });
  }

  getOperatingAddress() {
    this.homeService.getRegisterdDetails().subscribe(res => {
    if (res['status'] == 0) {
      if(res['data']['status']==0){
        for (let i = 0; i < res['data']['addressDetails'].length; i++) {
          if (res['data']['addressDetails'][i].address_type_id == 3) {
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

  
  handleFileSelectshare(evt) {

    var files = evt.target.files;
    var file = files[0];
    var string = evt.target.files[0].type;
    var file_upload = string.slice(6).toUpperCase(); 
    var file_name = file.name;
    this.shareholderFileName=file_name;
    if(file_upload.includes("PDF")){
      this.shareholderObject['file_type'] = 1;
      } else if (file_upload.includes("JPG")) {
        this.shareholderObject['file_type'] = 2;
      } else if (file_upload.includes("JPEG")) {
        this.shareholderObject['file_type'] = 3;
      } else if (file_upload.includes("PNG")) {
        this.shareholderObject['file_type'] = 4;
      } else if (file.name.includes("xlsx") || file.name.includes("xls")) {
        this.shareholderObject['file_type'] = 5;
      }
      else {
        return;
      }
    this.fileupload=true
    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoadedshare.bind(this);
     
    //  $('#shareholderFileName').attr('src', window.URL.createObjectURL(files[0]));
      reader.readAsBinaryString(file);
      if(file_upload === 'ATION/PDF') {
        $('#registeredFileNamePDF').attr('src', '../../../../assets/images/icons/pdf.png');
      }else {
        $('#shareholderFileName').attr('src', window.URL.createObjectURL(files[0]));        
      }
    }

  }

  _handleReaderLoadedshare(readerEvt) {

    var binaryString = readerEvt.target.result;
    var base64textString = btoa(binaryString);
    this.shareholderObject['file_content'] = base64textString;
    this.fileupload = true;
  
  }

  uploadShareDocument() {
    this.shareholderObject['file_name'] = 4;
    this.shareholderObject['doc_name'] = this.shareholderFileName;
    this.homeService.sendRegisterdAddressDocument(this.shareholderObject).subscribe(res => {
      if(res['status']==0){
        if(res['data']['status'] == 1) {
        this.alert.error('Uploading failed');
      //  this.routerNavigate.navigate(['/home/application/businessOwner']);
       }
       else if(res['data']['status'] == 0) {
        this.supportDocument = true;
        this.proofOfShareHolder = false;
        this.activeClickShareHolder=true;
        this.documentStatus = "Submitted";
        this.getshareholderDocumets();
      //  this.routerNavigate.navigate(['/home/application/businessOwner']);
       }
     } else if(res['status']==1){
      this.alert.error(res['message']);
     // this.routerNavigate.navigate(['/home/application/businessOwner']);
     }
    });
    this.proofofOperating=false;
    this.proofOfShareHolder=false;
    this.authorityAddress=false;
    this.fileupload = false;
  //  this.routerNavigate.navigate(['/home/application/businessOwner']);
  }

  getshareholderDocumets() {
    let requestobj = {};
    requestobj['business_id'] = this.business_Id;
    var shareHolderFile: any;
    this.homeService.getRegisterdAddressDocument().subscribe(response => {
    if (response['status'] == 1){
      for (let i = 0; i < response['data'].length; i++){
      if (response['data'][i].kyb_doc_type == 4)
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
      } else {
        // if(response['data']['business_id']){
        //   this.business_Id = response['data']['business_id']; 
        //   this.getDocumentsStatus(this.business_Id);
        // }
        this.docData=response['data']['documents'];
    if(this.docData && this.docData.length > 0) {
        for (let i = 0; i <this.docData.length; i++) {
          if (response['data']['documents'][i].kyb_doc_type == 1) {                    
          this.registerDocumentStatus = this.docData[i].doc_status;
          } else if (response['data']['documents'][i].kyb_doc_type == 2) {
            this.operatingDocumentStatus = this.docData[i].doc_status;
          } else if (response['data']['documents'][i].kyb_doc_type == 4) {
            this.shareHolderDocumentStatus = this.docData[i].doc_status;
          } else if (response['data']['documents'][i].kyb_doc_type == 3) {
            this.authorityDocumentStatus = this.docData[i].doc_status;
          }
        }
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
    var file_name = file.name;
    this.authorityFileName=file_name;
    if(file_upload.includes("PDF")){
    this.authorityObject['file_type'] = 1;
    } else if (file_upload.includes("JPG")) {
      this.authorityObject['file_type'] = 2;
    } else if (file_upload.includes("JPEG")) {
      this.authorityObject['file_type'] = 3;
    } else if (file_upload.includes("PNG")) {
      this.authorityObject['file_type'] = 4;
    } else if (file.name.includes("xlsx") || file.name.includes("xls")) {
      this.authorityObject['file_type'] = 5;
    }
    else {
      return;
    }
    this.fileupload_1=true
//$('#authorityFileName').src=
    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderAuthority.bind(this);
    //  $('#authorityFileName').attr('src', window.URL.createObjectURL(files[0]));
   
    if(file_upload === 'ATION/PDF') {
      $('#registeredFileNamePDF').attr('src', '../../../../assets/images/icons/pdf.png');
    }else {
      $('#authorityFileName').attr('src', window.URL.createObjectURL(files[0]));        
    }
      reader.readAsBinaryString(file);
    }

  }

  _handleReaderAuthority(readerEvt) {

    var binaryString = readerEvt.target.result;
    var base64textString = btoa(binaryString);
    this.authorityObject['file_content'] = base64textString;
    this.fileupload = true;
   

  }

   uploadAuthorityDocument() 
   {
    this.authorityObject['file_name'] = 3;
    this.authorityObject['doc_name'] = this.authorityFileName;
    this.homeService.sendRegisterdAddressDocument(this.authorityObject).subscribe(res => {
    if(res['status']==0){
    if(res['data']['status'] == 1){
        this.alert.error(res['data']['message']);       
     } else if (res['data']['status'] == 0){          
       this.supportDocument=true;
       this.activeClickAuthority = true;
       this.application.getKYBStatus()       
      //this.alert.success(res['data']['message']);
      this.authorityAddress = false;
      this.getsAuthorityDocumets();
    }}
    else if(res['status']==1){
       this.alert.error(res['message']);
    }
    });
    this.proofofOperating=false;
    this.proofOfShareHolder=false;
    this.authorityAddress=false;
    this.fileupload = false;
  }

  getsAuthorityDocumets() {
    let requestobj = {};
    requestobj['business_id'] = this.business_Id;
    var checkAuthorityFile: any;
    this.homeService.getRegisterdAddressDocument().subscribe(response => {
      if (response['status'] == 1){
      for (let i = 0; i < response['data'].length; i++){
      if (response['data'][i].kyb_doc_type == 3) 
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
      } else {
        // if(response['data']['business_id']){
        //   this.business_Id = response['data']['business_id']; 
        //   this.getDocumentsStatus(this.business_Id);
        // }
        this.docData=response['data']['documents'];
    if(this.docData && this.docData.length > 0) {
        for (let i = 0; i <this.docData.length; i++) {
          if (response['data']['documents'][i].kyb_doc_type == 1) {                    
          this.registerDocumentStatus = this.docData[i].doc_status;
          } else if (response['data']['documents'][i].kyb_doc_type == 2) {
            this.operatingDocumentStatus = this.docData[i].doc_status;
          } else if (response['data']['documents'][i].kyb_doc_type == 4) {
            this.shareHolderDocumentStatus = this.docData[i].doc_status;
          } else if (response['data']['documents'][i].kyb_doc_type == 3) {
            this.authorityDocumentStatus = this.docData[i].doc_status;
          }
        }
      }
    }
    });
  }
 
  supportingDocument() {
    this.homeService.getDocStatus().subscribe(res=>{
    this.docData=res['data']['documents'];
    if(this.docData && this.docData.length > 0) {
    for (let i = 0; i <this.docData.length; i++) {
      if (res['data']['documents'][i].kyb_doc_type == 1) {                    
      this.registerDocumentStatus = this.docData[i].doc_status;
      } else if (res['data']['documents'][i].kyb_doc_type == 2) {
        this.operatingDocumentStatus = this.docData[i].doc_status;
      } else if (res['data']['documents'][i].kyb_doc_type == 4) {
        this.shareHolderDocumentStatus = this.docData[i].doc_status;
      } else if (res['data']['documents'][i].kyb_doc_type == 3) {
        this.authorityDocumentStatus = this.docData[i].doc_status;
      }
      this.getKYBStatus();
    }
  } else {
    this.getKYBStatus();
  }

      if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type: 1}))>0){
      this.activeclick=true;
       this.supportDocument = true;
      }
    if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type: 4}))>0){
      this.activeClickShareHolder=true;
      this.supportDocument = true;
   
    }
    if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type: 2}))>0){
    this.activeClickOperating=true;
    this.supportDocument = true;
    }
    if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type: 2}))>0){
      this.activeClickOperating=true;
       this.supportDocument = true;
    }
    if((_.size(res["data"]['documents']) == _.size(_.filter(res["data"]['documents'],{status:0}))) && _.size(_.filter(res["data"]['documents'],{kyb_doc_type:3}))>0){
    this.activeClickAuthority=true;
    this.supportDocument = true;
    }
       else{
        this.supportDocBtn=true;   
        this.supportDocument = true;
       }       
    
    })
  
  }


  registeredAddress() {
    if(this.KYBStatus.business_address==1 || this.KYBStatus.business_address==2){
      this.getRegisterdAddress();
      this.supportDocument = false;
      this.suppDocumRegistered = true;
    }
     else{
       this.alert.warn('Please, complete business address verification before this step');
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
    }
    else{
      this.alert.warn('Please, complete business address verification before this step');
    }
  }

  proofOfShareAdd() {
    this.supportDocument = false;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = true;
    this.authorityAddress = false;
  }

  proofOfOpenAcc()
  {
    this.supportDocument = false;
    this.suppDocumRegistered = false;
    this.proofofOperating = false;
    this.proofOfShareHolder = false;
    this.authorityAddress = true;
    this.updateContactDetails=false;
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
      'postal_code':['',Validators.compose([Validators.required,this.ValidatePostal, Validators.pattern("^[a-zA-Z0-9- ]+$")])],
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
      postal_code:['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9- ]+$")])],
      city:['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z- ']+$")])],
      address_line1:['',Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      address_line2:['',Validators.compose([Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      region:['',Validators.compose([Validators.required])],
      })
  }
  navigateScreen() {
    this.supportDocument=false;
    this.proofofOperating=true;
    this.routerNavigate.navigate(['/business/application/supportingdocument']);
    
    
  }
  formValidate(){
    this.shareholderFileName=''
    this.supportDocument=true;
    this.proofOfShareHolder=false;
    this.fileupload_1=false
    this.fileupload=false

  }
formValidate1(){
  this.authorityFileName=''
  this.supportDocument=true;
  this.authorityAddress=false;
  this.fileupload=false
}

formValidate2(){
  this.registeredFileName=''
  this.supportDocument=true;
  this.authorityAddress=false;
  this.fileupload=false
}

formValidate3(){

  this.fileName=''
  this.supportDocument=true;
  this.proofofOperating=false;
  this.fileupload=false
}

}

