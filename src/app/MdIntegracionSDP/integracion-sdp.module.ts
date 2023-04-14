import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TabErrorModule } from './tabs/tab.module';

@NgModule({
  imports: [CommonModule, RouterModule, TabErrorModule ],
  declarations: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntegracionSDPModule { }
