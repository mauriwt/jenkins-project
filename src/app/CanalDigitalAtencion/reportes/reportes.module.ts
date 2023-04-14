import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReportesComponent } from './reportes.component';
import { ReportesRoutes } from './reportes.routes';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { NgxCaptchaModule, } from 'ngx-captcha';
import { ShuyaiModule } from 'src/app/shared/components/shuyai/shuyai.module';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';



@NgModule({
  declarations: [ReportesComponent,],
  exports: [ReportesComponent],
  imports: [
    NgxUpperCaseDirectiveModule,
    RouterModule.forChild(ReportesRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShuyaiModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSelectModule,
    DxTemplateModule,
    DxDataGridModule,
    MatTableModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportesModule { }
