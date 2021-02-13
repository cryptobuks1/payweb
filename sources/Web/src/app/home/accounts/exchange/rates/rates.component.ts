import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from '../../../../core/shared/home.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import * as Highcharts from 'highcharts';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { getLocaleDateFormat } from '@angular/common';

declare var $:any;

@Component({
  selector: 'rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit,OnDestroy{
  private subs=new SubSink();
  CountryDetails: any;
  exchangeCurrencyResult: any;
  userData: any;
  convertObj: any;
  result: any;
  ratesData: any;
  to_currency: any;
  from_currency: any;
  currencyFB: FormGroup;
  currentPage = 1;
  rateExchangeData:any;
  applicant_id:any;
  currencyDataValues: any;
  fixerDetails:any;
  exchangeRatesValues: any = [];
  showSelects = true;

  highcharts = Highcharts;
  chartOptions = {
    chart: {
      zoomType: 'x',
      height: 150
    },
    title: {
      text : ''
    },

    credits: {
        enabled: false
    },

    xAxis: {
      categories: [],
      labels: {
        enabled: false
      }
    },
    yAxis: {
      labels: {
        enabled: false
      },
      title: {
        text: null
      }
    }, tooltip: {
      headerFormat: '',
      pointFormat: '<b>{point.y}</b>'
    },
    plotOptions : {
      area: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, new Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },

    series: [{
      showInLegend: false,
      type: 'area',
      data : []
    }]
  };

  constructor(private homeService: HomeService,private formBuilder: FormBuilder,private alert:NotificationService) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.ratesList();
  }

  clear_Details() {
    this.resetCurrencyFB();
    this.showSelects = false;
  }

  getCountrydetails() {
    this.showSelects = true;
    if(this.CountryDetails !== undefined && this.CountryDetails !== null) {
      return;
    }
    this.homeService.getAccountsCurrency().subscribe(res => {
      if(res['status']==0){
        if(res['data']['status']==0){
          this.currencyDataValues = res['data']['currency'];
          this.CountryDetails = this.currencyDataValues;
        }
        else if(res['data']['status']==1){
          this.alert.warn(res['data']['message'])
        }
      }
      else{
        this.alert.error(res['message'])
      }
    });
  }
  CreateRates(){
    var request = {
      "from_currency": this.currencyFB.get('from_currency').value ? this.currencyFB.get('from_currency').value : 'EUR',
      "to_currency": this.currencyFB.get('to_currency').value ? this.currencyFB.get('to_currency').value : 'USD',
      "isConvert": 0
    }
    if(request.from_currency == request.to_currency){
      this.alert.warn("Please select different currencies");
    }
    else if(request.from_currency != request.to_currency){
      $("#createCurrency").modal("hide");
      this.subs.sink= this.homeService.CreateCurrencycheckRate(request).subscribe(res => {
        if(res['status']==0){
          if(res['data']['rates']) {
            const item = res['data'];
            this.ratesData.push(item);
            this.modifyRatesData(item,this.ratesData.length-1);
            // this.alert.success(res['data']['message']);
            this.showSelects = false;
            this.resetCurrencyFB();
          }
          else if(!res['data']['rates']) {
            this.alert.warn(res['data']['message']);
            this.resetCurrencyFB();
          }
        }
        else{
          this.alert.error(res['message'])
          this.resetCurrencyFB();
        }
        this.fixerDetails = this.ratesData;
      });
    }
    this.resetCurrencyFB();
  }
  deleteRate(id, indexValue) {
    this.subs.sink=this.homeService.deleteCurrencyRate(id).subscribe((res: any) => {
      if(res['status']==0){
        if(res['data']['status'] == 0) {
          this.ratesData.splice(indexValue, 1);
          // this.alert.success(res['data']['message']);
        } else if(res['data']['status'] == 1){
          //  this.alert.error(res['data']['message']);
        }
      }
      else{
        this.alert.error(res['message'])
      }
    })
  }

  ratesList(){
    this.convertObj = {
      "isConvert": 0
    }

    this.subs.sink=this.homeService.createCurrencyConvertor(this.convertObj).subscribe(res => {
      // var observableList = [];
      if(res['status']==0){
        if(res['data']['rates']) {
          this.ratesData = JSON.parse(JSON.stringify(res['data']['rates']));
          this.fixerDetails = this.ratesData;
          this.ratesData.forEach((rateData, i) => {
            this.modifyRatesData(rateData, i);
          })
        } else if (!res['data']['rates']){
          this.ratesData = [];
        }
      }
      else{
        this.alert.error(res['message'])
      }
    });
  }

  modifyRatesData(rateData, i) {
    rateData['chartOptions'] = JSON.parse(JSON.stringify(this.chartOptions));
    var currencyArray = []
    rateData['rates'].forEach(currency => {
      currencyArray.push(currency.currency);
    });
    this.ratesData[i].chartOptions.xAxis.categories = [];
    this.ratesData[i].chartOptions.series[0].data = currencyArray;
  }

  resetCurrencyFB() {
    this.currencyFB.reset({
      "from_currency": 'EUR',
      "to_currency": 'USD'
    });
  }

  ngOnInit() {
    this.currencyFB = this.formBuilder.group({
      from_currency: ['', Validators.required],
      to_currency: ['', Validators.required],
    });
  }
  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}

