import { Route } from '@angular/router';

export const RucRoutes: Route[] = [
  {
    path: 'solicitud/ruc/new/:token',
    loadChildren: () =>
      import('./pestanias/pestania.module').then(m => m.PestaniaModule)
  },
];
