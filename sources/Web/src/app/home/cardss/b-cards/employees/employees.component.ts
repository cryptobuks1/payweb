import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  forPhysical:boolean = false;
  clsVir:boolean = false;
  emp:boolean = true;
  forVirtual:boolean = false;
  navBar = false;
  cards:boolean = true;
  forSettings:boolean = false;
  state:boolean = false;

  constructor() { }

  ngOnInit() {
  }
  openPhysical(){
    this.forPhysical = true;
    this.emp = false;
    this.forVirtual = false;
  }
  openVirtual() {
    this.forPhysical = false;
    this.emp = false;
    this.forVirtual = true;
  }
  closePhysical(){
    this.navBar = true;
    this.emp = false; 
    this.cards = true;
  }
  blockEmployee(){
    this.navBar = true;
    this.forSettings = true;
    this.cards = false;
    this.state = false;
  }
  openCards(){
    this.cards = true;
    this.forSettings = false;
    this.state = false;
  }
  openTran() {
    this.cards = false;
    this.forSettings = false;
    this.state = true;
  }
  onBack(){
    this.navBar = false;
    this.emp = true; 
    this.state = false;
    this.forSettings = false;
  }
}
