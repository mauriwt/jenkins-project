import { Route } from '@angular/router';

export const PortalCliente: Route[] = [
 
  {
    path: 'crud/formulario/:tokenusu',
    loadChildren: () =>
      import('./CRUD Portal Cliente/crud-portal-cliente.module').then(m => m.CrudPortalClienteModulo)
  }
  
];
