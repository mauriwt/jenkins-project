import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HistorialProcesoManualComponent } from './historial-proceso-manual.component';
import { HistorialProcesoManualRoutes } from './historial-proceso-manual.routes';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  declarations: [HistorialProcesoManualComponent],
  exports: [HistorialProcesoManualComponent],
  imports: [
    DxDataGridModule,
    DxSelectBoxModule, DxButtonModule,
    SharedModule,
    RouterModule.forChild(HistorialProcesoManualRoutes),
    CommonModule,
  ]
})
export class HistorialProcesoManualModule { }
