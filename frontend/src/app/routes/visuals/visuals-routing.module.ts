import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualsComponent } from './visuals.component';

const routes: Routes = [
  {
    path: '',
    component: VisualsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualsRoutingModule {}
