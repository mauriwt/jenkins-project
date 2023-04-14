import { Route } from '@angular/router';

export const ProductosRoutes: Route[] = [
  {
    path: 'display-data/:token',
    loadChildren: () =>
      import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
  },
  {
    path: 'productos/cancelar/zohoData/:zohoParams',
    loadChildren: () =>
      import('./cancelacion/cancelacion.module').then(m => m.CancelacionModule)

  },

  {
    path: 'homologacion/actualizar/lista/:token',
    loadChildren: () =>
      import('../MdHomologacion/lista/lista.module').then(m => m.ListaModule)
  },

  {
    path: 'crear/cancelacion/:body',
    loadChildren: () =>
      import('./cancelarzoho/cancelarzoho.module').then(m => m.CancelarZohoModule)
  },

  {
    path: 'gestion/cancelacion/devolucion/:parametros',
    loadChildren: () =>
      import('./ap-cancelar-devolver/gestion-cd.module').then(m => m.GestionCDModule)
  },

  {
    path: 'historial/procesos/:token',
    loadChildren: () =>
      import('./historial-proceso/historial-proceso.module').then(m => m.HistorialProcesoModule)
  },

  {
    path: 'historial/procesos/manual/:token',
    loadChildren: () =>
      import('./historial-proceso-manual/historial-proceso-manual.module').then(m => m.HistorialProcesoManualModule)
  },

  {
    path: 'proceso/servicio/:token',
    loadChildren: () =>
      import('./proceso-servicio/proceso-servicio.module').then(m => m.ProcesoServicioModule)
  },

  {
    path: 'historial/procesos/fecha/:token',
    loadChildren: () =>
      import('./historial-proceso-fecha/historial-proceso-fecha.module').then(m => m.HistorialProcesoFechaModule)
  },

  {
    path: 'crud',
    loadChildren: () =>
      import('./crud/crud.module').then(m => m.CrudModule)
  }
];
