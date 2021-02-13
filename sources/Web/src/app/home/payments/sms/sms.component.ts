import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomeService } from 'src/app/core/shared/home.service';
import { IndexService } from 'src/app/core/shared/index.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';
import { BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import { LocationStrategy } from '@angular/common';
import 'rxjs/add/operator/filter';
import { HomeDataService } from '../../homeData.service';


declare var $: any;

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

  name: string;
  sendSmsForm: FormGroup;
  userData: any;
  userInfo: any;
  cuntrieslist: any[];
  country_name: string;
  calling_code: number;
  isPersonal: boolean;
  modalAmount: BsModalRef;

  private subs = new SubSink()
  timer: any;
  intervalId: any;
  isDisabled: boolean = false;
  sms: any;
  OtpError: string;
  combined: string;
  acc_type: string;
  existMobile: string;
  counterPartyMember: any;
  flag: any;
  test: boolean = true;
  amount: any;
  phone: any;
  amountSent: any;
  textShow:boolean= false;
  mobile: any;
  country_id: any;
  bankCurrency:any;
  euroCurrency:any;
  totalBalance:any;
  bulkPaymentList:any;
  csvTotalAmount:any;
  apploader: boolean;
  req: any;
  uniqueLinkToPayNonPayvooUser: any;
  csvBulkData: any;
  csvPayment: any;
  transferMessage: any;


  constructor(private route: ActivatedRoute, private fb: FormBuilder,private modalService: BsModalService,
              private hoemsService: HomeService, private indexService: IndexService,private homeDataService: HomeDataService,
              private alert: NotificationService, private router: Router, private homeService:HomeService,
              private locationStrategy: LocationStrategy) {
  }

  ngOnInit() {
    this.subs.sink = this.homeService.getPaymentRequest().subscribe(element => {
      this.req = element;
    })
    this.subs.sink = this.homeService.getSenderDetails().subscribe(data => {
      this.counterPartyMember = data;
    })
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.acc_type = this.userData.account_type;
    this.route.queryParams.filter(params => params.name)
      .subscribe(params => {
        this.name = params.name;
        this.amountSent = params.amountSent;  
        this.bankCurrency = params.bankCurrency;  
        this.euroCurrency = params.euroCurrency; 
        this.bulkPaymentList = params.bulkPaymentList;
        this.totalBalance = params.totalBalance; 
        this.csvTotalAmount = params.csvTotalAmount;    
    });
    this.subs.sink = this.hoemsService.getUserDetails().subscribe(data => {
      this.country_id = data.country_id        
    })
    this.homeService.getCsv().subscribe(data => {
      this.csvPayment = data;
      if(this.csvPayment){
        this.homeService.getBulkPaymentsData().subscribe(data => {
          this.csvBulkData = data.csvDataList;
        //  this.bulkPaymentList = data.userDataList;
        })
      }
    })
    this.mobile = localStorage.getItem('mobile');
    this.subs.sink = this.homeDataService.getMobile().subscribe(data => {
      this.mobile = data ? data : this.mobile;
      localStorage.setItem('mobile', this.mobile);
    })

    this.sendSmsForm = this.fb.group({
      sms: ["", Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]
    });

    clearInterval(this.intervalId);
    this.createMobileOTP();
    this.setTimer();  
    this.preventBackButton();
    this.getCuntries();   
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered'
  };

  verifyOTPAndSubmit(sms, busamount: TemplateRef<any>) {
    //this.flag = this.indexService.isVerified();
   
    this.subs.sink = this.indexService.verifyOTP(sms, this.mobile).subscribe(res=>{
      if (res['status'] == 0) {
            if (res['data']['status'] == 0) {
              if(this.acc_type === 'personal') {
                this.isPersonal = true;
                if (this.name === 'counterParty') {
                    this.router.navigateByUrl('/personal/payments/add-counterparty');
                } else if (this.name === 'single') {
                    this.router.navigateByUrl('/personal/payments/money-transfer');
                } else if (this.name === 'bulk') {
                    this.router.navigateByUrl("/personal/payments/bulk-money-transfer");
                }
              } else if(this.acc_type === 'business') {
                if (this.name === 'counterParty') {
                    this.router.navigateByUrl('/business/payments_tab/add-counterparty');
                } else if (this.name === 'single') {
                  if (this.counterPartyMember.is_non_payvoo_user === 1) {
                    this.homeService.sendMoneyToNonPayvooUser(this.req).subscribe((res: any) => {
                  if(res['status'] == 0) {
                    if(res['data']['uniquePaymentId']) {
                  this.uniqueLinkToPayNonPayvooUser = res['data']['uniquePaymentUrl'];
                  this.apploader = false;
                  $('#sentNonPayvooUser').modal('show');
                  this.test = false;
                    }
                }
                });
                    } else {
                  this.homeService.singleTransfer(this.req).subscribe(res => {
                    if (res['status'] === 0) {
                      this.apploader=false;
                      if (res['data']['status'] === 0) {                      
                          this.modalAmount = this.modalService.show(busamount,this.config);  
                          this.test = false;                      
                      }
                    } else if (res['status'] === 1) {
                      this.apploader=false;
                      this.alert.error(res['data']['message']);
                    }
                  }) 
                }
                } else if (this.name === 'bulk') {

                  this.homeService.singleTransfer(this.req).subscribe(res => {
                    if (res['status'] === 0) {
                      this.apploader=false;
                      if (res['data']['status'] === 0) {                       
                          this.modalAmount = this.modalService.show(busamount,this.config); 
                          this.test = false;
                          this.transferMessage = "Successfully sent";                       
                      } else {
                        this.modalAmount = this.modalService.show(busamount,this.config);
                        this.transferMessage = res['data']['message'];
                      }
                    } else if (res['status'] === 1) {
                      this.apploader=false;
                      this.alert.error(res['data']['message']);
                    }
                  })                                    
                }
              }
            } else if (res['data']['status'] == 1) {
              clearInterval(this.intervalId);
              var thisObj = this;
              thisObj.timer='00'
              thisObj.isDisabled = true;
              this.sendSmsForm.reset();
            // this.alert.error(res['data']['message']);
             this.OtpError = res['data']['message'];
            }
          } else {
            this.alert.error(res['message']);
          }
      });
      // this.sendSmsForm.reset();
  }

  continue() {
    if (this.modalAmount) {
      this.modalAmount.hide();
    }
    if (this.acc_type === 'personal') {
      this.isPersonal = true;
      this.router.navigateByUrl('/personal/payments');
    } else if (this.acc_type === 'business') {
      this.router.navigateByUrl('/business/payments_tab');
    }
   // sessionStorage.removeItem('UserDetails')
  }

  hideOk() {
    this.continue();
  }

  

  getCuntries() {
    this.subs.sink = this.indexService.getCountryDetails().subscribe(res => {
      if (res["status"] == 0) {
        if (res["data"]["status"] == 0) {
          this.cuntrieslist = res["data"]["country list"];
          const applicantCountry = this.cuntrieslist.find(c => c.country_id === this.userData.country_id);
          this.country_name = applicantCountry.country_name;
          this.calling_code = applicantCountry.calling_code;
          this.combined = `${this.mobile}`;
        }
      }
    });
  }


  setTimer() {
    this.timer = 59
    var thisObj = this;
    this.intervalId = setInterval(function () {
      if(thisObj.timer > 0) {
          thisObj.timer = thisObj.timer - 1;
        if(thisObj.timer < 10) {
          thisObj.timer = "0" + thisObj.timer;
        } if(thisObj.timer == 0) {
          thisObj.isDisabled = true;
        }
      }
    }, 1000);
  }

  mobileResendLink() {
    this.textShow = true;
    this.sendSmsForm.reset();
    this.isDisabled = false;
    this.subs.sink=this.indexService.createOTP(this.mobile).subscribe(res=>{
      if(res['status']==0) {
        if(res['data']['status']==0) {
          this.setTimer();
          this.OtpError = '';
         // this.alert.success(res['data']['message']);
        } else if(res['data']['status']==1) {
          this.alert.error(res['data']['message']);
        }
     } else {
       this.alert.error(res['message']);
      }
      setTimeout( () => {
        this.textShow = false;
      }, 10000);
    });
  }

  createMobileOTP() {
          this.subs.sink = this.indexService.createOTP(this.mobile).subscribe(res => {
            if (res['status'] === 0) {
              if (res['data']['status'] === 0) {
                this.existMobile = res['data']['message'];
              } if (res['data']['status'] === 3) {
                this.existMobile = res['data']['message'];
              } if (res.data.status === 4) {
                this.existMobile = res['data']['message'];
              } if (res['data']['status'] === 1) {
                this.existMobile = res['data']['message'];
              }
            } else {
              this.alert.error(res['message'])
            }
          });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
