import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalLoginComponent } from '../login/personal-login/personal-login.component';
import { PersonalSignupComponent } from '../sign-up/personal/personal-signup.component';
import { PersonalForgotComponent } from '../forgot/personal-forgot/personal-forgot.component';




const routes: Routes = [
    {path: '', loadChildren: 'src/app/home/home.module#HomeModule'},
    {path:'login',component: PersonalLoginComponent, 
     children:[{path:'',loadChildren:'src/app/index/login/login.module#LoginModule'}]
    },
    {path:'signup',component: PersonalSignupComponent,
     children:[{path:'',loadChildren:'src/app/index/sign-up/sign-up.module#SignUpModule'}]
    },
    {path:'forgot',component: PersonalForgotComponent,
    children:[{path:'',loadChildren:'src/app/index/forgot/forgot.module#ForgotModule'}]
    },
    {path:'forgot/:id',component: PersonalForgotComponent,
    children:[{path:'',loadChildren:'src/app/index/forgot/forgot.module#ForgotModule'}]
    }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }