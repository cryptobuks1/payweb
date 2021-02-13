import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SandboxloginComponent } from './login/sandbox-login/sandbox-login.component';
import { SandboxsignupComponent } from 'app/index/sign-up/sandbox/sandboxsignup/sandboxsignup.component';
import { SandboxForgotComponent } from 'app/index/forgot/sandbox-forgot/sandbox-forgot.component';
import { AuthGuard } from 'app/core/gaurds/auth.guard';

const routes: Routes = [
  {path: 'dashboard', loadChildren: () => import('../../app/home/home.module').then(m => m.HomeModule)},
    {path:'',component: SandboxloginComponent, 
     children:[{path:'',loadChildren:() => import('../../app/sandbox/login/login.module').then(m => m.LoginModule)}]
    },
    {path:'login',component: SandboxloginComponent, 
    children:[{path:'',loadChildren:() => import('../../app/sandbox/login/login.module').then(m => m.LoginModule)}]
   },
    {path:'signup',component: SandboxsignupComponent,
     children:[{path:'',loadChildren:() => import('../../app/index/sign-up/sign-up.module').then(m => m.SignUpModule)}]
    },
    {path:'sandbox/forgot',component: SandboxForgotComponent,
     children:[{path:'',loadChildren:() => import('../../app/index/forgot/forgot.module').then(m => m.ForgotModule)}]
    },
    {path:'sandbox/forgot/:id',component: SandboxForgotComponent,
    children:[{path:'',loadChildren:() => import('../../app/index/forgot/forgot.module').then(m => m.ForgotModule)}]
    },
    
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRoutingModule { }
