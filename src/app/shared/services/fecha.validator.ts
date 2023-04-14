import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export function ValidarFecha(control: AbstractControl) {

  const fechaMax = new Date().setHours(0, 0, 0, 0);
  const fechaMin = moment("1800-01-01", 'YYYY-MM-DD').toDate().getTime();
  const fechaSeleccion = moment(control.value, 'YYYY-MM-DD').toDate().getTime();
  if (fechaSeleccion) {
    if (fechaMin < fechaSeleccion && fechaSeleccion <= fechaMax) {
      return null;
    }
    return { fechaVal: true };
  }
  return { fechaVal: true };
}
