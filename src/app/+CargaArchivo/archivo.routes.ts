import { Route } from '@angular/router';

export const ArchivoRoutes: Route[] = [
  {
    path: 'archivos/cliente/:zohoIdentificacion',
    loadChildren: () =>
      import('./cliente/webhook.module').then(m => m.WebHookModule)
  },
  {
    path: 'solicitud/proveedor/:numeroCertificado/iden/:identificacion/nombre/:nombres/:ramdonID',
    loadChildren: () =>
      import('./solicitud/solicitud.module').then(m => m.SolicitudModule)
  },
];
