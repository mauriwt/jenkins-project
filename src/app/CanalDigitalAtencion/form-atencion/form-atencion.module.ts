import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormAtencionComponent } from './form-atencion.component';
import { FormAtencionkRoutes } from './form-atencion.routes';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { NgxCaptchaModule, } from 'ngx-captcha';
import { ShuyaiModule } from 'src/app/shared/components/shuyai/shuyai.module';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ImgFallbackDirective } from 'src/app/pipes/noimages.directive';

@NgModule({
  declarations: [FormAtencionComponent, ImgFallbackDirective],
  exports: [FormAtencionComponent, ImgFallbackDirective],
  imports: [
    NgxUpperCaseDirectiveModule,
    RouterModule.forChild(FormAtencionkRoutes),
    CommonModule,
    FormsModule, ReactiveFormsModule,
    ShuyaiModule,
    NgxCaptchaModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormAtencionModule { }
