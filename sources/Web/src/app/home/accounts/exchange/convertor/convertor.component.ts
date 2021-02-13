import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from '../../../../core/shared/home.service';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import { HomeComponent } from 'src/app/home/home.component';

declare var $: any;
@Component({
  selector: 'convertor',
  templateUrl: './convertor.component.html',
  styleUrls: ['./convertor.component.scss']
})
export class ConvertorComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  CountryDetails: any;
  exchanCurrencyRes: any;
  userData: any;
  getCountrydetailsList: any;
  country_id_currency: any;
  searchText: any;
  value = 100;
  convertAmount = 100;
  result: any;
  constructor(private homeService: HomeService, private fb: FormBuilder, private alert: NotificationService, private loader: HomeComponent) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.getConvertorList();
  }
  getConvertorList() {
    this.loader.apploader = true;
    let obj = {
      "isConvert": 1,
      "from_currency": "EUR",
      "amount": this.convertAmount
    }
    this.subs.sink = this.homeService.createCurrencyConvertor(obj).subscribe((res: any) => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.exchanCurrencyRes = res['data']['convertionRates'];
          this.exchanCurrencyRes.map(ele => {
            ele.exchanged_amount = Math.round(ele.exchanged_amount * 100) / 100
            return ele;
          });
          this.loader.apploader = false;
        }
        if (res['data']['status'] == 1) {
          this.loader.apploader = false;
          this.alert.warn(res['data']['message'])
        }
      }
      else {
        this.loader.apploader = false;
        this.alert.error(res['message'])
      }

    });
  }
  getCountrydetails() {
    this.subs.sink = this.homeService.getAccountsCurrency().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.CountryDetails = res['data']['currency'];
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message']);
        }
        else if (res['status'] == 1) {
          this.alert.error(res['message']);
        }
      }
      else {
        this.alert.error(res['message']);
      }
    })
  }

  addAccount(obj) {
    this.country_id_currency = obj.country_id;
    this.getCountrydetailsList = obj;
    // $("#createCurrency").modal('hide');
    // $("#exampleModalCenter").modal('show');
  }

  convertorValue(value, event) {
    var code = (event.keyCode ? event.keyCode : event.which);
    this.convertAmount = value.exchanged_amount;
    let obj = {    
      "isConvert": 1,
      "from_currency": value.to_currency,
      "amount": value.exchanged_amount
    }
    this.subs.sink = this.homeService.currenceExchangedByConvertor(obj).subscribe((res: any) => {
      if (res['status'] == 0) {
        this.exchanCurrencyRes = res['data']['convertionRates'];
        this.exchanCurrencyRes.map(ele => {
          ele.exchanged_amount = (Math.round(ele.exchanged_amount * 100) / 100).toFixed(2);
          return ele;
        });
      } else {
        this.alert.error(res['message']);
      }
    });
  }

  roundOff(data) {
    //return data.toFixed(3);
    return Math.round(data * 100) / 100;
  }

  deleteCurrency(id) {
    this.subs.sink = this.homeService.deleteCurrencyRate(id).subscribe((res: any) => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          //  this.alert.success(res['data']['message']);
          //  this.getConvertorList();
          this.exchanCurrencyRes = this.exchanCurrencyRes.filter(element => element.check_rates_id !== id);
        }
        else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message'])
        }

      } else {
        this.alert.error(res['message']);
      }
    })
  }
  CreateConverts(obj) {
    this.country_id_currency = obj.country_id;
    let request = {
      "from_currency": obj.currency,
      "to_currency": null,
      "isConvert": 1
    }
    this.subs.sink = this.homeService.CreateCurrencycheckRate(request).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          //this.alert.success(res['data']['message']);
          this.getConvertorList();
        }
        else if (res['data']['status'] == 1) {
          this.alert.warn(res['data']['message'])
        }

      }
      else {
        this.alert.error(res['message']);
      }
    })
    this.searchText = ''
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
