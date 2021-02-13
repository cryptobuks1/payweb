import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { HttpUrl } from 'src/app/core/shared/httpUrl.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { IndexService } from 'src/app/core/shared/index.service';
import { HomeService } from 'src/app/core/shared/home.service';
import { SubSink } from 'subsink';

declare var $: any;

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loginActionActive: any;
  apploader: boolean=false;
  userData: any;
  name: any;
  isPersonal: boolean = false;
  amountSent: any;
  modalAmount: BsModalRef;
  counterPartyMember: any;
  phone: any;
  eye=false;
  slasheye=true;
  type="password";
  email: any;
  bankCurrency: any;
  euroCurrency: any;
  req: any;
  uniqueLinkToPayNonPayvooUser: any;
  detailsList: any;
  private subs=new SubSink()

  constructor(private route: ActivatedRoute,private router: Router,
    private modalService: BsModalService,
    private fb: FormBuilder,private http: HttpClient,private homeService: HomeService,
    private authService:AuthService, private alert: NotificationService) { 
    }

  ngOnInit() {
    this.getPersonaldetails();
    this.subs.sink = this.homeService.getPaymentRequest().subscribe(element => {
      this.req = element;
    })
    this.subs.sink = this.homeService.getSenderDetails().subscribe(data => {
      this.counterPartyMember = data;
    })
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required,Validators.minLength(7),Validators.maxLength(15)]]
    });
    this.route.queryParams.filter(params => params.name)
    .subscribe(params => {
      this.name = params.name;
      this.amountSent = params.amountSent; 
      this.bankCurrency = params.bankCurrency    
      this.euroCurrency = params.euroCurrency  
  });
  this.getBeneficiaryAccounts();
  this.subs.sink = this.homeService.getUserDetails().subscribe(data => {
    if(data) {
      this.email = data.email
    }
  })
  this.userData = JSON.parse(sessionStorage.getItem('userData'));
  }

  getPersonaldetails() {
    this.homeService.getPersonalDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.detailsList = res['data'];
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }

  getBeneficiaryAccounts() {
 //   this.counterPartyMember = JSON.parse(sessionStorage.getItem('UserDetails'));
    this.phone = this.counterPartyMember.mobile;
  }

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered'
  };
  verifyPassword(password:any, busamount: TemplateRef<any>){    
    this.isPersonal = true;
    let obj = {};
    obj['userId'] = this.detailsList.user_id;
    obj['password'] = password;
    obj['account_type'] = 'personal';
    this.http.post(HttpUrl.Login_PayVoo, obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0 && res['data']['userInfo']['account_type'] == 'personal') {
          if (this.counterPartyMember.is_non_payvoo_user === 1) {
          this.homeService.sendMoneyToNonPayvooUser(this.req).subscribe((res: any) => {
        if(res['status'] == 0) {
          if(res['data']['uniquePaymentId']) {
        this.uniqueLinkToPayNonPayvooUser = res['data']['uniquePaymentUrl'];
        this.apploader = false;
        $('#sentNonPayvooUser').modal('show');
          }
      }
      });
          } else {
          this.homeService.singleTransfer(this.req).subscribe(res => {
            if (res['status'] === 0) {
              this.apploader=false;
              if (res['data']['status'] === 0) {
                if (res['data']['total_fail_trans'] === 1) {
                  this.alert.error(res['data'].list_of_fail_trans[0].TransRes.message);                  
                } else {
                  this.modalAmount = this.modalService.show(busamount,this.config);
                }
              }
            } else if (res['status'] === 1) {
              this.apploader=false;
              this.alert.error(res['data']['message']);
            }
          })
        }
        }
        else{
          this.alert.error('The entered password is incorrect')
        }
      }
   })
  }

  eyeHide() {
    if(this.eye == false && this.slasheye == true) {
      this.eye=true;
      this.slasheye=false;
      this.type="text";
    }
    else if(this.eye == true && this.slasheye == false) {
      this.eye=false;
      this.slasheye=true;
      this.type="password";
    }
  }

  continue() {
    if (this.modalAmount) {
      this.modalAmount.hide();
    }   
      this.isPersonal = true;
    this.router.navigateByUrl('/personal/payments');    
    sessionStorage.removeItem('UserDetails')
  }
  
  onOk(){
    if(this.userData.account_type == "personal") {
      this.router.navigate(['/personal/payments/payment-type']);
      } else {
        this.router.navigate(['/business/payments/payment-type']);
      }
    }
}
