import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GestionCDComponent } from './gestion-cd.component';
import { GestionCDRoutes } from './gestion-cd.routes';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';


import { DxDataGridModule, DxSelectBoxModule, DxButtonModule, DxPopupModule } from 'devextreme-angular';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [GestionCDComponent],
  exports: [GestionCDComponent],
  imports: [
    SharedModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxButtonModule,
    MatButtonModule,
    DxPopupModule,
    RouterModule.forChild(GestionCDRoutes),
    CommonModule,
  ]
})
export class GestionCDModule {}
