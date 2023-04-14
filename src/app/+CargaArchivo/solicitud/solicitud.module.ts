import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SolicitudComponent } from './solicitud.component';
import { SolicitudRoutes } from './solicitud.routes';
import { RouterModule } from '@angular/router';

import { ListaDocModule } from '../listaDocumentos/listaDoc.module';


@NgModule({
  declarations: [SolicitudComponent],
  exports: [SolicitudComponent],
  imports: [
    ListaDocModule,
    RouterModule.forChild(SolicitudRoutes),
    CommonModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SolicitudModule {}
