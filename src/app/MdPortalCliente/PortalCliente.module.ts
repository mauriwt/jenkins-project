import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {CrudPortalClienteModulo} from './CRUD Portal Cliente/crud-portal-cliente.module'

import { RouterModule } from '@angular/router';



@NgModule({
  imports: [CommonModule, RouterModule,CrudPortalClienteModulo ],
  declarations: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) 
export class PortalClienteModule { }
