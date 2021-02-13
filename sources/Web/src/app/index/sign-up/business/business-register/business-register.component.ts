import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-business-register',
  templateUrl: './business-register.component.html',
  styleUrls: ['./business-register.component.scss']
})
export class BusinessRegisterComponent implements OnInit {

  constructor(private routerNavigate:Router) { }

  ngOnInit() {
  }
  busingessRegForm(){
  this.routerNavigate.navigate(['/business/signup/reg-form'])
  }
}
