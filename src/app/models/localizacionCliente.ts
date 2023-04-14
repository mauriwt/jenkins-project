import { Validators } from '@angular/forms';
import { ValidarEmail } from '../shared/services/cedula.validator'
import { ValidarConvencional } from '../shared/services/telefono.validator';
export class LocalizaciónCliente {
  Activo: boolean;
  EsPrincipal: boolean;
  Extension: string;
  FechaCreacion: Date;
  HostUsuario: string;
  IdCliente: number;
  IdLocalizacionCliente: number;
  SistemaAfectacion: string;
  TipoLocalizacion: string;
  UsuarioAfectacion: string;
  Validada: boolean;
  Valor: string;
  constructor() { }

  public static camposT() {
    return [
      { tipo: 'text', id: 'Valor', validar: [Validators.nullValidator, Validators.required, ValidarConvencional] },
      { tipo: 'select', id: 'TipoLocalizacion', validar: [Validators.nullValidator, Validators.required,] },
      { tipo: 'checkbox', id: 'EsPrincipal', validar: [] },
      { tipo: 'checkbox', id: 'Activo', validar: [] }
    ];
  }

  public static camposE() {
    return [
      { tipo: 'text', id: 'Valor', validar: [Validators.nullValidator, Validators.required, ValidarEmail] },
      { tipo: 'select', id: 'TipoLocalizacion', validar: [Validators.nullValidator, Validators.required,] },
      { tipo: 'checkbox', id: 'EsPrincipal', validar: [] },
      { tipo: 'checkbox', id: 'Activo', validar: [] }
    ];
  }

  public static fieldEmpty() {
    return {
      Valor: '',
      TipoLocalizacion: '',
      EsPrincipal: '',
      Activo: ''
    };
  }
  public static getCampos() {

    return [
      { id: 'Valor', pattern: '', maxLength: '' },
      { id: 'TipoLocalizacion', pattern: '', maxLength: '' },
      { id: 'EsPrincipal', pattern: '', maxLength: '' },
      { id: 'Activo', pattern: '', maxLength: '' },
    ];
  }
}
