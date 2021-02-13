import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SepaService } from 'src/app/sepa.service';
import { LocationStrategy } from '@angular/common';
declare var $;
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  currencyname:any="EUR";
 
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
  toCurrency:any;
  fromCurrency:any;
  convertedAmount: any;
  totalamount: any;
  currencyvalue:any;

  constructor(private service: SepaService,private locationStrategy: LocationStrategy) { }

  ngOnInit() {
    this.preventBackButton() ;
    this.getCards();
    this.getAccounts();
   
    $(document).ready(function(){
      $(".per").on("click", function() {
        $(".collapse").collapse('hide');
     });

    });
    

  }
  
 
  arr = [];
  getCards() {
    this.service.getCards().subscribe(res => {


      this.cards = res['data']['cards'];

    
    })
  }


  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  getAccounts() {

    this.service.getAccount().subscribe(res => {

      this.orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
      this.totalAmount = this.orderDetails;
      this.totalamount = this.totalAmount ? this.totalAmount['amount'] : '';
      this.convertedAmount = this.orderDetails['amount'];
      this.payingCurrency = this.totalAmount['currency']
      this.toCurrency = this.payingCurrency

      this.accounts = res['data']['account'];
      console.log("this.account", this.accounts)
      if (this.selectedCurrency != '') {

        this.getAccountCurrecy(this.selectedCurrency);

      }
      else {

        this.getAccountCurrecy('EUR');


      }

    })
  }


  addCard() {
    this.showCard = true;
    this.displayCard = false;
  }

  displayCards() {
    this.showCard = false;
    this.displayCard = true;
  }


  insertCard(request) {
    var expDate = request.expDate;
    var cards = expDate.split('/');
    this.month = cards[0];
    this.year = cards[1];
    var req = {
      "card_type": "MC",
      "name_on_card": request.nameOnCard,
      "card_number": request.cardNumber,
      "card_cvv": request.cvv,
      "card_month": this.month,
      "card_year": this.year
    }
    this.service.addCard(req).subscribe(res => {
      this.getCards();
      this.showCard = false;
      this.displayCard = true;
    })
  }

 

  // exchangeMoney(money){
  //   let data={
  //     fromCurrency:this.payingCurrency,
  //     toCurrency:this.selectedCurrency,
  //     amount:money
  //   }
  //  this.service.getExchangeRates(data).subscribe(res=>{
  //    if(res){
  //     let amount=res['data']['amount']
  //     return amount
  //    }
  //  })
  // }







  
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
    if(data.length == 3){
      this.continueBtn = false;
    }
  }



  getAccountCurrecy(data) {
      this.continueBtn = false;
    let obj = {
      "currency": data
    }
    this.service.getAccountByCurrency(obj).subscribe(res => {
      let accountNo = res['data']['account'][0]
      this.selectedAccountDetails = accountNo;
      this.money = this.selectedAccountDetails['balance'];
      this.currencyvalue=this.money;
     
      if(this.totalAmount['amount']-this.money ){

      }
      // this.fromCurrency = this.selectedCurrency;
      // let data={
      //   fromCurrency:this.fromCurrency,
      //   toCurrency:this.toCurrency,
      //   amount:this.money
      // }
      // this.service.getExchangeRates(data).subscribe(res=>{
      //   this.money = res['data']['amount'];
      // })
      
      
      
      if (this.money < this.convertedAmount) {
        this.continueBtn = true;
      }
      this.selectAccountNumber = this.selectedAccountDetails['account_no'];
    })
  }
  roundOff(data){
   // return data.toFixed(2);
   return Math.round(data * 100) / 100;
  }

  abc: any;
  radiobtn(data, card) {
    this.selectedCard = card
    this.ShowCvv = true;
    // this.continueBtn = false;
  }


  currencyType(data) {
    
    //this.selectedCurrency = data.slice(0, 3);
    this.currencyname=data.currency;
    this.currencyvalue=data.balance;
    this.selectedCurrency=data.currency;
    this.getAccountCurrecy(this.selectedCurrency);
    let obj={
      fromCurrency:this.selectedCurrency,
      toCurrency:this.orderDetails['currency'],
      amount:JSON.stringify(this.orderDetails['amount'])
    }
    this.service.getExchangeRates(obj).subscribe(res=>{
      this.convertedAmount=res['data']['amount'];
    })




  }




  paySandbox() {
    this.loadingButton = true;
    // {
    //   "orderDescriptor":"hrthrh",
    //   "amount":"146.72",
    //   "payment_cards_id":55,
    //   "currency":"BGN",
    //   "account_number":83,
    //   "card_cvv": "123",
    //   "from_currency" : "BGN",
    //   "to_currency" : "EUR",
    //   "to_mobile" : "729605512903"
    // }
    
    if (Math.round(this.convertedAmount * 100) / 100 <= Math.round(this.money * 100)/100 ) {
      this.obj = {
        "orderDescriptor": this.orderDetails['order_id'],
        "amount": (this.convertedAmount * 100) / 100,
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
        "amount": (this.convertedAmount * 100) / 100,
        "payment_cards_id": this.selectedCard['payment_cards_id'],
        "currency": this.selectedCurrency,
        "account_number": this.selectAccountNumber,
        "card_cvv": this.selectedCardCvv,
        "from_currency": this.selectedCurrency,
        "to_currency": this.orderDetails['currency'],
        "to_mobile": this.orderDetails['mobile']
      }
    }
    this.service.paywithPayvoo(this.obj).subscribe(res => {
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
