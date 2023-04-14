import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ListaDocComponent } from './listaDoc.component';
import { ListaDocRoutes } from './listaDoc.routes';
import { FrmDocumentoModule } from '../frm-documento/frm-documento.module';
import { SharedModule } from '../../shared/shared.module';

import { RouterModule } from '@angular/router';
import { DxDataGridModule, DxPopupModule } from 'devextreme-angular';

@NgModule({
  declarations: [ListaDocComponent],
  exports: [ListaDocComponent],
  imports: [
    SharedModule,
    //RouterModule.forChild(ListaDocRoutes),
    CommonModule, FrmDocumentoModule,
    DxDataGridModule, DxPopupModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ListaDocModule {}
