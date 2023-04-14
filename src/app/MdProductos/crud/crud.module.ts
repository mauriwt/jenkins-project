import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CrudComponent } from './crud.component';
import { ProcesoComponent } from './proceso/proceso.component';
import { ServicioComponent } from './servicio/servicio.component';
import { ProcesoServicioEntidadComponent } from './proceso-servicio-entidad/proceso-servicio-entidad.component';
import { ProductoServicioComponent } from './producto-servicio/producto-servicio.component';
import { CrudRoutes } from './crud.routes';
import { RouterModule } from '@angular/router';


import { SharedModule } from '../../shared/shared.module';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule, DxPopupModule, DxCheckBoxModule, DxValidatorModule, DxToolbarModule, DxFormModule } from 'devextreme-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [CrudComponent, ProcesoComponent, ServicioComponent, ProcesoServicioEntidadComponent, ProductoServicioComponent],
  exports: [CrudComponent],
  imports: [
    SharedModule,
    DxFormModule,
    DxDataGridModule,
    DxSelectBoxModule, DxButtonModule, DxPopupModule, DxCheckBoxModule, DxValidatorModule, DxToolbarModule,
    RouterModule.forChild(CrudRoutes),
    CommonModule,
  ]
})
export class CrudModule { }
