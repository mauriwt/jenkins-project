import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabComponent } from './tab.component';
import { TabRoutes } from './tab.routes';

import { RouterModule } from '@angular/router';

import { ClienteModule } from '../formulario/cliente.module';
import { FiltroModule } from '../filtro/filtro.module';

@NgModule({
  declarations: [TabComponent],
  exports: [TabComponent],
  imports: [
    ClienteModule,
    FiltroModule,
    //RouterModule.forChild(TabRoutes),
    CommonModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TabModule {}
