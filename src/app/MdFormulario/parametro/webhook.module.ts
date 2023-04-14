import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebHookComponent } from './webhook.component';
import { WebHookRoutes } from './webhook.routes';
import { RouterModule } from '@angular/router';

import { ClienteModule } from '../formulario/cliente.module';


@NgModule({
  declarations: [WebHookComponent],
  exports: [WebHookComponent],
  imports: [
    ClienteModule,
    RouterModule.forChild(WebHookRoutes),
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebHookModule { }
