import { HomeService } from 'src/app/core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexService } from 'src/app/core/shared/index.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent implements OnInit {
  business_profile_data: any;
  trading_name: any;
  registered_address: any = "";
  operating_address: any;
  companyName: string;
  companySymbol: string;
  country_of_incorporation: string;
  regAddress: any;
  registeredAddress: string ;
  business_reg_address: any;
  opAddress: string[];
  operate_address: string ="";
  business_operating_address: any;
  editButton: boolean = true;
  businessProfile: boolean = true;
  busAddrTemp: boolean = false;
  operatingAddrTemp: boolean = false;
  loadContent: boolean = true;
  busAddrForm: FormGroup;
  operatingAddrForm: FormGroup;
  countryData: any;
  businessSectorData: any;
  KYBStatus: any;
  userData: any;
  country_name: any;
  apploader:boolean;
  businessDetailsData:any;
  addressDetails: any;
  operDetails: any;
  business_country_of_incorporation: any;
  regAdd: boolean = false;
  operAdd: boolean = false;
  myObject = {};
  supportDocument:boolean=false;
  suppDocumRegistered:boolean=false;
  activeclick:boolean=false;
  fileupload:boolean=false;
  registeredFileName: any;
  operatingObject={};
  authorityAddress:boolean=false;
  proofofOperating:boolean=false;
  activeClickOperating:boolean=false;
  fileName: any;
  documentStatus: string;

  constructor(private fb: FormBuilder, private indexService: IndexService, private homeService: HomeService, private alert: NotificationService, ) {
    this.getCountryDetails();
    this.userData=JSON.parse(sessionStorage.getItem('userData'));
    // this.homeService.getUserDetails().subscribe(data => {
    //   this.business_country_of_incorporation = data.business_country_of_incorporation;
    // })
   }

  ngOnInit() {
    this.getBusinessSettings();
    this.busAddrForm = this.fb.group({
      'country_id': ['', Validators.required],
      'postal_code': ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9- ]+$")])],
      'city': ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z- ']+$")])],
      'address_line1': ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      'address_line2': ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9' ,-]+$")])],
      'region': ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z', -]+$")])],
    })
    this.operatingAddrForm = this.fb.group({
      'country_id': ['', Validators.required],
      'postal_code': ['', Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9- ]+$")])],
      'city': ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z- ']+$")])],
      'address_line1': ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      'address_line2': ['', Validators.compose([Validators.pattern("^[a-zA-Z0-9', -]+$")])],
      'region': ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z', -]+$")])],
    });
  }
  editDetails(){
    this.editButton = false;
  }
  registered(){
    this.businessProfile = false;
    this.busAddrTemp = true;
    this.operatingAddrTemp = false;
  }
  operating(){
    this.businessProfile = false;
    this.operatingAddrTemp = true;
    this.busAddrTemp = false;
  }
  canceladdressDetails(){
    this.businessProfile = true;
    this.busAddrTemp = false;
    this.operatingAddrTemp = false;
  }
  cancelOperDetails(){
    this.businessProfile = true;
    this.busAddrTemp = false;
    this.operatingAddrTemp = false;
  }
  toRegAdd(){
    this.regAdd = false;
    this.busAddrTemp = true;
    this.operatingAddrTemp = false;
  }
  toOperAdd(){
    this.operAdd = false;
    this.operatingAddrTemp = true;
    this.busAddrTemp = false;
  }
  getBusinessSettings() {
    //get company details
    this.companyName = sessionStorage.getItem("companyName");
    this.companySymbol = sessionStorage.getItem("companySymbol");
    this.country_of_incorporation = sessionStorage.getItem("country_of_incorporation");

    this.homeService.getBusinessSettings().subscribe(res => {
      if(res != undefined || res != null) {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          // this.alert.success(res['data']['message']);
          this.business_profile_data = res['data']['business_profile'];
          this.trading_name = this.business_profile_data.trading_name
          this.registeredAddress = this.business_profile_data['registered_address'];  

          // space between registered address
          this.regAddress = this.registeredAddress.split(",");
          this.regAddress.forEach(element => {
            this.registered_address += element+", "
          });
          this.business_reg_address = this.registered_address.substring(0,this.registered_address.length-2);
          
           // space between operating address
          this.operating_address = this.business_profile_data['operating_address'];
          this.opAddress = this.operating_address.split(",");
          this.opAddress.forEach(element => {
            this.operate_address += element+", "
          });
          this.business_operating_address = this.operate_address.substring(0,this.operate_address.length-2);
      
        }
        else {
          this.alert.error(res['data']['message']);
        }
      }
      else {
        this.alert.error(res['message']);
      }
    }
    })
  }
  getCountryDetails() {
    this.indexService.getCountryDetails().subscribe(res => {
      if(res['status']==0){
        if (res['data']['status'] == 0) {
          this.countryData = res['data']['country list'];
          let obj =  this.countryData.filter(element => element.country_id == this.userData.business_country_of_incorporation);
          let list=obj[0];
         
          this.country_name=list.country_name
          this.getRegisterdDetails();
          
          // this.busAddrForm.patchValue({
          //   'country_id':list['country_id']
          // })
          
        }
        else if(res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        }
      }
      else{
        this.alert.error(res['message'])
      }
    });
  }
  getRegisterdDetails(){
    this.homeService.getRegisterdDetails().subscribe(res =>{
      if(res['status']==0){
        if (res['data']['status'] == 0) {
          this.addressDetails = res['data']['addressDetails'][0];
          this.operDetails = res['data']['addressDetails'][1];
          if ((res['data']['addressDetails'][0].address_type == "BUSINESS_ADDRESS")) {
            this.busAddrForm.patchValue({
              'country_id' : this.countryData.filter(x => {return x.country_name == res['data']['addressDetails'][0].country_name})[0].country_id,
              'postal_code' : res['data']['addressDetails'][0].postal_code,
              'address_line1' : res['data']['addressDetails'][0].address_line1,
              'address_line2' : res['data']['addressDetails'][0].address_line2 == "null"? null : res['data']['addressDetails'][0].address_line2,
              'city' : res['data']['addressDetails'][0].city,
              'region' : res['data']['addressDetails'][0].region
            });
          }
           if ((res['data']['addressDetails'][1].address_type == "OPERATING_ADDRESS")) {
            this.operatingAddrForm.patchValue({
              'country_id' : this.countryData.filter(x => {return x.country_name == res['data']['addressDetails'][1].country_name})[0].country_id,
              'postal_code' : res['data']['addressDetails'][1].postal_code,
              'address_line1' : res['data']['addressDetails'][1].address_line1,
              'address_line2' : res['data']['addressDetails'][1].address_line2 == "null"? null : res['data']['addressDetails'][1].address_line2,
              'city' : res['data']['addressDetails'][1].city,
              'region' : res['data']['addressDetails'][1].region
            });
          }
        } else if(res['data']['status']==1){
          this.alert.error(res['message']);
        }
      } else if(res['status']==1){
        this.alert.error(res['message'])
      }
    })
  }
  submitBusAddr(formData: any) {
    this.regAdd = true;
    this.operAdd = false;
    this.busAddrTemp = false;
    this.operatingAddrTemp = false;
    formData.address_type_id = 2,
    formData.country=this.country_name;
    formData.account_type="business";
    formData.address_line2 = formData.address_line2 == null ? '' : formData.address_line2;
    this.apploader=true
    this.homeService.submitBusinessAddr(formData).subscribe(res => {
      if (res['status'] == 0) {
        this.apploader=false
        if (res['data']['status'] == 0) {
          this.busAddrTemp = false;
          this.getCountryDetails();
          this.addressDetails.map(element => {
            if(element.address_type_id == 3){
              this.operatingAddrForm.patchValue({
                'country_id' : this.countryData.filter(x => {return x.country_name == element.country_name})[0].country_id,
                'postal_code' : element.postal_code,
                'address_line1' : element.address_line1,
                'address_line2' : element.address_line2 == "null"? null : element.address_line2,
                'city' : element.city,
                'region' : element.region
              });
            }
          })
        
        } else if (res['data']['status'] == 1) {
          this.apploader=false
          this.alert.error(res['data']['message']);
        }
      }
      else {
        this.apploader=false
        this.alert.error(res['message'])
      }
    },
    err=>{
      this.apploader=false
    });
  }
  
  submitOperatingAddr(formData: any) {
    this.operAdd = true;
    this.regAdd = false;
    this.busAddrTemp = false;
    this.operatingAddrTemp = false;
    formData.address_type_id = 3;
    formData.country=this.country_name;
    formData.account_type="business";
    this.homeService.submitBusinessAddr(formData).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.loadContent = true;
          this.operatingAddrTemp = false;
          this.getCountryDetails();
          // this.getUpdatedStatus('business_address', 2);
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
  
  setBusAddr(value) {
    if (value.currentTarget.checked == true) {
      this.operatingAddrForm.patchValue({
        country_id: this.busAddrForm.get('country_id').value,
        postal_code: this.busAddrForm.get('postal_code').value,
        city: this.busAddrForm.get('city').value,
        address_line1: this.busAddrForm.get('address_line1').value,
        address_line2: this.busAddrForm.get('address_line2').value,
        region: this.busAddrForm.get('region').value,
      });
    }
    else if (value.currentTarget.checked == false) {
      this.operatingAddrForm.reset();
      
    }
  }
  ValidatePostal(control: AbstractControl) {
    let postalValue = control.value;
    if (postalValue == null) return null;
    
    let regex = new RegExp(/^[A-Za-z0-9- ]+$/);
    if (!regex.test(postalValue)) {
      return { invalidPostal: true };
    }
    else {
      let onlyNumeric = /^(?=.*[0-9- ])/;
      if (!postalValue.match(onlyNumeric)) {
        return { invalidPostal: true };
      }
    }
    return null;
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
      }
      } else if(res['status']==1){
      this.alert.error(res['message']);
    }
    });
    this.suppDocumRegistered=false;
    this.fileupload = false;
    this.businessProfile = true;
    this.editButton = true;
    this.regAdd = false;
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
       // this.alert.success(res['data']['message']);
        this.supportDocument = true;
        this.proofofOperating = false;
        this.activeClickOperating=true;
        this.documentStatus = "Submitted";
        this.authorityAddress=false;
      }
      } else if (res['status']==1){
        this.alert.error(res['message']);
      }
    });
    this.proofofOperating=false;
    this.fileupload = false;
    this.authorityAddress=false;
    this.businessProfile = true;
    this.editButton = true;
    this.operAdd = false;
  }
  
}
