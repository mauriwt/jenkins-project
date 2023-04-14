import { NgModule, LOCALE_ID } from "@angular/core";

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/es-EC';
import localeFrExtra from '@angular/common/locales/extra/es-EC';


registerLocaleData(localeFr, 'es-EC', localeFrExtra);

export const NOVA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@NgModule({
  imports: [
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es_EC' },
    { provide: LOCALE_ID, useValue: 'es-EC' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: NOVA_FORMATS }
  ]
})
export class FechaModule { }
