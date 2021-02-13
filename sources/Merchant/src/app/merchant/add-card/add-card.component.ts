import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SepaService } from 'src/app/sepa.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/core/toastr-notification/toastr-notification.service';
@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  cardForm: any;
  cardExp: any;
  monthValudation:boolean=false;
  cardNumber:any;

  constructor(private fb: FormBuilder, private service: SepaService, private router: Router, private alert: NotificationService) { }

  ngOnInit() {
    this.cardForm = this.fb.group({
      nameOnCard: ['', [Validators.required, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])]],
      cardNum: ['', [Validators.required, Validators.compose([Validators.required, Validators.pattern('^[0-9 ]*$')])]],
      expDate: ['', Validators.required],
      CVV: ['', [Validators.required, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]]
    })
    this.cardForm.controls['expDate'].valueChanges.subscribe(value => {
      if(value.length==2 && value>12){
       this.monthValudation=true;
      }
      else if(value.length==3  || value.length==4){
       let month=value.substring(0, 2)
       if(month>12){
        this.monthValudation=true;
       }
       else{
        this.monthValudation=false;
       }

      }
      else{
        this.monthValudation=false;
      }
    });
  }

  addCard(data) {
    var month = data.expDate.slice(0, 2);
    var year ='20'+ data.expDate.slice(2, 4);
    var request = {
      "card_type": this.type,
      "name_on_card": data.nameOnCard,
      "card_number": data.cardNum,
      "card_cvv": data.CVV,
      "card_month": +month,
      "card_year": +year
    }
    this.service.addCustomerCard(request).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data'] && res['data']['status'] == 0) {
          //this.alert.success(res['data']['message']);
           setTimeout(() => {
            this.router.navigate(['/shopping-cart']);
            }, 200);
        }
        else {
          this.alert.error(res['data']['message']);
        }
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }


  cardValidate: boolean = true;
  flag: boolean = false;
  type: any;
  getCardType(cardNumber) {
    if (cardNumber && cardNumber.length == 4) {
      this.service.getValidCard(cardNumber).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            this.cardValidate = false;
            this.flag = true
            this.type = res['data']['type'];
            this.cardForm.patchValue({
              'card_type': this.type
            })            
            // setTimeout(() => {
            //   this.subs.unsubscribe();
            // }, 100);
          }
          else if (res['data']['status'] == 1) {
            this.cardValidate = true;
            this.alert.error(res['data']['message'])
            this.type = '';
          }
        }
        else {
          this.alert.error(res['message'])
        }
      })
    }
    else {
      if (this.flag) {
        this.type = this.type;
      }
      if (cardNumber && cardNumber.length <= 4) {
        this.type = ''
      }
    }
  }
}
