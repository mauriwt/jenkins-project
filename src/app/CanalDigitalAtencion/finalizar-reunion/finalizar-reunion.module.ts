import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinalizarReunionComponent } from './finalizar-reunion.component';
import { RouterModule } from '@angular/router';
import { FinalizarReunionRoutes } from './finalizar-reunion.routes';
import { ShuyaiModule } from 'src/app/shared/components/shuyai/shuyai.module';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';

import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';



@NgModule({
  declarations: [FinalizarReunionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(FinalizarReunionRoutes),
    TimeagoModule.forRoot({ formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }, }), ShuyaiModule,
    DxDataGridModule,
    DxButtonModule,
    DxDateBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxTextAreaModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatTableModule

  ], providers: [TimeagoIntl],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FinalizarReunionModule { }
