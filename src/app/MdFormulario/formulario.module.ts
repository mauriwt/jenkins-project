import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabModule } from './tabs/tab.module';
import { WebHookModule } from './parametro/webhook.module';
import { NuevoModule } from './nuevo/nuevo.module';
import { MatButtonModule } from '@angular/material/button';

import { RouterModule } from '@angular/router';
@NgModule({
  imports: [CommonModule, RouterModule, TabModule, WebHookModule, MatButtonModule, NuevoModule],
  declarations: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormularioModule { }
