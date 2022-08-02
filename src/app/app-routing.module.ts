import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroceriesComponent } from './groceries/groceries.component';
import { GroceryDetailComponent } from './grocery-detail/grocery-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/groceries', pathMatch: 'full' },
  { path: 'groceries', component: GroceriesComponent },
  { path: 'grocerydetail/:uid', component: GroceryDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }