import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './routes/board/board.component';
import { VisualsComponent } from './routes/visuals/visuals.component';

const routes: Routes = [
  {
    path: 'board',
    component: BoardComponent,
  },
  {
    path: 'visuals',
    component: VisualsComponent,
  },
  {
    path: '**',
    redirectTo: 'board',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
