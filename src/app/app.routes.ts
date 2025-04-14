import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/circle-packing/circle-packing.component').then(
        m => m.CirclePackingComponent,
      ),
  },
];
