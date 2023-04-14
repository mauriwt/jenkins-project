import { Route } from '@angular/router';

export const IntegracionSDPRoutes: Route[] = [
  {
    path: 'gestion/integracion/emision/error/:token',
    loadChildren: () =>
      import('./tabs/tab.module').then(m => m.TabErrorModule)
  },
  /* {
    path: 'resumen/integracion/emision/error/:token',
    loadChildren: () =>
      import('./resume-error/resumen-error.module').then(m => m.ResumenErrorModule)
  }, */
];
