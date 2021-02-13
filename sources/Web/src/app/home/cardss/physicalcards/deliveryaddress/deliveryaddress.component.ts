import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deliveryaddress',
  templateUrl: './deliveryaddress.component.html',
  styleUrls: ['./deliveryaddress.component.scss']
})
export class DeliveryaddressComponent implements OnInit {

  linkAccount: boolean;
  cardLimittt: boolean = false;
  btndisabled: boolean = true;
  address: boolean = true;
  activeclrstandard: boolean = false;
  activeclrexpress: boolean = false;
  constructor() {

  }

  ngOnInit() {
  }
  cardsTrue() {
    this.linkAccount = true;
    this.address = false;
  }
  cardLimit() {
    this.cardLimittt = true;
    this.btndisabled = false
  }
  previousPage() {
    this.cardLimittt = false;
    this.btndisabled = true
  }
  activclrexpress(){
    this.activeclrstandard = false
    this.activeclrexpress=true
  }
  activclrstndard() {
    this.activeclrstandard = true
    this.activeclrexpress=false
  }
 

}
