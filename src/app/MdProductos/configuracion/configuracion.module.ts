import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfiguracionComponent } from './configuracion.component';
import { ConfiguracionRoutes } from './configuracion.routes';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  declarations: [ConfiguracionComponent],
  exports: [ConfiguracionComponent],
  imports: [
    DxDataGridModule,
    DxSelectBoxModule,DxButtonModule,
    SharedModule,
    RouterModule.forChild(ConfiguracionRoutes),
    CommonModule,
  ]
})
export class ConfiguracionModule {}
