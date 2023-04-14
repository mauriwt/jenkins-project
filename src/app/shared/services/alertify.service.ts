import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';
import {MatSnackBar} from '@angular/material/snack-bar';

declare var $;

@Injectable()
export class AlertifyService {

  constructor(private _snackBar: MatSnackBar) {
    alertify.set('notifier','position', 'top-right');
   }

  success(msj: string) {
    alertify.notify(`${msj}`, 'ok');
  }

  warning(msj: string) {
    alertify.notify(`${msj}`, 'alerta');
  }

  message(msj: string) {
    alertify.notify(`${msj}`, 'info');
  }

  error(msj: string) {
    alertify.notify(`${msj}`, 'falla');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4 * 1000,
      panelClass: ['warning'],
      //verticalPosition: 'top'
    });
  }

  openClose(modalID,accion) {
    $('#' + modalID).modal(accion);
  }
  
}
