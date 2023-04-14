import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FrmDocumentoComponent } from './frm-documento.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { DxScrollViewModule } from 'devextreme-angular';

@NgModule({
  declarations: [FrmDocumentoComponent],
  exports: [FrmDocumentoComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxUpperCaseDirectiveModule,

    DxScrollViewModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class FrmDocumentoModule {}
