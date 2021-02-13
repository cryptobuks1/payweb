import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypesofbusinessComponent } from './typesofbusiness/typesofbusiness.component';
import { BusinessaddressComponent } from './businessaddress/businessaddress.component';
import { SupportingdocumentsComponent } from './supportingdocuments/supportingdocuments.component';
import { PersonalprofileComponent } from './personalprofile/personalprofile.component';
import { BusinessownerdetailsComponent } from './businessownerdetails/businessownerdetails.component';

export const applicationRoute: Routes = [
  {path:'typesbusiness',component:TypesofbusinessComponent},
  {path:'businessadd',component:BusinessaddressComponent}, 
  {path:'supportingdocument',component:SupportingdocumentsComponent},
  {path:'personal',component:PersonalprofileComponent},
  {path:'businessOwner',component:BusinessownerdetailsComponent}

]


@NgModule({
  imports: [RouterModule.forChild(applicationRoute)],
  exports:[RouterModule]

})
export class ApplicationsroutingModule { }
