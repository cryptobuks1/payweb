  /**
   * Payvoo Component
   * its a landing page of the payvoo personal and navigation of signup and login
   * @package PayvooBusinessComponent
   * @subpackage app\index\personal-landing\PayvooComponent
   * @author SEPA Cyber Technologies, Sayyad M.
   */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-payvoo',
  templateUrl: './payvoo.component.html',
  styleUrls: ['./payvoo.component.scss']
})
export class PayvooComponent implements OnInit {

  constructor(private routerNavigate: Router) { }

  businessPayvoo() {
    this.routerNavigate.navigate(['payvoo-business']);
  }

  personalPayvoo() {
    this.routerNavigate.navigate(['payvoo-personal']);
  }

  PersoanlSignupPage() {
    this.routerNavigate.navigate(['/signup']);
  }


  PersonalloginPage() {
    this.routerNavigate.navigate(['/login']);
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
