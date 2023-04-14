import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HistorialProcesoFechaComponent } from './historial-proceso-fecha.component';
import { HistorialProcesoFechaRoutes } from './historial-proceso-fecha.routes';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule, DxTreeListModule } from 'devextreme-angular';

@NgModule({
  declarations: [HistorialProcesoFechaComponent],
  exports: [HistorialProcesoFechaComponent],
  imports: [
    DxDataGridModule,
    DxSelectBoxModule, DxButtonModule,
    DxTreeListModule,
    SharedModule,
    RouterModule.forChild(HistorialProcesoFechaRoutes),
    CommonModule,
  ]
})
export class HistorialProcesoFechaModule { }
