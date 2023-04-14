import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabErrorComponent } from './tab.component';
import { TabErrorRoutes } from './tab.routes';

import { RouterModule } from '@angular/router';

import { EmisionModule } from '../emision/emision.module';
import { ResumenErrorModule } from '../resume-error/resumen-error.module';

@NgModule({
  declarations: [TabErrorComponent],
  exports: [TabErrorComponent],
  imports: [
    EmisionModule,
    ResumenErrorModule,
    RouterModule.forChild(TabErrorRoutes),
    CommonModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TabErrorModule {}
