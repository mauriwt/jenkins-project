import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import {ConfirmDialogComponent} from './confirm-dialog.component'

@NgModule({
  imports: [CommonModule,MatButtonModule],
  declarations: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfirmarModule {}