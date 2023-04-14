import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CancelarzohoComponent } from './cancelarzoho.component';
import { CancelarZohoRoutes } from './cancelarzoho.routes';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ListaDocModule } from '../../+CargaArchivo/listaDocumentos/listaDoc.module';


import { DxDataGridModule, DxSelectBoxModule, DxButtonModule, DxPopupModule } from 'devextreme-angular';
import { MatButtonModule } from '@angular/material/button';
import { DetalleCancelacionModule } from '../detalle-cancelacion/detalle-cancelacion.module';

@NgModule({
  declarations: [CancelarzohoComponent],
  exports: [CancelarzohoComponent],
  imports: [
    SharedModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxButtonModule,
    MatButtonModule,
    DxPopupModule,
    RouterModule.forChild(CancelarZohoRoutes),
    CommonModule,
    ListaDocModule,
    DetalleCancelacionModule
  ]
})
export class CancelarZohoModule {}
