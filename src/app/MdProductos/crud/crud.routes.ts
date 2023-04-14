import { Route } from '@angular/router';
import { CrudComponent } from './crud.component';
import { ProcesoComponent } from './proceso/proceso.component';
import { ServicioComponent } from './servicio/servicio.component';
import { ProductoServicioComponent } from './producto-servicio/producto-servicio.component';
import { ProcesoServicioEntidadComponent } from './proceso-servicio-entidad/proceso-servicio-entidad.component';
export const CrudRoutes: Route[] = [
  {
    path: '',
    component: CrudComponent,
    children: [
      {
        path: 'proceso',
        component: ProcesoComponent
      },
      {
        path: 'servicio',
        component: ServicioComponent
      },
      {
        path: 'producto-servicio',
        component: ProductoServicioComponent
      },
      {
        path: 'proceso-servicio-entidad/:token',
        component: ProcesoServicioEntidadComponent
      }
    ]
  }
];
