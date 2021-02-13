import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessLoginComponent } from '../login/business-login/business-login.component';
import { BusinessSignupComponent } from '../sign-up/business/business-signup.component';
import { BusinessForgotComponent } from '../forgot/business-forgot/business-forgot.component';
import { BusinessRegisterFormComponent } from '../sign-up/business/business-register-form/business-register-form.component';
import { BusinessRegisterComponent } from '../sign-up/business/business-register/business-register.component';

const routes: Routes = [
    {path: '', loadChildren: 'src/app/home/home.module#HomeModule'},
    {path:'login',component: BusinessLoginComponent,
    children:[{path:'',loadChildren:'src/app/index/login/login.module#LoginModule'}]
   },
   {path:'signup',component: BusinessSignupComponent,
     children:[{path:'',loadChildren:'src/app/index/sign-up/sign-up.module#SignUpModule'}]
    },
    {path:'signup/reg-form', component: BusinessRegisterFormComponent,
     children:[{path:'',loadChildren:'src/app/index/sign-up/sign-up.module#SignUpModule'}]
    },
    {path:'signup/register', component: BusinessRegisterComponent,
    children:[{path:'',loadChildren:'src/app/index/sign-up/sign-up.module#SignUpModule'}]
   },
    {path:'forgot',component: BusinessForgotComponent,
    children:[{path:'',loadChildren:'src/app/index/forgot/forgot.module#ForgotModule'}]
    },
    {path:'forgot/:id',component: BusinessForgotComponent,
    children:[{path:'',loadChildren:'src/app/index/forgot/forgot.module#ForgotModule'}]
    }
]
9849338475

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }