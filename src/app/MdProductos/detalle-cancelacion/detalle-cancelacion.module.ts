import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DetalleCancelacionComponent } from './detalle-cancelacion.component';

import { SharedModule } from '../../shared/shared.module';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule, DxPopupModule } from 'devextreme-angular';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DetalleCancelacionComponent],
  exports: [DetalleCancelacionComponent],
  imports: [
    SharedModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxButtonModule,
    MatButtonModule,
    DxPopupModule,
    CommonModule,
  ]
})
export class DetalleCancelacionModule { }
