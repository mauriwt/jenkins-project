import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { CancelacionModule } from './cancelacion/cancelacion.module';
import {MatButtonModule} from '@angular/material/button';

import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, ConfiguracionModule, CancelacionModule,  MatButtonModule],
  declarations: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductoModule {}
