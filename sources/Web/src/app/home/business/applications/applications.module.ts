import { NgModule } from '@angular/core';
import { ApplicationsroutingModule } from './applicationsrouting.module';
import { SupportingdocumentsComponent } from './supportingdocuments/supportingdocuments.component';
import { PersonalprofileComponent } from './personalprofile/personalprofile.component';
import { BusinessownerdetailsComponent } from './businessownerdetails/businessownerdetails.component';
import { FinishyourapplicationComponent } from './finishyourapplication/finishyourapplication.component';
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [SupportingdocumentsComponent, PersonalprofileComponent, BusinessownerdetailsComponent, FinishyourapplicationComponent,],
  imports: [
    ApplicationsroutingModule,CommonModule,FormsModule,ReactiveFormsModule
  ]
})
export class ApplicationsModule { 
  constructor(){
  }
}
