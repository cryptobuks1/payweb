import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-b-cards',
  templateUrl: './b-cards.component.html',
  styleUrls: ['./b-cards.component.scss']
})
export class BCardsComponent implements OnInit {

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
  activeclrstandard: boolean = false;
  activeclrexpress: boolean = false;
  showMyContainer;
  showMyContainer1;
  countryData;
  search_accounts;
  isVisible: boolean = false;
  isVisible1: boolean = false;
  confirmPin: boolean = false;
  forVirtual:boolean = false;
  forEmployees:boolean = false;

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
    $("#existingCard").modal("hide")
  }
  onClick3(){
    $("#cardLimit").modal("hide")
  }
  onClick4(){
    $("#PIN").modal("hide")
  }
  onClick5(){
    $("#delivery").modal("hide")
  }
  onClick6(){
    $("#address").modal("hide")
  }
  onClick7(){
    $("#deliveryOption").modal("hide")
  }
  onClickV(){
    $("#exampleModal2").modal("hide")
  }
  onClick8(){
    $("#order").modal("hide")
  }
  onClick9(){
    $("#corporateCard").modal("hide")
  }
  onClick10(){
    $("#newEmployee").modal("hide")
  }
 
  OnCard1(){
    $("#NEWCARD").modal("hide")
    $("#benefits").modal("show")

  }
  OnCard2(){
    $("#benefits").modal("hide")
  }
  OnCard3(){
    $("#PLAN").modal("hide")
  }
  onClose1() {
    $("#exampleModal").modal("show")
  }
  onClose3() {
    $("#cardLimit").modal("show")
  }
  onClose2() {
    $("#existingCard").modal("show")
  }
  onClose4() {
    $("#PIN").modal("show")
  }
  onClose5(){
    $("#delivery").modal("show")
  }
  onClose6(){
    $("#address").modal("show")
  }
  onLink() {
    $("#existingCard").modal("hide")
  }
  AddNew(){
    $("#exampleModal").modal("hide")
  }
  onChange1(){
    this.isVisible = true;
  }
  closeEmp() {
    $("#exampleModal").modal("hide")
  }
  onConfirm(){
    $("#delivery").modal("hide")
  }
  onChange2(){
    this.isVisible1 = true;
  }
  closePhysical() {
    this.phys = false;
    this.forVirtual = true;
    this.forEmployees = false;
  }
  closeVirtual() {
    this.phys = true;
    this.forVirtual = false;
    this.forEmployees = false;
  }
  openEmployees(){
    this.phys = false;
    this.forVirtual = false;
    this.forEmployees = true;
  }
  activclrexpress(){
    this.activeclrstandard = false
    this.activeclrexpress=true
  }
  activclrstndard() {
    this.activeclrstandard = true
    this.activeclrexpress=false
  }
 
  forPin() {
    this.confirmPin = true;
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
 onPending(){
  $("#pending1").modal("show")
 }
 onPending2(){
  $("#pending1").modal("hide")
  $("#pending2").modal("show")
 }
 onDelete() {
  $("#deleteCard").modal("show")
 }
}
