import { Route } from '@angular/router';
export const IndexRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./nova/nova.module').then(m => m.NovaModule)
  },
];
