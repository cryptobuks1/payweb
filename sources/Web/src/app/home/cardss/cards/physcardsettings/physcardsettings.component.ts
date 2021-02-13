import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-physcardsettings',
  templateUrl: './physcardsettings.component.html',
  styleUrls: ['./physcardsettings.component.scss']
})
export class PhyscardsettingsComponent implements OnInit {

  cardsback:boolean = false;
  closePhys:boolean = true;
  lost1:boolean = true;
  lost2:boolean = false;
  unblock1:boolean = false;
  unblock2:boolean = true;
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
  clickBack(){
    this.cardsback = true;
    this.closePhys = false;
  }
  onConfirm(value) {
    this.limit = value;
  }
  onName(value) {
    this.nameInput = value;
  }
  swap() {
    var x = document.getElementById("freeze");
    if (x.innerHTML === "Freeze") {
      x.innerHTML = "Unfreeze";
      this.lost1 = false;
      this.lost2 = true;
      this.unblock2 = false;
      this.unblock1 = true;
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
      this.unblock2 = true;
      this.unblock1 = false;
      this.remove2 = true;
      this.remove1 = false;
      this.limit2 = true;
      this.limit1 = false;
      this.name2 = true;
      this.name1 = false
    }
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
