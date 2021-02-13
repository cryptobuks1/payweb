import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalprofileComponent } from './personal/personalprofile.component';
import { AuthGuard } from 'src/app/core/gaurds/auth.guard';

export const profileRoute: Routes = [
  {path:'personal',component:PersonalprofileComponent,canActivate:[AuthGuard],data:{userAccount:['personal']}}
]

@NgModule({
  imports: [RouterModule.forChild(profileRoute)],
  exports:[RouterModule]

})
export class UsersrouteModule { }
