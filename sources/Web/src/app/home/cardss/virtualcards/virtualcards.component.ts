import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-virtualcards',
  templateUrl: './virtualcards.component.html',
  styleUrls: ['./virtualcards.component.scss']
})
export class VirtualcardsComponent implements OnInit {
  linkAccount: boolean;
  cardLimittt: boolean=false;
  btndisabled: boolean = true;
  selectCard : boolean = true;
  arry : any = [{name:"Razak",symbol:"C"},{name:"praneeth",symbol:"P"}];
  selectedIndex:any;
  constructor() { 
   
  }

  ngOnInit() {
  }
  cardsTrue(i) {
    this.linkAccount = true;
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
  chooseCard(){
    this.selectCard = true;
    this.linkAccount = false;
  }
}
