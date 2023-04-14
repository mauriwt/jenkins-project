import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CrudPortalClienteComponent } from './crud-portal-cliente.component';
import {  CrudPortalClienteRoutes } from './crud-portal-cliente.routes';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { NgxCaptchaModule, } from 'ngx-captcha';
import { ShuyaiModule } from 'src/app/shared/components/shuyai/shuyai.module';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormularioComponent } from './formulario/formulario.component';   



@NgModule({
  declarations: [CrudPortalClienteComponent, FormularioComponent],
  exports: [CrudPortalClienteComponent],
  imports: [
    NgxUpperCaseDirectiveModule,
    RouterModule.forChild(CrudPortalClienteRoutes),
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
    MatCheckboxModule
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrudPortalClienteModulo { }
