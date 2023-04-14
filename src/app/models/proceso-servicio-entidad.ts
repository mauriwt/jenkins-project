import { Validators } from '@angular/forms';

export class ProcesoServicioEntidad {
  IdProcesoServicioEntidad: number;
  IdProceso: number;
  IdServicio: number;
  IdEntidadOrigen: number;
  Activo: boolean;
  Orden: number;
  public static campos() {
    return [
      { tipo: 'select', id: 'IdProceso', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'select', id: 'IdServicio', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'select', id: 'IdEntidadOrigen', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'checkbox', id: 'Activo', validar: [Validators.nullValidator, Validators.required] }
    ];
  }

  public static fieldEmpty() {
    return {
      IdProceso: '',
      IdServicio: '',
      IdEntidadOrigen: '',
      Activo: ''
    };
  }
  public static getCampos() {

    return [
      { id: 'IdProceso', pattern: '', maxLength: '' },
      { id: 'IdServicio', pattern: '', maxLength: '' },
      { id: 'IdEntidadOrigen', pattern: '', maxLength: '' },
      { id: 'Activo', pattern: '', maxLength: '' }
    ];
  }
}
