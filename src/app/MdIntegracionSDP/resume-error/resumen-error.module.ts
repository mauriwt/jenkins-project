import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ResumeErrorComponent } from './resume-error.component';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';


@NgModule({
  declarations: [ResumeErrorComponent],
  exports: [ResumeErrorComponent],
  imports: [
    CommonModule,
    DxDataGridModule,
    DxLoadPanelModule
  ]
})
export class ResumenErrorModule { }
