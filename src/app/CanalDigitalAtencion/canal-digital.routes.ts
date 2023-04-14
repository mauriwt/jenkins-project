import { Route } from '@angular/router';

export const CanalDigitalRoutes: Route[] = [
  {
    path: 'formulario/canal/digital',
    loadChildren: () =>
      import('./form-atencion/form-atencion.module').then(m => m.FormAtencionModule)
  },
  {
    path: 'formulario/canal/digital/:tokenSistema',
    loadChildren: () =>
      import('./form-atencion/form-atencion.module').then(m => m.FormAtencionModule)
  },
  {
    path: 'formulario/canal/digital/:tokenSistema/:tokenUsuario',
    loadChildren: () =>
      import('./form-atencion/form-atencion.module').then(m => m.FormAtencionModule)
  },
  {
    path: 'gestion/reunion/canal/digital/:tokenUsuario/:asesorCedula',
    loadChildren: () =>
      import('./finalizar-reunion/finalizar-reunion.module').then(m => m.FinalizarReunionModule)
  },
  {
    path: 'crud/asesor-sala/:token',
    loadChildren: () =>
      import('./crud-asesor-sala/crud-asesor-sala.module').then(m => m.CrudAsesorSalaModule)
  },
  {
    path: 'reporte-llamadas/:token',
    loadChildren: () =>
      import('./reportes/reportes.module').then(m => m.ReportesModule)
  },
  {
    path: 'reporte-asesores/:token',
    loadChildren: () =>
      import('./reporte-asesor/reporte-asesor.module').then(m => m.ReporteAsesorModule)
  }
];
