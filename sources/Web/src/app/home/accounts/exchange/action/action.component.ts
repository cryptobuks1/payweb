import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from '../../../../core/shared/home.service';
import * as _ from "lodash";
import { EventEmitterService } from 'src/app/home/accounts/exchange/event-emitter.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import { HomeComponent } from 'src/app/home/home.component';
declare var $: any;
@Component({
  selector: 'action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit,OnDestroy {
  private subs=new SubSink();
  profileData: any;
  getAutoAlerts: any;
  autoExchangeData:any;

  currentPage:any;
  constructor(private homeService: HomeService,public emitter:EventEmitterService,private alert:NotificationService,private loader: HomeComponent) {
    this.getCallAction()
   }
  autoExchModal(){
    $("#addActionModal").modal('hide');
    this.emitter.myEvent.emit('autoExchange');
  }
  autoPriceAlert() {
    $("#addActionModal").modal('hide');
    this.emitter.myEvent.emit('autoPriceAlert');
  }
  getCallAction(){
    this.emitter.myEvent.subscribe(res=>{
      if(res=='getAction')
      {
        this.getActionData();
      }
    })
  }
  getActionData() {

    this.loader.apploader=true;
    this.subs.sink=this.homeService.getAutoCurrencyData().subscribe((res: any) => {    
      if(res['status']==0){
      if (res['data']['status']==0) {
        this.autoExchangeData = res['data']['priceAlerts'];
        this.getAutoAlerts = true;
        this.loader.apploader=false;

      }
      else if(res['data']['status']==1){
      this.autoExchangeData = [];
        this.getAutoAlerts = false;
        this.loader.apploader=false;
      }
      this.getAutoExcangeActionsData()
    }
    else{
      this.alert.error(res['message'])
      this.loader.apploader=false;
      this.getAutoExcangeActionsData()
    }
    })
  }
  getAutoExcangeActionsData(){
    this.loader.apploader=true;
    this.subs.sink=this.homeService.getAutoExchangeCurrencyData().subscribe(res => {
      if(res['status']==0){
      if (res['data']['status']==0) {
        Array.prototype.push.apply(this.autoExchangeData, res['data']['currencyExchangeDetails']);
       // this.autoExchangeData.concat(...res['data']['currencyExchangeDetails']);
        this.getAutoAlerts = true;
        this.loader.apploader=false;
      }
      else if(res['data']['status']==1){
       if(this.autoExchangeData.length==0){
        this.autoExchangeData = [];
       }
        this.getAutoAlerts = false;
        this.loader.apploader=false;
      }
    }
    else{
      this.alert.error(res['message'])
      this.loader.apploader=false;
    }
    })

  }

deletePriceorautoExchangeRecord(obj){

  let id=obj.price_alert_id==undefined ? obj.auto_exchange_id:obj.price_alert_id;
  obj.price_alert_id==undefined ? this.deleteAutoExchangeAlert(id) : this.deletePriceAlert(id);
}



  deleteAutoExchangeAlert(id) {

    this.subs.sink=this.homeService.deleteAutoExchangeRecord(id).subscribe(res => {
      if (res['status'] == 0) {
        if(res['data']['status']==0){
         // this.alert.success(res['data']['message']);
          this.getActionData();
        }
        else if(res['data']['status']==1){
          this.alert.error(res['data']['message'])
        }

      } else {
        this.alert.error(res['message']);
      }
    })
  }

  deletePriceAlert(id) {

    this.subs.sink=this.homeService.deletepriceAlertRecord(id).subscribe(res => {
      if (res['status'] == 0) {
        if(res['data']['status']==0){
          //this.alert.success(res['data']['message']);
          this.getActionData();
        }
        else if(res['data']['status']==1){
          this.alert.error(res['data']['message'])
        }

      } else {
        this.alert.error(res['message']);
      }
    })
  }
  ngOnInit() {
    this.getActionData();
  }
  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
