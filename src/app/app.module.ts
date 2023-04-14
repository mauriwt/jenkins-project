import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';


import {
  CRUDService, AlertifyService,
  FormService, FileUploadService, RSAHelperService
} from './shared/services';


import { AppRoutingModule } from './app-routing.module';
import { routes } from './app.routing';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/es-EC';
import localeFrExtra from '@angular/common/locales/extra/es-EC';

import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductoModule } from './MdProductos/productos.module';
import { FormularioModule } from './MdFormulario/formulario.module';
import { NoPageModule } from './no-page/no-page.module';
import { IndexModule } from './index/index.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { IntegracionSDPModule } from './MdIntegracionSDP/integracion-sdp.module';
import { ExcelService } from './shared/services/excel.service';
import { CanalDigitalModule } from './CanalDigitalAtencion/canal-digital.module';
import { PortalClienteModule } from './MdPortalCliente/PortalCliente.module';
import { RucModule } from './MdAprobacionRuc/ruc.module';

//

registerLocaleData(localeFr, 'es-EC', localeFrExtra);
@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [ConfirmDialogComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    RouterModule.forRoot(routes, { useHash: true }),
    BrowserAnimationsModule,
    MatDialogModule, MatSnackBarModule,

    IndexModule,
    ProductoModule,
    FormularioModule,
    IntegracionSDPModule,
    NoPageModule,
    CanalDigitalModule,
    PortalClienteModule,
    RucModule,
    HammerModule,
  ],
  exports: [RouterModule, MatDialogModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es-EC' },


    CRUDService,
    AlertifyService, FormService, FileUploadService, ExcelService, RSAHelperService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
