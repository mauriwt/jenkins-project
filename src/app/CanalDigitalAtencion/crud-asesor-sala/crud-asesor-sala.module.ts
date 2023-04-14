import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CrudAsesorSalaComponent } from './crud-asesor-sala.component';
import { CrudAsesorSalaRoutes } from './crud-asesor-sala.routes';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { NgxCaptchaModule, } from 'ngx-captcha';
import { ShuyaiModule } from 'src/app/shared/components/shuyai/shuyai.module';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { AsesorComponent } from './asesor/asesor.component';
import { SalaComponent } from './sala/sala.component';
import { EquipoComponent } from './equipo/equipo.component';

import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectFilterModule } from 'mat-select-filter';



@NgModule({
  declarations: [CrudAsesorSalaComponent, AsesorComponent, SalaComponent, EquipoComponent],
  exports: [CrudAsesorSalaComponent],
  imports: [
    NgxUpperCaseDirectiveModule,
    RouterModule.forChild(CrudAsesorSalaRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShuyaiModule,
    NgxCaptchaModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    SharedModule,
    MatTableModule,
    MatCheckboxModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSelectFilterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrudAsesorSalaModule { }
