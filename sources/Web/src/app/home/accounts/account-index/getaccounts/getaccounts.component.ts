import { HomeService } from './../../../../core/shared/home.service';
import { Component, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink'
import { HomeComponent } from 'src/app/home/home.component';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AlertsService } from 'src/app/alerts.service';
import * as format from '../helper.component';
import { environment } from '../../../../../environments/environment';
import { HomeDataService } from 'src/app/home/homeData.service';

declare var $: any;
@Component({
  selector: 'app-getaccounts',
  templateUrl: './getaccounts.component.html',
  styleUrls: ['./getaccounts.component.scss']
})
export class GetaccountsComponent implements OnInit {
  apploader: boolean = false;
  currencyData: any;
  profileData: any;
  country_name: any;
  obj: any;
  accountData: any;
  country_id_currency: any;
  layout: boolean=true;
  initialPayment:any;
  cardData:any;
  search_accounts:any=''
  searchCurrency:any;
  searchText:any;
  listActive: boolean=false;
  gridActive: boolean=true;
  public unsubscribe$=new SubSink();
  kycStatus: any;
  success:boolean = true;
  filteredCurrencyData: any;
  user_id: any;
  isKycDirShare: any;
  directorListFlag:boolean=true;
  url: string = "";
  urlSafe: SafeResourceUrl;
  authToken: any;
  userData: any = [];
  smslinkBox: boolean = true;
  identId: any;
  KYCStatus: any;
  isIdentId:boolean=true;
  email: any;
  kycIframe:boolean=false;
  kycTargetURL:any;
  gplay:boolean;
  ios:boolean;
  MobidentId: any;
  platform_type: any;
  mobile: any;
  private subs = new SubSink()

  constructor(private homeService: HomeService,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private alert: NotificationService,
    private loader: HomeComponent,
    private homeDataService: HomeDataService,
    private alertsService: AlertsService) {
      this.profileData = JSON.parse(sessionStorage.getItem('userData'));
      this.getInitialPayment();
      this.subs.sink = this.homeDataService.getMobile().subscribe(data => {
        this.mobile = data;
      })
      this.homeService.getEmail().subscribe(data => {
        this.email = data;
      })
  }

  searchCurrencyCountry(data) {
    if(data) {
      this.filteredCurrencyData = this.currencyData.filter(item => {
        return item.country_name.toLowerCase().includes(data.toLowerCase()) || item.currency.toLowerCase().includes(data.toLowerCase());
      });
    } else {
      this.filteredCurrencyData = this.currencyData;
    }
  }


  hideOk() {
    $("#appWarn1").modal('hide');
  }

  getApp() {    
    $("#appWarn").modal('show');
  }

  statusCurrency() {
    this.homeService.getAccountsCurrency().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.currencyData = res['data']['currency'];
          this.filteredCurrencyData = this.currencyData;
        } else if (res['data']['status'] == 1) {
          this.alert.error(res['data']['message']);
        }
      } else if (res['status'] == 1) {
        this.alert.error(res['message']);
      }
    });
  }
  listView() {
    this.listActive = true
    this.gridActive = false;
    this.layout = false;
  }
  gridView() {
    this.gridActive = true;
    this.listActive = false
    this.layout = true;
  }

  sendInvitationAlert(platform) {
    this.platform_type = platform;
    $('#kycverifywarn').modal('show');
  }

  KYClinkToMobile(mobilePlatform) {
    this.apploader=true;
    let obj={
      "account_type": this.userData.account_type
    }
    this.homeService.SubmitForKYC(obj).subscribe(res=>{
      if(res['status']==0){
        this.identId =res['data']['id'];
        if (res['data']['status'] == 0) {
          this.MobidentId =res['data']['id'];
          this.linkToMobile(mobilePlatform);
          this.apploader=false;
        } else if(res['data']['status']==1){
          this.linkToMobile(mobilePlatform);
          this.apploader=false;
        }
      } else {
        this.alert.error(res['message']);
        this.apploader=false;
      }
    });
  }

  linkToMobile(mobilePlatform){
    this.apploader=true;
     this.homeService.KYClinkToMobile(this.mobile,this.email, mobilePlatform, this.MobidentId).subscribe(res => {
      if(res['status']==0){
       if(res['data']['status']==0){
         //this.alert.success(res['data']['message']);
         this.apploader=false;
       }
      } else {
        this.alert.error(res['message']);
        this.apploader=false;
      }
    });
   }
  save_outage_item(item) {
    this.country_id_currency = item.country_id;
    this.country_name = item.currency;

    this.obj = {
      "applicantId": this.profileData.applicant_id,
      "currency": item.currency,
      "status": true,
      "role": 1,
      "balance": 0
    }
  }
  createAccount() {
    this.homeService.createAccount(this.obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
         // this.alert.success(res['data']['message'])
          this.getAccounts();
        } else if (res['data']['status'] == 1) {
          this.alert.warn(res['data']['message']);
        }
      } else {
        this.alert.error(res['message'])
      }
    });
    this.searchText=''
  }

  setAccountStatus(status, item) {
    status? this.activateAccount(item) : this.deactivateAccount(item);
  }
  getAccounts() {
    this.loader.apploader = true;
    this.unsubscribe$.sink = this.homeService.getAccounts().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.accountData = res['data']['account'];
          this.accountData.forEach(element => {
            element.balance = element.balance;
          });
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
  deactivateAccount(item){
   var obj={
      "status":0,
      "currency":item.currency,
  }
  this.homeService.ActiveDeactiveacocunt(obj).subscribe(res => {
if(res['status']==0){
  if(res['data']['status']==0){
   // this.alert.success(res['data']['message']);
    this.getAccounts();
  }
  else if(res['data']['status']==1){
    this.alert.error(res['data']['message']);
  }
}
else{
  this.alert.error(res['message']);
}
  });
}
activateAccount(item){
  var obj={
     "status":1,
     "currency":item.currency
 }
 this.homeService.ActiveDeactiveacocunt(obj).subscribe(res => {
  if(res['status']==0){
  // this.alert.success(res['data']['message']);
    this.getAccounts();
  }
  else{
    this.alert.error("Failed")
  }
});
}

addMoney() {
  this.loader.apploader = true;
  $('#add_money').modal('hide');
  this.homeService.getKYCStatus('').subscribe(res => {
    if(res.code == 1 && res.status == 2) {
      return;
    }
    this.loader.apploader = false;
    this.kycStatus = res['data']['kyc_status'];


      if ( this.kycStatus && (this.kycStatus.includes('SUCCESS'))) {
        this.success = false;
      this.loader.apploader = false;
      if(res['status'] == 2) {
        this.alert.error(res['message']);
      }
      if (this.cardData == null) {
        if(this.profileData.account_type == 'business'){
          this.router.navigate(['business/add-money']);
        } else {
            this.router.navigate(['personal/add-money']);
          }
        } else {
          this.router.navigate(['personal/add-money', this.cardData]);
        }
      } else if(this.kycStatus=='FRAUD_SUSPICION' || res['data']['kyc_status'].includes('PENDING')){
        this.loader.apploader = false;
        this.alert.warn(res.data.message);
    } else {
      //this.alert.warn('Please complete KYC to add money');
      $('#kycwarn1').modal('show');
      this.loader.apploader = false;
    }
  });






}

gotoProfilePage(){
  if(this.profileData.account_type == 'business' || this.profileData.account_type == 'personal'){
    $("#kycwarn1").modal('hide');
    $("#myModal_addMoney").modal('show');
  }

}

latestStatus(){

  this.smslinkBox = true;
  this.apploader=false;
  this.loader.getKYCStatus();

}

webCamera(){
  this.SubmitForKYC();
}

SubmitForKYC() {

  this.loader.apploader=true;
  this.userData = JSON.parse(sessionStorage.getItem('userData'))
  if(sessionStorage.getItem('isCamera')=='no'){
    this.loader.apploader=false;
     this.alert.info("No camera available or Broswer support")
  }
  if(sessionStorage.getItem('isCamera')=='yes'){
    let obj={
      "account_type": this.userData.account_type
    }
  this.homeService.SubmitForKYC(obj).subscribe(res => {
    if(res['status']==0){
    if (res['data']['status'] == 0) {
      this.loader.apploader=false;
      this.kycIframe=true;
      this.identId =res['data']['id'];
       $("#myModal").modal('hide');
      $("#kycpopup_addMoney").modal('show');
      this.url=`https://go.idnow.de/app/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/auto-ident'
      // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
      this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
     else if(res['data']['status']==1) {
        this.loader.apploader=false;
        this.kycIframe=true;
        this.identId =res['data']['id'];
        $("#kycpopup_addMoney").modal('show');
        this.url=`https://go.idnow.de/app/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/auto-ident'
        // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
        this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
  }
  else{
    this.alert.error(res['message']);
    this.loader.apploader=false;
  }
  })
}
}

skip() {
  this.profileData.initialPayment=true;
  //sessionStorage.setItem('userData', JSON.stringify(this.profileData));
  $('#add_money').modal('hide');
}

getInitialPayment() {
  this.initialPayment = this.profileData.initialPayment;
  if (!this.initialPayment) {
    $('#add_money').modal('show');
  }
}
ngOnInit() {
    this.getAccounts();
    this.unsubscribe$.sink = this.homeService.getAutoCurrencyData().subscribe((res: any) => {
      if (res && res.data && res.data.numberOfPriceAlerts) {
        this.alertsService.broadcastAlertCount(res.data.numberOfPriceAlerts);
      }
      else return res;
    });
    this.getInitialPayment();
    $(".search_open").click(function () {
      $(".srch_cnt").toggleClass("active");
    });
  }


}
