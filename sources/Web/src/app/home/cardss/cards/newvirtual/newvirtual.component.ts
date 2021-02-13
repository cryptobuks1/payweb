import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-newvirtual',
  templateUrl: './newvirtual.component.html',
  styleUrls: ['./newvirtual.component.scss']
})
export class NewvirtualComponent implements OnInit {

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
  onClickV(){
    $("#exampleModal2").modal("hide")
  }
  onClick7(){
    $("#orderV").modal("hide")
  }
  closeVirtual() {
    this.forPhysical = true;
    this.clsVir = false;
  }
  onChange2(){
    this.isVisible1 = true;
  }
  onVirCard() {
    this.clsVir = false;
    this.vcs = true;
  }
}
