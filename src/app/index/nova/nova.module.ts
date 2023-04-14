import { NovaRoutes } from './nova.routes';
import { NovaComponent } from './nova.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NovaComponent],
  exports:[NovaComponent],
  imports: [
    RouterModule.forChild(NovaRoutes),
    CommonModule,
    SharedModule
  ]
})
export class NovaModule { }
