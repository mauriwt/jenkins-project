import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ZohoComponent } from './zoho.component';
import { ZohoRoutes } from '././zoho.routes';

import { RouterModule } from '@angular/router';

import { TabModule } from '../tabs/tab.module';

@NgModule({
  declarations: [ZohoComponent],
  exports: [ZohoComponent],
  imports: [
    TabModule,
    RouterModule.forChild(ZohoRoutes),
    CommonModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ZohoModule {}
