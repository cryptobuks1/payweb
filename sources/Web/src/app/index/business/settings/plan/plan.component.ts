import { HomeService } from './../../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  response: any;
  planFeatures: any;
  spent: any;
  plan_subscription: any;
  plan_subscription_spent: any;
  total: any;
  footer: any;

  constructor(private homeService: HomeService, private alert: NotificationService, private location: Location) { }

  ngOnInit() {
    this.getPlans();
  }

  dynamic : boolean = true;
  static : boolean  =false;

  backPlan(){
    this.location.back();
  }
  getPlans() {
    this.homeService.getPlans().subscribe(res => {
       if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.response = res['data'];
          this.plan_subscription = this.response['subscription']['title']

          this.plan_subscription_spent = this.response['subscription']['Spent']
          this.planFeatures = this.response['features'];
          this.total = this.response['total']['total'];
          this.footer = this.response['total']['footer'];
        }
        else {
          this.dynamic = false;
          this.static = true;
        }
      }
      else {
      }
    })
  }
}