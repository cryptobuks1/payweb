import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss']
})
export class BeneficiaryComponent implements OnInit {

  fName = '';
  lName = '';
  one:boolean = true;
  two:boolean = false;
  three:boolean = false;
  four:boolean = false;
  five:boolean = false;
  confirm:boolean = false;
  constructor() { }

  ngOnInit() {
  }
  onNew(){
    this.one = false;
    this.two = true;
  }
  transferType(){
    this.two = false;
    this.three = true;
  }
  onClick1(){
    $("#country").modal("hide");
    this.three = false;
    this.four = true;
  }
  onClick2(){
    this.four = false;
    this.five = true;
  }
  onClick3(){
    this.five = true;
  }
  onConfirm(){
    this.five = false;
    this.one = true;
    this.confirm = true;
  }
  onClose(){
    this.one = false;
  }
  onClose1(){
    $("#bName2").modal("hide");
  }
  onClose2(){
    $("#bName").modal("hide");
  }
}
