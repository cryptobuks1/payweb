import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HomeService } from 'src/app/core/shared/home.service';
import { SubSink } from 'subsink';
import { IndexService } from 'src/app/core/shared/index.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singlepayments',
  templateUrl: './singlepayments.component.html',
  styleUrls: ['./singlepayments.component.scss']
})
export class SinglepaymentsComponent implements OnInit {

  data: any;
  searchText: any;
  counterParties: any;
  cuntrieslist: any;
  userData: any;
  country_name: any;
  calling_code: any;
  combined: any;
  userInfo: any;
  private subs = new SubSink();
  existMobile: any;
  detail: string;
  acc_type: any;
  selectedRow : any;
  flag: any;
  @Input() requestMoney = false;
  @Output() requestFundsEvent = new EventEmitter();

  constructor(private router: Router, private homeService : HomeService,
              private indexService: IndexService, private alert: NotificationService) {
  }

  ngOnInit() {
    this.getCuntries();
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.userInfo = this.userData;
    this.acc_type = this.userInfo.account_type;
    this.searchText ='';
    this.getCountriesList();
  }

  selectUser(counterParty) {
    this.selectedRow = counterParty;
  }

  sendUserDetails() {
      this.detail = this.selectedRow;
      this.homeService.setSenderDetails(this.detail);
    //  sessionStorage.setItem('UserDetails', JSON.stringify(this.detail));
      if (this.acc_type === 'personal') {      
        this.router.navigate(['/personal/payments/money-transfer'], { queryParams: { name: 'single'} });
      } else if (this.acc_type === 'business') {
        this.router.navigate(['/business/payments_tab/money-transfer'], { queryParams: { name: 'single' } });
      }
  }

  getCountriesList() {
    this.homeService.getCounterParty().subscribe(res => {
      if(res['status'] === 0){
        this.counterParties = res['data'].results;
      } else if(res['status'] === 1){
        this.alert.error(res['message']);
      }
    });
  }

  getShortName(name: string) {
    return name.charAt(0).toUpperCase();
  }

  getCuntries(){
    this.homeService.getCountryDetails().subscribe(res => {
    if(res['status'] === 0) {
          if (res['data']['status'] === 1) {
        } else if(res['data']['status'] === 0) {
          this.cuntrieslist = res['data']['country list'];
          this.cuntrieslist.forEach(element => {
            if(element.country_id == this.userData['country_id']){
              this.country_name = element.country_name;
              this.calling_code = element.calling_code;
              this.combined = this.calling_code + this.userInfo.mobile;
            }
          });
        }
      }
    });
  }

  requestMoneyFromCounterParty() {
    this.requestFundsEvent.emit(this.selectedRow);
  }

  continueAfterSelectingCounterParty() {
    if (this.requestMoney) {
      this.requestMoneyFromCounterParty();
    } else {
      this.sendUserDetails();
    }
  }
}
