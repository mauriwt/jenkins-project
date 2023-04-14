import { AbstractControl, Validators } from '@angular/forms';

export function ValidarMovil(control: AbstractControl) {
    const regexp = /^(0[1-9]{1})([0-9]{8})$/i;
    if (regexp.test(control.value)) {
        return null;
    }
    return { telfMovil: true };
}

export function ValidarConvencional(control: AbstractControl) {
    const regexp = /^(0[1-9]{1})([0-9]{7})$/i;
    if (regexp.test(control.value)) {
        return null;
    }
    return { telfFijo: true };
}

export function validarTelefonos(controName, tipo) {
    switch (tipo) {
        case 'MD':
        case 'MP':
            controName.setValidators([Validators.nullValidator, Validators.required, ValidarMovil]);
            break;
        case 'TA':
        case 'TD':
        case 'TT':
            controName.setValidators([Validators.nullValidator, Validators.required, ValidarConvencional]);
            break;
        default:
            controName.setValidators([Validators.nullValidator, Validators.required]);
            break;
    }
    controName.updateValueAndValidity();
}
