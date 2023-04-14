import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PestaniaComponent } from './pestania.component';
import { PestaniaRoutes } from './pestania.routes';

import { RouterModule } from '@angular/router';

import { DxLoadPanelModule, DxDataGridModule } from 'devextreme-angular';
import { AngularOtpLibModule } from 'angular-otp-box';

@NgModule({
  declarations: [PestaniaComponent],
  exports: [PestaniaComponent],
  imports: [
    RouterModule.forChild(PestaniaRoutes),
    CommonModule,
    DxDataGridModule,
    DxLoadPanelModule,
    AngularOtpLibModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PestaniaModule {}
