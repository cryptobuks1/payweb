import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { AddCardComponent } from './add-card/add-card.component';
import { LoginGuard } from '../login.guard';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
   { path: '', component: LoginComponent },
  // { path: 'sandbox', component: SandboxStep1Component },
  { path: 'card', component: CardComponent,canActivate: [LoginGuard]},
  { path: 'add-card', component: AddCardComponent,canActivate:[LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRoutingModule { }