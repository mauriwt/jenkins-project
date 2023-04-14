import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ShuyaiModule } from "./components/shuyai/shuyai.module";
import { ConfirmarModule } from "./components/confirm-dialog/confirm-dialog.module";
import { DomseguroPipe } from '../pipes/domseguro.pipe';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { DosDecimalesDirective } from '../pipes/decimales.directive';
import { AutofocusDirective } from '../pipes/focus.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CambiarColorDirective } from '../pipes/cambiarColor.directive';
import { KeysPipe } from '../pipes/objetoAtributo.pipe';
import { DxTemplateModule } from 'devextreme-angular';
import { TablaDinamicaComponent } from './components/tabla-dinamica/tabla-dinamica.component';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { DxLookupModule } from 'devextreme-angular/ui/lookup';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';

import { DecimalPipe } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FechaModule } from './fecha.module';
import { MatListModule } from '@angular/material/list';


@NgModule({
  imports: [
    CommonModule,
    FechaModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmarModule,
    NgxUpperCaseDirectiveModule,

    DxTemplateModule,
    DxDataGridModule,
    DxFormModule,
    DxPopupModule,
    DxScrollViewModule,
    DxLookupModule,
    DxToolbarModule,
    DxDateBoxModule,
    DxButtonModule,
    DxNumberBoxModule,
    DxLoadPanelModule,
    DxSelectBoxModule,
    DxTextAreaModule,

    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatListModule,
    MatTooltipModule,
    ShuyaiModule,

  ],
  declarations: [DomseguroPipe, DosDecimalesDirective, AutofocusDirective, CambiarColorDirective, TablaDinamicaComponent, KeysPipe],
  exports: [
    DomseguroPipe,
    CommonModule,
    FechaModule,
    FormsModule,
    RouterModule,
    ConfirmarModule,
    ShuyaiModule,
    NgxUpperCaseDirectiveModule,
    DosDecimalesDirective,
    AutofocusDirective,
    CambiarColorDirective,
    TablaDinamicaComponent,
    KeysPipe,
    ReactiveFormsModule,

    DxTemplateModule,
    DxDataGridModule,
    DxFormModule,
    DxPopupModule,
    DxScrollViewModule,
    DxLookupModule,
    DxToolbarModule,
    DxDateBoxModule,
    DxButtonModule,
    DxNumberBoxModule,
    DxLoadPanelModule,
    DxSelectBoxModule,
    DxTextAreaModule,

    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatListModule,
    MatTooltipModule

  ],
  providers: [
    DecimalPipe,
  ]
})
export class SharedModule { }
