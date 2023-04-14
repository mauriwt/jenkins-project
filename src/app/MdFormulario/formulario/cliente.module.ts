import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClienteComponent } from './cliente.component';
import { SharedModule } from '../../shared/shared.module';
import { FiltroModule } from '../filtro/filtro.module';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatListModule} from '@angular/material/list';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';


import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';

@NgModule({
  declarations: [ClienteComponent],
  exports: [ClienteComponent],
  imports: [

    CommonModule,
    FiltroModule,
    SharedModule,

    FormsModule, ReactiveFormsModule
  ],
  providers: [
  ],
})
export class ClienteModule {}
