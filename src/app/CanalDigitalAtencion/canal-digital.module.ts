import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormAtencionModule } from './form-atencion/form-atencion.module';

import { RouterModule } from '@angular/router';
import { FinalizarReunionModule } from './finalizar-reunion/finalizar-reunion.module';
import { CrudAsesorSalaModule } from './crud-asesor-sala/crud-asesor-sala.module';
import { ReportesModule } from './reportes/reportes.module';


@NgModule({
  imports: [CommonModule, RouterModule, FormAtencionModule, FinalizarReunionModule, CrudAsesorSalaModule, ReportesModule],
  declarations: [],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CanalDigitalModule { }
