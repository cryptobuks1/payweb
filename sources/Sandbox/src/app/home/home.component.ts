
/**
* Home Component
* its contain logout actin of the application and router-routet of the child components (home module)
* @package HomeComponent
* @subpackage app\home\HomeComponent
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { HomeService } from './../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../core/toastr-notification/toastr-notification.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { PaymentsGuard } from '../core/gaurds/payments.guard';
import { environment } from '../../environments/environment';

declare var $: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  KYBStatus: any;
  apploader: boolean = false;
  userData: any;
  firstName: string = "";
  lastName: string = "";
  KYCStatus: any;
  accountType: any;
  public loading = true;
  accountActive: boolean=false;
  paymentActive: boolean;
  isDisabled:boolean=false;
  isCompleted: boolean = false;
  businessName: any;
  kycStatus: any;
  user_id: any;
  isKycDirShare: any;
  directorListFlag:boolean=true;
  url: any = "";
  platform_type: any;
  urlSafe: SafeResourceUrl;
  authToken: any;
  smslinkBox: boolean = true;
  identId: any;
  isIdentId:boolean=true;
  email: any;
  kycIframe:boolean=false;
  kycTargetURL:any;
  busOwnPerTemplate:boolean=false;
  busSelfAddress:boolean=false;
  verifyIdenTemp:boolean=false;
  gplay:boolean;
  ios:boolean;
  isNull: boolean = false;
  alertsCount: number;
  MobidentId: any;
  selectedTab = '';
  parentRoutes = ['accounts', 'payments', 'settings','settings', 'exchange', 'accounts','add-money', 'exchange', 'application'];

  constructor(
    public authService: AuthService,
    public sanitizer: DomSanitizer,
    private alert: NotificationService,
    private homeService: HomeService,
    private routerNavigate: Router,
    private activatedRoute: ActivatedRoute,
    private paymentsGuard: PaymentsGuard
  ) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    let profileData = JSON.parse(sessionStorage.getItem("profileData"));
    this.firstName = profileData ? profileData.firstName : this.userData['data']['userInfo']['first_name'];
    this.lastName = profileData ? profileData.lastName :  this.userData['data']['userInfo']['last_name'];
    this.businessName = this.userData['data']['userInfo']['business_legal_name']
    sessionStorage.setItem('x-auth-token', this.userData['data']['x-auth-token']);
    this.industryStatus();
    
    if(this.userData && this.userData.data.userInfo && this.userData.data.userInfo.kyb_status === "COMPLETED") {
      this.isCompleted = true;
      this.homeService.setIsKybCompleted(true);
    } else {
      this.isCompleted = false;
      this.homeService.setIsKybCompleted(false);
    }

  }

  checkifNull() {
    if((this.firstName === "" || this.firstName == "null") && (this.lastName === "" || this.lastName == "null")) {
    this.isNull = true;
  } else {
    this.isNull = false;
  }
}

  getKYCStatus(){
    const isDropdownOpen = $('.profile_dropdown').hasClass('show');
    if(!isDropdownOpen) {
      this.apploader = true;
      this.KYCStatus = '';
      this.homeService.getKYCStatus('').subscribe(res => {
        if(res['data']['kyc_status']) {
          this.KYCStatus = res['data']['kyc_status'];
          this.apploader = false;
        } else if(res['status'] == 2) {
          this.alert.error(res['message']);
          this.apploader = false;
        } else{
          this.KYCStatus = res['data']['kyc_status'];
          this.apploader = false;
        }
      });
    }
  }
  onSelectFile(event) {
    var img = new Image();
    img.src = localStorage.theImage;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event:any) => {
        this.url = event.target.result;
      }

    }
  }

  // toSettingsP() {
  //   this.routerNavigate.navigate(['/personal/individual-settings/general-details'])
  // }
  // toSettingsB() {
  //   this.routerNavigate.navigate(['/business/settings/personal-settings/personal-profile-settings'])
  // }
  logoutAction() {
    if (this.userData.data.userInfo.account_type == 'personal') {
      if (this.authService.logOutAction()) {
        this.routerNavigate.navigate([''])
      }
    }
    else if (this.userData.data.userInfo.account_type == 'business') {
      if (this.authService.logOutAction()) {
        this.routerNavigate.navigate([''])
      }
    }
    else if (this.userData.data.userInfo.account_type == 'sandbox') {
      if (this.authService.logOutAction()) {
        this.routerNavigate.navigate([''])
      }
    }

  }

  hideOk() {
    $("#appWarn").modal('hide');
  }

  getStatus() {
    this.industryStatus();
  }


  industryStatus() {

    if(this.userData.data.userInfo.account_type == 'business'){


    this.homeService.industryStatus().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.KYBStatus=res['data']['Dashboard Status'];
          if (res['data']['Dashboard Status']['isRestricted'] == 1) {
            this.isDisabled = true;
            // this.application.industrStatus=res['data']['Dashboard Status']['isRestricted'];
          }
          else if(res['data']['Dashboard Status']['isCompleted'] == 1) {
            //   this.isCompleted = true;
              // this.homeService.setIsKybCompleted(true);
          }
        }
        // else if(res['data']['status']==1){
        //   this.alert.error(res['data']['message'])
        // }
      }
      // else if(res['data']['status']==1){
      //   this.alert.error(res['data']['message'])
      // }
     })
    //  else{
    //    this.alert.error(res['message'])
    //  }
  // });
  }
 }

  setSelectedTab(tab) {
    const foundTab = this.parentRoutes.find(r => tab.toLowerCase().includes(r.toLowerCase()));
    if (this.selectedTab !== foundTab) {
      this.selectedTab = foundTab;
    }
  }

  ngOnInit() {
    const intialTab = (this.activatedRoute.snapshot as any)._routerState.url;
    this.setSelectedTab(intialTab);
    this.routerNavigate.events.subscribe(res => {
      this.setSelectedTab(this.routerNavigate.url);
    });

    this.homeService.recieveUpdatedUserData().subscribe((data: any) => {
      this.firstName = data.first_name;
      this.lastName = data.last_name;
    })

    $(document).ready(function () {
      $(".bars_cnt").click(function () {
        $(".left_nav").toggleClass("active");
        $(".nav_backdrop").toggleClass("active");
      });
      $(".close_btn").click(function () {
        $(".left_nav").toggleClass("active");
        $(".nav_backdrop").toggleClass("active");
      });
      $(".closePopup").click(function () {
        $(".left_nav").toggleClass("active");
        $(".nav_backdrop").toggleClass("active");
      });
    });
  //  this.firstName= this.userData['data']['userInfo']['first_name'] ? this.userData['data']['userInfo']['first_name'] : '';
 //  this.lastName= this.userData['data']['userInfo']['last_name'] ? this.userData['data']['userInfo']['last_name'] : '';
    this.firstName= this.userData['data']['userInfo']['first_name'];
    this.lastName= this.userData['data']['userInfo']['last_name'];
}

  payments() {
    if (this.paymentsGuard.canActivate(null, null)) {
      this.routerNavigate.navigateByUrl('/home/payments');
    } else {
      this.getApp();
    }
  }

  checkKycToAddMoney(rout) {

    this.apploader = true;
    sessionStorage.setItem('csv', JSON.stringify(false));
    this.homeService.getKYCStatus('').subscribe(res => {
      this.apploader = false;
      this.kycStatus = res['data']['kyc_status'];
      if ( this.kycStatus && (this.kycStatus == 'SUCCESS')) {

        // if (this.acnt_type =='personal') {
        //   this.router.navigate(['/home/add-money']);
        // } else if (this.acnt_type == 'business') {
        //   this.router.navigate(['/home/business-add-money']);
        // }
        this.routerNavigate.navigate([rout]);
         if(res['status'] == 2) {
          this.alert.error(res['message']);
        }
      }
      else if(this.kycStatus=='FRAUD_SUSPICION' || res['data']['kyc_status'] =='CHECK_PENDING'){
        this.alert.warn(res.data.message);
      }
      else {
       $('#kycwarnhome').modal('show');
      //  this.alert.warn('Please complete KYC to add money');
        this.apploader = false;
      }
    });
  }

  gotoProfilePage(){
    if(this.userData.data.userInfo.account_type == 'business'){


     $("#kycwarnhome").modal('hide');
     $("#myModal").modal('show');
    }
    else if(this.userData.data.userInfo.account_type == 'personal'){
    //  this.routerNavigate.navigate(['/home/profile/personal']);
       $("#myModal").modal('show');
    }

  }

  webCamera(){
    this.SubmitForKYC();
  }

  latestStatus(){

    this.smslinkBox = true;
    this.apploader=false;
    this.getKYCStatus();
    this.busSelfAddress=false;
    this.busOwnPerTemplate=false;
    this.verifyIdenTemp=true;

  }


  getApp() {
    $("#appWarn").modal('show');
    $("#myModal").modal('hide');
  }

  sendInvitationAlert(platform) {
    this.platform_type = platform;
    $('#kycverifywarn').modal('show');
  }

  KYClinkToMobile(mobilePlatform) {
    this.apploader=true;
    let obj={
      "account_type": this.userData.data.userInfo.account_type,
      "applicant_id":this.userData.data.userInfo.applicant_id
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
     this.homeService.KYClinkToMobile(this.userData['data']['userInfo']['mobile'],this.userData['data']['userInfo']['email'], mobilePlatform, this.MobidentId).subscribe(res => {
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

  SubmitForKYC() {

    this.apploader=true;
    this.user_id = sessionStorage.getItem('email');
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    if(sessionStorage.getItem('isCamera')=='no'){
      this.apploader=false;
       this.alert.info("No camera available or Broswer support")
    }
    if(sessionStorage.getItem('isCamera')=='yes'){
      let obj={
        "account_type": this.userData.data.userInfo.account_type,
        "applicant_id":this.userData.data.userInfo.applicant_id
      }
    this.homeService.SubmitForKYC(obj).subscribe(res => {
      if(res['status']==0){
      if (res['data']['status'] == 0) {
        this.apploader=false;
        this.kycIframe=true;
        this.identId =res['data']['id'];        
         $("#myModal").modal('hide');
        $("#kycpopup").modal('show');
        this.url=`https://go.idnow.de/app/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/auto-ident'
        // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
        this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      }
       else if(res['data']['status']==1) {
          this.apploader=false;
          this.kycIframe=true;
          this.identId =res['data']['id'];
          $("#kycpopup").modal('show');
          this.url=`https://go.idnow.de/app/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/auto-ident'
          // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
          this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
    }
    else{
      this.alert.error(res['message']);
      this.apploader=false;
    }
    })
  }
  }

}
