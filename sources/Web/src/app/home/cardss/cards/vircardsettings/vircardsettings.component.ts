import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-vircardsettings',
  templateUrl: './vircardsettings.component.html',
  styleUrls: ['./vircardsettings.component.scss']
})
export class VircardsettingsComponent implements OnInit {

  cardsback:boolean = false;
  closeVir:boolean = true;
  lost1:boolean = true;
  lost2:boolean = false;
  unblock:boolean = true;
  remove1:boolean = false;
  remove2:boolean = true;
  limit1:boolean = false;
  limit2:boolean = true;
  name1:boolean = false;
  name2:boolean = true;
  limit = '200';
  nameInput = 'EasyVoo';

  constructor() { }

  ngOnInit() {
  }
  clickBack() {
    this.cardsback = true;
    this.closeVir = false;
  }
  swap() {
    var x = document.getElementById("freeze");
    if (x.innerHTML === "Freeze") {
      x.innerHTML = "Unfreeze";
      this.lost1 = false;
      this.lost2 = true;
      this.unblock = false;
      this.remove2 = true;
      this.remove1 = false;
      this.limit2 = false;
      this.limit1 = true;
      this.name2 = true;
      this.name1 = false
    } else {
      x.innerHTML = "Freeze";
      this.lost1 = true;
      this.lost2 = false;
      this.unblock = true;
      this.remove2 = true;
      this.remove1 = false;
      this.limit2 = true;
      this.limit1 = false;
      this.name2 = true;
      this.name1 = false
    }
  }
  onConfirm(value) {
    this.limit = value;
  }
  onName(value) {
    this.nameInput = value;
  }
  threeTimes() {
    $("#unblockCVV").modal("hide")
  }
  closeRemove() {
    $("#removeCrd").modal("hide")
  }
  closeReport() {
    $("#block").modal("hide")
  }
}
