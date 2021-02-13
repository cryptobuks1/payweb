import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SepaService } from 'src/app/sepa.service';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
declare var $;
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  currencyname:any="EUR";
  currencyvalue:any;
  card: any;
  currency: void;
  selectedCardCvv = ''
  accounts: any;
  cards: any;
  showCard: boolean;
  displayCard: boolean = true;
  sandBoxCard: FormGroup;
  month: any;
  year: any;
  showCards: boolean = false;
  money: any;
  totalAmount: string;
  orderDetails: string;
  ShowCvv: boolean;
  checkboxCard: boolean = false;
  selectedCard: any = '';
  selectedCurrency: any = 'EUR';
  selectAccountNumber: any;
  selectedAccountBalance;
  selectedAccountDetails: any;
  checkboxdisable: boolean;
  checkboxenable: boolean = true;
  obj: {};
  loadingButton = false;
  continueBtn: any;
  cardNumber: { "card_month": number; "card_number": string; "card_type": string; "card_year": number; "default_card": number; "name_on_card": string; "payment_cards_id": number; };
  payingCurrency: any;
  toCurrency: any;
  fromCurrency: any;
  convertedAmount: any;
  totalamount: any;

  constructor(private service: SepaService,private locationStrategy: LocationStrategy, private router: Router) { }

  ngOnInit() {
    this.preventBackButton();
    this.getCards();
    this.getAccounts();
    
    $(document).ready(function(){
      $(".per").on("click", function() {
        $(".collapse").collapse('hide');
     });
  //    $(".pointer").on("blur", function() {
  //     $(".collapse").collapse('hide');
  //  });
    });
  }



  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  arr = [];
  getCards() {
    this.service.getCustomerCards().subscribe(res => {
      this.cards = res['data']['cards'];
    })
  }

  getAccounts() {
    this.service.getCustomerAccount().subscribe(res => {
      this.orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
      this.totalAmount = this.orderDetails;
      this.totalamount = this.totalAmount['amount'];
      this.convertedAmount = this.orderDetails['amount'];
      this.toCurrency = this.payingCurrency
      this.payingCurrency = this.totalAmount['currency']
      this.accounts = res['data']['account'];
      if (this.selectedCurrency != '') {
        this.getAccountCurreny(this.selectedCurrency);
      }
      else {
        this.getAccountCurreny('EUR');
      }
    })
  }
  addCard() {
    this.router.navigate(['/add-card']);
    this.showCard = true;
    this.displayCard = false;
  }

  displayCards() {
    this.showCard = false;
    this.displayCard = true;
  }

  checkbox(data) {
    if (data == 'true') {
      this.checkboxdisable = true;
      this.checkboxenable = false;
      this.showCards = true;
    }
    else {
      this.checkboxdisable = false;
      this.checkboxenable = true;
      this.showCards = false;
      this.continueBtn = true;
    }
  }

 


  cvv(data) {
    this.continueBtn = true;
    this.selectedCardCvv = data;
    if (data.length == 3) {
      this.continueBtn = false;
    }
  }



  getAccountCurreny(data) {
    this.continueBtn = false;
    let obj = {
      "currency": data
    }
    this.service.getAccountByCurrency(obj).subscribe(res => {

      let accountNo = res['data']['account'][0]
      this.selectedAccountDetails = accountNo;
      this.money = this.selectedAccountDetails['balance'];
      this.currencyvalue=this.money;
      if (this.money < this.convertedAmount) {
        this.continueBtn = true;
      }
      this.selectAccountNumber = this.selectedAccountDetails['account_no'];
    })
  }


  abc: any;
  radiobtn(data, card) {
    this.selectedCard = card
    this.ShowCvv = true;
    this.continueBtn = false;
  }


  currencyType(data) {
    //this.selectedCurrency = data.slice(0, 3);
    this.selectedCurrency=data.currency;   
    this.currencyname=data.currency;
    this.currencyvalue=data.balance;
    this.getAccountCurreny(this.selectedCurrency);
    let obj = {
      fromCurrency: this.selectedCurrency,
      toCurrency: this.orderDetails['currency'],
      amount: JSON.stringify(this.orderDetails['amount'])
    }
    this.service.getExchangeRates(obj).subscribe(res => {
      this.convertedAmount = res['data']['amount'];
    })

  }

  roundOff(data) {
    return Math.round(data * 100) / 100;
  }

  paySandbox() {
    this.loadingButton = true;
    if (Math.round(this.convertedAmount * 100) / 100 <= Math.round(this.money * 100) / 100) {
      this.obj = {
        "orderDescriptor": this.orderDetails['order_id'],
        "amount": Math.round(this.convertedAmount * 100)/100,
        "currency": this.selectedCurrency,
        "account_number": this.selectAccountNumber,
        "from_currency": this.selectedCurrency,
        "to_currency": this.orderDetails['currency'],
        "to_mobile": this.orderDetails['mobile']
      }
    }
    else {
      this.obj = {
        "orderDescriptor": this.orderDetails['order_id'],
        "amount":Math.round(this.convertedAmount * 100)/100,
        "payment_cards_id": this.selectedCard['payment_cards_id'],
        "currency": this.selectedCurrency,
        "account_number": this.selectAccountNumber,
        "card_cvv": this.selectedCardCvv,
        "from_currency": this.selectedCurrency,
        "to_currency": this.orderDetails['currency'],
        "to_mobile": this.orderDetails['mobile']
      }
    }
    this.service.payWithPayvoo(this.obj).subscribe(res => {
      this.loadingButton = false;
      let successUrl = this.orderDetails['success_url'];
      let failureUrl = this.orderDetails['failure_url']
      if (res['status'] == 0 && res['data']) {

        if (res['data']['status'] == 0) {
          sessionStorage.removeItem("orderDetails");
          sessionStorage.removeItem("x-auth-token");
          sessionStorage.removeItem("Token");
          sessionStorage.removeItem("api_access_key");
          sessionStorage.removeItem("member_id");
          sessionStorage.removeItem("client_auth");
          sessionStorage.removeItem("userData");
          window.location.href = successUrl + '/00001' + '?' + res['data']['transactionId'];
        }
        else {
          if (res['data']['transactionInfo']) {
            sessionStorage.removeItem("orderDetails");
            sessionStorage.removeItem("x-auth-token");
            sessionStorage.removeItem("Token");
            sessionStorage.removeItem("api_access_key");
            sessionStorage.removeItem("member_id");
            sessionStorage.removeItem("client_auth");
            sessionStorage.removeItem("userData");
          window.location.href = failureUrl + '/' + res['data']['transactionInfo']['code'];
          }
          else {
            sessionStorage.removeItem("orderDetails");
            sessionStorage.removeItem("x-auth-token");
            sessionStorage.removeItem("Token");
            sessionStorage.removeItem("api_access_key");
            sessionStorage.removeItem("member_id");
            sessionStorage.removeItem("client_auth");
            sessionStorage.removeItem("userData");
            window.location.href = failureUrl + '/11096';
          }
        }
      }
      else {
        sessionStorage.removeItem("orderDetails");
        sessionStorage.removeItem("x-auth-token");
        sessionStorage.removeItem("Token");
        sessionStorage.removeItem("api_access_key");
        sessionStorage.removeItem("member_id");
        sessionStorage.removeItem("client_auth");
        sessionStorage.removeItem("userData");
        window.location.href = failureUrl + '/11003';
      }
    }, err => {
      this.loadingButton = false;
      sessionStorage.removeItem("orderDetails");
      sessionStorage.removeItem("x-auth-token");
      sessionStorage.removeItem("Token");
      sessionStorage.removeItem("api_access_key");
      sessionStorage.removeItem("member_id");
      sessionStorage.removeItem("client_auth");
      sessionStorage.removeItem("userData");
      window.location.href = this.orderDetails['failure_url'] + '/11096';
    })
  }
}
