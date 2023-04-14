import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShuyaiComponent } from './shuyai.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ShuyaiComponent],
  exports: [ShuyaiComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShuyaiModule { }
