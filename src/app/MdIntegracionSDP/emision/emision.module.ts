import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmisionComponent } from './emision.component';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FechaModule } from 'src/app/shared/fecha.module';
import { MatSelectFilterModule } from 'mat-select-filter';




@NgModule({
  declarations: [EmisionComponent],
  exports: [EmisionComponent],
  imports: [
    CommonModule,
    FormsModule,
    FechaModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxLoadPanelModule,
    DxToolbarModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectFilterModule
  ],
})
export class EmisionModule { }
