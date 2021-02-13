import { Component, OnInit, TemplateRef, ɵConsole } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { HomeService } from 'src/app/core/shared/home.service';
import { FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { HomeComponent } from '../../home.component';
import { Validators } from '@angular/forms';
import { LocationStrategy } from '@angular/common';
import { IndexService } from 'src/app/core/shared/index.service';

declare var $: any;

@Component({
  selector: 'app-single-money-transfer',
  templateUrl: './single-money-transfer.component.html',
  styleUrls: ['./single-money-transfer.component.scss']
})
export class SingleMoneyTransferComponent implements OnInit {

  modalRef: BsModalRef;
  modalAmount: BsModalRef;
  accountData: any;
  selectedOption: any;
  selectedAmount: any;
  bankBalance: any =0;
  bankCurrency: any;
  currencyType: any;
  counterPartyMember: any;

  fee: any;
  selectedMyAcc: any;
  selectedBenificiary: any;
  benificiaryCurrency: any;
  bCurrencyCode: any;
  balance: any;
  defaultCurrency: any;
  euro: any;
  euroBalance: any;
  euroCurrency: any;
  currencyList: any;
  phone: number;
  bCurrencyCurrency: any;
  benDefaultCurrency: any;
  euroDefCurrency: any;
  euroDefBalance: any;
  benCurrency: any;
  selectBen: string;
  profileForm: FormGroup;
  req: any;
  senderCurrency: any;
  receiverCurrency: string;
  totalAmount: string;
  SuccessModal: boolean;
  balanceError: boolean;
  profileData: any;
  scheduleForm: FormGroup;
  notified: number;
  transaction_list: any;
  acc_type: any;
  givenBalance: any;

  minDate: any;
  maxDate: any;
  validDate: boolean = false;
  zeroBalance: boolean = false;
  input_display: boolean = false;
  isPersonal: boolean = false;
  apploader: boolean=false;
  MinimunDate: string;
  MaximumDate: string;
  insufficientBal: boolean;
  disabledform: boolean;
  transferDate: any;
  todayDate: number;
  schedulePayment: any;
  accdata: any;
  removeVal: boolean;
  showSchedule: boolean;
  scheduleshow: boolean;
  dateYMD: any;
  valdate: boolean;
  sendFundsButton:boolean;
  applicantId: any;
  uniqueLinkToPayNonPayvooUser;
  amountSent;
  firstName: any;
  lastName: any;
  email: any;



  constructor(private form: FormBuilder, private modalService: BsModalService, private homeService: HomeService,
              private fb: FormBuilder, private router: Router, private alert: NotificationService,
              private loader: HomeComponent, private locationStrategy: LocationStrategy,
              private indexService: IndexService) {
                
    var date = new Date();
    this.todayDate = date.setDate(date.getDate());
    this.minDate = date.setDate(date.getDate() + 1);
    this.maxDate = date.setDate(date.getDate() + 30);
    this.email = localStorage.getItem('email');
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered'
  };
  inputDisplay() {
    this.scheduleForm.reset();
    this.validDate = false;
    this.input_display = !this.input_display;
    if(this.input_display) {
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
  ngOnInit() {
    this.homeService.getSenderDetails().subscribe(data => {
      this.counterPartyMember = data;
    })
    this.preventBackButton();
    this.getAccounts()
    this.getCounterPartyCurrencies();
    this.getBeneficiaryAccounts();
    this.profileForm = this.fb.group({
      selectedOption: [''],
      balance: ['', Validators.required],
      selectBen: ['']
    });
    this.scheduleForm = this.fb.group({
      dateYMD: [''],
      reference: [''],
      notify: ['']
    });
    this.senderCurrency = 'EUR';
    this.receiverCurrency = 'EUR';
    this.MinimunDate =this.convert(this.minDate)
    this.MaximumDate =this.convert(this.maxDate)
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));  
    this.acc_type = this.profileData.account_type;
    this.homeService.recieveUpdatedUserData().subscribe(userInfo => {
      if(userInfo) {
        this.firstName = userInfo.firstName;
        this.lastName = userInfo.lastName;
      }
    })
  }
  checkbalance1(e) {
    if(e.length > 6){
      document.getElementById("myText").style.fontSize = "30px";
    }else {
      document.getElementById("myText").style.fontSize = "50px";
    }
    if((this.euroBalance) < (this.profileForm.controls['balance'].value)) {
      this.alert.error("Insufficient funds");
      $(".continue_btn").prop("disabled", true);
    }else {
      $(".continue_btn").prop("disabled", false);
    }
    if (this.profileForm.controls['balance'].value <= 0) {
      this.zeroBalance = true;
    } else {
      this.zeroBalance = false;
    }
  }  
  checkbalance2(e) {
    if((this.bankBalance) < this.profileForm.controls['balance'].value) {
      this.alert.error("Auto-Exchange will not be processed if your account doesn't have enough funds at the required time")
    }
    if (this.profileForm.controls['balance'].value <= 0) {
      this.zeroBalance = true;
    } else {
      this.zeroBalance = false;
    }
  }
  onlyNumberKey(event) {
    var ctl = document.getElementById('myText');
    var startPos = ctl['selectionStart'];

    if (startPos == 0 && String.fromCharCode(event.which) == '0') {
      return false
    }
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 46) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  onSubmit() {
  }

  getBeneficiaryAccounts() {
   // this.counterPartyMember = JSON.parse(sessionStorage.getItem('UserDetails'));
    this.phone = this.counterPartyMember.mobile;
  }

  paymentDetailsModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    if (this.bankCurrency) {
      if (this.bankBalance < this.profileForm.controls['balance'].value) {
        this.insufficientBal =true;
      }
      else {
        this.insufficientBal =false;

      }
    }
    else {
      if(this.euroBalance < this.profileForm.controls['balance'].value) {
        this.insufficientBal =true;
      }
      else {
        this.insufficientBal =false;

      }
    }
  }

  getAccounts() {
    this.loader.apploader = true;
    this.homeService.getAccounts().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.accdata = res['data']['account'];
          this.accountData = this.accdata.filter((item) => item.status == 1);
          this.euroCurrency = this.accountData[0].currency;
          this.euroBalance = this.accountData[0].balance;
          this.totalAmount = this.euroBalance;
          this.loader.apploader = false;
        } else if (res['data']['status'] == 1) {
          this.loader.apploader = false;
        }
      } else {
        this.loader.apploader = false;
        this.alert.error(res['message'])
      }
    });
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  getCounterPartyCurrencies() {
    this.getBeneficiaryAccounts();
    this.loader.apploader = true;
    if (this.phone) {
      this.homeService.getCounterPartyCurrencyList(this.phone).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            this.currencyList = res['data']['currencyList'];
            this.euroDefCurrency = this.currencyList[0].currency;
            this.applicantId = this.currencyList[0].applicant_id;
            this.loader.apploader = false;
          } else if (res['data']['status'] == 1) {
            this.loader.apploader = false;
          }
        } else {
          this.loader.apploader = false;
          this.alert.error(res['message'])
        }
      });
    }
  }

  changeAcc(e) {
    this.selectedMyAcc = e.target.value;
    this.selectedAmount = this.accountData.filter((item) => item.currency == this.selectedMyAcc);
    this.bankBalance = this.selectedAmount[0].balance;
    this.bankCurrency = this.selectedAmount[0].currency
    this.euroBalance = this.selectedAmount[0].balance;
    this.euroCurrency = this.selectedAmount[0].currency
    this.senderCurrency = this.profileForm.value.selectedOption;
    this.totalAmount = this.bankBalance;
    this.receiverCurrency = this.senderCurrency;
  }

  changeBen(e) {
    this.selectedBenificiary = e.target.value;
    this.benificiaryCurrency = this.currencyList.filter((item) => item.currency == this.selectedBenificiary);
    this.benCurrency = this.benificiaryCurrency[0].currency;
    this.receiverCurrency = this.profileForm.value.selectBen;
  }

  continue() {
    if (this.modalAmount) {
      this.modalAmount.hide();
    }
    if (this.acc_type === 'personal') {
      this.isPersonal = true;
      this.router.navigateByUrl('/personal/payments');
    } else if (this.acc_type === 'business') {
      this.router.navigateByUrl('/business/payments_tab');
    }
    sessionStorage.removeItem('UserDetails')
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
  singleTransfer(amount) {
    this.modalRef.hide();
    this.sendFundsButton = true;  
    if (this.scheduleForm.value.notify == true) {
      this.notified = 1
    }
    else if (this.scheduleForm.value.notify == false) {
      this.notified = 0
    }
    this.req = {
      "from_currency": this.senderCurrency,
      "transaction_list": [{
        "receiver": this.counterPartyMember.full_name,
        "receiver_applicant_id": this.applicantId,
        "email": this.counterPartyMember.email,
        "from_currency": this.senderCurrency,
        "to_mobile": this.counterPartyMember.mobile,
        "to_currency": this.receiverCurrency,
        "amount": this.profileForm.value.balance,
        "description": this.scheduleForm.value.reference ? this.scheduleForm.value.reference : '',
        "sender_name": `${this.firstName} ${this.lastName}`,
        "sender_email": this.email,
        "transaction_time": this.getCurrentTimeStamp()
      }],
      "transfer_time": this.scheduleForm.value.dateYMD,
      "do_notify": this.notified
    }
    this.homeService.setPaymentRequest(this.req);
    this.apploader=true;
    if (this.counterPartyMember.is_non_payvoo_user === 1) {
      // this.homeService.sendMoneyToNonPayvooUser(this.req).subscribe((res: any) => {
      //   if(res['status'] == 0) {
      //     if(res['data']['uniquePaymentId']) {
      //   this.uniqueLinkToPayNonPayvooUser = res['data']['uniquePaymentUrl'];
      //   this.apploader = false;
      //   this.amountSent = this.profileForm.value.balance;
      //   $('#sentNonPayvooUser').modal('show');
      //     }
      // }
      // });
      if (this.acc_type === 'personal') {   
        this.router.navigate(['/personal/payments/password'], { queryParams: { name: 'single', amountSent: this.profileForm.value.balance,bankCurrency:this.bankCurrency, euroCurrency:this.euroCurrency } });
       } else {
       this.router.navigate(['/business/payments_tab/sms'], { queryParams: { name: 'single', amountSent: this.profileForm.value.balance, bankCurrency:this.bankCurrency, euroCurrency:this.euroCurrency } });
     }
    } else {
      // this.homeService.singleTransfer(this.req).subscribe(res => {
      //   if (res['status'] === 0) {
      //     this.apploader=false;
      //     if (res['data']['status'] === 0) {
      //       if (res['data']['total_fail_trans'] === 1) {
      //         this.alert.error(res['data'].list_of_fail_trans[0].TransRes.message);
      //         this.modalRef.hide();
      //       } else {
               if (this.acc_type === 'personal') {   
                this.router.navigate(['/personal/payments/password'], { queryParams: { name: 'single', amountSent: this.profileForm.value.balance,bankCurrency:this.bankCurrency, euroCurrency:this.euroCurrency } });
               } else {
               this.router.navigate(['/business/payments_tab/sms'], { queryParams: { name: 'single', amountSent: this.profileForm.value.balance, bankCurrency:this.bankCurrency, euroCurrency:this.euroCurrency } });
             }
             //  this.modalAmount = this.modalService.show(amount,this.config);
              this.modalRef.hide();
      //       }
      //     } else if (res['data']['status'] === 1) {
      //       this.apploader=false;
      //       this.alert.warn(res['data']['message']);
      //     }
      //   } else if (res['status'] === 1) {
      //     this.apploader=false;
      //     this.alert.error(res['data']['message']);
      //   }
      // });
    }
  }

  getCurrentTimeStamp() {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let timeStamp = date + ' ' + time;
    //let GMTimeStamp = dateFormat(timeStamp,' : yyyy:mm:dd hh:MM:ss');
    return timeStamp;
  }

  convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
  
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
  
    newDate.setHours(hours - offset);
  
    return newDate;   
  }

  hideOk() {
    this.continue();
  } 
}
