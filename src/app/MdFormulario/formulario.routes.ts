import { Route } from '@angular/router';

export const FormularioRoutes: Route[] = [
  {
    path: 'tab-cliente',
    loadChildren: () =>
      import('./dezoho/zoho.module').then(m => m.ZohoModule)
  },
  {
    path: 'tab-cliente/:token',
    loadChildren: () =>
      import('./desigs/sigs.module').then(m => m.SigsModule)
  },
  {
    path: 'formulario-cliente/:zohoIdentificacion',
    loadChildren: () =>
      import('./parametro/webhook.module').then(m => m.WebHookModule)
  },
  {
    path: 'nuevo/registro/:tipo',
    loadChildren: () =>
      import('./nuevo/nuevo.module').then(m => m.NuevoModule)
  },
];
