import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from '../../service/merchant.service';
import { SepaService } from 'src/app/sepa.service';
import { NotificationService } from 'src/core/toastr-notification/toastr-notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cardData: any = [];
  cardForm: FormGroup;
  radioSelected: any;
  selectedCard: any;
  amount: any;
  forPassword: boolean = false;
  toPay: boolean = true;
  accountData: any;
  accdata: any;
  euroCurrency: any;
  euroBalance: any;
  totalAmount: any;
  
  constructor(private _router:Router, private fb: FormBuilder, private _service:MerchantService, private service: SepaService,
    private alert: NotificationService) {
    this.getCards();
   }

  ngOnInit() {
    this.amount = 100
    this._service.loggedIn.next(true)
    this.cardForm = this.fb.group({
      amount: ['', Validators.compose([Validators.required, Validators.min(10)])],
      currency: ['', Validators.required],
    })
  }
  getCards() {
    this.service.getCards().subscribe(res => {
      if (res['status'] == 0) { 
        if (res['data']['status'] == 0) {
          this.cardData = res['data']['cards'];        
        }
        if (res['data']['status'] == 1) {
          this.cardData = res['data']['cards'];
        }   
      }
      else {
        this.alert.error(res['message'])
      }
    })
  }
  onItemChange(value){
    console.log(" Value is : ", value );
 }
  creditCardMask(credNumber) {
    //   credNumber = credNumber.replace(/[^0-9]+/g, ''); /*ensureOnlyNumbers*/
       let l = credNumber.length;
       if (l == 16) {
         return "**** " + "**** " + "**** " + credNumber.substring(12, l);
       }
   
       if (l == 19) {
         return "**** " + "**** " + "**** " + "*** " + credNumber.substring(15, l);
       }
   
       // return credNumber.substring(0,0) + char.repeat(l-4) + credNumber.substring(l-4,l);
       // return credNumber.substring(0, 4) + " " + credNumber.substring(4, 8) + " " + credNumber.substring(8, 12) + " " + credNumber.substring(12, l);
     }
  confirmPay(){
    this.cardData.forEach(element => {
      if(element.payment_cards_id == this.radioSelected) {
        this.selectedCard = element;
      }     
    });   
    this._router.navigate(['/confirm-pay'], { state: { cardData: this.selectedCard }});
  }
  preDiv(){
    this._router.navigate([''])
  }
  paymentDetailsModal(){
    $('#amount').modal('show')
  }
  onClick1(){
    $('#exampleModal').modal('hide')
  }
}