import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { AddMoneyComponent } from './../add-money.component';
import * as _ from "lodash";
declare var $: any;

import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { AuthService } from 'src/app/core/shared/auth.service';

@Component({
  selector: 'app-deletecards',
  templateUrl: './cardsdetails.component.html',
  styleUrls: ['./cardsdetails.component.scss']
})
export class CardsDetailsComponent implements OnInit {
  applicant_id: any;
  profileData: any;
  cardData: any;
  CardDetails: any;
  id: any;
  confirmDelete:false;
  constructor(public authService: AuthService,private routerNavigate:Router,private route: ActivatedRoute,private addmoneycomponent:AddMoneyComponent,private homeService:HomeService,private alert:NotificationService) {
    this.profileData=JSON.parse(sessionStorage.getItem('userData'));
  }

  deleteModel() {
    $('html, body').css("overflowY", "auto");
    $("#deleteModal").modal('show');
  }

  deleteCard(){
    $('html, body').css("overflowY", "auto");
    $("#deleteModal").modal('hide');
    $("#confirm_delete").modal('show');
      var obj={
       payment_cards_id:this.id,
      isActive:0
    }
    this.homeService.deleteCard(obj).subscribe(res=>{

      if(res['status']==0){
      if(res['data']['status']==0){
        $("#deleteModal").modal('hide');

        $("#confirm_delete").modal('show');
        this.addmoneycomponent.getCardDetails();
      }

      if(res['data']['status']==1){
         this.alert.error(res['data']['message'])
       }
      }
      else{
        this.alert.error(res['message'])
      }
    })

  }
  creditCardMask(credNumber) {
    if (credNumber != null) {
      // credNumber = credNumber.replace(/[^0-9]+/g, ''); /*ensureOnlyNumbers*/
      //   return (credNumber.substring(0,0) + char.repeat(l-4) + credNumber.substring(l-4,l)).replace(/(.{4})/g, '$1 ').trim();
      return (credNumber).replace(/(.{4})/g, '$1 ').trim();
    }
  }

  confirmPopClose(){
    $("#confirm_delete").modal('hide');
    if(this.authService.accountMatch(['personal'])){
    this.routerNavigate.navigate(['/personal/add-money']);
    }
    else if(this.authService.accountMatch(['business'])){
      this.routerNavigate.navigate(['/business/add-money']);
    }
  }
  ngOnInit() {
    this.route.params.subscribe(param =>{
       this.id=this.route.snapshot.paramMap.get('id');
    this.homeService.getCardDetails().subscribe(res=>{
      if(res['status']==0){
      if(res['data']['status']==0){
         this.cardData=res['data']['cards'];
         var obj =  this.cardData.filter(({payment_cards_id}) => payment_cards_id == this.id);
        this.CardDetails=obj[0];
      }
      else if(res['data']['status']==1){
          this.alert.error(res['data']['message'])
       }
      }
      else{
        this.alert.error(res['message'])
      }
    })
     });
  }


}
