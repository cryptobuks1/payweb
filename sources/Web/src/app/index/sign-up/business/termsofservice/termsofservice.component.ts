import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-termsofservice',
  templateUrl: './termsofservice.component.html',
  styleUrls: ['./termsofservice.component.scss']
})
export class TermsofserviceComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  
  Individual()
  {
    this.router.navigate(['payvoo-personal']);
  }

  business()
  {
    this.router.navigate(['payvoo-business']);
  }


}
