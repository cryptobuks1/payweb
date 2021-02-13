import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeService } from '../../../core/shared/home.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/home/accounts/exchange/event-emitter.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import { AuthService } from 'src/app/core/shared/auth.service';
import { ActionComponent } from './action/action.component';
import { HomeComponent } from '../../home.component';
import { HomeDataService } from '../../homeData.service';
declare var $: any;

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit,OnDestroy{
  @ViewChild(ActionComponent, {static: false})
  private actionComp: ActionComponent;

  private subs=new SubSink();
  fromExchnAmount:any;
  toExchnAmount:any;
  toExchAmount:any;
  toAmount:any;
  result:any;
  fromCurrency:any;
  toCurrency:any;
  targetCurrency:any;
  exchangeCurrencyResult:any;
  exchangeCurrencyObj: any;
  showTodayCurrency: any;
  getTransactionResult: any;
  currencyFB: FormGroup;
  tobalance: any;
  frombalance: any;
  frmcurrency: any;
  tocurrency: any;
  fromExchnCurrency: any;
  from_exchnCurrency: any = ''
  currencyList: any = [];
  activeCurrencyType: any;
  toDayCurrencyRate: any;
  autoExchangeMessage: any;

  //autoExchange variable declaration

  from_Currency: any;
  from_Amt: any;
  to_Currency: any;
  autoExCurrencyObj: any;
  autoExchangeData: any;
  currentPage = 1;
  setTarPrice: any;
  isSetTarget: boolean = true;
  isetTarBtn: boolean = true;
  getdata: any;
  currencyType: any;
  getAutoAlerts: any;
  fromCurrencyBal: any;
  toCurrencyBal: any;
  showCurrency: any;
  accountNo: any;
  autoCurrencyType: any = [];
  getAllExchData: any;
  autoExchForm: any;
  applicantId: any;
  userData: any;

  // pricealert variable declaration

  taramount: any;
  targetfb: FormGroup;
  CountryDetails: any = [];
  selCountrydetails: any;
  country_id_currency: any;
  targettCurrency: any;
  getResult: any;
  searchText: any;
  toPriceRate: any;
  selCurrency: any;
  todayPriceCurrn: boolean;
  priceActCurren: any;
  exchCurrencyType: any;
  toDayCurrnExchRate: any;
  isEditable:boolean=true;
  to_amount: any;
  from_amount: any;
  mobile: any;
  sameCurrency: boolean = false;
  value1:string = '';
  value2:string = '';
  value3:string = '';
  constructor(public authService: AuthService,private homeService: HomeService, private http: HttpClient,private emitter:EventEmitterService,
    private formBuilder: FormBuilder, private routerNavigate: Router,private alert:NotificationService,
    private loader: HomeComponent, private homeDataService: HomeDataService) {
      this.userData = JSON.parse(sessionStorage.getItem('userData'));
      this.getautoAction();
      this.subs.sink = this.homeDataService.getMobile().subscribe(data => {
        this.mobile = data;
      })
    }

    CurrencyChange() {
      if ((this.frmcurrency && this.tocurrency) && (this.frmcurrency ==this.tocurrency) ) {
        this.alert.warn("Both currencies are same, please select distinct currencies")
        this.currencyFB.get('fromExchnCurrency').setValue('');
        this.currencyFB.get('toExchnAmount').setValue('');
        this.showTodayCurrency = false;
        this.sameCurrency = true;
      }
      else if(this.frmcurrency || (this.frmcurrency && this.tocurrency && this.frmcurrency !=this.tocurrency)){
        this.subs.sink=this.homeService.currentRate(this.tocurrency, this.frmcurrency, 1).subscribe((res: any) => {
          if (res['status'] == 0) {
            if(res['data']['status']==0){
              this.currencyFB.get('fromExchnCurrency').setValue('');
              this.currencyFB.get('toExchnAmount').setValue('');
              this.isEditable=false;
              this.sameCurrency = false;
              this.toDayCurrnExchRate = res['data']['amount'];
              this.showTodayCurrency = true;
              this.fromBalanceCheck(this.frmcurrency);
              this.toBalanceCheck(this.tocurrency);
            }
            else if(res['data']['status']==1){
              // this.alert.warn(res['data']['message'])
            }
          }
          else {
            this.alert.error(res['message'])
          }
        });
      }
    }
    swap_currency() {
      let fromCurrency = this.currencyFB.get('fromCurrency').value;
      let toCurrency = this.currencyFB.get('toCurrency').value;
      this.fromExchnCurrency = this.currencyFB.get('fromExchnCurrency').value
      let balance = this.tobalance;
      this.tobalance = this.frombalance;
      this.frombalance = balance;
      if ((this.frmcurrency && this.tocurrency) && (this.frmcurrency ==this.tocurrency) ) {
        this.alert.warn("Both currencies are same, please select distinct currencies")
        this.currencyFB.get('fromExchnCurrency').setValue('');
        this.currencyFB.get('toExchnAmount').setValue('');
        this.showTodayCurrency = false;
        this.sameCurrency = true;
      }
      else if (!this.fromExchnCurrency) {
        this.sameCurrency = false;
        this.currencyFB.get('fromCurrency').setValue(toCurrency);
        this.currencyFB.get('toCurrency').setValue(fromCurrency);
        this.frmcurrency = toCurrency;
        this.tocurrency = fromCurrency;
        if(this.tocurrency=='' && this.frmcurrency==''){
          this.tocurrency=null;
          this.frmcurrency=null;
        }
        if(this.tocurrency!='' && this.frmcurrency==''){

          this.frmcurrency=null;
        }
        if(this.tocurrency=='' && this.frmcurrency!=''){

          this.tocurrency=null;
        }
        this.subs.sink=this.homeService.currentRate(this.tocurrency, this.frmcurrency, 1).subscribe((res: any) => {
          if (res['status'] == 0) {
            if(res['data']['status']==0){
              this.toDayCurrnExchRate = res['data']['amount'];
              this.showTodayCurrency = true;
              let from_exchCurrency = this.currencyFB.get('fromExchnCurrency').value;
              if (from_exchCurrency !== '') {
                let convertedAmt = (from_exchCurrency * this.toDayCurrnExchRate).toFixed(4);
                this.currencyFB.get('toExchnAmount').setValue(convertedAmt);
              }
            }
            else if(res['data']['status']==1){
              // this.alert.warn(res['data']['message']);
              this.alert.warn('From and To currencies should be filled');
            }}
            else {
              this.alert.error(res['message']);
            }
          });


        }
        else {
          this.sameCurrency = false;
          this.targetCurrency = fromCurrency;
          this.fromCurrency = toCurrency;
          this.toCurrency = fromCurrency;      
          this.frmcurrency = toCurrency;
          this.tocurrency = fromCurrency;
          this.currencyFB.get('fromCurrency').setValue(toCurrency);
          this.currencyFB.get('toCurrency').setValue(fromCurrency);
          this.subs.sink=this.homeService.currentRate(this.tocurrency, this.frmcurrency, 1).subscribe((res: any) => {
            if(res['status']==1){
              this.toDayCurrnExchRate = res['amount'];
              this.toExchnAmount = this.toDayCurrnExchRate;
              this.showTodayCurrency = true;
            }
          });
        }
        if(this.currencyFB.get('fromExchnCurrency').value || this.currencyFB.get('toExchnAmount').value) {
          let currency = this.currencyFB.get('fromExchnCurrency').value;
          this.fromExchnCurrency = this.currencyFB.get('toExchnAmount').value;
          this.currencyFB.get('fromExchnCurrency').setValue(this.fromExchnCurrency);
          this.currencyFB.get('toExchnAmount').setValue(currency);
        }
      }

      getAccount() {
        this.subs.sink=this.homeService.getAccountById().subscribe((res: any) => {
          if(res['status']==0){
            if(res['data']['status']==0){
        //      if(this.exchCurrencyType == null || this.exchCurrencyType == undefined) {
              this.exchCurrencyType = res['data']['account'].filter(({ status }) => status == 1);
              this.getCurrencydetails();
              this.frmcurrency = this.fromCurrency ? this.fromCurrency : 'EUR';
              if(this.fromCurrency === undefined)
          {
          this.fromCurrency = this.frmcurrency ? this.frmcurrency : this.frmcurrency;
          }
          if(this.toCurrency === undefined)
          {
          //  this.toCurrency = this.tocurrency ? this.tocurrency : 'USD';
          }
              this.fromBalanceCheck(this.fromCurrency);
              this.toBalanceCheck(this.toCurrency);
              // } else {
              //   let exchangeCurrency = res['data']['account'].filter(({ status }) => status == 1);
              //   exchangeCurrency.map(element => {
              //     if(element.currency === this.frmcurrency){
              //       this.frombalance = element.balance
              //     }
              //     if(element.currency === this.tocurrency) {
              //       this.tobalance = element.balance
              //     }
              //   })

              // }
            //  this.currencyFB.get('fromCurrency').setValue(this.frmcurrency ? this.frmcurrency : 'EUR');
            //  this.currencyFB.get('toCurrency').setValue(this.tocurrency ? this.tocurrency : 'USD');
            }
            else if(res['status']==1){
              this.alert.warn(res['data']['message'])
            }
          }
          else{
            this.alert.warn(res['message'])
          }          
        })
      }
      fromBalanceCheck(fromCurrency){
        if(this.exchCurrencyType) {
          this.exchCurrencyType.map(element => {
            if(element.currency === fromCurrency)
            {
              this.frombalance = element.balance
            }
          });
        }
      }
      toBalanceCheck(toCurrency){
        if(this.exchCurrencyType) {
          this.exchCurrencyType.forEach(element => {
            if(element.currency === toCurrency)
            {
              this.tobalance = element.balance;
            }
          });
        }
      }

      exchange_currency() {
        let toCurrency = this.currencyFB.get('toCurrency').value;
        let fromCurrency = this.currencyFB.get('fromCurrency').value;
        let amount=this.currencyFB.get('fromExchnCurrency').value;
        this.exchangeCurrencyObj = {
          "account_type": this.userData.account_type,
          "from_currency" :fromCurrency,
          "to_currency" : toCurrency,
          "to_mobile" : this.mobile,
          "amount" : amount
        }
        this.subs.sink=this.homeService.createTransactionByCurrency(this.exchangeCurrencyObj).subscribe((res: any) => {
          this.exchangeCurrencyResult = res;
          if (res['status'] == 0) {
            if(res['data']['status']==0){
              //this.alert.success(res['data']['message'])
              // this.getTransation();
            }
            else if(res['data']['status']==1){
              this.alert.warn(res['data']['message'])
            }
          }
          else{
            this.alert.error(res['message'])
          }
          this.fromCurrency = fromCurrency;
          this.tocurrency = toCurrency;
          this.currencyFB.setValue({
            'toExchnAmount':'',
            'fromExchnCurrency':'',
            'fromCurrency': fromCurrency,
            'toCurrency': toCurrency
          })
          this.showTodayCurrency=false;
          this.getAccount();
          this.getCurrency();
          this.isEditable=true;
        })
      }
      exchange(data) {
        if(data !=''){
          this.targetCurrency = this.currencyFB.get('fromCurrency').value;
          this.toCurrency = this.currencyFB.get('toCurrency').value;
          this.subs.sink=this.homeService.getcurrency(this.toCurrency, this.targetCurrency, data).subscribe(res => {
            if (res['status']==0) {
              if(res['data']['status']==0){
                this.toExchnAmount = res['data']['amount'] ? (res['data']['amount']) : '';
                this.currencyFB.get('toExchnAmount').setValue(this.toExchnAmount);
              }
              else if(res['data']['status']==1){
                this.alert.warn(res['data']['message'])
              }
            }
            else{
              this.alert.error(res['message'])
            }
          })
        }
        else{
          this.currencyFB.patchValue({
            'toExchnAmount':''
          })
        }
      }
      getTransation() {
        this.subs.sink=this.homeService.getAllTransctionList().subscribe((res: any) => {
          if (res['status'] == 0) {
            if(res['data']['status']==0){
              this.routerNavigate.navigate(['personal/accounts/transactions']);
              //this.alert.success(res['data']['message'])
            }
            else{
              this.alert.warn(res['data']['message'])
            }
          }
          else{
            this.alert.error(res['message'])
          }
        })
      }


      // auto exchange start
      getautoAction(){
        this.emitter.myEvent.subscribe(res=>{
          if(res=='autoExchange')
          {
            this.autoExchangeCurrency();
          }
          else if(res=='autoPriceAlert'){

            $('#priceAlert').modal('show');
          }
        })
      }
      getCurrency() {

        this.subs.sink=this.homeService.getCurrency().subscribe(res => {
          if(res['status']==0){
            if(res['data']['status']==0){
              this.currencyType = res['data']['account'];
              this.autoCurrencyType = this.currencyType.filter(({ status }) => status == 1);
            }
            else if(res['data']['status']==1){
              //this.alert.error(res['data']['message'])
            }
          }
          else{
            this.alert.error(res['message'])
          }
        })
      }
      currencyRate() {
        this.from_Currency = this.autoExchForm.value.autoFromCurrn;
        this.to_Currency = this.autoExchForm.value.autoToCurrn;
        if ((this.from_Currency && this.to_Currency) && (this.from_Currency ==this.to_Currency) ) {
          this.alert.warn("Both currencies are same, please select distinct currencies")
          this.sameCurrency = true;
        }
        else{
          this.sameCurrency = false;
          this.showCurrency = true;
          var fromCurrency = this.from_Currency;
          var fCurrencydata = this.currencyType.filter(({ currency }) => currency == fromCurrency);
          this.fromCurrencyBal = fCurrencydata[0].balance;
          this.accountNo = fCurrencydata[0].account_no;
          if(this.to_Currency !=='' && this.to_Currency !==null){
            var toCurrency = this.to_Currency;
            var tCurrencydata = this.currencyType.filter(({ currency }) => currency == toCurrency);
            this.toCurrencyBal = tCurrencydata[0].balance;
          }
        }
        if ((this.from_Currency && this.to_Currency) && (this.from_Currency !=this.to_Currency)) {
          this.isetTarBtn = false;
          this.sameCurrency = false;
          this.subs.sink=this.homeService.currentRate(this.to_Currency, this.from_Currency, 1).subscribe((res: any) => {
            if (res['status']== 0) {
              if(res['data']['status']==0){
                this.showCurrency = true;
                this.toDayCurrencyRate = res['data']['amount'];
                // this.alert.success(res['data']['message'])
              }
              else if(res['data']['status']==1)
              {
                this.alert.warn(res['data']['message'])
              }
            }
            else{
              this.alert.error(res['message'])
            }
          });
        }
      }
      exchang_currency() {

        let balance = this.toCurrencyBal;
        let to_Currency = this.autoExchForm.get('autoToCurrn').value;
        let from_Currency = this.autoExchForm.get('autoFromCurrn').value;
        let to_amount = this.autoExchForm.get('autoToAmnt').value;
        let from_amount = this.autoExchForm.get('autoFromAmnt').value;
        this.autoExchForm.patchValue({
          'autoFromCurrn': to_Currency,
          'autoToCurrn': from_Currency,
          'autoFromAmnt': from_amount,
          'autoToAmnt': to_amount,
          'autoSetTargetAmt':''
        })
        this.toCurrencyBal = this.fromCurrencyBal;
        this.fromCurrencyBal = balance;
        this.to_Currency = from_Currency;
        this.from_Currency = to_Currency;
        this.to_amount = from_amount;
        this.from_amount = to_amount;
        this.isSetTarget = true;
        this.subs.sink=this.homeService.currentRate(this.to_Currency, this.from_Currency, 1).subscribe(res => {
          if (res['status'] == 0) {
            if(res['data']['status']==0){
              this.toDayCurrencyRate = res['data']['amount'];
            }
            else if(res['data']['status']==1)
            {
              // this.alert.warn(res['data']['message']);
              this.alert.warn('From and To currencies should be filled');
            }
          }
          else{
            this.alert.error(res['message']);
          }
        })
      }


  hideOk() {
    $("#appWarn").modal('hide');
    $("#success").modal('hide');
  }
      autoExchangeCurrency() {       
        this.isetTarBtn=true;
        this.from_Currency = '';
        this.to_Currency = '';
        this.autoExchForm.reset();
        $('#exchange').modal('show');
        this.fromCurrencyBal = '';
        this.toCurrencyBal = '';
        this.showCurrency = false;
        this.isSetTarget = true;
 
      }
      setTargetModal() {
        $("#exchange").modal('hide');
        this.autoExchForm.get("autoSetTargetAmt").setValue('');
      }
      setTargetAmount() {
        $("#setTargetModal").modal('hide');
        $("#exchange").modal('show');
        this.isSetTarget = false;
        this.setTarPrice = this.autoExchForm.value.autoSetTargetAmt;
        this.from_Amt = this.autoExchForm.value.autoFromAmnt;
        if (this.from_Amt != '' && this.from_Amt !== null) {
          var tAmount = (this.from_Amt * this.setTarPrice).toFixed(3);
          this.autoExchForm.get('autoToAmnt').setValue(tAmount);
          $("#autoExchangebtn").prop('disabled', false);
        }
      }
      autoExchange() {      
        var autoExchObj = {
          "from_currency": this.from_Currency,
          "to_currency": this.to_Currency,
          "amount": this.autoExchForm.get('autoFromAmnt').value,
          "target_amount": this.autoExchForm.get('autoSetTargetAmt').value,
          "exchange_status": false
        }
        this.subs.sink=this.homeService.autoCurrencyExhan(autoExchObj).subscribe((res: any)=> {
          if (res['status'] == 0) {
            if(res['data']['status']==1){
              this.emitter.myEvent.emit('getAction');
              this.alert.error(res['data']['message']);
              this.routerNavigate.navigate(['/home/exchange/action'])
            }
            else if(res['data']['status']==0){
              $('#success').modal('show');
              this.autoExchangeMessage = res['data']['message']
              this.emitter.myEvent.emit('getAction');
              //this.alert.success(res['data']['message']);
              if(this.userData.account_type=='personal'){
                this.routerNavigate.navigate(['personal/exchange/action']);
              }
              else{
                this.routerNavigate.navigate(['business/exchange/action']);
              }


            }
          }
          else {
            this.alert.error(res['message'])
          }
        })
      }
      convertAmt() {
        if(this.fromCurrencyBal < this.value2) {
          this.alert.error("Auto-Exchange will not be processed if your account doesn't have enough funds at the required time")
        }        
        var fromAmt = this.autoExchForm.get('autoFromAmnt').value;
        var targetAmt = this.autoExchForm.get('autoSetTargetAmt').value;
        if (targetAmt !== '' && targetAmt !== null) {
          var fromAmt = this.autoExchForm.get('autoFromAmnt').value;
          var convertAmt = fromAmt * targetAmt;
          this.autoExchForm.get('autoToAmnt').setValue(convertAmt);
        }
      }


      //price alert start

      getCurrencydetails() {
        this.subs.sink=this.homeService.getAccountsCurrency().subscribe((res:any) => {
          if(res['status']==0){
                    if(res['data']['status']==0){
                      this.CountryDetails = res['data']['currency'];
                    } else if(res['data']['status']==1){
                        this.alert.error(res['data']['message']);
                    }
                 } else if(res['status']==1){
                    this.alert.error(res['message']);
                }
        })
      }
      countryDetls(data) {
        $('#priceAlertsModal').show();
        this.getPriceAccount()
        this.country_id_currency = data.country_id;
        this.selCurrency = data;
        this.targetfb.get('target_tcurrency').setValue('EUR');
        this.targetfb.get('taramount').setValue('');
        $('#CountryDetails').hide();
        this.selCountrydetails=true;
        this.loader.apploader=true;
        this.subs.sink=this.homeService.currentRate('EUR', this.selCurrency.currency, 1).subscribe((res: any) => {
          if (res['status'] == 0) {
            this.todayPriceCurrn = true;
            this.loader.apploader=false;
            if(res['data']['status']==0){
              this.toPriceRate = res['data']['amount'];
            }
            else if(res['data']['status']==1){
              this.alert.error(res['data']['message'])
            }
          } else {
            this.alert.error(res['message'])
          }
        });
      }
      getPriceAccount() {
        this.subs.sink=this.homeService.getAccountById().subscribe((res: any) => {
          if(res['status']==0){
            if(res['data']['status']==0){
              this.priceActCurren  =res['data']['account'].filter(({ status }) => status == 1);
            }
            else if(res['status']==1){
              this.alert.warn(res['data']['message'])
            }
          }
          else{
            this.alert.warn(res['message'])
          }
        })
      }
      priceCurrency() {
        if (this.targettCurrency == this.selCurrency.currency) {
          this.targetfb.get('taramount').setValue('');
          this.targetfb.get('target_tcurrency').setValue('');
          this.alert.warn("Please select the different currencies");
          this.todayPriceCurrn = false;
          $("#taramount").prop('disabled', true);
        }
        else {
          $("#taramount").prop('disabled', false);
          this.todayPriceCurrn = true;
          this.subs.sink=this.homeService.currentRate(this.targetfb.get('target_tcurrency').value, this.selCurrency.currency, 1).subscribe((res: any) => {
            if (res['status'] == 0) {
              if(res['data']['status']==0){
                this.toPriceRate = res['data']['amount'];
              }
              else if(res['data']['status']==1){
                this.alert.error(res['data']['message'])
              }
            }
            else {
              this.alert.error(res['message'])
            }

          });
        }
      }

      CreateCountry(data) {
        $('#CountryDetails').show('slow');
        $('.modal-dialog modal-dialog-slideout').show();
        this.country_id_currency = data.country_id;
        this.searchText=''
        let fromCurrency=data.currency;
        let toCurrency=this.targetfb.get('target_tcurrency').value;
        let tarAmount=this.targetfb.get('taramount').value;
        var alertObj = {
          "from_currency":fromCurrency,
          "to_currency":toCurrency,
          "amount":0,
          "target_amount":tarAmount,
          "exchange_status":true
        }
        this.subs.sink=this.homeService.createSetAlertPrice(alertObj).subscribe((res: any) => {
          this.closeModal();
          if (res['status'] == 0) {
            if(res['data']['status']==0){
              this.emitter.myEvent.emit('getAction');
              //this.alert.success(res['data']['message']);
              if(this.userData.account_type=='personal'){
                this.routerNavigate.navigate(['personal/exchange/action']);
              }
              else{
                this.routerNavigate.navigate(['business/exchange/action']);
              }

              //  this.routerNavigate.navigate(['home/exchange/action']);
            }
            else if(res['data']['status']==1)
            {
              this.alert.warn(res['data']['message'])
            }
          }
          else {
            //this.alert.success(res['message']);
          }
        })
      }
      closeModal(){
        $('#priceAlertsModal').hide();
        $('#CountryDetails').show('slow');
        $('.modal-dialog modal-dialog-slideout').show();
        this.searchText='';
      }

      ngOnInit() {

        this.getAccount();
        this.getCurrency()
        this.currencyFB = this.formBuilder.group({
          fromCurrency: ['', Validators.required],
          fromExchnCurrency: ['', Validators.required],
          toCurrency: ['', Validators.required],
          toExchnAmount: []
        });
        // $(document).ready(function() {
        //   $(".exchng").on("blur", function() {
        //     $(this).val(parseFloat($(this).val()).toFixed(3));
        //   })
        // });
        this.autoExchForm = this.formBuilder.group({
          autoFromCurrn: ['', Validators.required],
          autoFromAmnt: ['', Validators.required],
          autoToCurrn: ['', [Validators.required]],
          autoToAmnt: [''],
          autoSetTargetAmt: ['', [Validators.required]]
        });
        if (this.fromExchnCurrency !== '') {
          this.subs.sink=this.currencyFB.get('fromExchnCurrency').valueChanges.subscribe(val => {
            this.exchange(val);
          });
        }
     
        this.subs.sink=this.currencyFB.get('fromCurrency').valueChanges.subscribe(val => {
          if (val) {
     //     this.fromBalanceCheck(val);
            // this.frombalance = val.balance;
            this.frmcurrency = this.currencyFB.get('fromCurrency').value ? this.currencyFB.get('fromCurrency').value : val;
          }
          else{
            this.frombalance = '';
           this.frmcurrency = this.currencyFB.get('fromCurrency').value ? this.currencyFB.get('fromCurrency').value : this.frmcurrency;
          }
        })
        this.subs.sink=this.currencyFB.get('toCurrency').valueChanges.subscribe(val => {
          if (val) {
            this.tocurrency = val;
     //       this.toBalanceCheck(val);
          }
          else{
            this.tobalance = '';
            if(this.exchCurrencyType) {
            this.exchCurrencyType.map(element => {
              if(element) {
              this.tocurrency =  element.currency === 'USD' ? 'USD' : '';
            }
          })
            }
          }
          })       
        this.targetfb = this.formBuilder.group({
          target_tcurrency: ['', Validators.required],
          taramount: ['', [Validators.required, Validators.pattern("[0-9.]{1,}")]]
        });
        this.subs.sink=this.targetfb.get('target_tcurrency').valueChanges.subscribe(val => {
          if (val) {
            this.targettCurrency = val;
          }
        })
      }


      onPriceAlert() {
        this.emitter.myEvent.emit('autoPriceAlert');
      }

      ngOnDestroy(){
        this.subs.unsubscribe();
      }
      set3NumberDecimal1() {
        this.value1 = parseFloat(this.value1).toFixed(3);
      }
      set3NumberDecimal2() {
        this.value2 = parseFloat(this.value2).toFixed(3);
      }
      set3NumberDecimal3() {
        this.value3 = parseFloat(this.value3).toFixed(3);
      }
      onlyNumberKey(event) {
        var ctl = document.getElementById('myText');
        var startPos = ctl['selectionStart'];
    
        if (startPos == 0 && String.fromCharCode(event.which) == '0') {
          return false
        }
        return (event.charCode == 8 || event.charCode == 0 || event.charCode == 46) ? null : event.charCode >= 48 && event.charCode <= 57;
      }
    }

