import { Validators } from '@angular/forms';
import { ValidarEmail } from 'src/app/shared/services/cedula.validator';
import { ExpRegular } from '../regex';

export class Equipo {
  Activo: boolean;
  CodigoEquipoCanalDigital: string;
  Descripcion: string;
  IdEquipoCanalDigital: number;
  MensajeNoDisponibilidad: string;
  Nombre: string;
  TiempoMaximoAtencionLlamada: number;
  TiempoMaximoDuracionLlamada: number;
  EmailResponsable: string;
  constructor() { }

  public static formControlNames() {
    return [
      { tipo: 'checkbox', id: 'Activo', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'CodigoEquipoCanalDigital', validar: [Validators.nullValidator, Validators.required, Validators.pattern(ExpRegular.alfNumericoMay)] },
      { tipo: 'text', id: 'Descripcion', validar: [] },
      { tipo: 'text', id: 'MensajeNoDisponibilidad', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'Nombre', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'TiempoMaximoAtencionLlamada', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'TiempoMaximoDuracionLlamada', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'EmailResponsable', validar: [Validators.nullValidator, Validators.required, ValidarEmail] },
    ];
  }

  public static emptyControlNames() {
    return {
      CodigoEquipoCanalDigital: '',
      Descripcion: '',
      MensajeNoDisponibilidad: '',
      Nombre: '',
      Activo: '',
      TiempoMaximoAtencionLlamada: '',
      TiempoMaximoDuracionLlamada: '',
      EmailResponsable: ''
    };
  }
  public static msjControlNames() {
    return [
      { id: 'CodigoEquipoCanalDigital', pattern: 'El campo solo permite números y letras', maxLength: '' },
      { id: 'Descripcion', pattern: '', maxLength: '' },
      { id: 'MensajeNoDisponibilidad', pattern: '', maxLength: '' },
      { id: 'Nombre', pattern: '', maxLength: '' },
      { id: 'Activo', pattern: '', maxLength: '' },
      { id: 'TiempoMaximoAtencionLlamada', pattern: '', maxLength: '' },
      { id: 'TiempoMaximoDuracionLlamada', pattern: '', maxLength: '' },
      { id: 'EmailResponsable', pattern: '', maxLength: '' },
    ];
  }
}
