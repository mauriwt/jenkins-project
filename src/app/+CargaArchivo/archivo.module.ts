import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ListaDocModule } from './listaDocumentos/listaDoc.module';
import {MatButtonModule} from '@angular/material/button'

import { RouterModule } from '@angular/router';
@NgModule({
  imports: [CommonModule, RouterModule, ListaDocModule, MatButtonModule],
  declarations: [],
  exports: [],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ArchivoModule {}
