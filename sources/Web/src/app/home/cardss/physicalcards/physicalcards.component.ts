import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-physicalcards',
  templateUrl: './physicalcards.component.html',
  styleUrls: ['./physicalcards.component.scss']
})
export class PhysicalcardsComponent implements OnInit {

  linkAccount: boolean;
  cardLimittt: boolean=false;
  btndisabled: boolean = true;
  cardholderr:boolean=true;
  deliveryaddress:boolean=false;
  selectedIndex;
  aray:any=[{name:"Razak",symbol:"R"},{name:"Praneeth",symbol:"P"}];
  constructor() { 
   
  }

  ngOnInit() {
  }
  cardsTrue(i) {
    this.linkAccount = true
    this.selectedIndex=i;
  }
  cardLimit() {
    this.cardLimittt = true;
    this.btndisabled = false
  }
  previousPage() {
    this.cardLimittt = false;
    this.btndisabled = true
  }
  deliveryAddress(){
    this.cardholderr=false;
    this.deliveryaddress=true
  }
  chooseCard(){
    this.cardholderr = true;
    this.linkAccount = false;
  }
}
