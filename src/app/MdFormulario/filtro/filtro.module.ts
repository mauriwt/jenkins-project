import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FiltroComponent } from './filtro.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [FiltroComponent],
  exports: [FiltroComponent],
  imports: [
    DxDataGridModule, DxButtonModule,
    CommonModule,
    SharedModule,

    FormsModule, ReactiveFormsModule

  ]
})
export class FiltroModule {}
