import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CancelacionComponent } from './cancelacion.component';
import { CancelacionRoutes } from './cancelacion.routes';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ListaDocModule } from '../../+CargaArchivo/listaDocumentos/listaDoc.module';


import { DxDataGridModule, DxSelectBoxModule, DxButtonModule, DxPopupModule } from 'devextreme-angular';
import { MatButtonModule } from '@angular/material/button';
import { DetalleCancelacionModule } from '../detalle-cancelacion/detalle-cancelacion.module';

@NgModule({
  declarations: [CancelacionComponent],
  exports: [CancelacionComponent],
  imports: [
    SharedModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxButtonModule,
    MatButtonModule,
    DxPopupModule,
    RouterModule.forChild(CancelacionRoutes),
    CommonModule,
    ListaDocModule,
    DetalleCancelacionModule
  ]
})
export class CancelacionModule {}
