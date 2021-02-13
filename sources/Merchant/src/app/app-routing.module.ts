import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'sandbox', loadChildren: 'src/app/sandbox/sandbox.module#SandboxModule' },
  { path: 'index', loadChildren: 'src/app/index/index.module#IndexModule' },
  { path: '', loadChildren: 'src/app/merchant/merchant.module#MerchantModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
