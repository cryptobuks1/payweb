//import { Component, } from '@angular/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';
import { HomeComponent } from '../../home.component';
import { SubSink } from 'subsink';
import { HomeDataService } from '../../homeData.service';
declare var $: any;

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent {

  userData: any;
  applicant_id: any;
  cardData: any = [];
  intialpayment: boolean;
  aplicant_id: any;
  all: any;
  cardlength: any;
  private subs = new SubSink;
  acnt_type: string;
  kycStatus: string;
  gplay:boolean;
  ios:boolean;
  MobidentId: any;
  platform_type: any;
  identId: any;
  mobile: any;
  email: any;

  constructor(private router: Router, private homeService: HomeService,private homeDataService: HomeDataService,
    private alert:NotificationService,public authService: AuthService, private loader: HomeComponent) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.acnt_type = this.userData.account_type;    
    // this.getCardDetails();
    // this.getTransactions();
    this.mobile = localStorage.getItem('mobile');
    this.email = localStorage.getItem('email');
    
    this.subs.sink = this.homeService.getEmail().subscribe(data => {
      this.email = this.email ? this.email : data.email;
    })
  }

  getCardDetails() {
    this.homeService.getCardDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.cardlength = res['cards'];
        for (var i = 0; i < this.cardlength.length; i++) {
          if (res['cards'][i]['status']==1) {
            this.cardData = res['cards'][i]['payment_cards_id'];
          }
          else{
            this.cardData=null;
          }
        }
      }
      if (res['status'] == 1) {
        this.alert.error("Get card details failed")
      }
    })
   }

   sendInvitationAlert(platform) {
    this.platform_type = platform;
    $('#kycverify_warn').modal('show');
  }

  getAppP() {
    this.router.navigate(['/personal/payments/payment-type'])
  }
  getAppB() {
    this.router.navigate(['/business/payments/payment-type'])
  }

  getApp() {
    $("#appWarn").modal('show');
    $("#myModal").modal('hide');
  }

  addMoney() {
    $('#add_money').modal('hide');
    this.router.navigateByUrl('add-money');
    if (this.cardData == null) {
      this.router.navigate(['home/add-money/cards']);
    }
    else {
      this.router.navigate(['home/add-money/payments', this.cardData]);
    }
  }
  skip() {
    $('#add_money').modal('hide');
  }


  getTransactions() {  
    this.all = "all";
    this.homeService.getAllTransctionList().subscribe(res => {
      if (res['status'] == 0) {
        $('#add_money').modal('show');
      }
    })
  }

  checkKycToAddMoney(rout) {
    this.loader.apploader = true;
    this.homeService.getKYCStatus('').subscribe(res => {
      if(res.code == 1 && res.status == 2) {
        return;
      }
      this.loader.apploader = false;
      this.kycStatus = res['data'] ? res['data']['kyc_status'] : 'NOT_INITIATED';

      if (this.kycStatus && (this.kycStatus.includes('SUCCESS'))) {
        // if (this.acnt_type =='personal') {
        //   this.router.navigate(['/home/add-money']);
        // } else if (this.acnt_type == 'business') {
        //   this.router.navigate(['/home/business-add-money']);
        // }
        this.router.navigate([rout]);
         if(res['status'] == 2) {
          this.alert.error(res['message']);
        }
      }
      else if(this.kycStatus=='FRAUD_SUSPICION' || this.kycStatus == 'PENDING' || this.kycStatus == 'CHECK_PENDING') {
        this.alert.warn(res.data.message);
      }
      else {
       $('#kyc_warn').modal('show');
      //  this.alert.warn('Please complete KYC to add money');
        this.loader.apploader = false;
      }
    });
  }
  checkKycToSend(rout){
    this.loader.apploader = true;
    this.homeService.getKYCStatus('').subscribe(res => {
      if(res.code == 1 && res.status == 2) {
        return;
      }
      this.loader.apploader = false;
      this.kycStatus = res['data'] ? res['data']['kyc_status'] : 'NOT_INITIATED';

      if (this.kycStatus && (this.kycStatus.includes('SUCCESS'))) {
        this.router.navigate([rout]);
         if(res['status'] == 2) {
          this.alert.error(res['message']);
        }
      }
      else if(this.kycStatus=='FRAUD_SUSPICION' || this.kycStatus == 'PENDING' || this.kycStatus == 'CHECK_PENDING') {
        this.alert.warn(res.data.message);
      }
      else {
       $('#kyc_warn').modal('show');
        this.loader.apploader = false;
      }
    });
  }
  checkKycToExchange(rout){
    this.loader.apploader = true;
    this.homeService.getKYCStatus('').subscribe(res => {
      if(res.code == 1 && res.status == 2) {
        return;
      }
      this.loader.apploader = false;
      this.kycStatus = res['data'] ? res['data']['kyc_status'] : 'NOT_INITIATED';

      if (this.kycStatus && (this.kycStatus.includes('SUCCESS'))) {
        this.router.navigate([rout]);
         if(res['status'] == 2) {
          this.alert.error(res['message']);
        }
      }
      else if(this.kycStatus=='FRAUD_SUSPICION' || this.kycStatus == 'PENDING' || this.kycStatus == 'CHECK_PENDING') {
        this.alert.warn(res.data.message);
      }
      else {
       $('#kyc_warn').modal('show');
        this.loader.apploader = false;
      }
    });
  }
  KYClinkToMobile(mobilePlatform) {
    this.loader.apploader=true;
    let obj={
      "account_type": this.userData.account_type
    }
    this.homeService.SubmitForKYC(obj).subscribe(res=>{
      if(res['status']==0){
        this.identId =res['data']['id'];
        if (res['data']['status'] == 0) {
          this.MobidentId =res['data']['id'];
          this.linkToMobile(mobilePlatform);
          this.loader.apploader=false;
        } else if(res['data']['status']==1){
          this.linkToMobile(mobilePlatform);
          this.loader.apploader=false;
        }
      } else {
        this.alert.error(res['message']);
        this.loader.apploader=false;
      }
    });
  }

  linkToMobile(mobilePlatform){
    this.loader.apploader=true;
     this.homeService.KYClinkToMobile(this.mobile,this.email, mobilePlatform, this.MobidentId).subscribe(res => {
      if(res['status']==0){
       if(res['data']['status']==0){
         //this.alert.success(res['data']['message']);
         this.loader.apploader=false;
       }
      } else {
        this.alert.error(res['message']);
        this.loader.apploader=false;
      }
    });
   }


  goToExcahnges(rout) {
    this.router.navigate([rout]);
  }

  hideOk() {
    $("#appWarn").modal('hide');
  }


  webCamera(){
    this.loader.SubmitForKYC();
  }

  gotoProfilePage(){
    if(this.userData.account_type == 'business'){

      $("#myModal2").modal('show');
    }
    else if(this.userData.account_type == 'personal'){
     // this.router.navigate(['/home/profile/personal']);
     $("#myModal2").modal('show');
    }

  }

}
