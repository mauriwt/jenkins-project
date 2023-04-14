import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NuevoComponent } from './nuevo.component';
import { NuevoRoutes } from './nuevo.routes';
import { RouterModule } from '@angular/router';

import { ClienteModule } from '../formulario/cliente.module';


@NgModule({
  declarations: [NuevoComponent],
  exports: [NuevoComponent],
  imports: [
    ClienteModule,
    RouterModule.forChild(NuevoRoutes),
    CommonModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class NuevoModule {}
