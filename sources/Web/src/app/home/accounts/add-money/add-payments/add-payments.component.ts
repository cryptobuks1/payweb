import { Component, OnInit, Directive, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from "lodash";
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';
declare var $: any;


@Component({
  selector: 'app-payments',
  templateUrl: './add-payments.component.html',
  styleUrls: ['./add-payments.component.scss']
})
export class AddpaymentsComponent implements OnInit {
  countryData: any;
  applicant_id: any;
  profileData: any;
  cardData: any;
  CardDetails: any;
  id: any;
  amountTransForm: FormGroup;
  currTransForm: FormGroup;
  addPaymentemplate: boolean = false;
  processingFees: number;
  hideCurrBtn: boolean = true;
  amount: number;
  currency: any;
  currAmountTmpl: boolean = true;
  currencyData: any;
  prevcurrTransForm: boolean = false;
  loader: boolean = false;
  currencyDataValues: any = [];
  months: string[] = [];
  currencyTopup:any=10;
  cardDetails: any;
  currencyvalue:any;
  isReadOnly: boolean = false;
  state = false;

  constructor(public authService: AuthService, private routerNavigate: Router, private route: ActivatedRoute, private homeService: HomeService, private fb: FormBuilder, private alert: NotificationService) {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
    this.getAccounts();
    this.months= ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  }
  getAccounts() {
    this.homeService.getAccounts().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.currencyDataValues = res['data']['account'];
          setTimeout (() => {
            this.currencyData = this.currencyDataValues.filter(({ status }) => status == 1);
            this.currencyData.push({ currency: 'Choose currency' });
         }, 2000);
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
  addPaymentemp(formData: any) {
    let monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let index = this.months.findIndex(element => element == this.CardDetails.card_month);
    var monthName = monthsArray[index] || '';
    this.amount = formData.amount.replace(/^0+/,'');
    this.currency = formData.currency;
    this.addPaymentemplate = true;
    this.hideCurrBtn = false;
    this.isReadOnly = true;
    this.state = !this.state;
    this.currTransForm.patchValue({
      card_number: this.creditCardMask(this.CardDetails['card_number']),
      name_on_card: this.CardDetails.name_on_card,
      card_type: this.CardDetails.card_type,
      // card_exp: + this.CardDetails.card_month.length == 1 ? '0' + this.CardDetails.card_month.toString() + obj : this.CardDetails.card_month.toString() + obj,
      card_month: monthName,
      card_year: this.CardDetails.card_year
    })
    this.processingFees = this.amount * 0.00;
  }
  AddCurrMoney(formData: any) {
    const copiedObj = Object.assign({}, formData);
    this.loader = true;
    this.prevcurrTransForm = true
    let fixedAmount = parseFloat(this.amountTransForm.get('amount').value).toFixed(2)
    copiedObj.amount = fixedAmount;
    copiedObj.currency = this.amountTransForm.get('currency').value;
    copiedObj.payment_cards_id = parseInt(this.id);
    copiedObj.orderDescriptor = "test";
    let obj = this.currencyData.filter(({ currency }) => currency == this.currency);
    copiedObj.account_number = obj[0]['account_no'];


    delete copiedObj["card_name"];
    delete copiedObj["card_number"];
    delete copiedObj["card_exp"];
    this.cardDetails = copiedObj
    $('#confirmation').modal('show');
  }
  closeConfirm(){
    this.loader = false;
    this.prevcurrTransForm = false
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

  confirmAddCurrency() {
    $('#confirmation').modal('hide');
    this.homeService.AddCurrMoney(this.cardDetails).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.loader = false;
          this.prevcurrTransForm = false;

          this.profileData.initialPayment = true;    /* for stoping pop modal after adding money*/
          //sessionStorage.setItem('userData', JSON.stringify(this.profileData));    /* for stoping pop modal after adding money*/


          //this.alert.success(res['data']['transactionInfo']['description'])
          if (this.authService.accountMatch(['personal'])) {
            this.routerNavigate.navigate(['/personal/accounts/transactions']);
          }
          if (this.authService.accountMatch(['business'])) {
            this.routerNavigate.navigate(['/business/accounts/transactions']);
          }

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

  PreDiv() {
    this.currAmountTmpl = true;
    this.addPaymentemplate = false;
    this.hideCurrBtn = true;
    this.currTransForm.reset();
    this.amountTransForm.reset();
    this.isReadOnly = false;
    this.state = false;
    this.currencyData.push({ currency: 'Choose currency' });
  }
  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.homeService.getCardDetails().subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            this.addPaymentemplate = false;
            this.hideCurrBtn = true;
            this.loader = false;
            this.prevcurrTransForm = false;
            this.currTransForm.reset();
            this.amountTransForm.reset();
            this.cardData = res['data']['cards'];
            var obj = this.cardData.filter(element => element.payment_cards_id == this.id);
            this.CardDetails = obj[0];
            if(this.currencyData) {
              this.currencyData.push({ currency: 'Choose currency' });
            }
          }
          else if (res['data']['status'] == 1) {
            this.alert.error(res['data']['message'])
          }
        }
        else {
          this.alert.error(res['message'])
        }
      })
    });
    $(document).ready(function() {
      $(".currval").on("blur", function() {
        $(this).val(parseFloat($(this).val()).toFixed(2));
      })
    });
    this.amountTransForm = this.fb.group({
      amount: ['', Validators.compose([Validators.required, Validators.min(10.00)])],
      currency: ['', Validators.required],
    })
    this.currTransForm = this.fb.group({
      card_number: ["", Validators.required],
      card_cvv: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
      name_on_card: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])],
      card_type: ['', Validators.required],
      // card_exp: ['', Validators.required],
      card_month: ['', Validators.required],
      card_year: ['', Validators.required],
    })
  }



  choseCurrency(cur) {
    let data:any = {
      'INR': 20, 'GBP': 10, 'USD': 20,'CHF': 20,'ISK': 20,'NOK': 20, 'SEK': 100, 'RON': 50,'PLN': 20, 'HUF': 3500,'DKK': 100,'CZK': 300,'HRK': 90,'EUR': 10,'BGN': 25.
    }
    this.currencyTopup=data[cur];

    this.amountTransForm.controls.amount.setValidators([Validators.required, Validators.min(data[cur])]);
    this.amountTransForm.updateValueAndValidity();
    this.amountTransForm.get('amount').reset();
  }

  checkCurrency(currencyvalue) {
    if(currencyvalue <= 0) {  
      this.alert.warn('Please, choose currency');
    }
  }

}


@Directive({
  selector: '[appTwoDigitDecimaNumber]'
})

export class TwoDigitDecimaNumberDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
