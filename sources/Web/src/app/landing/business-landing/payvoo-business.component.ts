  /**
   * Payvoo Business Component
   * its a landing page of the payvoo business and navigation of signup and login
   * @package PayvooBusinessComponent
   * @subpackage app\index\business-landing\PayvooBusinessComponent
   * @author SEPA Cyber Technologies, Sayyad M.
   */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-payvoo-business',
  templateUrl: './payvoo-business.component.html',
  styleUrls: ['./payvoo-business.component.scss']
})
export class PayvooBusinessComponent implements OnInit {

  constructor(private routerNavigate: Router) { }


  personalPayvoo() {
    this.routerNavigate.navigate(['']);
  }
  businessSignupPage() {
    this.routerNavigate.navigate(['business/signup']);
  }
  businessLoginPage() {
    this.routerNavigate.navigate(['business/login']);
  }
  sandboxRegister() {
    this.routerNavigate.navigate(['sandbox/signup']);
  }
  termsofPolicy() {
    window.open('/#/index/termsofpolicy', '_blank');
  }



  ngOnInit() {

    $(".slider-content").not('.slick-initialized').slick({
      infinite: !1,
      slidesToShow: 4,
      slidesToScroll: 1,
      settings: "unslick",
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true
          }
        }
      ]
    });

    $("#nav-icon").click(function () {
      $(this).toggleClass("active");
      $('.menu_items').toggleClass("active");
    });
  }

}
