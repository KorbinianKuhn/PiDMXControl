import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'board',
    loadChildren: () =>
      import('./routes/board/board.module').then((m) => m.BoardModule),
  },
  {
    path: 'visuals',
    loadChildren: () =>
      import('./routes/visuals/visuals.module').then((m) => m.VisualsModule),
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
