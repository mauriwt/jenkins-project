import { Validators } from '@angular/forms';
import { ExpRegular } from '../regex';

export class Sala{
  Activo: boolean;
  CodigoSalaCanalDigital: string;
  IdEquipoCanalDigital: string;
  EstadoOcupacion: string;
  IdSalaCanalDigital: number;
  Nombre: string;
  URLSala: string;
  constructor(){}

  public static formControlNames() {
    return [
      { tipo: 'checkbox', id: 'Activo', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'IdEquipoCanalDigital', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'EstadoOcupacion', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'CodigoSalaCanalDigital', validar: [Validators.nullValidator, Validators.required, Validators.pattern(ExpRegular.alfNumericoMay)] },
      { tipo: 'text', id: 'Nombre', validar: [Validators.nullValidator, Validators.required] },
      { tipo: 'text', id: 'URLSala', validar: [Validators.nullValidator, Validators.required, Validators.pattern(ExpRegular.urlValidar)] },
    ];
  }

  public static emptyControlNames() {
    return {
      IdEquipoCanalDigital: '',
      EstadoOcupacion: '',
      CodigoSalaCanalDigital: '',
      Nombre: '',
      URLSala: '',
      Activo: ''
    };
  }
  public static msjControlNames() {

    return [
      { id: 'IdEquipoCanalDigital', pattern: '', maxLength: '' },
      { id: 'EstadoOcupacion', pattern: '', maxLength: '' },
      { id: 'CodigoSalaCanalDigital', pattern: 'El campo solo permite números y letras', maxLength: '' },
      { id: 'Nombre', pattern: '', maxLength: '' },
      { id: 'URLSala', pattern: 'La URL no es válida.', maxLength: '' },
      { id: 'Activo', pattern: '', maxLength: '' },
    ];
  }
}
