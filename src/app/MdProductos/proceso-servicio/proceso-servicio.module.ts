import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProcesoServicioComponent } from './proceso-servicio.component';
import { ProcesoServicioRoutes } from './proceso-servicio.routes';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule, DxTreeListModule } from 'devextreme-angular';

@NgModule({
  declarations: [ProcesoServicioComponent],
  exports: [ProcesoServicioComponent],
  imports: [
    DxDataGridModule,
    DxSelectBoxModule, DxButtonModule,
    DxTreeListModule,
    SharedModule,
    RouterModule.forChild(ProcesoServicioRoutes),
    CommonModule,
  ]
})
export class ProcesoServicioModule { }
