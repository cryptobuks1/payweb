import { AddMoneyComponent } from './../add-money.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';
import { SubSink } from 'subsink';
import { cloneDeep } from 'lodash';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  cardDetailsForm: FormGroup
  profileData: any;
  applicant_id: any;
  type: any;
  flag: boolean = false;
  cardNumber: any;
  months: string[] = [];
  cardValidate:boolean=true;
  monthValidation:boolean=false;
  yearValidation:boolean = false;
  cvvValidation:boolean =false;
  private subs=new SubSink();
  apploader: boolean=false;
  day;
  month;
  year;


  constructor(public authService: AuthService,private fb: FormBuilder, private homeService: HomeService,  private addMoneyComp: AddMoneyComponent,private alert:NotificationService) {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
    this.months= ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  }
  submitCard(formData: any) {
    const copiedObj = cloneDeep(formData);
    copiedObj.card_month = this.months.findIndex(element => element === formData.card_month);
    copiedObj.card_month = copiedObj.card_month + 1;
    copiedObj.card_year= formData.card_year
    delete copiedObj["card_exp"];
    this.apploader=true;
    this.homeService.submitCard(copiedObj).subscribe(res => {
      if(res['status']==0){
        this.apploader=false;
      if (res['data']['status'] == 0) {
        //this.alert.success(res['data']['message']);
        this.cardDetailsForm.reset();
        this.type = ''
        this.addMoneyComp.getCardDetails();
       } else if (res['data']['status'] == 1) {
        this.apploader=false;
         this.alert.error(res['data']['message']);
      }
    }
    else{
      this.apploader=false;
      this.alert.error(res['message'])
    }
    })
  }
  getCardType(cardNumber) {
    if (cardNumber && cardNumber.length == 4) {
      this.subs.sink=this.homeService.getValidCardDetails(cardNumber).subscribe(res => {
      if(res['status']==0){
        if (res['data']['status'] == 0) {
          this.cardValidate=false;
          this.flag = true
          this.type = res['data']['type'];
          this.cardDetailsForm.patchValue({
            'card_type': this.type
          })
          setTimeout(() => {
            this.subs.unsubscribe();
          }, 100);
        } else if(res['data']['status']==1) {
        this.cardValidate=true;
        this.alert.error(res['data']['message'])
          this.type = '';
        }
      } else {
        this.alert.error(res['message'])
      }
      })
    } else {      
      if (cardNumber && cardNumber.length <= 4) {
        this.type = ''
      }
    }
  }

  ngOnInit() {
    this.cardDetailsForm = this.fb.group({
      card_number: ["", Validators.compose([Validators.required, Validators.pattern('^[0-9 ]*$')])],
      card_cvv: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
      name_on_card:["", Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z ]*$')])],
      card_type: ['', Validators.required],
      card_month: [0, Validators.required],
      card_year: ['',Validators.compose([Validators.required,Validators.pattern('^[0-9]*$')])],
    })

    this.cardDetailsForm.controls['card_month'].valueChanges.subscribe(value => {
      if(value && value.length==2 && value>12){
       this.monthValidation=true;
      }
      else if((value && value.length==3)  || (value && value.length==4)){
       let month=value.substring(0, 2)
       if(month>12){
        this.monthValidation=true;
       }
       else{
        this.monthValidation=false;
       }

      }
      else{
        this.monthValidation=false;
      }
    });
    this.cardDetailsForm.controls['card_cvv'].valueChanges.subscribe(value => {
      if(value && !value.toString().match(/^[0-9]+(\.?[0-9]+)?$/)){
       this.cvvValidation=true;
      }
      else{
        this.cvvValidation=false;
      }
    });
    this.cardDetailsForm.controls['card_year'].valueChanges.subscribe(value => {
      if(!this.day && !this.month && !this.year) {      
        var d = new Date();
        this.month = (d.getMonth() + 1);
        this.day = '' + d.getDate();
        this.year = d.getFullYear();
      }
      if((value && value.length)<4 || value<this.year){
       this.yearValidation=true;      
      }
      else{
        this.yearValidation=false;
      }
    });
    this.cardDetailsForm.valueChanges.subscribe(res => {
      if(!this.day && !this.month && !this.year) {      
        var d = new Date();
        this.month = (d.getMonth() + 1);
        this.day = '' + d.getDate();
        this.year = d.getFullYear();
      }
      const cardYear = parseInt(res.card_year);
      const cardMonth = parseInt(res.card_month);
      if(cardYear==this.year && cardMonth < this.month ){
       this.yearValidation =true;      
      }
      else if(cardYear == this.year && cardMonth >= this.month){
        this.yearValidation = false;
      } else if(cardYear > this.year) {
        this.yearValidation = false;
      }
    });  
  }
  myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }
  hideInfoPopup() {
    var popup = document.getElementById("myPopup");
    popup.classList.remove("show");
  }
}
