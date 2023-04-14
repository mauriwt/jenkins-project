import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterModule } from '@angular/router';
import { PestaniaModule } from './pestanias/pestania.module';

@NgModule({
  imports: [CommonModule, RouterModule, PestaniaModule ],
  declarations: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RucModule { }
