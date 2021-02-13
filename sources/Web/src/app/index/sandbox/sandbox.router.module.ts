import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SandboxloginComponent } from '../login/sandbox-login/sandboxlogin.component';
import { SandboxsignupComponent } from '../sign-up/sandbox/sandboxsignup.component';
import { SandboxForgotComponent } from '../forgot/sandbox-forgot/sandbox-forgot.component';

const routes: Routes = [
    {path: '', loadChildren: 'src/app/home/home.module#HomeModule'},
    {path:'login',component: SandboxloginComponent, 
     children:[{path:'',loadChildren:'src/app/index/login/login.module#LoginModule'}]
    },
    {path:'signup',component: SandboxsignupComponent,
     children:[{path:'',loadChildren:'src/app/index/sign-up/sign-up.module#SignUpModule'}]
    },
    {path:'forgot',component: SandboxForgotComponent,
    children:[{path:'',loadChildren:'src/app/index/forgot/forgot.module#ForgotModule'}]
    },
    {path:'forgot/:id',component: SandboxForgotComponent,
    children:[{path:'',loadChildren:'src/app/index/forgot/forgot.module#ForgotModule'}]
    }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRoutingModule { }
