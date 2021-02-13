import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {path: '', loadChildren: () => import('../app/sandbox/sandbox.module').then(m => m.SandboxModule)},

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule],

})
   export class AppRouterModule { }