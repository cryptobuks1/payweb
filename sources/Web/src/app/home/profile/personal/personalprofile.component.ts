/**
* Userprofile Component
* @package UserprofileComponent
* @subpackage app\home\personal\userprofile\UserprofileComponent
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { Component, OnInit, Input} from '@angular/core';
import { HomeService } from '../../../core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomeComponent } from '../../home.component';
import { environment } from '../../../../environments/environment';
import { SubSink } from 'subsink';

declare var $;

@Component({
  selector: 'user-profile',
  templateUrl: './personalprofile.component.html',
  styleUrls: ['./personalprofile.component.scss']
})
export class PersonalprofileComponent implements OnInit {
  ios:boolean;
  gplay:boolean;
  @Input()
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
  cuntrieslist: any=[];
  country_name: any;
  calling_code: any;
  MobidentId: any;
  platform_type: any;
  mobile: any;
  private subs = new SubSink;

  constructor(private homeService: HomeService, private alert:NotificationService,
              public sanitizer: DomSanitizer,private loader: HomeComponent) {
    this.userData=JSON.parse(sessionStorage.getItem('userData'));
    this.getCuntries()
    this.getKYCStatus();
    this.subs.sink = this.homeService.getUserDetails().subscribe(data => {
      this.mobile = data.mobile;
      this.email = data.user_id;
    })
    //this.KYCStatus= this.userData['data']['userInfo']['kycStatus'];
  }

  SubmitForKYC() {
    this.loader.apploader=true;
    if(sessionStorage.getItem('isCamera')=='no'){
      this.loader.apploader=false;
      this.alert.info("No camera available or Broswer support")
    }
    if(sessionStorage.getItem('isCamera')=='yes'){
    this.homeService.SubmitForKYC(null).subscribe(res => {
      if(res['status']==0){ //need to set 0 after testing
        if (res['data']['status'] == 0) {
            // Need to change the if condition after testing
          this.loader.apploader=false;
          this.kycIframe=true;
          this.identId = res['data']['id'];
          $("#myModal").modal('hide');
          $("#kycpopup").modal('show');
          // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
        // this.url='https://go.idnow.de/app/${environment.sepaKycEnvironment}/identifications/'+this.identId+'/identification/start';
          this.url=`https://kyc.payvoo.com/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/start';
          this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        } else if(res['data']['status']==1) {
          this.loader.apploader=false;
          this.kycIframe=true;
          this.identId =res['data']['id'];
          $("#kycpopup").modal('show');
          this.url=`https://kyc.payvoo.com/app/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/auto-ident'
          // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
         // this.url='https://go.idnow.de/app/${environment.sepaKycEnvironment}/identifications/'+this.identId+'/identification/start';
          // this.url='https://go.idnow.de/app/${environment.sepaKycEnvironment}/identifications/'+this.identId+'/identification/auto-ident'
          this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        }
    } else{
      this.alert.error(res['message']);
      this.loader.apploader=false;
    }
    })
  }
  }

  kycOption(){
    $("#myModal").modal('show');
  }

  webCamera(){
    this.SubmitForKYC();
  }

  getKYCStatus(){
    this.loader.apploader = true;
    this.homeService.getKYCStatus('').subscribe(res => {
      if(res['data']['kyc_status']) {
        this.KYCStatus = res['data']['kyc_status'];
        this.loader.apploader = false;
      } else if(res['status'] == 2) {
          this.alert.error(res['message']);
      } else{
        this.KYCStatus = res['data']['kyc_status'];
        this.loader.apploader = false;
      }
    });
  }

  getCuntries(){
   // getCountryDetails
   this.homeService.getCountryDetails().subscribe(res => {
    if(res['status']==0){
    if (res['data']['status'] == 1) {
     //this.alert.error(res['data']['message'])
    } else if(res['data']['status']==0) {
      this.cuntrieslist=res['data']['country list'];
      this.cuntrieslist.forEach(element => {
        if(element.country_id==this.userData['data']['userInfo']['country_id']){
          this.country_name=element.country_name;
          this.calling_code = element.calling_code;
        }
      });
    }
  } else {
      this.alert.error(res['message'])
    }
  });
  }

  sendInvitationAlert(platform) {
    this.platform_type = platform;
    $('#kycverifywarn').modal('show');
  }


  getApp() {
    $("#myModal1").modal('hide');
    $("#appWarn1").modal('show');
  }

  KYClinkToMobile(mobilePlatform) {
    this.loader.apploader=true;
    this.homeService.SubmitForKYC(null).subscribe(res=>{
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

  latestStatus(){
    this.smslinkBox = true;
    this.getKYCStatus();
  }

  ngOnInit() {
    $(document).ready(function(){
        $('#commingSoonPopup').modal({
      });
     });
  }

}
