
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IndexService } from 'src/app/core/shared/index.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
//ssimport { checkcamera } from 'src/assets/dist/js/localscript'
import { environment } from '../../environments/environment';

declare var $: any;
//declare var camera: any;
@Component({
  selector: 'app-send-link',
  templateUrl: './sendlink.component.html',
  styleUrls: ['./sendlink.component.scss']
})
export class SendLinkComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  personalAddress: FormGroup;
  updateContactForm: FormGroup;
  updateContactDetails: boolean = true;
  updateContactAddress: boolean = false;
  thanksFlag: boolean = false;
  minDOB = ''
  maxDOB: any;


  // public href: string = "";
  url: string = "";


  identId: any;


  tokenObj: any;
  token: any;
  dataToken: any;
  userData: any;
  user_id: any;
  gplay: any;
  ios: any;
  KYCStatus:any;

  urlSafe: SafeResourceUrl;
  kycIframe: boolean = false;


  constructor(private indexService: IndexService,
    private alert: NotificationService, private router: Router, private route: ActivatedRoute,
    public sanitizer: DomSanitizer) {




    this.route.queryParams.subscribe(params => {
      this.identId = params.id
      this.dataToken = params.data_token
    });

  //  camera.checkcamera();

//    this.getDireSharehloderDetails();


  }


  getDireSharehloderDetails() {
      this.kycIframe=true
      this.indexService.getUserData(this.dataToken).subscribe(res => {
      this.userData=res;
      this.userData['data']['userInfo']['account_type'] ='notAccount'
      sessionStorage.setItem('x-auth-token',this.userData['data']['x-auth-token']);
      $('#kycwarn').modal('show',{backdrop: 'static', keyboard: false})
      sessionStorage.setItem('userData', JSON.stringify(this.userData));
    })
  }


  redirectLogin(){
    this.router.navigate(['/business/login'])
  }

  check_Kyc(){
    $('#kycpopup').modal('show')
    $('#kycwarnmodal').modal('hide')
    this.kycIframe=true
    this.url = `https://kyc.payvoo.com/app/sepacyberauto1/identifications/` + this.identId + '/identification/auto-ident'
    // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }



  getKYCStatus() {

   $('#kycpopup').modal('hide');
   //window.close();
   this.router.navigate(['']);
    // let obj = {
    //   "identityId": this.identIds
    // }
    // let uerdata=this.userData.data.userInfo

    // this.indexService.getKYCStatus(obj, uerdata.Token, uerdata.api_access_key, uerdata.client_auth, uerdata.client_auth).subscribe(res => {
    //   if (res['status'] == 0) {
    //     if (res['data']['status'] == 1) {
    //       this.alert.error(res['data']['message'])
    //     } else if (res['data']['status'] == 0) {
    //       $('#kycpopup').modal('hide');
    //       //this.KYCStatus=res['data']['kyc_status'];
    //       this.router.navigate(['/login/business'])
    //     } else if (res['status'] == 2) {
    //       this.alert.error(res['message']);
    //     }
    //   }
    //   else {
    //     this.alert.error(res['message'])
    //   }
    // })
  }
  logoutAction(){
 this.router.navigate(['/business/login'])
sessionStorage.clear()

  }



  ngOnInit() {
  this.openMOdal()

  }


openMOdal(){
  $('#kycwarnmodal').modal('show')
  $("#kycwarnmodal").appendTo("body");
}
  ngOnDestroy() {
    this.subs.unsubscribe();
  }



}
