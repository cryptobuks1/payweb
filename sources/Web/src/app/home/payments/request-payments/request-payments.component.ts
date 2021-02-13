import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';

import { HomeDataService } from '../../homeData.service';
import { HomeService } from 'src/app/core/shared/home.service';
import { SubSink } from 'subsink';
declare var $:any;

@Component({
  selector: 'app-request-payments',
  templateUrl: './request-payments.component.html',
  styleUrls: ['./request-payments.component.scss']
})
export class RequestPaymentsComponent implements OnInit, OnDestroy {


  private subs = new SubSink();
  requestFromSelected = false;
  counterParty: any;
  currencyList: any;
  counterPartyMember: any;
  phone: any;
  email:any;
  selectedBenificiary: any;
  benificiaryCurrency: any;
  benCurrency: any;
  receiverCurrency: any;
  profileForm: any;
  loader: any;
  accdata: any;
  accountData: any;
  euroCurrency: any;
  euroBalance: any;
  totalAmount: any;
  alert: any;
  selectedMyAcc: any;
  selectedAmount: any;
  bankBalance: any;
  bankCurrency: any;
  senderCurrency: any;
  zeroBalance: any;
  fee: any;
  firstName: any;
  lastName: any;
  profileData: any;
  requestMoneyInSinglePaymentComponent = true;
  requestingAmount: any;
  modalAmount: BsModalRef;
  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered'
  };
  userData: any;
  uniqueLinkToPayNonPayvooUser: any;


  constructor(private homeDataService: HomeDataService,
    private homeService: HomeService,
    private router: Router,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getAccounts();
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
  }

  getCurrencyList() {
    if (this.phone) {
      this.subs.sink = this.homeService.getAccounts().subscribe(res => {
        if (res['status'] === 0) {
          if (res['data']['status'] === 0) {
            this.currencyList = res['data']['account'];
            this.changeAcc({
              target: {
                value: this.currencyList[0].currency
              }
            });
          }
        }
      });
    } else {
    this.homeService.getAccounts().subscribe(res => {
      if(res['status']==0){
      if(res['data']['status']==0){
        this.currencyList = res['data']['account'];
      } else if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      } } else {
        this.alert.error(res['message'])
      }
    })
  
    }
    if (this.email) {
      this.subs.sink = this.homeService.getAccounts().subscribe(res => {
        if (res['status'] === 0) {
          if (res['data']['status'] === 0) {
            this.currencyList = res['data']['account'];
            this.changeAcc({
              target: {
                value: this.currencyList[0].currency
              }
            });
          }
        }
      });
    } else {
    this.homeService.getAccounts().subscribe(res => {
      if(res['status']==0){
      if(res['data']['status']==0){
        this.currencyList = res['data']['account'];
      } else if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      } } else {
        this.alert.error(res['message'])
      }
    })
  
    }
  }

  requestFromSelectedCounterParty(counterParty) {
    this.requestFromSelected = true;
    this.homeDataService.setIsRequestPayment(true);
    this.phone = counterParty.mobile;
    this.email = counterParty.email
    this.counterParty = counterParty;
    this.getCurrencyList();
  }

  getAccounts() {
    this.subs.sink = this.homeService.getAccounts().subscribe(res => {
      if (res['status'] === 0) {
        if (res['data']['status'] === 0) {
          this.accdata = res['data']['account'];
          this.accountData = this.accdata.filter((item) => item.status === 1);
          this.euroCurrency = this.accountData[0].currency;
          this.euroBalance = this.accountData[0].balance;
          this.totalAmount = this.euroBalance;
        }
      }
    });
  }

  changeAcc(e) {
    this.selectedMyAcc = e.target.value;
    this.selectedAmount = this.accountData.filter((item) => item.currency === this.selectedMyAcc);
    this.bankBalance = this.selectedAmount[0].balance;
    this.bankCurrency = this.selectedAmount[0].currency;
    this.totalAmount = this.bankBalance;
  }

  onlyNumberKey(event) {
    var ctl = document.getElementById('myText');
    var startPos = ctl['selectionStart'];

    if (startPos == 0 && String.fromCharCode(event.which) == '0') {
      return false
    }
    return (event.charCode === 8 || event.charCode === 0 || event.charCode === 46) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  checkbalance(e) {
    if(e.length > 6){
      document.getElementById("myText").style.fontSize = "30px";
    }else {
      document.getElementById("myText").style.fontSize = "50px";
    }
    if (e <= 0) {
      this.zeroBalance = true;
    } else {
      this.zeroBalance = false;
    }
  }

  requestFunds(template: TemplateRef<any>) {
    this.homeService.recieveUpdatedUserData().subscribe(userInfo => {
      if(userInfo) {
        this.firstName = userInfo.firstName;
        this.lastName = userInfo.lastName;
      }
    })
    const details = {
      requestedFrom: this.counterParty.full_name,
      requestedBy: `${this.firstName} ${this.lastName}`,
      requestedByEmail: this.counterParty.email,
      requestedAmount: this.requestingAmount,
      requestedCurrency: this.bankCurrency
    };
    this.subs.sink = this.homeService.requestFunds(details).subscribe(data => {
      this.modalAmount = this.modalService.show(template, this.config);
      if(data['status'] == 0) {
        if(data['data']) {
          this.uniqueLinkToPayNonPayvooUser = data['data']['message'];
        }
    }
    });
  }
  requestFunds4Non(template: TemplateRef<any>) {
    this.homeService.recieveUpdatedUserData().subscribe(userInfo => {
      if(userInfo) {
        this.firstName = userInfo.firstName;
        this.lastName = userInfo.lastName;
      }
    })
    const details = {
      requestedFrom: this.counterParty.full_name,
      requestedBy: `${this.firstName} ${this.lastName}`,
      requestedByEmail: this.counterParty.email,
      requestedAmount: this.requestingAmount,
      requestedCurrency: this.bankCurrency
    };
    this.subs.sink = this.homeService.requestFundsNonPayvooUser(details).subscribe(data => {
      this.modalAmount = this.modalService.show(template, this.config);
      if(data['status'] == 0) {
        if(data['data']['uniquePaymentId']) {
      this.uniqueLinkToPayNonPayvooUser = data['data']['uniquePaymentUrl2'];
        }
    }
    });
  }
  continue() {
    this.modalAmount.hide();
    if(this.userData.account_type == "personal") {
    this.router.navigate(['/personal/payments']);
    } else {
      this.router.navigate(['business/payments']);
    }
  }
  onBack(){
    if(this.userData.account_type == "personal") {
      this.router.navigate(['/personal/payments']);
      } else {
        this.router.navigate(['/business/payments']);
      }
    }
  ngOnDestroy() {
    this.homeDataService.setIsRequestPayment(false);
    this.subs.unsubscribe();
  }

}
