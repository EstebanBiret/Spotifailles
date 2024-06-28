import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { standalone: true } },
  { path: 'callback', component: CallbackComponent, data: { standalone: true } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
