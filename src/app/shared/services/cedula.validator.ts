import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { ComunService } from './comun.service';

export function ValidarEmail(control: AbstractControl) {
  const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regexp.test(control.value)) {
    return null;
  }
  return { invalidEmail: true };
}

export function ValidarCedula(control: AbstractControl) {
  if (ComunService.validarCedulaRucNatural(control.value, 'C')) {
    return null;
  }
  return { invalidDni: true };
}

export function ValidarRucPrivadoPublico(control: AbstractControl) {
  if (ComunService.validarRucPrivadoPublico(control.value, 'RX')) {
    return null;
  }
  return { invalidDni: true };
}

export function ValidarTiposRuc(esEmpresa: boolean): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (ComunService.verificarTipoRuc(control.value, esEmpresa)) {
      return null;
    }
    return { invalidDni: true };
  };
}

export function validarTiposIdentificacion(controName, tipo, esEmpresa) {
  switch (tipo) {
    case 'C':
      controName.setValidators([Validators.nullValidator, Validators.required, Validators.pattern("^[0-9]{10}$"), ValidarCedula]);
      break;
    case 'R':
      controName.setValidators([Validators.nullValidator, Validators.required, Validators.pattern("^[0-9]{13}$"), ValidarTiposRuc(esEmpresa)]);
      break;
    default:
      controName.setValidators([Validators.nullValidator, Validators.required]);
      break;
  }
  controName.updateValueAndValidity();
}
