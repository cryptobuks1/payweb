import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  phys:boolean = true;
  physStt:boolean = false;
  listActive: boolean = false;
  gridActive: boolean = true;
  layout: boolean = true;
  cardType: boolean = true;
  deliveryaddress:boolean=false;
  pinCreate:boolean = true;
  delivery1:boolean = true;
  checkPin:boolean = false;
  showMyContainer;
  showMyContainer1;
  countryData;
  search_accounts;
  isVisible: boolean = false;
  isVisible1: boolean = false;
  confirmPin: boolean = false;
  forVirtual:boolean = false;

  constructor() { }

  ngOnInit() {
   
   
      $(".search_open").click(function () {
        $(".srch_cnt").toggleClass("active");
      });
    
  }
  onPhys() {
    this.phys = false;
    this.physStt = true;
  }
  listView() {
    this.listActive = true
    this.gridActive = false;
    this.layout = false;
  }
  gridView() {
    this.gridActive = true;
    this.listActive = false
    this.layout = true;
  }
  deliveryAddress(){
    this.deliveryaddress=true
  }
  onClick1(){
    $("#exampleModal").modal("hide")
  }
  onClick2(){
    $("#PIN").modal("hide")
  }
  onClick3(){
    $("#delivery").modal("hide")
  }
  onClick4(){
    $("#delivery").modal("hide")
  }
  onClick5(){
    $("#address").modal("hide")
  }
  onClick6(){
    $("#order").modal("hide")
  }
  onClick8(){
    $("#corporateCard").modal("hide")
  }
  onClickV(){
    $("#exampleModal2").modal("hide")
  }
  onClick7(){
    $("#orderV").modal("hide")
  }
  onClose1() {
    $("#exampleModal").modal("show")
  }
  onClose2() {
    $("#PIN").modal("show")
  }
  onClose3() {
    $("#delivery").modal("show")
  }
  onClose4() {
    $("#delivery").modal("show")
  }
  onClose5(){
    $("#exampleModal").modal("show")
  }
  onLink() {
    $("#existingCard").modal("hide")
  }
  onClick10(){
    $("#corporateCard").modal("hide")
  }
  onChange1(){
    this.isVisible = true;
  }
  onChange2(){
    this.isVisible1 = true;
  }
  closePhysical() {
    this.phys = false;
    this.forVirtual = true;
  }
  forPin() {
    this.confirmPin = true;
  }
  onOrange(){
    $("#exampleModal").modal("hide")
  }
  onBlue(){
    $("#exampleModal").modal("hide")
  }
  onBlack(){
    $("#exampleModal").modal("hide")
  }
  getOrange(){
    $("#exampleModal").modal("show")
  }
  getBlue(){
    $("#exampleModal").modal("show")
  }
  getBlack(){
    $("#exampleModal").modal("show")
  }
  closeBlack(){
    $("#BLACK").modal("hide")
  }
  passwordType:string ='password';
 passwordShown: boolean = false;
 togglePassword(){
   if(this.passwordShown){
     this.passwordShown = false;
     this.passwordType = 'password';
   }
   else{
    this.passwordShown = true;
    this.passwordType = 'text';
   }
 }
}
