import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { HomeDataService } from '../../homeData.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  KYBStatus: any;
  loadContent: boolean = true;
  isAllVerified: boolean = false;
  industrStatus: any;
  shreholderKYBStatus: any;
  KYCShareHolderStatus: any;


  constructor(private homeService: HomeService, private alert: NotificationService,
    private routerNavigate: Router, private homeDataService: HomeDataService, private loader: HomeComponent) {
    // this.insertKYB();
    // this.getKYBStatus();
    this.homeDataService.receiveKYBStatus().subscribe(status => {
      this.KYBStatus = status;
      if ((this.KYBStatus['isDocsUploaded'] == 2) && (this.KYBStatus['type_of_business'] == 2) &&
      (this.KYBStatus['personal_profile'] == 2) && (this.KYBStatus['business_owner_details'] == 2) && (this.KYBStatus['business_address'] == 2) 
      && this.KYBStatus['isCompleted'] == 1) {
      this.isAllVerified = true;     
    } else {      
      this.isAllVerified = false;     
    }   
    });
 //  this.industryStatus()
  
  }

  getKYBStatus() {
    this.homeService.getKYBStatus().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {       
          this.KYBStatus = res['data']['Dashboard Status'];
          this.loader.apploader = false;
          //    if(res['data']['Dashboard Status']['business_owner_details']==1){
          //     this.getShareholderStaus(); 
          //  }
          if ((this.KYBStatus['isDocsUploaded'] == 2) && (this.KYBStatus['type_of_business'] == 2) &&
            (this.KYBStatus['personal_profile'] == 2) && (this.KYBStatus['business_owner_details'] == 2) && (this.KYBStatus['business_address'] == 2)) {
            this.isAllVerified = true;
          } else {
            this.isAllVerified = false;
          }
        }
        else if (res['data']['status'] == 1) {
          this.loader.apploader = false;
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.loader.apploader = false;
        this.alert.error(res['message'])
      }
    });
  }

  moveToAccounts() {  
  this.homeService.finishActivation().subscribe(res => {
    if(res && res['data'] && res['data']['status'] == 0) {
       this.isAllVerified = true;
       this.homeDataService.isKYBDone(this.isAllVerified);
       this.homeService.setIsKybCompleted(this.isAllVerified);
       this.routerNavigate.navigate(['/business/accounts/getaccount']);
    }
  })
  }

  getShareholderStaus(identId) {
    this.homeService.getKYBshareholderStatus(identId).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.KYCShareHolderStatus = res['data']['kyc_status'];
          //   this.KYBStatus=this.KYCShareHolderStatus
          this.loader.apploader = false;

        }
        else if (res['data']['status'] == 1) {
          this.loader.apploader = false;
          this.alert.error(res['data']['message'])
        }
      }
      else {
        this.loader.apploader = false;
        //this.alert.error(res['message'])
      }
    });

  }


  industryStatus() {

    this.homeService.industryStatus().subscribe(res => {
      if (res && res['data'] && res['data']['Dashboard Status']) {
        this.industrStatus = res['data']['Dashboard Status']['isRestricted'];
        if (res['data']['Dashboard Status']['isRestricted'] == 1) {
          this.routerNavigate.navigate(['business/application/typesbusiness']);
          //  this.alert.error('Your account blocked, please contact customer support');
          //  home/application/typesbusiness
        }
        if ((res['data']['Dashboard Status']['isDocsUploaded'] === 2) && (res['data']['Dashboard Status']['type_of_business'] == "2") &&
          (res['data']['Dashboard Status']['personal_profile'] == "2") && (res['data']['Dashboard Status']['business_owner_details'] == "2") && (res['data']['Dashboard Status']['business_address'] == "2")) {
          this.isAllVerified = true;
        }
      }
    });

  }

  ngOnInit() {

  }

}
