import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'board',
    loadComponent: () =>
      import('./routes/board/board.component').then((m) => m.BoardComponent),
  },
  {
    path: 'visuals',
    loadComponent: () =>
      import('./routes/visuals/visuals.component').then(
        (m) => m.VisualsComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'board',
  },
];

// TODO: Remove module
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
