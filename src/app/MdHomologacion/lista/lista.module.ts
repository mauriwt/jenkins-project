
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ListaComponent } from './lista.component';
import { ListaRoutes } from './lista.routes';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule } from 'devextreme-angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ListaComponent],
  exports: [ListaComponent],
  imports: [
    DxDataGridModule,
    DxSelectBoxModule,
    DxButtonModule,
    SharedModule,
    RouterModule.forChild(ListaRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ListaModule {}
