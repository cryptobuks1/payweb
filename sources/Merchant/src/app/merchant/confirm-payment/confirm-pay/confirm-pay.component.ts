import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SepaService } from 'src/app/sepa.service';
import { NotificationService } from 'src/core/toastr-notification/toastr-notification.service';

@Component({
  selector: 'app-confirm-pay',
  templateUrl: './confirm-pay.component.html',
  styleUrls: ['./confirm-pay.component.scss']
})
export class ConfirmPayComponent implements OnInit {
  cardDetails: any;
  currencyData: any;
  profileData: any;
  id: any;
  months: string[] = [];
  cardData: any;
  currency: any;
  amount: any;
  CardDetails: any;
  addPaymentemplate: boolean = false;
  loader: boolean = false;
  prevcurrTransForm: boolean = false;
  currencyDataValues: any = [];
//  amountTransForm: FormGroup;
  currTransForm: FormGroup;
  constructor(private _router:Router, private fb: FormBuilder, private serivce: SepaService, private alert: NotificationService) {
    this.CardDetails = this._router.getCurrentNavigation().extras.state.cardData;
    this.getAccounts();
    console.log("this.CardDetails", this.CardDetails);
   this.profileData = JSON.parse(sessionStorage.getItem('userData'));
   this.months= ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
   this.currency = "EUR"
  }

  ngOnInit() {
    this.amount = 100;
    this.id = this.CardDetails.payment_cards_id;
    this.addPaymentemplate = true;
    this.currTransForm = this.fb.group({
      card_number: ["", Validators.required],
      card_cvv: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
      name_on_card: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])],
      card_type: ['', Validators.required],
      // card_exp: ['', Validators.required],
      card_month: ['', Validators.required],
      card_year: ['', Validators.required],
    })
    let monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let index = this.months.findIndex(element => element == this.CardDetails.card_month);
    var monthName = monthsArray[index] || '';
    this.currTransForm.patchValue({
      card_number: this.creditCardMask(this.CardDetails['card_number']),
      name_on_card: this.CardDetails.name_on_card,
      card_type: this.CardDetails.card_type,
      // card_exp: + this.CardDetails.card_month.length == 1 ? '0' + this.CardDetails.card_month.toString() + obj : this.CardDetails.card_month.toString() + obj,
      card_month: monthName,
      card_year: this.CardDetails.card_year
    })
    // this.amountTransForm = this.fb.group({
    //   amount: ['', Validators.compose([Validators.required, Validators.min(10)])],
    //   currency: ['', Validators.required],
    // })
  }
  PreDiv(){
    this._router.navigate(['/shopping-cart'])
  }
  getAccounts() {
    this.serivce.getAccount().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.currencyDataValues = res['data']['account'];
          this.currencyData = this.currencyDataValues.filter(({ status }) => status == 1);
          this.currencyData.push({ currency: 'Choose currency' });
          this.cardData = res['data']['cards']; 
        }
        else if (res['data']['status'] == 1) {
          this.alert.warn(res['data']['message'])
        }
      }
      else {
        this.alert.error(res['message'])
      }
    });
  }
  creditCardMask(credNumber) {
    if (credNumber != null) {
      let char = "*"
      //  credNumber = credNumber.replace(/[^0-9]+/g, ''); /*ensureOnlyNumbers*/
      let l = credNumber.length;
      //credNumber.substring(0,0) + char.repeat(l-4)+ credNumber.substring(l-4,l)
      return credNumber.replace(/(.{4})/g, '$1 ').trim();
    }
  }
  onClick(formData: any){
    const copiedObj = Object.assign({}, formData);
    this.loader = true;
    this.prevcurrTransForm = true
 //   let fixedAmount = parseFloat(this.amountTransForm.get('amount').value).toFixed(2)
    copiedObj.amount = 93;
    copiedObj.currency = "EUR";  
    copiedObj.payment_cards_id = parseInt(this.id);
    copiedObj.orderDescriptor = "test";
    let obj = this.currencyData.filter(({ currency }) => currency == this.currency);
    copiedObj.account_number = obj[0]['account_no'];


    delete copiedObj["card_name"];
    delete copiedObj["card_number"];
    delete copiedObj["card_exp"];
    this.cardDetails = copiedObj
    this.serivce.paywithPayvoo(this.cardDetails).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.loader = false;
          this.prevcurrTransForm = false;

          this.profileData.data.userInfo.initialPayment = true;    /* for stoping pop modal after adding money*/
          sessionStorage.setItem('userData', JSON.stringify(this.profileData));    /* for stoping pop modal after adding money*/
          this._router.navigate(['/payment-success'])
        }
        else if (res['data']['status'] == 1) {
          this.loader = false;
          this.prevcurrTransForm = false;
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.alert.error(res['message'])
      }

    });
   
  }
}
