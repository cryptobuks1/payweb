import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';

import { HomeService } from 'src/app/core/shared/home.service';
import { HomeComponent } from '../../home.component';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { IndexService } from 'src/app/core/shared/index.service';
@Component({
  selector: 'app-bulk-money-transfer',
  templateUrl: './bulk-money-transfer.component.html',
  styleUrls: ['./bulk-money-transfer.component.scss']
})
export class BulkMoneyTransferComponent implements OnInit {
  modalRef: BsModalRef;
  modalAmount: BsModalRef;
  bulkPaymentList: any;
  profileData: any;
  accountData: any;
  euroCurrency: any;
  euroBalance: any;
  totalAmount: any;
  userForm: FormGroup;
  selectedMyAcc: any;
  selectedAmount: any;
  bankBalance: any;
  bankCurrency: any;
  senderCurrency: any;
  balance: any;
  req: any;
  acc_type: any;
  kycStatus: any;
  arrayList: any=[];
  listAccounts: any;
  totalBalance: any;
  hideschedule:boolean=false;
  scheduleForm: FormGroup;
  notified: number;
  validDate: boolean = false;
  minDate: number;
  maxDate: number;
  apploader: boolean=false;
  MinimunDate: string;
  MaximumDate: string;
  insufficientBal: boolean;
  disabledform: boolean;
  accdata: any;
  removeVal: boolean;
  showSchedule: boolean;
  scheduleshow: boolean;
  isPersonal: boolean = false;
  dateYMD: any;
  valdate: boolean;
  csvBulkData: any;
  email: any;
  first_name: any;
  last_name: any;
  csvTotalAmount: any;
  csvPayment: any;
  failTransactions: any;
  successTransactions: any;
  sendFundsButton:boolean;
  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered'
  };

  constructor(
    private loader:HomeComponent,
    private modalService: BsModalService,
    public homeService:HomeService,
    private f: FormBuilder,
    public router: Router,
    private alert: NotificationService,
    private indexService: IndexService
  )
   {
    var date = new Date();
    this.minDate= date.setDate(date.getDate() + 1);
    this.maxDate= date.setDate(date.getDate() + 30);
    this.email = localStorage.getItem('email');
    this.homeService.recieveUpdatedUserData().subscribe(userInfo => {
      if(userInfo) {
        this.first_name = userInfo.firstName;
        this.last_name = userInfo.lastName;
      }
    })
      }
  ngOnInit() {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
    this.acc_type = this.profileData.account_type;
    this.getAccounts();
    this.userForm = this.f.group({
      selectedOption: [''],
      balance:['']
    });
    this.scheduleForm = this.f.group({
      dateYMD: [''],
      notify: [''],
    });
    this.senderCurrency = 'EUR';
    this.MinimunDate =this.convert(this.minDate)
    this.MaximumDate =this.convert(this.maxDate)
    this.homeService.getBulkPaymentsData().subscribe(data => {
  //  this.csvBulkData = JSON.parse(sessionStorage.getItem('csvDataList'));
      
      this.totalBalance = (data.TotalBalance).toFixed(2);
    })
    this.homeService.getCsv().subscribe(data => {
      this.csvPayment = data;
    })
    this.homeService.getBulkPaymentsBalance().subscribe(data => {
      this.csvTotalAmount = (data.TotalCsvBalance).toFixed(2);
    })
    this.homeService.getBulkPaymentsData().subscribe(data => {
      this.csvBulkData = data.csvDataList;
      this.bulkPaymentList = data.userDataList;
    })
  //  this.bulkPaymentList = JSON.parse(sessionStorage.getItem('userDataList'));
  //  this.totalBalance = JSON.parse(sessionStorage.getItem('TotalBalance'));
  //  this.csvBulkData = JSON.parse(sessionStorage.getItem('csvDataList'));
  //  this.csvTotalAmount = JSON.parse(sessionStorage.getItem('TotalCsvBalance'));
  //  this.csvPayment = JSON.parse(sessionStorage.getItem('csv'));
  }

  getShortName(name: string) {
    return name.charAt(0).toUpperCase()
  }
  scheduleinput(){

    this.scheduleForm.reset();
    this.validDate = false;
    this.hideschedule = !this.hideschedule;
    if(this.hideschedule) {
      this.scheduleshow = true;
    }
    else {
      this.scheduleshow = false;
      if(this.insufficientBal == true) {
        this.validDate = true;
        this.valdate = true
      }
    }
  }
  onSubmit() {

  }
  getAccounts(){
    this.loader.apploader=true;
    this.homeService.getAccounts().subscribe(res => {
      if(res['status']==0){
        if(res['data']['status']==0){
          this.accdata = res['data']['account'];
          this.accountData = this.accdata.filter((item) => item.status == 1);
          this.euroCurrency = this.accountData[0].currency;
        this.euroCurrency = this.accountData[0].currency;
        this.euroBalance = this.accountData[0].balance;
        this.totalAmount =this.euroBalance;
        this.loader.apploader=false;
        } else if(res['data']['status']==1){
          this.loader.apploader=false;
        }
       }else{
        this.loader.apploader=false;
        this.alert.error(res['message'])
      }
    });
  }
  changeAcc(e) {
    this.selectedMyAcc= e.target.value;
    this.selectedAmount = this.accountData.filter((item)=> item.currency == this.selectedMyAcc);
    this.bankBalance = this.selectedAmount[0].balance;
    this.bankCurrency = this.selectedAmount[0].currency;
    this.senderCurrency = this.userForm.value.selectedOption;
    this.totalAmount =this.bankBalance;
    this.bulkPaymentList.forEach(el => el.currency = this.senderCurrency);
  }
  paymentDetailsModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    if (this.bankCurrency) {
      if (this.bankBalance < this.totalBalance || this.bankBalance < this.csvTotalAmount) {
        this.insufficientBal =true;
      }
      else {
        this.insufficientBal =false;
      }
    }
    else {
      if(this.euroBalance < this.totalBalance || this.euroBalance < this.csvTotalAmount) {
        this.insufficientBal =true;
      }
      else {
        this.insufficientBal =false;
      }
    }
  }
  successfullySent(amount: TemplateRef<any>) {
    this.modalAmount = this.modalService.show(amount ,this.config);
    this.modalRef.hide();
  }
  continue() {
    if(this.acc_type == "personal") {
      this.isPersonal = true;
    this.router.navigateByUrl('/personal/payments_tab');
    } else {
      this.router.navigateByUrl('/business/payments_tab');
    }
    sessionStorage.removeItem('UserListDetails');
    sessionStorage.removeItem('TotalBalance');
    sessionStorage.removeItem('userDataList');
    this.modalAmount.hide();
  }
  editPayment() {
  //  sessionStorage.setItem('UserListDetails', JSON.stringify(this.bulkPaymentList));
  //  sessionStorage.setItem('TotalBalance', JSON.stringify(this.totalBalance));
  let bulkDetils = {}; 
  bulkDetils['TotalBalance'] = this.totalBalance;
  bulkDetils['UserListDetails'] = this.bulkPaymentList;
    this.homeService.setBulkPayments(bulkDetils);
    if(this.acc_type == "personal") {
    this.router.navigateByUrl('/personal/payments_tab/bulk-money-transfer');
    } else {
      this.router.navigateByUrl('/business/payments_tab/bulk-money-transfer');
    }
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  dateVal(e) {
    if ((this.convert(this.minDate) > this.scheduleForm.controls['dateYMD'].value) || (this.convert(this.maxDate) < this.scheduleForm.controls['dateYMD'].value)) {
      this.validDate = true;
    }
    else {
      this.validDate = false;
    }

    if(!this.validDate) {
      this.disabledform= true;
    }
    else {
      this.disabledform= false;
    }

  }
  bulkTransfer(amount) {
    this.modalRef.hide();
    this.sendFundsButton = true;
    if (this.scheduleForm.value.notify == true) {
      this.notified = 1
    } else if (this.scheduleForm.value.notify == false) {
      this.notified = 0
    }
    if (this.csvPayment) {
      this.csvBulkData.forEach(element => {
        this.listAccounts = {
          "from_currency": this.senderCurrency,
          "to_mobile": element['Phone number of counterparty'],
          "to_currency": element['Recipient account currency'],
          "amount": element['Amount'],
          "description": element['Reference']
        }
        this.arrayList.push(this.listAccounts)
      });
      this.req = {
        "from_currency": this.senderCurrency,
        "transaction_list": this.arrayList,
        'to_currency': this.senderCurrency,
        "transfer_time": this.scheduleForm.value.dateYMD,
        "do_notify": '',
        "isCsv": true
      };
    } else {
      this.bulkPaymentList.forEach(element => {
        if (element.is_non_payvoo_user === 1) {
          this.listAccounts = {
            'sender_name': `${this.first_name} ${this.last_name}`,
            'receiver': element.full_name,
            'receiver_mobile': 'not given',
            'email': element.email,
            'sender_email': this.email,
            'from_currency': this.senderCurrency,
            'to_mobile': 'not given',
            'to_currency': this.senderCurrency,
            'amount': element.balance,
            'description': 'Payment to a non payvoo user',
            'is_non_payvoo_user': 1
          };
        } else {
          this.listAccounts = {
            'from_currency': this.senderCurrency,
            'to_mobile': element.mobile,
            'to_currency': this.senderCurrency,
            'amount': element.balance,
            'description': element.referenceText
          };
        }
        this.arrayList.push(this.listAccounts);
      });
      this.req = {
        'from_currency': this.senderCurrency,
        'to_currency': this.senderCurrency,
        'transaction_list': this.arrayList,
        'transfer_time': this.scheduleForm.value.dateYMD,
        'do_notify': '',
      };
    }

    this.homeService.setPaymentRequest(this.req);
    this.apploader = true;
    // this.homeService.singleTransfer(this.req).subscribe(res => {
    //   if (res['status'] === 0) {
    //     this.apploader = false;
    //     if (res['data']['status'] === 0) {
    //       if (res['data']['total_fail_trans'] === 1) {
    //         this.alert.error(res['data'].list_of_fail_trans[0].TransRes.message);
    //         this.modalRef.hide();
    //       } else {
    //         sessionStorage.removeItem('TotalBalance')
    //         sessionStorage.removeItem('csvDataList')
    //         sessionStorage.removeItem('TotalCsvBalance')
    //         sessionStorage.removeItem('csv')
    //         sessionStorage.removeItem('userDataList');
             if (this.acc_type === 'business'){
               this.router.navigate(['/business/payments_tab/sms'], { queryParams: { name: 'bulk', bankCurrency:this.bankCurrency, euroCurrency:this.euroCurrency,bulkPaymentList:this.bulkPaymentList, totalBalance:this.totalBalance, csvTotalAmount:this.csvTotalAmount, amountSent: this.userForm.value.balance } });
             }
            
    //         // this.modalAmount = this.modalService.show(amount, this.config);
    //         // this.modalRef.hide();
    //       }
    //     } else if (res['data']['status'] === 1) {
    //       this.apploader = false;
    //       this.alert.warn(res['data']['message']);
    //     }
    //   } else if (res['status'] === 1) {
    //     this.apploader = false;
    //     this.alert.error(res['data']['message']);
    //   }
    //   this.failTransactions = res['data']['total_fail_trans'];
    //   this.successTransactions = res['data']['no_of_scheduled_transactions'];
    // });
  }
}
