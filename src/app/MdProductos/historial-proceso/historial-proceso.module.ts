import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HistorialProcesoComponent } from './historial-proceso.component';
import { HistorialProcesoRoutes } from './historial-proceso.routes';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  declarations: [HistorialProcesoComponent],
  exports: [HistorialProcesoComponent],
  imports: [
    DxDataGridModule,
    DxSelectBoxModule, DxButtonModule,
    SharedModule,
    RouterModule.forChild(HistorialProcesoRoutes),
    CommonModule,
  ]
})
export class HistorialProcesoModule { }
