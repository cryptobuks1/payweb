import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-b-newvirtual',
  templateUrl: './b-newvirtual.component.html',
  styleUrls: ['./b-newvirtual.component.scss']
})
export class BNewvirtualComponent implements OnInit {

  abc:boolean = true;
  def:boolean = false;
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
  forPhysical:boolean = false;
  forEmployees:boolean = false;
  clsVir:boolean = true;
  vcs:boolean = false;

  constructor() { }

  ngOnInit() {
    
    $(".search_open").click(function () {
      $(".srch_cnt").toggleClass("active");
    });
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
  onClick1(){
    $("#exampleModal").modal("hide")
  }
  onClose1(){
    $("#exampleModal").modal("show")
  }
  addNew(){
    $("#exampleModal").modal("hide")
  }
  onClick2(){
    $("#newEmployee").modal("hide")
  }
  onClose2(){
    $("#exampleModal").modal("show")
  }
  onClick3(){
    $("#setName").modal("hide")
  }
  onClose3(){
    $("#setName").modal("show")
  }
  onClick4(){
    $("#linkCard").modal("hide")
  }
  onClose4(){
    $("#linkCard").modal("show")
  }
  onClick5(){
    $("#monthlyLimit").modal("hide")
  }
  onClick6(){
    $("#order").modal("hide")
  }
  onClick7(){
    $("#corporateCard").modal("hide")
  }
 
 
  openPhysical() {
    this.forPhysical = true;
    this.clsVir = false;
  }
  openEmployees() {
    this.forEmployees = true;
    this.clsVir = false;
    this.forPhysical = false;
    this.vcs = false;
  }
  onChange2(){
    this.isVisible1 = true;
  }
  onVirCard() {
    this.clsVir = false;
    this.vcs = true;
  }
}
