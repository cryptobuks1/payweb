import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index.component';
import { LoginGuard } from '../login.guard';
import { PersonalLoginComponent } from './personal-login/personal-login.component';


const routes: Routes = [
      { path: 'sandbox-login/:id', component: LoginComponent },
      { path: 'login', component: PersonalLoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }