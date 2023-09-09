import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ContinentComponent } from './components/continent/continent.component';


const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'continent/:continent', component: ContinentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
