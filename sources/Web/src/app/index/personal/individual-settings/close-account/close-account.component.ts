import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { HomeService } from './../../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-close-account',
  templateUrl: './close-account.component.html',
  styleUrls: ['./close-account.component.scss']
})
export class CloseAccountComponent implements OnInit {
  userData: any;
  constructor(private homeService: HomeService,private alert:NotificationService, private router:Router) { 
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
  }
  status: any;
  ngOnInit() {
  }
  keepAccount() {
  //   this.router.navigate(['/home/settings'])
  // location.reload();
    this.status = 1;
    this.closeaccount(this.status);
  }

  closeAccount() {
    this.status = 0;
    this.closeaccount(this.status);
    sessionStorage.clear();
    this.router.navigate(['/personal/login'])
  }
  closeaccount(data) {
    var request = {
      "status": data,
      "account_type": this.userData.data.userInfo.account_type
    }
    this.homeService.closeAccount(request).subscribe(res => {
      if (res['data']['status'] == 0) {
        this.alert.success(res['data']['message']);
      }
      else{
        this.alert.error(res['data']['message']);
      }
    })
  }
}
