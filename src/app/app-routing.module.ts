import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { PageScreenComponent } from './components/page-screen/page-screen.component';

const routes: Routes = [
  {path: 'gas', component: PageScreenComponent},
  {path: '', redirectTo: '/gas', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }