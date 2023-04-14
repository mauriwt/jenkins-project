import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SigsComponent } from './sigs.component';
import { SigsRoutes } from './sigs.routes';

import { RouterModule } from '@angular/router';


import { TabModule } from '../tabs/tab.module';

@NgModule({
  declarations: [SigsComponent],
  exports: [SigsComponent],
  imports: [
    TabModule,
    RouterModule.forChild(SigsRoutes),
    CommonModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SigsModule {}
