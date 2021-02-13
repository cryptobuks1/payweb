import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/shared/home.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-plan',
  templateUrl: './personal-plan.component.html',
  styleUrls: ['./personal-plan.component.scss']
})
export class PersonalPlanComponent implements OnInit {

  response: any;
  planFeatures: any;
  spent: any;
  plan_subscription: any;
  plan_subscription_spent: any;
  personalPlan:boolean=true;
  constructor(private homeService: HomeService, private location: Location, private route:Router) { }

  ngOnInit() {
    this.getPlans();
  }
  getPlans() {
    this.homeService.getPlans().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.response = res['data'];
          this.plan_subscription = this.response['subscription']['title']
          this.plan_subscription_spent = this.response['subscription']['Spent']
          this.planFeatures = this.response['features'];  
        }
        else {
        }
      }
      else{
      }
    })
  }
  backPlan(){
    this.route.navigate(['/personal/individual-settings/general-details']);
  }
  
}
