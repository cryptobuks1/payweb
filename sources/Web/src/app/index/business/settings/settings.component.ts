import { IndexService } from './../../../core/shared/index.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/shared/auth.service';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
declare var $;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  cardData: any = [];
  intialpayment: boolean;

  all: any;
  cardlength: any;
  incorporation_data: any;
  business_profile_data: any;
  nature_of_business_data: any;
  structure_of_business_data: any;
  directorsList: any;
  ownersList: any;
  dirname: any;
  hide: boolean = true;
  emptyCard : boolean = false;
  emptyCard1: boolean = false;
  emptyCard2: boolean = false;
  emptyCard3: boolean = false;
  contentCard : boolean = false;


  //personal
  profileData: any;
  applicant_id: any;
  private subs = new SubSink()
  mobile: any;
  timer: any;
  intervalId: any;
  mobileOtp: any;
  isDisabled: boolean = true;
  showForm: boolean = true;
  personal_Profile: boolean = false;
  business_Profile: boolean = false;
  change_lang:boolean=false;
  change_password: boolean = false;
  structure_business: boolean = false;
  nature_business: boolean = false;
  incorporation: boolean = false;
  imageTrue: boolean = true;
  imageFalse: boolean = false;
  imageTrue2: boolean = true;
  imageFalse2: boolean = false;
  //plan
  routerDisplay: boolean = false
  profileDisplay: boolean = true;
  personalDet: boolean = false;
  count: number;
  count1: number;
  textData: boolean;
  companyName: string;
  companySymbol: string;
  country_of_incorporation: string;
  nature_of_business: string;
  directorsCount: string;
  shareholdersCount: string;
  one: boolean = false;
  two: boolean = false;
  three: boolean = false;
  four: boolean = false;
  changeL:boolean
  personalselect: boolean = false;
  structure_of_business: any;
  arr: any[];
  ownerarr: any[];
  business_profile_address: any;
  bProfileOpen = false;
  businessProfile: boolean;
  showBusinessProfileDropdown:boolean = false;
  showAboutusDropdown:boolean = false;
  isKybCompleted$: Observable<boolean>;
  status: number;
  forPlan:boolean = false;


  constructor(private router: Router, private homeService: HomeService, private alert: NotificationService, public authService: AuthService, private indexService: IndexService) {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));

  }

  ngOnInit() {
    this.structureOfBusiness();
    this.isKybCompleted$ = this.homeService.getIsKybCompleted();
  }

  personalSettingsChange() {
    this.router.navigate(['/business/settings/personal-profile/personal-profile-settings']);
    this.personalselect=true;
    this.emptyCard = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.businessProfile=false;
    this.contentCard =true;
    this.change_lang=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
    this.business_Profile = false;
    this.showBusinessProfileDropdown = false
    $(".per").on("click", function () {
      $(".collapse").collapse('hide');
    });

  }
  businessSettingsChange(){
    this.emptyCard = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.contentCard =true;
    this.change_lang=false;
    this.personal_Profile = false;
    this.business_Profile = true;
    this.change_password = false;
    this.structure_business = false;
    this.incorporation = false;
    this.nature_business = false;
    this.imageTrue = false;
    this.imageFalse = true;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
  }
  changeLang(){
    this.emptyCard = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.contentCard =true;
    this.change_lang=true;
    this.personal_Profile = false;
    this.business_Profile = false;
    this.change_password = false;
    this.structure_business = false;
    this.incorporation = false;
    this.nature_business = false;
    this.imageTrue = false;
    this.imageFalse = true;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
  }
  incorporationChange() {
    this.emptyCard = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.contentCard =true;
    this.personal_Profile = false;
    this.business_Profile = false;
    this.change_password = false;
    this.structure_business = false;
    this.incorporation = true;
    this.nature_business = false;
    this.change_lang=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
  }
  business_ProfileChange() {
    this.emptyCard = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.contentCard =true;
    this.personal_Profile = false;
    this.business_Profile = true;
    this.change_password = false;
    this.structure_business = false;
    this.incorporation = false;
    this.nature_business = false;
    this.change_lang=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
  }
  structure_businessChange() {
    this.emptyCard = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.contentCard =true;
    this.personal_Profile = false;
    this.business_Profile = false;
    this.change_password = false;
    this.structure_business = true;
    this.incorporation = false;
    this.nature_business = false;
    this.change_lang=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
  }
  nature_businessChange() {
    this.emptyCard = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.contentCard =true;
    this.personal_Profile = false;
    this.business_Profile = false;
    this.change_password = false;
    this.structure_business = false;
    this.incorporation = false;
    this.nature_business = true;
    this.change_lang=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
  }
  privacyPolicy(){
    this.emptyCard = false;
    this.emptyCard1 = true;
    this.emptyCard2 = false;
    this.emptyCard3 = false;
    this.contentCard = false;
    this.personal_Profile = false;
    this.business_Profile = false;
    this.change_password = false;
    this.structure_business = false;
    this.nature_business = false;
    this.change_lang=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = false;
    this.imageFalse2 = true;
  }
  termsConditions(){
    this.emptyCard = false;
    this.emptyCard1 = false;
    this.emptyCard2 = true;
    this.emptyCard3 = false;
    this.contentCard = false;
    this.personal_Profile = false;
    this.business_Profile = false;
    this.change_password = false;
    this.structure_business = false;
    this.nature_business = false;
    this.change_lang=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = false;
    this.imageFalse2 = true;
  }
  closeAccount(){
    this.emptyCard = false;
    this.emptyCard1 = false;
    this.emptyCard2 = false;
    this.emptyCard3 = true;
    this.contentCard = false;
    this.personal_Profile = false;
    this.business_Profile = false;
    this.change_password = false;
    this.structure_business = false;
    this.nature_business = false;
    this.change_lang=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = false;
    this.imageFalse2 = true;
  }
  getCompanyDetails() {
    this.homeService.getBusinessSettings().subscribe(res => {
      this.emptyCard = true;
      this.contentCard = false;
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.companyName = res['data']['incorporation']['legal_name'];
          this.business_profile_address = res['data']['business_profile']['operating_address'];
          this.nature_of_business = res['data']['nature_of_business']['business_sector'];
          this.isKybCompleted$.subscribe(completed => {
            if (completed) {
              this.personalSettingsChange();
            }
          });
        } else {
          // this.alert.error(res['data']['status']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  structureOfBusiness() {

    this.arr = [];
    this.homeService.getStructureOfBusinessData().subscribe(res => {
      this.emptyCard = true;
      this.contentCard =false;
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.count = 0;
          this.count1 = 0;
          // OwnersList
          this.ownersList = res['data']['ownerList']['Shareholder'];
          this.ownersList.forEach(element => {
            this.count++;
          });



          // directorsList
          this.directorsList = res['data']['ownerList']['Directors'];
          this.directorsList.forEach(element => {
            var directorsName = element.name;
            this.dirname = directorsName.slice(0, 1);
            this.arr.push({
              "symbol": this.dirname
            });
            this.count1++;
          });

        }
        else {
         // this.alert.error(res['data']['message']);
        }
      }
      else {
            this.alert.error(res['message']);
      }

    })
  }

  toggleBusinessProfileDropdown() {
    this.personalselect=false;
    this.changeL=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
    this.showAboutusDropdown=false;
    this.showBusinessProfileDropdown = !this.showBusinessProfileDropdown;
  }
  toggleAboutUsDropdown(){
    this.personalselect=false;
    this.changeL=false;
    this.imageTrue = true;
    this.imageFalse = false;
    this.imageTrue2 = !this.imageTrue2;
    this.imageFalse2 = !this.imageFalse2;
    this.showBusinessProfileDropdown=false;
    this.showAboutusDropdown = !this.showAboutusDropdown;
  }
  closeBusinessUserAccount(data) {
    this.status = data;
    const request = {
      status: data,
      account_type: this.profileData.account_type
    };
    this.homeService.closeAccount(request).subscribe(res => {
      if (res['data']['status'] == 0) {
        this.alert.success(res['data']['message']);
      } else {
        this.alert.error(res['data']['message']);
      }
    });
    sessionStorage.clear();
    this.router.navigate(['/business/login'])
  }


  keepAccount() {
    this.router.navigate(['/business/settings']);
    this.emptyCard = true;
    this.emptyCard3 = false;
    this.showAboutusDropdown = false;
    this.imageTrue2 = true;
    this.imageFalse2 = false;
  }
  openPlan(){
    this.forPlan = true;
  }
  backPlan(){
    this.router.navigateByUrl('/business/settings');
    $(".genrl").addClass("active");
    $(".genrl1").addClass("show active");
    $(".pln").removeClass("active");
    $(".pln1").removeClass("show active");
  }
}
