import { Validators } from '@angular/forms';
import { ExpRegular } from '../regex';

export class DetalleActualizar {
  Codigo: string;
  Nombre: string;
  Descripcion: string;
  URL: string;
  URL2: string;
  Activo: boolean;
  constructor() { }

  public static formControlNames() {
    return [
      { tipo: 'text', id: 'Codigo', validar: [] },
      { tipo: 'text', id: 'Nombre', validar: [Validators.nullValidator, Validators.required,Validators.pattern(ExpRegular.nombresCanalDigital)] },
      { tipo: 'text', id: 'Descripcion', validar: [Validators.nullValidator, Validators.required,Validators.pattern(ExpRegular.nombresCanalDigital)] },
      { tipo: 'input', id: 'URL', validar: [] },
      { tipo: 'text', id: 'Activo', validar: [] },
      { tipo: 'input', id: 'URL2', validar: [] }
    ];
  }

  public static emptyControlNames() {
    return {
      Codigo: '',
      Nombre: '',
      Descripcion: '',
      URL: '',
      URL2: '',
      Activo: ''
    };
  }
  public static msjControlNames() {

    return [
      { id: 'Codigo', pattern: '', maxLength: '' },
      { id: 'Nombre', pattern: 'Formato inválido.', maxLength: '' },
      { id: 'Descripcion', pattern: 'Formato inválido.', maxLength: '' },
      { id: 'URL', pattern: '', maxLength: '' },
      { id: 'URL2', pattern: '', maxLength: '' },
      { id: 'Activo', pattern: '', maxLength: '' }
    ];
  }
}
