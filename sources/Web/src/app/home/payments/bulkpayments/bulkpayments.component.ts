import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Papa } from 'ngx-papaparse';
import { saveAs } from 'file-saver';

import { HomeService } from 'src/app/core/shared/home.service';
import { IndexService } from 'src/app/core/shared/index.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { EventEmitterService } from '../../accounts/exchange/event-emitter.service';
import { HomeDataService } from '../../homeData.service';

@Component({
  selector: 'app-bulkpayments',
  templateUrl: './bulkpayments.component.html',
  styleUrls: ['./bulkpayments.component.scss']
})
export class BulkpaymentsComponent implements OnInit {
 // @Output() csvPayment: EventEmitter<boolean> = new EventEmitter();
  dropdown: any;
  cuntrieslist: any;
  userData: any;
  country_name: any;
  calling_code: any;
  combined: any;
  userInfo: any;
  private subs = new SubSink();
  existMobile: any;
  counterParties: any;
  detail: any;
  acc_type: any;
  selected: any;
  checkedList = [];
  selectedRow: any;
  searchText: any;
 list = [];
  results: any;
  bulkPaymentList: any;
  csvPayment: boolean =false;
  input: any;
  infoArea: any;
  fileUploadName: boolean = false;
  close: string;
  uploadForm: FormGroup;
  fileupload: string;
  isPersonal: boolean = false;
  fileName: any;
  myObject = {};
  mobile: any;

  constructor(private fb: FormBuilder,public emitter:EventEmitterService,private papa: Papa,private homeDataService: HomeDataService,
    private router:Router,private homeService: HomeService, private indexService: IndexService, private alert: NotificationService) { }

  ngOnInit() {
    this.getCountriesList()
  //  this.getBulkPaymentList();
    this.getCuntries();
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.userInfo = this.userData;
    this.acc_type = this.userInfo.account_type;
    this.searchText = '';
    this.subs.sink = this.homeDataService.getMobile().subscribe(data => {
      this.mobile = data;            
    })
    this.uploadForm = this.fb.group({
    })
  }
  csvUpload() {
    this.csvPayment = true;
    this.homeService.setCsv(this.csvPayment);
  }

  backToBulk() {
    this.csvPayment = false;
    this.homeService.setCsv(this.csvPayment);
  }

  // getBulkPaymentList() {
  //   this.homeService.getBulkPaymentList().subscribe(res => {
  //     if(res['status']==0){
  //       this.counterParties = res['data'].results;
  //       if(this.counterParties) {
  //         this.counterParties = this.counterParties.map((ele: { selectORunselect: boolean; })=> {
  //           ele.selectORunselect=false;
  //           return ele;
  //         })
  //       }
  //      } else if(res['status']==1){
  //       this.alert.error(res['message']);
  //     }
  //   });

  // }

  continue(counterParty) {
    let bulkDetails = {};
    this.createMobileOTP();
   // sessionStorage.setItem('UserListDetails', JSON.stringify(this.selected));
   bulkDetails['UserListDetails'] = this.selected;
   this.homeService.setBulkPayments(bulkDetails);
    if(this.acc_type === 'personal') {
      this.isPersonal = true;
      this.router.navigate(['/personal/payments/sms'], { queryParams: { name: 'bulk' } });
    } else if(this.acc_type === 'business'){
      this.router.navigate(['/business/payments_tab/sms'], { queryParams: { name: 'bulk' } });
    }
  }

  getCountriesList() {
    this.homeService.getCounterParty().subscribe(res => {
      if(res['status']==0){
        this.counterParties = res['data'].results;
        if(this.counterParties) {
          this.counterParties = this.counterParties.map((ele: { selectORunselect: boolean; })=> {
            ele.selectORunselect=false;
            return ele;
          })
        }
       } else if(res['status']==1){
        this.alert.error(res['message']);
      }
    });
  }
  getShortName(name: string) {
    return name.charAt(0).toUpperCase()
  }
  getCuntries(){
    this.homeService.getCountryDetails().subscribe(res => {
     if(res['status']==0) {
          if (res['data']['status'] == 1) {
        } else if(res['data']['status']==0) {
          this.cuntrieslist = res['data']['country list'];
          this.cuntrieslist.forEach(element => {
            if(element.country_id == this.userData['country_id']){
              this.country_name = element.country_name;
              this.calling_code = element.calling_code;
              this.combined = this.calling_code + this.userInfo.mobile;
            }
          });
        }
      }
    });
  }

  onCheckboxChange(counterParty, event,index) {
      if(event.target.checked) {
        this.checkedList.push(counterParty);
      } else {
        this.checkedList.splice(index,1);
      }
  }

  next() {
    if(this.csvPayment) {
    let bulkDetils = {};
    this.myObject['file_name'] = this.fileName;

    this.subs.sink = this.indexService.uploadCsv(this.myObject).subscribe(res => {  
 //   this.createMobileOTP();
  //  sessionStorage.setItem('UserListDetails', JSON.stringify(this.checkedList));
  //  sessionStorage.setItem('bulkList', JSON.stringify(this.bulkPaymentList));
    bulkDetils['bulkList'] = this.bulkPaymentList;
    bulkDetils['UserListDetails'] = this.checkedList;
    this.homeService.setBulkPayments(bulkDetils);
    if (this.acc_type === 'personal') {
      this.router.navigate(['/personal/payments/sms'], { queryParams: { name: 'bulk' } });
    } else if (this.acc_type === 'business') {
      this.router.navigate(['/business/payments_tab/bulk-money-transfer'], { queryParams: { name: 'bulk' } });
    }
  })
} else {
//  this.createMobileOTP();
 let bulkDetils = {}; 
  bulkDetils['bulkList'] = this.bulkPaymentList;
  bulkDetils['UserListDetails'] = this.checkedList;
  this.homeService.setBulkPayments(bulkDetils);
  this.homeService.setCsv(false);
  if (this.acc_type === 'personal') {
    this.router.navigate(['/personal/payments/sms'], { queryParams: { name: 'bulk' } });
  } else if (this.acc_type === 'business') {
    this.router.navigate(['/business/payments_tab/bulk-money-transfer'], { queryParams: { name: 'bulk' } });
  }
}
  }

  sendUserListDetails(counterParty,index) {
     counterParty.selectORunselect=!counterParty.selectORunselect;
     if(counterParty.selectORunselect) {
      this.checkedList.push(counterParty);
    } else {
    this.checkedList= this.checkedList.filter(ele => ele.counterparty_id!=counterParty.counterparty_id);
    }
  }

  createMobileOTP() {
    let obj = { 'userId': this.mobile, 'type': "personal" }
    this.subs.sink = this.indexService.duplicateEmailMobile(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 1) {
          this.existMobile = res['data']['message'];
        }
        else if (res['data']['status'] == 0) {
          this.subs.sink = this.indexService.createOTP(this.mobile).subscribe(res => {
            if (res['status'] == 0) {
              if (res['data']['status'] == 0) {
                this.existMobile = res['data']['message'];
              }
              if (res['data']['status'] == 3) {
                this.existMobile = res['data']['message'];
              }
              if (res.data.status == 4) {
                this.existMobile = res['data']['message'];
              }
              if (res['data']['status'] == 1) {
                this.existMobile = res['data']['message'];
              }
            }
            else {
              this.alert.error(res['message'])
            }
          });
        }
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }
  handleFileSelect(evt) {
    this.input = document.getElementById( 'file-upload' );
    this.infoArea = document.getElementById( 'file-upload-filename' );
    this.infoArea.textContent = this.input.files[0].name;
    if (this.infoArea.textContent !='') {
      this.fileUploadName = true;
    }
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    var file_name = file.name;
    this.fileName = file_name;
    reader.readAsText(file);
    reader.onload = (event: any) => {
      var csv = event.target.result;
      var base64textString = btoa(csv);
      this.myObject['file_content'] = base64textString;
      this.papa.parse(csv, {
        skipEmptyLines: true,
        header: true,
        complete: (results) => {
          this.bulkPaymentList = results.data;
        }
      });
    }
    this.emitter.myEvent.emit('csvUpload');
  }
  clearFile() {
    this.fileUploadName = false;
    //this.uploadForm.reset();
    this.infoArea.textContent = '';
  }

  getBulkPaymentSample() {
    this.homeService.getBulkPaymentsSampleTemplate().subscribe(res => {
      const blob = new Blob([res], { type: 'text/csv' });
      const file = new File([blob], 'bulk_payments_template' + '.csv', { type: 'text/csv' });
      saveAs(file);
    });
  }
}
